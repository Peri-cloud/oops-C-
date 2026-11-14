"use client";

import { useState } from "react";
import { Lock, Lightbulb, CheckCircle2, XCircle, Info } from "lucide-react";
import type { TestItem, ItemState } from "@/lib/exam";

interface Props {
  item: TestItem;
  state: ItemState;
  onSelectChoice: (choice: number) => void;
  /** For MCQs: 'statement' shows only the question text (left column),
   *  'options' shows the option list + verdict (right column). */
  mcqVariant?: "statement" | "options";
}

const LETTERS = ["A", "B", "C", "D", "E"];

function IODocument({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      <div className="text-[13px] font-semibold text-[#121212]">{title}</div>
      <pre className="neo-mono mt-1 whitespace-pre-wrap rounded-md bg-[var(--neo-bg)] border border-[var(--neo-border)]/50 px-3 py-2 text-[12px] leading-relaxed text-[#121212]">
        {text}
      </pre>
    </div>
  );
}

export function ProblemPanel({ item, state, onSelectChoice, mcqVariant }: Props) {
  const [showHint, setShowHint] = useState(false);
  const q = item.question;
  const m = item.mcq;

  const kindBadge = (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        item.kind === "Coding"
          ? "bg-[rgba(52,86,255,0.1)] text-[var(--neo-primary)]"
          : item.kind === "Debugging"
            ? "bg-[#ffbd2533] text-[#a06a00]"
            : "bg-[#55ba4526] text-[#2e7d32]"
      }`}
    >
      {item.kind}
    </span>
  );

  if (item.type === "mcq" && m) {
    const submitted = state.submitted;
    const statementOnly = mcqVariant === "statement";
    const optionsOnly = mcqVariant === "options";
    return (
      <div className="neo-scroll h-full overflow-y-auto bg-white p-5 lg:p-6">
        {!optionsOnly && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#121212]">Question</span>
              <span className="text-[13px] text-[var(--neo-text)]">• Unit {item.unit}</span>
              {kindBadge}
            </div>
            <h2 className="text-[15px] font-medium leading-relaxed text-[#121212]">{m.q}</h2>

            {m.code && (
              <pre className="neo-mono mt-4 overflow-x-auto rounded-md border border-[var(--neo-border)]/50 bg-[#1e2431] p-4 text-[12.5px] leading-relaxed text-[#e8ecf3]">
                {m.code}
              </pre>
            )}
            {m.verifiedOutput && !m.code && (
              <p className="mt-2 text-[12px] text-[var(--neo-text)]">
                (Verified: this code prints <span className="neo-mono font-semibold">{m.verifiedOutput}</span>)
              </p>
            )}
          </>
        )}

        {!statementOnly && (
          <>
            <div className={optionsOnly ? "" : "mt-4 space-y-2"}>
              <div className={optionsOnly ? "mb-3" : "space-y-2"}>
                {m.opts.map((opt, i) => {
                  const selected = state.choice === i;
                  const isCorrect = LETTERS[i] === m.ans;
                  return (
                    <button
                      key={i}
                      disabled={submitted}
                      onClick={() => onSelectChoice(i)}
                      className={`flex w-full items-start gap-3 rounded-md border px-3.5 py-3 text-left transition-colors ${
                        submitted
                          ? isCorrect
                            ? "border-[var(--neo-success)] bg-[#55ba4514]"
                            : selected
                              ? "border-[var(--neo-error)] bg-[#ff5e5b14]"
                              : "border-[var(--neo-border)]/60 opacity-70"
                          : selected
                            ? "border-[var(--neo-primary)] bg-[rgba(52,86,255,0.1)]"
                            : "border-[var(--neo-border)]/60 hover:border-[var(--neo-primary)]/50 hover:bg-[var(--neo-bg)]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                          selected && !submitted
                            ? "border-[var(--neo-primary)] bg-[var(--neo-primary)] text-white"
                            : submitted && isCorrect
                              ? "border-[var(--neo-success)] bg-[var(--neo-success)] text-white"
                              : submitted && selected
                                ? "border-[var(--neo-error)] bg-[var(--neo-error)] text-white"
                                : "border-[var(--neo-border)] text-[var(--neo-text)]"
                        }`}
                      >
                        {submitted && isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : LETTERS[i]}
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-[#121212]">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {submitted && (
              <div
                className={`neo-fade-in mt-4 rounded-md border p-4 ${
                  state.correct ? "border-[var(--neo-success)] bg-[#55ba4510]" : "border-[var(--neo-error)] bg-[#ff5e5b0d]"
                }`}
              >
                <div className={`flex items-center gap-2 text-[14px] font-semibold ${state.correct ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
                  {state.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  {state.correct ? "Correct Answer (+1 mark)" : `Wrong Answer — correct option is ${m.ans}: ${m.ansText}`}
                </div>
                {m.expl && <p className="mt-2 text-[13px] leading-relaxed text-[#121212]">{m.expl}</p>}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (!q) return null;
  const samples = q.tests.filter((t) => t.tag === "sample");

  return (
    <div className="neo-scroll h-full overflow-y-auto bg-white p-5 lg:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-semibold text-[#121212]">Problem</span>
        <span className="text-[13px] text-[var(--neo-text)]">• Unit {item.unit}</span>
        {kindBadge}
        {q.bugLabel && (
          <span className="rounded-full bg-[#ff5e5b1a] px-2.5 py-0.5 text-[11px] font-semibold text-[#c62828]">
            contains planted errors
          </span>
        )}
      </div>

      <h2 className="text-[16px] font-semibold leading-snug text-[#121212]">{q.title}</h2>

      <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-[#121212]">{q.statement}</p>

      <div className="mt-4 space-y-3">
        <IODocument title="Input Format" text={q.inputFormat} />
        <IODocument title="Output Format" text={q.outputFormat} />
        {q.constraints && <IODocument title="Constraints" text={q.constraints} />}
      </div>

      {samples.length > 0 && (
        <div className="mt-5">
          <div className="text-[13px] font-semibold text-[#121212]">Sample Test Cases</div>
          <div className="mt-2 space-y-3">
            {samples.map((t, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">Sample Input {i + 1}</div>
                  <pre className="neo-mono whitespace-pre-wrap rounded-md border border-[var(--neo-border)]/50 bg-[var(--neo-bg)] px-3 py-2 text-[12.5px] text-[#121212]">
                    {t.input}
                  </pre>
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--neo-text)]">Sample Output {i + 1}</div>
                  <pre className="neo-mono whitespace-pre-wrap rounded-md border border-[var(--neo-border)]/50 bg-[var(--neo-bg)] px-3 py-2 text-[12.5px] text-[#121212]">
                    {t.expected}
                  </pre>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[var(--neo-text)]">
            <Lock className="h-3.5 w-3.5" />
            {q.tests.length - samples.length} more hidden test case{q.tests.length - samples.length === 1 ? "" : "s"} run on Submit — details stay hidden, like the real exam
          </div>
        </div>
      )}

      {/* hints (from the QB's official "common mistakes to avoid") */}
      <div className="mt-5 rounded-md border border-[var(--neo-border)]/50 bg-[var(--neo-bg)]">
        <button
          onClick={() => setShowHint((s) => !s)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-[#121212]"
        >
          <Lightbulb className="h-4 w-4 text-[#ffbd25]" />
          {item.kind === "Debugging" ? "Common mistakes to avoid (QB)" : "Approach hints"}
          <span className="ml-auto text-[11px] text-[var(--neo-text)]">{showHint ? "Hide" : "Show"}</span>
        </button>
        {showHint && (
          <ul className="space-y-1.5 border-t border-[var(--neo-border)]/50 px-5 py-3 text-[12.5px] leading-relaxed text-[#121212]">
            <li className="text-[var(--neo-text)]">{q.easy}</li>
            {q.logic.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--neo-primary)]">•</span> {l}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-md bg-[rgba(52,86,255,0.1)] px-4 py-3 text-[12px] leading-relaxed text-[#121212]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neo-primary)]" />
        <span>
          {item.kind === "Debugging"
            ? "This starter code compiles but produces WRONG output. Find and fix the errors, then Submit — do not rewrite from scratch; practise reading code."
            : "Write a complete C++17 program. Read input exactly as specified and print the output character-exact, then Run first and Submit when samples pass."}
        </span>
      </div>
    </div>
  );
}
