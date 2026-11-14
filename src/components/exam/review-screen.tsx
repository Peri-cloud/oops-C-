"use client";

import { useState } from "react";
import { NeoSidebar, CollegeLogo } from "./shell";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Target,
  Award,
  Lock,
  Clock,
} from "lucide-react";
import { fmtClock, type TestItem, type ItemState, type TestConfig } from "@/lib/exam";

interface Props {
  items: TestItem[];
  states: Record<string, ItemState>;
  config: TestConfig;
  timeUsed: number;
  onRestart: () => void;
}

function pct(score: number, max: number) {
  if (max === 0) return 0;
  return Math.round((score / max) * 100);
}

export function ReviewScreen({ items, states, config, timeUsed, onRestart }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const maxTotal = items.reduce((s, it) => s + it.maxMarks, 0);
  const score = items.reduce((s, it) => s + (states[it.id]?.score ?? 0), 0);
  const fullPass = items.filter((it) => states[it.id]?.submitted && states[it.id]?.passed === states[it.id]?.totalTests).length;
  const attempted = items.filter((it) => states[it.id]?.submitted).length;
  const grade = pct(score, maxTotal);
  const gradeLabel = grade >= 80 ? "Excellent" : grade >= 60 ? "Good" : grade >= 40 ? "Average" : "Needs work";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <NeoSidebar active="Tests" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-[var(--neo-border)]/50 bg-white px-4 shadow-[0_8px_24px_0_#0000000A] lg:px-6">
          <div className="flex items-center gap-3">
            <CollegeLogo size={34} />
            <span className="text-[14px] font-semibold text-[#121212]">Test Result Summary</span>
          </div>
          <button
            onClick={onRestart}
            className="flex h-9 items-center gap-1.5 rounded-md bg-[var(--neo-primary)] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#2a46d9]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New Practice Test
          </button>
        </header>

        <main className="neo-scroll flex-1 overflow-y-auto px-4 py-6 lg:px-10">
          <div className="mx-auto max-w-4xl">
            {/* score card */}
            <div className="rounded-lg border border-[var(--neo-border)]/50 bg-gradient-to-br from-[rgba(52,86,255,0.1)] to-white p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-[var(--neo-primary)] bg-white">
                  <span className="text-[22px] font-bold leading-none text-[var(--neo-primary)]">
                    {Number.isInteger(score) ? score : score.toFixed(1)}
                  </span>
                  <span className="mt-1 text-[11px] text-[var(--neo-text)]">/ {maxTotal} marks</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[18px] font-semibold text-[#121212]">
                    <Trophy className="h-5 w-5 text-[#ffbd25]" /> {gradeLabel} ({grade}%)
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Stat icon={<Award className="h-4 w-4 text-[var(--neo-primary)]" />} label="Attempted" value={`${attempted} / ${items.length}`} />
                    <Stat icon={<CheckCircle2 className="h-4 w-4 text-[var(--neo-success)]" />} label="All tests passed" value={String(fullPass)} />
                    <Stat icon={<Target className="h-4 w-4 text-[var(--neo-error)]" />} label="Not attempted" value={String(items.length - attempted)} />
                    <Stat icon={<Clock className="h-4 w-4 text-[var(--neo-text)]" />} label="Time used" value={fmtClock(timeUsed)} />
                  </div>
                </div>
              </div>
            </div>

            {/* result table */}
            <div className="mt-6 overflow-x-auto rounded-md border border-[var(--neo-border)]/50">
              <table className="w-full min-w-[560px] border-separate border-spacing-0 text-[13px]">
                <thead>
                  <tr className="h-10">
                    {["SNo", "Question", "Type", "Unit", "Status", "Score"].map((h) => (
                      <th key={h} className="whitespace-nowrap border-b border-[var(--neo-border)]/50 bg-[rgba(52,86,255,0.1)] px-3 text-left font-medium capitalize text-[#121212]">
                        {h}
                      </th>
                    ))}
                    <th className="border-b border-[var(--neo-border)]/50 bg-[rgba(52,86,255,0.1)] px-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const st = states[it.id] ?? { visited: false, marked: false, submitted: false };
                    const allPass = st.submitted && st.passed === st.totalTests;
                    return (
                      <tr key={it.id} className="h-11 bg-white hover:bg-[var(--neo-bg)]">
                        <td className="border-b border-[var(--neo-border)]/40 px-3 text-[#121212]">{i + 1}</td>
                        <td className="max-w-[280px] truncate border-b border-[var(--neo-border)]/40 px-3 text-[#121212]" title={it.title}>
                          {it.title}
                        </td>
                        <td className="whitespace-nowrap border-b border-[var(--neo-border)]/40 px-3 text-[var(--neo-text)]">{it.kind}</td>
                        <td className="border-b border-[var(--neo-border)]/40 px-3 text-[#121212]">{it.unit}</td>
                        <td className="border-b border-[var(--neo-border)]/40 px-3">
                          {!st.submitted ? (
                            <span className="text-[var(--neo-text)]">Not attempted</span>
                          ) : it.type === "mcq" ? (
                            <span className={`flex items-center gap-1 font-medium ${st.correct ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
                              {st.correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                              {st.correct ? "Correct" : "Wrong"}
                            </span>
                          ) : (
                            <span className={`flex items-center gap-1 font-medium ${allPass ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
                              {allPass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                              {st.passed}/{st.totalTests} tests
                            </span>
                          )}
                        </td>
                        <td className="border-b border-[var(--neo-border)]/40 px-3 font-semibold text-[#121212]">
                          {st.submitted ? (Number.isInteger(st.score) ? `${st.score}` : (st.score ?? 0).toFixed(1)) : "—"}
                        </td>
                        <td className="border-b border-[var(--neo-border)]/40 px-3 text-right">
                          <button
                            onClick={() => setOpenId(openId === it.id ? null : it.id)}
                            className="rounded p-1 text-[var(--neo-text)] hover:bg-[var(--neo-bg)]"
                            title="Details"
                          >
                            {openId === it.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* expanded details */}
            {items.map((it) => {
              if (openId !== it.id) return null;
              const st = states[it.id] ?? { visited: false, marked: false, submitted: false };
              const q = it.question;
              return (
                <div key={it.id} className="neo-fade-in mt-4 rounded-lg border border-[var(--neo-border)]/50 bg-white">
                  <div className="border-b border-[var(--neo-border)]/50 bg-[var(--neo-bg)] px-4 py-2.5 text-[13.5px] font-semibold text-[#121212]">
                    {it.id} — {it.title}
                  </div>
                  <div className="p-4">
                    {it.type === "mcq" && it.mcq && (
                      <div className="space-y-2 text-[13px] text-[#121212]">
                        <p>
                          Your answer:{" "}
                          <span className="font-semibold">
                            {st.choice !== undefined ? `${"ABCDE"[st.choice]}. ${it.mcq.opts[st.choice]}` : "— none —"}
                          </span>
                        </p>
                        <p>
                          Correct answer: <span className="font-semibold text-[#2e7d32]">{it.mcq.ans}. {it.mcq.ansText}</span>
                        </p>
                        {it.mcq.verifiedOutput && (
                          <p className="text-[12px] text-[var(--neo-text)]">
                            This output-question code was compiled and executed during verification: it prints{" "}
                            <span className="neo-mono font-semibold">{it.mcq.verifiedOutput}</span>.
                          </p>
                        )}
                        {it.mcq.expl && <p className="leading-relaxed text-[var(--neo-text)]">{it.mcq.expl}</p>}
                      </div>
                    )}

                    {it.type === "code" && q && (
                      <div className="space-y-4">
                        <div>
                          <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">Test case outcomes</div>
                          <div className="flex flex-wrap gap-2">
                            {st.results?.map((r) => (
                              <span
                                key={r.index}
                                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
                                  r.passed ? "bg-[#55ba451f] text-[#2e7d32]" : "bg-[#ff5e5b1f] text-[#c62828]"
                                }`}
                                title={r.hidden ? "Hidden case — details not shown" : `Sample: ${r.input?.slice(0, 60)}`}
                              >
                                Case {r.index} {r.hidden && <Lock className="h-3 w-3" />} — {r.passed ? "Passed" : "Failed"}
                              </span>
                            ))}
                            {!st.results?.length && <span className="text-[var(--neo-text)]">No recorded run.</span>}
                          </div>
                        </div>
                        {st.compileError && (
                          <div>
                            <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#c62828]">Last compilation error</div>
                            <pre className="neo-mono overflow-auto whitespace-pre-wrap rounded border border-[#ff5e5b4d] bg-[#ff5e5b0d] p-2.5 text-[12px] text-[#c62828]">
                              {st.compileError}
                            </pre>
                          </div>
                        )}
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div>
                            <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">Your final code</div>
                            <pre className="neo-mono max-h-64 overflow-auto whitespace-pre rounded border border-[var(--neo-border)]/60 bg-[#1e2431] p-3 text-[11.5px] leading-relaxed text-[#e8ecf3]">
                              {st.code ?? "(no code)"}
                            </pre>
                          </div>
                          <div>
                            <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">
                              Verified reference solution (g++ C++17, all QB cases pass)
                            </div>
                            <pre className="neo-mono max-h-64 overflow-auto whitespace-pre rounded border border-[var(--neo-border)]/60 bg-[#1e2431] p-3 text-[11.5px] leading-relaxed text-[#e8ecf3]">
                              {q.referenceSolution}
                            </pre>
                          </div>
                        </div>
                        {q.bugLabel && (
                          <p className="text-[12.5px] leading-relaxed text-[var(--neo-text)]">
                            <span className="font-semibold text-[#c62828]">Planted bug in the starter code:</span> {q.bugLabel}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <p className="mt-6 pb-8 text-[11.5px] leading-relaxed text-[var(--neo-text)]">
              Scores: +{10} per coding/debugging question in proportion to test cases passed, +1 per MCQ. Every reference solution shown here was compiled with g++ C++17 and executed against all sample, hidden and answer-key cases of the original question banks.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--neo-border)]/50 bg-white px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11px] text-[var(--neo-text)]">
        {icon} {label}
      </div>
      <div className="mt-0.5 text-[15px] font-semibold text-[#121212]">{value}</div>
    </div>
  );
}
