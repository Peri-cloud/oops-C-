"use client";

import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  ChevronDown,
  ChevronRight,
  Terminal,
  FileInput,
  ListChecks,
} from "lucide-react";
import type { TestItem, ItemState, CaseResult } from "@/lib/exam";

interface Props {
  item: TestItem;
  state: ItemState;
  code: string;
  onCodeChange: (code: string) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
  onCustomRun: (input: string) => void;
  running: null | "run" | "submit" | "custom";
}

type Tab = "results" | "console" | "custom";

function CaseRow({ r }: { r: CaseResult }) {
  const [open, setOpen] = useState(false);
  const detailable = !r.hidden && (r.input !== undefined || r.stderr);
  return (
    <div className="rounded-md border border-[var(--neo-border)]/60 bg-white">
      <button
        onClick={() => detailable && setOpen((o) => !o)}
        className={`flex w-full items-center gap-2.5 px-3 py-2 text-left ${detailable ? "cursor-pointer" : "cursor-default"}`}
      >
        {detailable ? (
          open ? (
            <ChevronDown className="h-4 w-4 text-[var(--neo-text)]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[var(--neo-text)]" />
          )
        ) : (
          <span className="w-4" />
        )}
        <span className="text-[12.5px] font-medium text-[#121212]">
          Test case {r.index}
          <span className="ml-1.5 text-[11px] font-normal text-[var(--neo-text)]">
            {r.tag === "custom" ? "• Custom input" : r.tag === "extra" ? "• Extra practice" : r.hidden ? "• Hidden" : "• Sample"}
          </span>
        </span>
        {r.hidden && <Lock className="h-3 w-3 text-[var(--neo-text)]" />}
        <span
          className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            r.passed ? "bg-[#55ba451f] text-[#2e7d32]" : "bg-[#ff5e5b1f] text-[#c62828]"
          }`}
        >
          {r.passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {r.passed ? "Passed" : r.timedOut ? "Time Limit" : "Failed"}
        </span>
        <span className="text-[10.5px] text-[var(--neo-text)]">{r.timeMs} ms</span>
      </button>
      {open && detailable && (
        <div className="space-y-2 border-t border-[var(--neo-border)]/60 px-3 py-2.5">
          {r.input !== undefined && (
            <Block label="Input" value={r.input} />
          )}
          {r.expected !== undefined && <Block label="Expected Output" value={r.expected} />}
          {r.actual !== undefined && <Block label="Your Output" value={r.actual} tone={r.passed ? "ok" : "bad"} />}
          {r.stderr ? <Block label="stderr" value={r.stderr} tone="bad" /> : null}
        </div>
      )}
    </div>
  );
}

function Block({ label, value, tone }: { label: string; value: string; tone?: "ok" | "bad" }) {
  return (
    <div>
      <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">{label}</div>
      <pre
        className={`neo-mono max-h-32 overflow-auto whitespace-pre-wrap rounded border px-2.5 py-1.5 text-[12px] leading-relaxed ${
          tone === "bad"
            ? "border-[#ff5e5b4d] bg-[#ff5e5b0d] text-[#c62828]"
            : tone === "ok"
              ? "border-[#55ba454d] bg-[#55ba450d] text-[#1b5e20]"
              : "border-[var(--neo-border)]/60 bg-[var(--neo-bg)] text-[#121212]"
        }`}
      >
        {value || "(empty)"}
      </pre>
    </div>
  );
}

export function EditorPanel({
  item,
  state,
  code,
  onCodeChange,
  onReset,
  onRun,
  onSubmit,
  onCustomRun,
  running,
}: Props) {
  const [tab, setTab] = useState<Tab>("results");
  const [customInput, setCustomInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);

  const q = item.question!;
  const lastResults: CaseResult[] = state.results ?? [];
  const hasResults = lastResults.length > 0;
  const isSubmitResults = state.lastRun === "submit";
  const nSamples = q.tests.filter((t) => t.tag === "sample").length;
  const nHidden = q.tests.length - nSamples;

  const extensions = useMemo(() => [cpp()], []);

  const summary = useMemo(() => {
    if (isSubmitResults && hasResults) {
      const p = state.passed ?? 0;
      const t = state.totalTests ?? 0;
      return { text: `${p} / ${t} test cases passed`, ok: p === t };
    }
    if (hasResults) {
      const p = lastResults.filter((r) => r.passed).length;
      return { text: `${p} / ${lastResults.length} sample cases passed`, ok: p === lastResults.length };
    }
    return null;
  }, [isSubmitResults, hasResults, lastResults, state.passed, state.totalTests]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--neo-bg)]">
      {/* toolbar */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--neo-border)]/60 bg-white px-3">
        <div className="flex items-center gap-3">
          <select
            className="h-8 rounded-md border border-[var(--neo-border)] bg-white px-2.5 text-[12.5px] font-medium text-[#121212] outline-none"
            defaultValue="C++ (17)"
            aria-label="Programming language"
          >
            <option value="C++ (17)">C++ (17)</option>
          </select>
          <span className="hidden text-[11.5px] text-[var(--neo-text)] md:block">
            {state.submitted ? "Submitted — review feedback below" : "g++ -std=c++17 • judge compares output exactly"}
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-md border border-[var(--neo-border)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--neo-text)] transition-colors hover:bg-[var(--neo-bg)] hover:text-[#121212]"
          title="Reset to starter code"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Code
        </button>
      </div>

      {/* editor */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={onCodeChange}
          basicSetup={{ foldGutter: false, autocompletion: false, highlightActiveLine: true, tabSize: 4 }}
          style={{ height: "100%", fontSize: 13.5 }}
          className="neo-cm h-full"
        />
      </div>

      {/* results panel */}
      <div
        className={`shrink-0 border-t border-[var(--neo-border)]/60 bg-white transition-all ${
          panelOpen ? "h-[240px]" : "h-[40px]"
        }`}
      >
        <div className="flex h-[40px] items-center gap-1 border-b border-[var(--neo-border)]/60 px-2">
          <button
            onClick={() => { setTab("results"); setPanelOpen(true); }}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-medium ${
              tab === "results" ? "bg-[rgba(52,86,255,0.1)] text-[var(--neo-primary)]" : "text-[var(--neo-text)] hover:text-[#121212]"
            }`}
          >
            <ListChecks className="h-4 w-4" /> Test Results
            {summary && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold ${summary.ok ? "bg-[#55ba451f] text-[#2e7d32]" : "bg-[#ff5e5b1f] text-[#c62828]"}`}>
                {summary.text}
              </span>
            )}
          </button>
          <button
            onClick={() => { setTab("console"); setPanelOpen(true); }}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-medium ${
              tab === "console" ? "bg-[rgba(52,86,255,0.1)] text-[var(--neo-primary)]" : "text-[var(--neo-text)] hover:text-[#121212]"
            }`}
          >
            <Terminal className="h-4 w-4" /> Console
          </button>
          <button
            onClick={() => { setTab("custom"); setPanelOpen(true); }}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-medium ${
              tab === "custom" ? "bg-[rgba(52,86,255,0.1)] text-[var(--neo-primary)]" : "text-[var(--neo-text)] hover:text-[#121212]"
            }`}
          >
            <FileInput className="h-4 w-4" /> Custom Input
          </button>
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="ml-auto rounded p-1.5 text-[var(--neo-text)] hover:bg-[var(--neo-bg)]"
            title={panelOpen ? "Collapse panel" : "Expand panel"}
          >
            {panelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {panelOpen && (
          <div className="neo-scroll h-[200px] overflow-y-auto">
            {tab === "results" && (
              <div className="space-y-2 p-3">
                {running && (
                  <div className="flex items-center gap-2 px-1 py-2 text-[13px] text-[var(--neo-text)]">
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--neo-primary)]" />
                    {running === "run" ? "Compiling and running sample cases…" : "Compiling and running all test cases…"}
                  </div>
                )}
                {!running && !hasResults && (
                  <div className="px-1 py-3 text-[12.5px] leading-relaxed text-[var(--neo-text)]">
                    Click <span className="font-semibold text-[var(--neo-primary)]">Run</span> to execute the {nSamples} sample case{nSamples === 1 ? "" : "s"} with full details.{" "}
                    <span className="font-semibold text-[var(--neo-primary)]">Submit</span> also runs the {nHidden} hidden case{nHidden === 1 ? "" : "s"} (status only) and records your score.
                  </div>
                )}
                {!running && state.compileError && (
                  <div className="rounded-md border border-[#ff5e5b4d] bg-[#ff5e5b0d] p-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#c62828]">
                      <XCircle className="h-4 w-4" /> Compilation Error
                    </div>
                    <pre className="neo-mono mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-[12px] leading-relaxed text-[#c62828]">
                      {state.compileError}
                    </pre>
                  </div>
                )}
                {!running && !state.compileError && lastResults.map((r) => <CaseRow key={`${r.index}-${r.timeMs}`} r={r} />)}
              </div>
            )}

            {tab === "console" && (
              <div className="p-3">
                <pre className="neo-mono whitespace-pre-wrap rounded bg-[#1e2431] p-3 text-[12px] leading-relaxed text-[#d5dae6]">
{state.compileError
  ? state.compileError
  : state.results?.some((r) => r.stderr)
    ? state.results.filter((r) => r.stderr).map((r) => `[test ${r.index}] ${r.stderr}`).join("\n")
    : hasResults
      ? "stdout handled above; no stderr produced."
      : "// Console output appears here after Run / Submit."}
                </pre>
              </div>
            )}

            {tab === "custom" && (
              <div className="flex h-full flex-col gap-2 p-3">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Type custom stdin for your program…"
                  className="neo-mono h-[92px] w-full resize-none rounded-md border border-[var(--neo-border)] bg-[var(--neo-bg)] p-2.5 text-[12.5px] text-[#121212] outline-none focus:border-[var(--neo-primary)]"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onCustomRun(customInput)}
                    disabled={!!running}
                    className="flex items-center gap-1.5 rounded-md border border-[var(--neo-primary)] px-3 py-1.5 text-[12px] font-semibold text-[var(--neo-primary)] transition-colors hover:bg-[rgba(52,86,255,0.1)] disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" /> Run with this input
                  </button>
                  <span className="text-[11px] text-[var(--neo-text)]">Test your own inputs — no verdict, output and stderr only.</span>
                </div>
                {!running &&
                  lastResults
                    .filter((r) => r.tag === "custom")
                    .map((r) => (
                      <div key="custom" className="space-y-2">
                        {r.actual !== undefined && <Block label="Your Output" value={r.actual} tone={r.passed ? "ok" : "bad"} />}
                        {r.stderr ? <Block label="stderr" value={r.stderr} tone="bad" /> : null}
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* action bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-end gap-2.5 border-t border-[var(--neo-border)]/60 bg-white px-4">
        {running && <Loader2 className="h-4 w-4 animate-spin text-[var(--neo-primary)]" />}
        <button
          onClick={onRun}
          disabled={!!running}
          className="flex items-center gap-1.5 rounded-md border border-[var(--neo-primary)] px-4 py-2 text-[13px] font-semibold text-[var(--neo-primary)] transition-colors hover:bg-[rgba(52,86,255,0.1)] disabled:opacity-50"
        >
          <Play className="h-4 w-4" /> Run Code
        </button>
        <button
          onClick={onSubmit}
          disabled={!!running}
          className="flex items-center gap-1.5 rounded-md bg-[var(--neo-primary)] px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#2a46d9] disabled:opacity-50"
        >
          <Send className="h-4 w-4" /> Submit
        </button>
      </div>
    </div>
  );
}
