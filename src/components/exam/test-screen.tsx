"use client";

import { Clock, Flag, User } from "lucide-react";
import { NeoSidebar, CollegeLogo } from "./shell";
import { ProblemPanel } from "./problem-panel";
import { EditorPanel } from "./editor-panel";
import { fmtClock, isAnswered, defaultItemState, type TestItem, type ItemState, type TestConfig } from "@/lib/exam";

interface Props {
  items: TestItem[];
  current: number;
  setCurrent: (i: number) => void;
  states: Record<string, ItemState>;
  config: TestConfig;
  timeLeft: number;
  running: null | "run" | "submit" | "custom";
  code: string;
  onCodeChange: (c: string) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
  onCustomRun: (input: string) => void;
  onSelectChoice: (n: number) => void;
  onToggleMark: () => void;
  onFinish: () => void;
}

function PaletteChip({ item, st, idx, current, onClick }: { item: TestItem; st: ItemState; idx: number; current: boolean; onClick: () => void }) {
  const answered = isAnswered(item, st);
  const passed = st.submitted && st.passed === st.totalTests;
  const failed = st.submitted && !passed && st.passed !== undefined;
  let cls = "border-[var(--neo-border)] bg-white text-[#121212] hover:border-[var(--neo-primary)]";
  if (passed) cls = "border-transparent bg-[var(--neo-success)] text-white";
  else if (failed) cls = "border-transparent bg-[var(--neo-error)] text-white";
  else if (st.marked) cls = "border-transparent bg-[var(--neo-marked)] text-white";
  else if (answered) cls = "border-transparent bg-[var(--neo-primary)] text-white";
  else if (st.visited) cls = "border-[var(--neo-border)] bg-white text-[#121212]";
  return (
    <button
      onClick={onClick}
      title={item.title}
      className={`relative h-9 w-9 rounded-md border text-[13px] font-semibold transition-all ${cls} ${
        current ? "ring-2 ring-[var(--neo-primary)] ring-offset-2 ring-offset-white" : ""
      }`}
    >
      {idx + 1}
      {st.marked && !passed && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--neo-marked)] ring-2 ring-white" />}
    </button>
  );
}

export function TestScreen(props: Props) {
  const { items, current, setCurrent, states, config, timeLeft } = props;
  const item = items[current];
  const st: ItemState = states[item.id] ?? defaultItemState();
  const danger = timeLeft <= 300;

  const answeredCount = items.filter((it) => isAnswered(it, states[it.id] ?? { visited: false, marked: false, submitted: false })).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <NeoSidebar active="Tests" />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* test header */}
        <header className="flex h-[54px] shrink-0 items-center justify-between gap-3 border-b border-[var(--neo-border)]/50 bg-white px-3 shadow-[0_8px_24px_0_#0000000A] lg:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <CollegeLogo size={34} />
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-semibold text-[#121212]">
                C++ Programming — Units 1–5 Practice
              </div>
              <div className="hidden text-[11px] text-[var(--neo-text)] sm:block">
                {config.mode === "mock" ? "IAMNEO Mock Replica" : config.mode === "unit" ? `Unit ${config.unit} Practice` : config.mode === "mcq" ? `MCQ Sprint — Unit ${config.unit}` : "Full Practice"} • {items.length} questions • {config.durationMin} min
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 items-center gap-2 rounded-md px-3 text-[14px] font-semibold tabular-nums ${
                danger
                  ? "neo-timer-danger bg-[#ff5e5b1f] text-[#c62828]"
                  : "bg-[rgba(52,86,255,0.1)] text-[var(--neo-primary)]"
              }`}
              role="timer"
              aria-label="Time remaining"
            >
              <Clock className="h-4 w-4" />
              {fmtClock(timeLeft)}
            </div>
            <button
              onClick={props.onToggleMark}
              className={`hidden h-9 items-center gap-1.5 rounded-md border px-3 text-[12.5px] font-medium transition-colors sm:flex ${
                st.marked
                  ? "border-[var(--neo-marked)] bg-[var(--neo-marked)]/10 text-[var(--neo-marked)]"
                  : "border-[var(--neo-border)] text-[var(--neo-text)] hover:text-[#121212]"
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              {st.marked ? "Marked for review" : "Mark for review"}
            </button>
            <button
              onClick={props.onFinish}
              className="flex h-9 items-center gap-1.5 rounded-md bg-[var(--neo-primary)] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#2a46d9]"
            >
              <Flag className="h-3.5 w-3.5" /> Finish Test
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--neo-bg)]">
                <User className="h-4 w-4 text-[#022277]" />
              </div>
              <span className="text-[12.5px] font-medium text-[#121212]">VISHNU PRIYA S</span>
            </div>
          </div>
        </header>

        {/* mobile palette strip */}
        <div className="neo-scroll flex items-center gap-2 overflow-x-auto border-b border-[var(--neo-border)]/50 bg-[var(--neo-bg)] px-3 py-2 lg:hidden">
          {items.map((it, i) => (
            <PaletteChip
              key={it.id}
              item={it}
              st={states[it.id] ?? { visited: false, marked: false, submitted: false }}
              idx={i}
              current={i === current}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <div className="flex min-h-0 flex-1">
          {/* desktop palette */}
          <div className="hidden w-[200px] shrink-0 flex-col border-r border-[var(--neo-border)]/50 bg-[var(--neo-bg)] lg:flex">
            <div className="px-4 pb-2 pt-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">
              Question Palette
            </div>
            <div className="neo-scroll grid grid-cols-5 gap-2 overflow-y-auto px-4 pb-3">
              {items.map((it, i) => (
                <PaletteChip
                  key={it.id}
                  item={it}
                  st={states[it.id] ?? { visited: false, marked: false, submitted: false }}
                  idx={i}
                  current={i === current}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <div className="mt-auto space-y-1.5 border-t border-[var(--neo-border)]/50 px-4 py-3 text-[11px] text-[var(--neo-text)]">
              <Legend color="bg-[var(--neo-primary)]" label="Answered" n={answeredCount} />
              <Legend color="bg-white border border-[var(--neo-border)]" label="Not answered" n={items.length - answeredCount} />
              <Legend color="bg-[var(--neo-marked)]" label="Marked for review" n={items.filter((it) => states[it.id]?.marked).length} />
              <Legend color="bg-[var(--neo-success)]" label="All tests passed" n={items.filter((it) => states[it.id]?.submitted && states[it.id]?.passed === states[it.id]?.totalTests).length} />
              <Legend color="bg-[var(--neo-error)]" label="Some tests failed" n={items.filter((it) => states[it.id]?.submitted && states[it.id]?.passed !== states[it.id]?.totalTests).length} />
            </div>
          </div>

          {/* main split */}
          <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
            <div className="min-h-0 flex-1 border-b border-[var(--neo-border)]/50 xl:border-b-0 xl:border-r xl:w-[44%] xl:flex-none">
              {item.type === "mcq" ? (
                <ProblemPanel item={item} state={st} onSelectChoice={props.onSelectChoice} mcqVariant="statement" />
              ) : (
                <ProblemPanel item={item} state={st} onSelectChoice={props.onSelectChoice} />
              )}
            </div>
            <div className="min-h-0 flex-1 xl:min-w-0">
              {item.type === "code" ? (
                <EditorPanel
                  item={item}
                  state={st}
                  code={props.code}
                  onCodeChange={props.onCodeChange}
                  onReset={props.onReset}
                  onRun={props.onRun}
                  onSubmit={props.onSubmit}
                  onCustomRun={props.onCustomRun}
                  running={props.running}
                />
              ) : (
                <div className="flex h-full flex-col bg-[var(--neo-bg)]">
                  <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--neo-border)]/60 bg-white px-3">
                    <span className="text-[12.5px] text-[var(--neo-text)]">Multiple choice — select one option</span>
                    {st.submitted && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.correct ? "bg-[#55ba451f] text-[#2e7d32]" : "bg-[#ff5e5b1f] text-[#c62828]"}`}>
                        {st.correct ? "+1 mark" : "0 marks"}
                      </span>
                    )}
                  </div>
                  <div className="min-h-0 flex-1">
                    <ProblemPanel item={item} state={st} onSelectChoice={props.onSelectChoice} mcqVariant="options" />
                  </div>
                  <div className="flex h-[52px] shrink-0 items-center justify-end gap-2.5 border-t border-[var(--neo-border)]/60 bg-white px-4">
                    <button
                      onClick={props.onSubmit}
                      disabled={st.submitted || st.choice === undefined}
                      className="flex items-center gap-1.5 rounded-md bg-[var(--neo-primary)] px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#2a46d9] disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label, n }: { color: string; label: string; n: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="flex-1">{label}</span>
      <span className="font-semibold text-[#121212]">{n}</span>
    </div>
  );
}
