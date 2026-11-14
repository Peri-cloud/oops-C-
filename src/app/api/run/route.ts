import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { readFileSync } from 'fs';

export const runtime = 'nodejs';
export const maxDuration = 60;

// ---------------- exam data (loaded once per server process) ----------------
interface TestDef { input: string; expected: string; tag: string }
interface QDef {
  id: string; unit: number; kind: string; title: string;
  tests: TestDef[];
}
let QUESTIONS: Map<string, QDef> | null = null;

function loadQuestions(): Map<string, QDef> {
  if (QUESTIONS) return QUESTIONS;
  const raw = readFileSync(join(process.cwd(), 'src/data/exam-data.json'), 'utf-8');
  const data = JSON.parse(raw);
  QUESTIONS = new Map<string, QDef>();
  for (const q of data.questions as QDef[]) {
    QUESTIONS.set(q.id, q);
  }
  return QUESTIONS;
}

// ---------------- runner helpers ----------------
const RUN_TIMEOUT_MS = 3000;
const COMPILE_TIMEOUT_MS = 20000;
const MAX_OUTPUT = 64 * 1024;

interface RunResult { stdout: string; stderr: string; timeMs: number; timedOut: boolean; exitCode: number | null }

function runBinary(exe: string, stdinData: string, timeoutMs = RUN_TIMEOUT_MS): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(exe);
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let done = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (d: Buffer) => { if (stdout.length < MAX_OUTPUT) stdout += d.toString(); });
    child.stderr.on('data', (d: Buffer) => { if (stderr.length < MAX_OUTPUT) stderr += d.toString(); });
    child.on('error', (e) => {
      if (done) return; done = true; clearTimeout(timer);
      resolve({ stdout, stderr: stderr + String(e), timeMs: Date.now() - start, timedOut, exitCode: -1 });
    });
    child.on('close', (code) => {
      if (done) return; done = true; clearTimeout(timer);
      resolve({ stdout, stderr, timeMs: Date.now() - start, timedOut, exitCode: code });
    });

    try { child.stdin.write(stdinData); } catch { /* ignore */ }
    child.stdin.end();
  });
}

function normalize(s: string): string {
  const lines = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(l => l.replace(/[ \t]+$/g, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

interface CompileInfo { ok: boolean; error: string; exePath: string | null; dir: string | null }

async function compileCpp(code: string): Promise<CompileInfo> {
  const dir = await mkdtemp(join(tmpdir(), 'neo-'));
  const src = join(dir, 'main.cpp');
  const exe = join(dir, 'prog');
  await writeFile(src, code, 'utf-8');
  return new Promise((resolve) => {
    const child = spawn('g++', ['-std=c++17', '-O2', '-o', exe, src]);
    let error = '';
    let done = false;
    const timer = setTimeout(() => {
      if (done) return; done = true;
      child.kill('SIGKILL');
      resolve({ ok: false, error: 'Compilation timed out', exePath: null, dir });
    }, COMPILE_TIMEOUT_MS);
    child.stderr.on('data', (d: Buffer) => { if (error.length < MAX_OUTPUT) error += d.toString(); });
    child.on('error', (e) => {
      if (done) return; done = true; clearTimeout(timer);
      resolve({ ok: false, error: error + String(e), exePath: null, dir });
    });
    child.on('close', (code2) => {
      if (done) return; done = true; clearTimeout(timer);
      resolve({ ok: code2 === 0, error, exePath: code2 === 0 ? exe : null, dir });
    });
  });
}

// ---------------- API ----------------
export async function POST(req: NextRequest) {
  let body: { questionId?: string; mode?: string; code?: string; customInput?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { questionId, mode, code, customInput } = body;
  if (!questionId || !mode) return NextResponse.json({ error: 'questionId and mode are required' }, { status: 400 });
  if (!code || typeof code !== 'string' || code.length > 100 * 1024) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }
  if (!['run', 'submit', 'custom'].includes(mode)) {
    return NextResponse.json({ error: 'mode must be run | submit | custom' }, { status: 400 });
  }

  const questions = loadQuestions();
  const q = questions.get(questionId);
  if (!q) return NextResponse.json({ error: `Unknown question: ${questionId}` }, { status: 404 });

  const compile = await compileCpp(code);
  if (!compile.ok) {
    if (compile.dir) rm(compile.dir, { recursive: true, force: true }).catch(() => {});
    return NextResponse.json({
      compile: 'ERROR',
      compileError: compile.error.slice(0, 8000),
      results: [],
      passed: 0,
      total: 0,
    });
  }

  const results: Array<{
    index: number; tag: string; hidden: boolean;
    input?: string; expected?: string; actual?: string;
    passed: boolean; stderr?: string; timeMs: number; timedOut?: boolean;
  }> = [];

  try {
    if (mode === 'custom') {
      const r = await runBinary(compile.exePath!, customInput ?? '');
      results.push({
        index: 1, tag: 'custom', hidden: false,
        input: (customInput ?? '').slice(0, 4096),
        actual: r.stdout.slice(0, 8000),
        stderr: r.stderr.slice(0, 4000),
        passed: r.exitCode === 0 && !r.timedOut,
        timeMs: r.timeMs, timedOut: r.timedOut,
      });
      rm(compile.dir, { recursive: true, force: true }).catch(() => {});
      return NextResponse.json({ compile: 'OK', results, passed: 1, total: 1 });
    }

    const tests = mode === 'run'
      ? q.tests.map((t, i) => ({ ...t, i })).filter(t => t.tag === 'sample')
      : q.tests.map((t, i) => ({ ...t, i }));
    let passed = 0;
    for (const t of tests) {
      const r = await runBinary(compile.exePath!, t.input);
      const ok = !r.timedOut && r.exitCode === 0 && normalize(r.stdout) === normalize(t.expected);
      if (ok) passed++;
      const hidden = t.tag !== 'sample';
      results.push({
        index: t.i + 1,
        tag: t.tag,
        hidden,
        passed: ok,
        timeMs: r.timeMs,
        timedOut: r.timedOut,
        // sample cases: full details; hidden cases: status only (like the real platform)
        ...(hidden ? {} : {
          input: t.input.slice(0, 4096),
          expected: t.expected.slice(0, 8000),
          actual: r.stdout.slice(0, 8000),
          stderr: r.stderr.slice(0, 4000),
        }),
      });
    }
    rm(compile.dir, { recursive: true, force: true }).catch(() => {});
    return NextResponse.json({ compile: 'OK', results, passed, total: results.length });
  } catch (e) {
    if (compile.dir) rm(compile.dir, { recursive: true, force: true }).catch(() => {});
    return NextResponse.json({ error: `Execution failed: ${String(e)}` }, { status: 500 });
  }
}
