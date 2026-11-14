"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StartScreen } from "@/components/exam/start-screen";
import { TestScreen } from "@/components/exam/test-screen";
import { ReviewScreen } from "@/components/exam/review-screen";
import {
  buildItems,
  defaultItemState,
  QUESTIONS,
  MCQS,
  type TestConfig,
  type TestItem,
  type ItemState,
  type RunResponse,
  MARKS_PER_CODE_Q,
  MARKS_PER_MCQ,
} from "@/lib/exam";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

type Stage = "start" | "test" | "review";

const STORAGE_KEY = "iamneo-cpp-practice-v1";

interface PersistShape {
  stage: Stage;
  config: TestConfig | null;
  itemIds: { id: string; type: "code" | "mcq" }[] | null;
  states: Record<string, ItemState> | null;
  deadline: number | null;
  current: number;
}

function loadPersisted(): PersistShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistShape) : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const hydrated = useRef(false);
  const [stage, setStage] = useState<Stage>("start");
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [items, setItems] = useState<TestItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [states, setStates] = useState<Record<string, ItemState>>({});
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [running, setRunning] = useState<null | "run" | "submit" | "custom">(null);
  const [modal, setModal] = useState<null | { kind: "all" | "partial" | "fail" | "correct" | "wrong" | "compile"; passed?: number; total?: number; score?: number }>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [timedOutFlag, setTimedOutFlag] = useState(false);

  // ---------- hydrate persisted session ----------
  useEffect(() => {
    const p = loadPersisted();
    if (p && p.stage !== "start" && p.config && p.itemIds) {
      const rebuilt = rebuildItems(p.itemIds);
      if (rebuilt.length === p.itemIds.length) {
        setConfig(p.config);
        setItems(rebuilt);
        setStates(p.states ?? {});
        setDeadline(p.deadline);
        setCurrent(p.current ?? 0);
        setStage(p.stage === "review" ? "review" : "test");
      }
    }
    hydrated.current = true;
  }, []);

  // ---------- persist ----------
  useEffect(() => {
    if (!hydrated.current) return;
    const shape: PersistShape = {
      stage,
      config,
      itemIds: stage === "start" ? null : items.map((i) => ({ id: i.id, type: i.type })),
      states: stage === "start" ? null : states,
      deadline,
      current,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shape));
    } catch {
      /* quota — ignore */
    }
  }, [stage, config, items, states, deadline, current]);

  // ---------- timer ----------
  useEffect(() => {
    if (stage !== "test" || deadline === null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [stage, deadline]);

  const timeLeft = deadline ? Math.max(0, Math.round((deadline - now) / 1000)) : 0;

  const finishTest = useCallback(() => {
    setStage("review");
    setShowFinishConfirm(false);
  }, []);

  // auto finish at zero
  useEffect(() => {
    if (stage === "test" && deadline !== null && timeLeft <= 0) {
      setTimedOutFlag(true);
      finishTest();
    }
  }, [stage, deadline, timeLeft, finishTest]);

  // ---------- item / state helpers ----------
  const item = items[current];
  const st: ItemState = (item && states[item.id]) || defaultItemState();

  const touchItem = useCallback(
    (id: string, patch: Partial<ItemState>) => {
      setStates((prev) => ({ ...prev, [id]: { ...(prev[id] ?? defaultItemState()), ...patch } }));
    },
    []
  );

  const goTo = useCallback(
    (i: number) => {
      setCurrent(i);
      const it = items[i];
      if (!it) return;
      setStates((prev) => {
        const cur = prev[it.id] ?? defaultItemState();
        const next: ItemState = { ...cur, visited: true };
        if (it.type === "code" && next.code === undefined) {
          next.code = it.question!.starterCode;
        }
        return { ...prev, [it.id]: next };
      });
    },
    [items]
  );

  // mark first item visited when the test starts
  useEffect(() => {
    if (stage === "test" && items.length) {
      goTo(current);
    }
  }, [stage, items]);

  // ---------- API actions ----------
  const post = useCallback(async (body: Record<string, unknown>): Promise<RunResponse> => {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }
    return res.json();
  }, []);

  const handleRun = useCallback(async () => {
    if (!item || item.type !== "code") return;
    setRunning("run");
    try {
      const r = await post({ questionId: item.id, mode: "run", code: st.code ?? "" });
      touchItem(item.id, {
        results: r.results,
        compileError: r.compile === "ERROR" ? r.compileError : undefined,
        lastRun: "run",
      });
    } catch {
      touchItem(item.id, { compileError: "Could not reach the judge. Try again." });
    } finally {
      setRunning(null);
    }
  }, [item, st.code, post, touchItem]);

  const handleSubmitCode = useCallback(async () => {
    if (!item || item.type !== "code") return;
    setRunning("submit");
    try {
      const r = await post({ questionId: item.id, mode: "submit", code: st.code ?? "" });
      const passed = r.passed;
      const total = r.total;
      const score = total > 0 ? Math.round((passed / total) * MARKS_PER_CODE_Q * 10) / 10 : 0;
      touchItem(item.id, {
        results: r.results,
        compileError: r.compile === "ERROR" ? r.compileError : undefined,
        lastRun: "submit",
        submitted: true,
        passed,
        totalTests: total,
        score: r.compile === "ERROR" ? 0 : score,
      });
      if (r.compile === "ERROR") setModal({ kind: "compile" });
      else if (passed === total) setModal({ kind: "all", passed, total, score });
      else if (passed > 0) setModal({ kind: "partial", passed, total, score });
      else setModal({ kind: "fail", passed, total, score });
    } catch {
      touchItem(item.id, { compileError: "Could not reach the judge. Try again." });
    } finally {
      setRunning(null);
    }
  }, [item, st.code, post, touchItem]);

  const handleCustomRun = useCallback(
    async (input: string) => {
      if (!item || item.type !== "code") return;
      setRunning("custom");
      try {
        const r = await post({ questionId: item.id, mode: "custom", code: st.code ?? "", customInput: input });
        touchItem(item.id, {
          results: [...(st.results ?? []).filter((x) => x.tag !== "custom"), ...r.results],
          compileError: r.compile === "ERROR" ? r.compileError : undefined,
          lastRun: "custom",
        });
      } catch {
        touchItem(item.id, { compileError: "Could not reach the judge. Try again." });
      } finally {
        setRunning(null);
      }
    },
    [item, st.code, st.results, post, touchItem]
  );

  const handleSubmitMcq = useCallback(() => {
    if (!item || item.type !== "mcq") return;
    const m = item.mcq!;
    const choice = st.choice;
    const correct = choice !== undefined && "ABCDE"[choice] === m.ans;
    touchItem(item.id, {
      submitted: true,
      correct,
      score: correct ? MARKS_PER_MCQ : 0,
      code: st.code,
    });
    setModal({ kind: correct ? "correct" : "wrong" });
  }, [item, st.choice, st.code, touchItem]);

  const handleSubmit = useCallback(() => {
    if (!item) return;
    if (item.type === "mcq") handleSubmitMcq();
    else handleSubmitCode();
  }, [item, handleSubmitMcq, handleSubmitCode]);

  // ---------- start / restart ----------
  const handleStart = useCallback((cfg: TestConfig) => {
    const built = buildItems(cfg);
    setConfig(cfg);
    setItems(built);
    setStates({});
    setCurrent(0);
    setDeadline(Date.now() + cfg.durationMin * 60_000);
    setNow(Date.now());
    setTimedOutFlag(false);
    setStage("test");
  }, []);

  const handleRestart = useCallback(() => {
    setStage("start");
    setConfig(null);
    setItems([]);
    setStates({});
    setDeadline(null);
    setCurrent(0);
  }, []);

  // ---------- derived ----------
  const code = useMemo(() => {
    if (!item || item.type !== "code") return "";
    return st.code ?? item.question!.starterCode;
  }, [item, st.code]);

  const timeUsed = config ? config.durationMin * 60 - timeLeft : 0;

  if (stage === "start" || !config) {
    return <StartScreen onStart={handleStart} />;
  }

  if (stage === "review") {
    return (
      <ReviewScreen
        items={items}
        states={states}
        config={config}
        timeUsed={timeUsed}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <>
      <TestScreen
        items={items}
        current={current}
        setCurrent={goTo}
        states={states}
        config={config}
        timeLeft={timeLeft}
        running={running}
        code={code}
        onCodeChange={(c) => item && touchItem(item.id, { code: c, visited: true })}
        onReset={() => item && item.type === "code" && touchItem(item.id, { code: item.question!.starterCode })}
        onRun={handleRun}
        onSubmit={handleSubmit}
        onCustomRun={handleCustomRun}
        onSelectChoice={(n) => item && touchItem(item.id, { choice: n, visited: true })}
        onToggleMark={() => item && touchItem(item.id, { marked: !st.marked })}
        onFinish={() => setShowFinishConfirm(true)}
      />

      {/* submit result modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="sm:max-w-md">
          {modal?.kind === "all" && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--neo-success)]" />
              <DialogHeader className="mt-2">
                <DialogTitle className="text-center text-[18px] text-[#2e7d32]">All Test Cases Passed!</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[13px] text-[var(--neo-text)]">
                {modal.passed} / {modal.total} test cases • score +{modal.score} marks
              </p>
              <p className="mt-2 rounded-md bg-[var(--neo-bg)] px-3 py-2 text-[12px] leading-relaxed text-[var(--neo-text)]">
                In the real exam this locks your answer. Keep practising: read the problem again and try to shorten your logic before moving on.
              </p>
            </div>
          )}
          {modal?.kind === "partial" && (
            <div className="text-center">
              <AlertTriangle className="mx-auto h-14 w-14 text-[#ffbd25]" />
              <DialogHeader className="mt-2">
                <DialogTitle className="text-center text-[18px] text-[#a06a00]">Some Test Cases Failed</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[13px] text-[var(--neo-text)]">
                {modal.passed} / {modal.total} passed • score +{modal.score} marks
              </p>
              <p className="mt-2 rounded-md bg-[var(--neo-bg)] px-3 py-2 text-[12px] leading-relaxed text-[var(--neo-text)]">
                Your output format may not match exactly: check spaces, line breaks, labels and decimal places. Fix the logic and Submit again.
              </p>
            </div>
          )}
          {modal?.kind === "fail" && (
            <div className="text-center">
              <XCircle className="mx-auto h-14 w-14 text-[var(--neo-error)]" />
              <DialogHeader className="mt-2">
                <DialogTitle className="text-center text-[18px] text-[#c62828]">No Test Case Passed</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[13px] text-[var(--neo-text)]">0 / {modal.total} passed • score +0 marks</p>
              <p className="mt-2 rounded-md bg-[var(--neo-bg)] px-3 py-2 text-[12px] leading-relaxed text-[var(--neo-text)]">
                Re-read the Input / Output format. Even a correct logic scores 0 when the printed format is wrong.
              </p>
            </div>
          )}
          {modal?.kind === "compile" && (
            <div className="text-center">
              <XCircle className="mx-auto h-14 w-14 text-[var(--neo-error)]" />
              <DialogHeader className="mt-2">
                <DialogTitle className="text-center text-[18px] text-[#c62828]">Compilation Error</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[13px] text-[var(--neo-text)]">All test cases score 0 — fix the errors shown in the Console tab, then Submit again.</p>
              <p className="mt-2 rounded-md bg-[var(--neo-bg)] px-3 py-2 text-left text-[12px] leading-relaxed text-[var(--neo-text)]">
                Remember the classic mistake: <span className="neo-mono">#include &lt;studio.h&gt;</span> does not exist. Use <span className="neo-mono">#include &lt;iostream&gt;</span>.
              </p>
            </div>
          )}
          {modal?.kind === "correct" && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--neo-success)]" />
              <DialogHeader className="mt-2">
                <DialogTitle className="text-center text-[18px] text-[#2e7d32]">Correct Answer!</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[13px] text-[var(--neo-text)]">+1 mark • the explanation is shown under the options.</p>
            </div>
          )}
          {modal?.kind === "wrong" && (
            <div className="text-center">
              <XCircle className="mx-auto h-14 w-14 text-[var(--neo-error)]" />
              <DialogHeader className="mt-2">
                <DialogTitle className="text-center text-[18px] text-[#c62828]">Wrong Answer</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[13px] text-[var(--neo-text)]">+0 marks • the correct option and explanation are shown under the options.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* finish confirm */}
      <Dialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{timedOutFlag ? "Time is up — test finished" : "Finish the test?"}</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] leading-relaxed text-[var(--neo-text)]">
            {timedOutFlag
              ? "The timer reached 00:00, exactly like the real exam. Your result summary is ready."
              : `${items.filter((it) => states[it.id]?.submitted).length} of ${items.length} questions submitted. Unsubmitted questions score 0. You can review every question, your code and the verified reference solutions after finishing.`}
          </p>
          <div className="mt-2 flex justify-end gap-2">
            {!timedOutFlag && (
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="rounded-md border border-[var(--neo-border)] px-4 py-2 text-[13px] font-medium text-[#121212] hover:bg-[var(--neo-bg)]"
              >
                Keep working
              </button>
            )}
            <button
              onClick={finishTest}
              className="rounded-md bg-[var(--neo-primary)] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#2a46d9]"
            >
              {timedOutFlag ? "View result" : "Finish test"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------- rebuild persisted items ----------
function rebuildItems(ids: { id: string; type: "code" | "mcq" }[]): TestItem[] {
  const out: TestItem[] = [];
  for (const { id, type } of ids) {
    if (type === "code") {
      const q = QUESTIONS.find((x) => x.id === id);
      if (q)
        out.push({
          type: "code",
          id: q.id,
          unit: q.unit,
          title: q.title,
          kind: q.kind,
          question: q,
          maxMarks: MARKS_PER_CODE_Q,
        });
    } else {
      const m = MCQS.find((x) => x.id === id);
      if (m)
        out.push({
          type: "mcq",
          id: m.id,
          unit: m.unit,
          title: m.q,
          kind: "MCQ",
          mcq: m,
          maxMarks: MARKS_PER_MCQ,
        });
    }
  }
  return out;
}
