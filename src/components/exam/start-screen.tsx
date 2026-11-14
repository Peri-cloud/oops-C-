"use client";

import { useState } from "react";
import { NeoSidebar, IamneoLogo, CollegeLogo } from "./shell";
import {
  Search,
  Bell,
  ShoppingCart,
  ChevronDown,
  Clock,
  HelpCircle,
  FileText,
  MonitorPlay,
  ShieldAlert,
  CircleAlert,
} from "lucide-react";
import {
  MODE_INFO,
  UNIT_NAMES,
  type TestConfig,
  type TestMode,
  buildItems,
  totalMarks,
  MARKS_PER_CODE_Q,
  MARKS_PER_MCQ,
} from "@/lib/exam";

interface Props {
  onStart: (config: TestConfig) => void;
}

const LANGUAGES = ["C (17)", "C++ (17)", "Python (3.8)", "Java (11)"];

export function StartScreen({ onStart }: Props) {
  const [mode, setMode] = useState<TestMode>("mock");
  const [unit, setUnit] = useState<number>(1);
  const info = MODE_INFO[mode];
  const config: TestConfig = { mode, unit: mode === "unit" || mode === "mcq" ? unit : null, durationMin: info.durationMin };
  const items = buildItems(config);
  const marks = totalMarks(items);
  const sections = Array.from(new Set(items.map((i) => i.kind)));
  const countBy = (kind: string) => items.filter((i) => i.kind === kind).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <NeoSidebar active="Tests" />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* header — mirrors the real iamneo white header with search + user */}
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[var(--neo-border)]/50 bg-white px-4 shadow-[0_8px_24px_0_#0000000A] lg:px-6">
          <div className="flex items-center gap-3">
            <CollegeLogo size={38} />
            <IamneoLogo />
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex h-10 w-full max-w-[420px] items-center overflow-hidden rounded-md border border-[var(--neo-border)]/50">
              <div className="flex h-full items-center bg-[var(--neo-bg)] px-4">
                <Search className="h-4 w-4 text-[var(--neo-text)]" />
              </div>
              <input
                className="h-full w-full bg-[var(--neo-bg)] px-2 text-[14px] outline-none placeholder:text-[#9aa2b1]"
                placeholder="Search"
                disabled
                aria-label="Search (disabled in practice replica)"
              />
            </div>
            <Bell className="h-5 w-5 text-[var(--neo-text)]" />
            <ShoppingCart className="h-5 w-5 text-[var(--neo-text)]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--neo-bg)]">
              <span className="text-[13px] font-semibold text-[#022277]">VP</span>
            </div>
            <span className="hidden text-[14px] font-medium text-[#121212] sm:block">VISHNU PRIYA S</span>
            <ChevronDown className="h-4 w-4 text-[var(--neo-text)]" />
          </div>
        </header>

        {/* scrollable body */}
        <main className="neo-scroll flex-1 overflow-y-auto bg-white px-4 py-6 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[24px] font-semibold leading-snug text-[#121212]">
              MSEC • C++ Programming — Units 1–5 Practice Test
            </h1>
            <p className="mt-1 text-[13px] text-[var(--neo-text)]">
              Real examination: <span className="font-medium text-[#121212]">19 November 2026</span> • online on Examly / IAMNEO • this environment replays the official iamneo test-taking interface with your own QB questions
            </p>

            <div className="mt-4 flex items-center gap-3 text-[13px] text-[rgb(233,15,15)]">
              <span className="hidden h-px w-10 bg-[var(--neo-border)] sm:block" />
              <span className="whitespace-nowrap font-medium">
                Exam in 5 days • practise today with unlimited attempts
              </span>
              <span className="hidden h-px w-10 bg-[var(--neo-border)] sm:block" />
            </div>

            {/* mode selection */}
            <h2 className="mt-8 text-[16px] font-semibold text-[#121212]">Choose a practice test</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(Object.keys(MODE_INFO) as TestMode[]).map((m) => {
                const mi = MODE_INFO[m];
                const selected = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      selected
                        ? "border-[var(--neo-primary)] bg-[rgba(52,86,255,0.1)] shadow-[0_0_0_1px_var(--neo-primary)]"
                        : "border-[var(--neo-border)] hover:border-[var(--neo-primary)]/50 hover:bg-[var(--neo-bg)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-[#121212]">{mi.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          selected ? "bg-[var(--neo-primary)] text-white" : "bg-[var(--neo-bg)] text-[var(--neo-text)]"
                        }`}
                      >
                        {mi.durationMin} min
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--neo-text)]">{mi.desc}</p>
                  </button>
                );
              })}
            </div>

            {(mode === "unit" || mode === "mcq") && (
              <div className="mt-4 rounded-lg border border-[var(--neo-border)] bg-[var(--neo-bg)] p-4">
                <div className="text-[13px] font-medium text-[#121212]">Select unit</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                        unit === u
                          ? "border-[var(--neo-primary)] bg-[var(--neo-primary)] text-white"
                          : "border-[var(--neo-border)] bg-white text-[#121212] hover:border-[var(--neo-primary)]/50"
                      }`}
                    >
                      Unit {u}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-[var(--neo-text)]">{UNIT_NAMES[unit]}</p>
              </div>
            )}

            {/* summary table — same structure as the real iamneo test summary */}
            <div className="mt-6 overflow-x-auto rounded-md border border-[var(--neo-border)]/50">
              <table className="w-full min-w-[420px] border-separate border-spacing-0 text-[13px]">
                <thead>
                  <tr className="h-10">
                    {["SNo", "Section", "Questions", "Duration (min)", "Marks"].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap border-b border-[var(--neo-border)]/50 bg-[rgba(52,86,255,0.1)] px-4 text-left font-medium capitalize text-[#121212]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map((kind, idx) => (
                    <tr key={kind} className="h-10">
                      <td className="border-b border-[var(--neo-border)]/50 px-4 text-[#121212]">{idx + 1}</td>
                      <td className="border-b border-[var(--neo-border)]/50 px-4 text-[#121212]">{kind}</td>
                      <td className="border-b border-[var(--neo-border)]/50 px-4 text-[#121212]">{countBy(kind)}</td>
                      <td className="border-b border-[var(--neo-border)]/50 px-4 text-[#121212]">{config.durationMin}</td>
                      <td className="border-b border-[var(--neo-border)]/50 px-4 text-[#121212]">
                        {countBy(kind) * (kind === "MCQ" ? MARKS_PER_MCQ : MARKS_PER_CODE_Q)}
                      </td>
                    </tr>
                  ))}
                  <tr className="h-10 bg-[var(--neo-bg)]">
                    <td className="px-4"></td>
                    <td className="px-4 font-semibold capitalize text-[var(--neo-primary)]">total</td>
                    <td className="px-4 font-semibold text-[#121212]">{String(items.length).padStart(2, "0")}</td>
                    <td className="px-4 font-semibold text-[#121212]">{config.durationMin}</td>
                    <td className="px-4 font-semibold text-[#121212]">{marks}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* instructions */}
            <div className="mt-6 rounded-md border border-[var(--neo-border)]/50">
              <div className="flex items-center gap-2 rounded-t-md bg-[rgba(52,86,255,0.1)] px-4 py-2.5 text-[14px] font-bold text-[#121212]">
                <HelpCircle className="h-4 w-4 text-[var(--neo-primary)]" /> Instructions read carefully before starting
              </div>
              <ul className="space-y-2.5 px-5 py-4 text-[13px] leading-relaxed text-[#121212]">
                <li className="flex gap-2">
                  <MonitorPlay className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neo-primary)]" />
                  <span>
                    Choose <span className="font-semibold">C++ (17)</span> in the language dropdown. The real exam offers C (17), C++ (17), Python (3.8) and Java (11); this practice environment compiles your code with real <span className="neo-mono">g++ -std=c++17</span>.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neo-primary)]" />
                  <span>
                    <span className="font-semibold">Run</span> executes only the sample test cases and shows input / expected / your output. <span className="font-semibold">Submit</span> runs all cases including the hidden ones — hidden case details stay hidden, exactly like the real platform.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neo-primary)]" />
                  <span>
                    Programs are evaluated only after you click <span className="font-semibold">Submit</span>. Extra spaces or missing line breaks fail a test case even when the logic is correct — match the output format character by character.
                  </span>
                </li>
                <li className="flex gap-2">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neo-primary)]" />
                  <span>
                    Known past mistake: <span className="neo-mono">#include &lt;studio.h&gt;</span> — wrong! Use <span className="neo-mono">#include &lt;iostream&gt;</span>. A typo in the header fails compilation and every test case scores 0.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neo-primary)]" />
                  <span>
                    The timer runs in the top-right corner. When it reaches 00:00 the test finishes automatically. Debugging questions open with <span className="font-semibold">buggy code</span> — fix it, do not rewrite from scratch.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 pb-8">
              <p className="max-w-[520px] text-[11px] leading-relaxed text-[var(--neo-text)]">
                Unofficial practice replica built from your Units 1–5 question bank for exam preparation. Not affiliated with iamneo / Examly. All {items.length} questions, reference solutions and test cases were compiled and executed with g++ C++17 before this session.
              </p>
              <button
                onClick={() => onStart(config)}
                className="h-11 shrink-0 rounded-md bg-[var(--neo-primary)] px-10 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#2a46d9]"
              >
                Start Test
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
