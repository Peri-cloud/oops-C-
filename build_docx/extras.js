// Static authored content for Sections 1, 8, 9, 10, 11, 12 of the merged QB document.
module.exports = {

section1: {
  intro: [
    `This document merges, solves and verifies the complete Question Banks for Units 1 to 5 of the C++ programming course, and prepares you for the computer-based ONLINE CODING EXAMINATION on 19 November 2026. Every answer in this document was produced directly from your five original QB files and independently re-verified: every code-based multiple-choice question was compiled and executed, and every programming solution was compiled with g++ (C++17) and run against every sample case, every hidden-case listing and every answer-key case printed in the question banks - 198 test executions in total, all matching exactly.`,
    `This is NOT a pen-and-paper exam. The exam runs in a browser-based coding platform (Examly / IAMNEO). Questions are marked by an automatic judge: your program must compile, read the input exactly as specified, and print the output in exactly the expected format. Extra spaces, missing line breaks or wrong decimal places fail a test case even when the logic is correct. Section 9 gives the full step-by-step browser guide; Section 11 gives the five-day study plan for 14-18 November.`,
  ],
  snapshotTitle: `Examination snapshot`,
  snapshot: [
    ["Item", "Detail", "Source / status"],
    ["Examination date", "19 November 2026 (Thursday), Asia/Kolkata timezone", "Provided by you"],
    ["Format", "Online, browser-based coding examination with automatic evaluation", "Provided by you; consistent with platform pages"],
    ["Platforms", "Examly: msec563.examly.io  |  IAMNEO: app.iamneo.ai (learner/test)", "Provided by you"],
    ["Language options seen in the practice test", "C (17), C++ (17), Python (3.8), Java (11) - C++ (17) is available; select it for the solutions in this document", "OBSERVED IN PRACTICE SCREENSHOT"],
    ["Mock test configuration seen", "PAT_Iamneo_Mock Test 2: 2 questions, 40 minutes, 20 marks (+10 / -0 per question); another mock: 1 question, 60 minutes, 20 marks", "OBSERVED IN PRACTICE SCREENSHOT + VERIFIED FROM SAVED EXAMLY PAGE"],
    ["Attempts", "Attempts: 00 / 01 shown for the mock - assume ONE attempt; read instructions before starting", "VERIFIED FROM SAVED EXAMLY PAGE"],
    ["Evaluation note shown in the test", "Programs are evaluated only after clicking Submit; extra spaces or newlines in the output cause test-case failures", "OBSERVED IN PRACTICE SCREENSHOT"],
    ["Known past mistake", "#include <studio.h> (typo) caused fatal error: studio.h: No such file or directory and all test cases failed at 0 ms - the correct headers are <iostream> / <cstdio>", "OBSERVED IN PRACTICE SCREENSHOT"],
  ],
  legendTitle: `How to read the status labels in this document`,
  legend: [
    ["Label", "Meaning"],
    ["VERIFIED", "Independently solved here and confirmed by compiling and running the exact code against the listed cases."],
    ["OBSERVED", "Seen directly in your practice-test screenshots or the saved Examly pages you uploaded."],
    ["INFERRED", "Reconstructed with high confidence from the problem statement and the verified program (the source itself was blank/cut off). Clearly marked - never presented as platform-verified."],
    ["UNVERIFIABLE", "The source document is missing the required information (e.g., the code snippet of an output question). No answer is claimed."],
    ["UNRESOLVED", "The question could not be found in any accessible source; documented with the evidence that exists."],
  ],
  goldenRules: [
    `Always select the language C++ (17) in the editor dropdown before typing code.`,
    `Never type studio.h - the C++ header is #include <iostream> (and <iomanip> for setprecision).`,
    `Copy the output labels EXACTLY, including the colon and the single space (e.g., \"Prime Count: 6\").`,
    `Use cout << fixed << setprecision(2) whenever the expected output shows two decimal places.`,
    `Print endl (or \"\\n\") exactly where the sample output changes line - no extra blank lines at the end.`,
    `Click Run / Compile first, check the Sample Tests tab, and only then click Submit Test.`,
    `Submitting early is safer than running out of time - you can usually move to the next question and come back (use Bookmark / Next).`,
    `Do not open other tabs or applications during the test - proctoring features exist on the platform.`,
    `Keep a backup plan for internet failure: do not panic, rejoin the same test from the same browser; your saved code remains (reconnection behaviour is NOT VERIFIED - ask the invigilator).`,
    `The night before the exam, re-read Section 8 (C++17 quick revision) and Section 9 (browser guide) only.`,
  ],
},

revision: [
  {title: `8.1 Program skeleton (memorise this)`, paras: [
    `Every program in this QB follows the same skeleton. Type it without thinking; it prevents 90% of compile errors.`,
  ], code: `#include <iostream>
#include <iomanip>   // only when setprecision is needed
#include <string>    // only when std::string is used
using namespace std;

int main() {
    // read input, compute, print
    return 0;
}`, trap: `Semicolon after class definition: class Box { ... };  - forgetting it is the most common compile error.`},
  {title: `8.2 Input and output`, paras: [
    `cin >> reads space-separated values (numbers, single words). cout << prints. endl prints a newline. For a whole line containing spaces use getline(cin, s).`,
  ], code: `int n; double x; string name;
cin >> n >> x >> name;
cout << "Value: " << n << " " << x << " " << name << endl;`, trap: `cin >> skips spaces and newlines automatically; never add prompts like \"Enter n:\" - the judge compares output exactly.`},
  {title: `8.3 Variables and data types`, paras: [
    `int (whole numbers), double (decimals), char (one character), bool (true/false), string (text). Choose double whenever the input may contain decimals (volumes, temperatures, salaries).`,
  ], code: `int count = 0;        // whole numbers
double volume = 1.728; // decimals
char grade = 'A';      // single quotes
bool ok = true;
string title = "Report"; // double quotes`, trap: `'A' is a char, "A" is a string. Dividing two ints (10 / 3) gives 3, not 3.33 - cast one side to double first.`},
  {title: `8.4 Operators and precedence`, paras: [
    `Arithmetic: + - * / % (modulo = remainder). Comparison: < <= > >= == !=. Logical: && (and) || (or) ! (not). Increment: ++i (prefix, used in this QB).`,
  ], code: `int r = 17 % 5;          // 2
bool inRange = (x >= 1 && x <= 100);
if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) { /* leap */ }`, trap: `== compares, = assigns. Writing if (a = b) is a bug that still compiles.`},
  {title: `8.5 Conditions`, paras: [
    `if / else if / else cover every branch. The leap-year decision and the month-day decision in Unit 1 are pure if-else chains.`,
  ], code: `if (month == 2)      { days = leap ? 29 : 28; }
else if (month == 4 || month == 6 || month == 9 || month == 11) { days = 30; }
else                 { days = 31; }`, trap: `The ternary a ? b : c is a compact if-else: days = leap ? 29 : 28;`},
  {title: `8.6 Loops`, paras: [
    `for repeats a known number of times; while repeats until a condition fails; do-while runs at least once (used in the circular list MCQ).`,
  ], code: `for (int i = 1; i <= n; i++) { cout << i << endl; }
for (int i = seconds; i >= 1; i--) { cout << i << endl; }  // countdown
while (temp != NULL) { temp = temp->next; }`, trap: `Off-by-one: including both range ends (a to b) needs i <= b. Countdown starts at seconds and must reach 1.`},
  {title: `8.7 Arrays`, paras: [
    `Fixed-size arrays: int a[100]; indices run from 0 to size-1. The array-based trees in this QB use adj[20][20], child[50] etc.`,
  ], code: `int a[10] = {0};            // all zeros
for (int i = 0; i < n; i++) cin >> a[i];
int adj[20][20];             // adjacency matrix
adj[u][v] = 1; adj[v][u] = 1; // undirected edge`, trap: `Index i means children at 2*i+1 and 2*i+2 for the array binary tree; always bounds-check (i >= n -> return).`},
  {title: `8.8 Strings`, paras: [
    `std::string supports + (join), .length(), s[i] (one char), and comparison with ==. Characters are converted with c - '0' (char to digit).`,
  ], code: `string cmd; cin >> cmd;
for (int i = 0; i < cmd.length(); i++) {
    if (cmd[i] == '+') { /* ... */ }
}
int digit = cmd[i] - '0';   // '7' -> 7`, trap: `cin >> stops at the first space; only use it when the problem guarantees no spaces in the word.`},
  {title: `8.9 Functions`, paras: [
    `Functions take parameters and return one value. Overloading = same name, different parameter lists (Unit 2's larger function).`,
  ], code: `bool isPrime(int x) {
    if (x < 2) return false;
    for (int i = 2; i * i <= x; i++)
        if (x % i == 0) return false;
    return true;
}`, trap: `The return type must match what you return; a function that must return a value needs a return on EVERY path.`},
  {title: `8.10 Pointers and references`, paras: [
    `A pointer stores an address (Node* p; p->next; p->data). A reference is an alias (Node*& head lets the function change the caller's pointer). The this pointer inside a member function points to the calling object; return *this to chain calls.`,
  ], code: `Node* p = head;
while (p != NULL) { cout << p->data; p = p->next; }

Student& addBonus(int b) { marks += b; return *this; }
s.addBonus(5).addBonus(3);   // chaining works because *this is returned`, trap: `Use . for objects, -> for pointers. Passing head by value means the caller never sees the change.`},
  {title: `8.11 Classes and objects`, paras: [
    `A class bundles private data and public functions. Constructors initialise (may be overloaded); the destructor ~Class() runs automatically at object destruction. static members are shared by ALL objects and must be defined outside the class. Inheritance: class Derived : public Base - constructors run base-first, destructors derived-first. virtual enables run-time polymorphism through base pointers; a pure virtual function (= 0) makes the class abstract. Operator overloading: Complex operator+(Complex other).`,
  ], code: `class Player {
    string name; int score;
    static int highest;            // shared by all objects
public:
    Player(string n, int s) { name = n; score = s; }
    static int getHighest() { return highest; }
};
int Player::highest = 0;           // required definition`, trap: `Forgetting int Player::highest = 0; causes an \"undefined reference\" LINKER error - the code compiles but never runs.`},
  {title: `8.12 Common compilation errors (and the fix)`, paras: [
    `Read the Compiler Message panel from the FIRST error downwards; fix one error and recompile. The screenshots from your mock show how a single typo kills every test case at 0 ms.`,
  ], code: `fatal error: studio.h: No such file or directory
  -> typo. Correct: #include <iostream>   (C++)   or  #include <cstdio> (C)

'cout' was not declared in this scope
  -> missing  using namespace std;  or forgot #include <iostream>

undefined reference to Player::highest
  -> define the static member outside the class

expected ';' before '}' 
  -> missing semicolon, usually after a class definition`, trap: `All test cases showing FAIL with 0 ms runtime means compilation failed - read the message instead of hunting for a logic bug.`},
  {title: `8.13 Exact output formatting`, paras: [
    `The judge compares your output character by character. Two tools cover every QB problem: fixed << setprecision(2) for two decimals, and printing endl exactly where the sample output changes line.`,
  ], code: `cout << fixed << setprecision(2);
cout << "Balance: " << acc.getBalance() << endl;
// prints: Balance: 4000.00

cout << "Value After Steps: " << valueAfterSteps(head, steps) << endl;`, trap: `setprecision alone rounds the TOTAL digits; fixed << setprecision(2) means two digits AFTER the point. Integers are unaffected by setprecision - 35 prints as 35, not 35.00.`},
],

guide: {
  intro: [
    `This guide explains, step by step, how to take the online coding examination. Every item carries a status label so you know exactly how much to trust it. VERIFIED items were confirmed on the saved Examly pages you uploaded; OBSERVED items were seen in your practice-test screenshots; RECOMMENDATION items are safe standard practice; NOT VERIFIED items could not be confirmed from any accessible material.`,
    `Note: the Examly site (msec563.examly.io) hosts the course pages (Dashboard, Courses, Labs, Assessments, Practices, Open IDE), and the test itself opens in the IAMNEO test-taking interface (the two platforms are related - the saved Examly page shows the PAT_Iamneo_Mock Test 2 entry with its View Instructions and Take Test buttons). Treat Examly and IAMNEO screens as related but NOT identical, and always follow the instructions page of the actual test.`,
  ],
  steps: [
    [`A. Login and entry`, `Open msec563.examly.io, sign in with your college account, open the course/test link, and click Take Test only after reading View Instructions. The saved page shows both buttons next to the assessment.`],
    [`B. Read the instructions page`, `Click View Instructions before starting. It shows duration, number of questions, and platform rules. VERIFIED that this button exists; the instruction CONTENT of your real exam is NOT VERIFIED - read it live.`],
    [`C. One attempt`, `The assessment shows Attempts: 00 / 01 - a single attempt. Do not close the browser mid-test casually.`],
    [`D. Browser`, `Use an updated Google Chrome, allow cookies, and close other applications. OBSERVED: your mock ran in a Chrome-like desktop browser. A proctoring UI exists on the platform (proctor icons in the saved pages); for a college PAT, follow whatever the instructions say.`],
    [`E. Interface layout`, `OBSERVED: top bar with your name, roll number, test name, remaining time (countdown), and a Submit Test button on the right. Question panel on the left (QUESTION 1/2 CODE, +10 / -0 marks, sample cases). Editor on the right with a language dropdown, Clear and Run buttons. Bottom tabs: Sample Tests, Submissions, Custom Inputs. Buttons: Summary x/y, Previous, Bookmark, Next.`],
    [`F. Language selection`, `OBSERVED: the dropdown offers C (17), C++ (17), Python (3.8), Java (11). Select C++ (17) for every question of this QB. Changing language later may reset the template - choose it first.`],
    [`G. Entering code`, `Type or paste into the editor. The editor provides C++ syntax highlighting and auto-indent. Keep the template's main() and add your logic.`],
    [`H. Custom input`, `The Custom Inputs tab lets you type your own input and run it. Use it for tricky cases (negative numbers, exact boundary values like 1900 / 2000).`],
    [`I. Run vs Submit`, `OBSERVED: Run compiles and runs the SAMPLE test cases only and shows results in the Sample Tests tab - it does NOT record a submission. Submit Test records your answer for evaluation, including the hidden test cases. Run often; Submit when the samples pass.`],
    [`J. Reading results`, `OBSERVED: the Sample Tests tab lists Testcase 1..n with PASS/FAIL badges and runtime. The Submissions tab stores every submission and its Compiler Message (compile errors appear there, e.g. fatal error: studio.h: No such file or directory followed by compilation terminated).`],
    [`K. Hidden test cases`, `Hidden cases run only on Submit and are not shown. Passing the samples does NOT guarantee passing hidden cases - verify boundary conditions (0, 1, negatives, century years) before submitting. GENERAL platform behaviour, not a documented rule.`],
    [`L. Full screen`, `OBSERVED in your earlier attempt: a full-screen warning appears in the practice environment. If the platform asks for full screen, accept it and stay in it; leaving full screen may raise a proctoring warning. The exact enforcement for the real exam is NOT VERIFIED.`],
    [`M. Finishing the test`, `OBSERVED: the Submit Test button at the top-right submits the whole test. A finish keyword such as typing END is NOT required by any accessible material - do not type END unless the live instructions say so. After the final submit, wait for the confirmation screen and do not refresh.`],
    [`N. Navigation`, `OBSERVED: Previous / Next buttons move between questions; Bookmark marks a question; Summary shows how many questions are answered (Summary 0/2 style). Use Bookmark for questions you want to revisit.`],
    [`O. Timer`, `OBSERVED: a countdown timer is shown at the top. The mock config seen was 40 minutes for 2 questions. Watch the timer; submit before it reaches zero - an auto-submit at zero is NOT VERIFIED.`],
    [`P. If something breaks`, `RECOMMENDATION: do not refresh repeatedly; wait a few seconds, then rejoin the test from the same browser tab; if the editor lost code, check the Submissions tab - a previous submission may hold your code. Inform the invigilator immediately. Reconnection behaviour is NOT VERIFIED from platform documents.`],
    [`Q. Internet loss`, `RECOMMENDATION: keep a mobile-hotspot fallback ready before the exam starts. Rejoin from the same browser; answers already submitted stay recorded (standard platform behaviour, NOT VERIFIED for your instance).`],
  ],
  errorTable: [
    ["Symptom", "Meaning", "Fix"],
    ["All test cases FAIL at 0 ms", "Compilation failed", "Read the Compiler Message; fix the first error (usually a typo like studio.h)"],
    ["fatal error: studio.h: No such file or directory", "Wrong header name", "Use #include <iostream> for C++ (or <cstdio> for C)"],
    ["Wrong Answer on some cases only", "Logic or formatting issue", "Check two-decimal formatting, exact labels, trailing spaces, boundary cases"],
    ["Time limit exceeded", "Program too slow", "Check for an infinite loop (circular lists: temp->next != head, not != NULL)"],
    ["Runtime error / segmentation fault", "Bad pointer or index", "Check NULL checks, array bounds, and empty-list handling"],
  ],
  notVerified: [
    `The exact question count, duration and marking of the real 19 November exam.`,
    `Whether full-screen enforcement or camera proctoring is active during your exam.`,
    `Whether any END-style keyword is required to finish (none found in any accessible material).`,
    `Auto-submit behaviour when the timer reaches zero.`,
    `Exact reconnection handling after an internet drop.`,
    `The actual instruction text shown by View Instructions on the exam day.`,
  ],
},

practice: {
  intro: [
    `This mini practice exam uses only questions taken from your own question banks. Sit down with a 40-minute timer (the same length as the PAT mock) and answer Part A and Part B without looking at the earlier sections. Part A: 12 multiple-choice questions (2 minutes each). Part B: 3 coding questions (roughly 10 minutes each). The answer key and the working follow immediately after - check honestly.`,
  ],
  mcqIntro: `Part A - Multiple choice (24 minutes). Circle your choice before checking the key.`,
  mcqs: [
    ["Unit 1 Q6", "What is the default access specifier for members of a class in C++?"],
    ["Unit 1 Q14", "Which is the correct declaration of a copy constructor for a class Box?"],
    ["Unit 1 Q20", "What is the return type of a constructor?"],
    ["Unit 2 Q3", "Which type of inheritance has a class derived from two or more base classes?"],
    ["Unit 2 Q10", "A class becomes abstract in C++ when it contains at least one:"],
    ["Unit 2 Q14", "Why should the destructor of a base class be declared virtual?"],
    ["Unit 3 Q11", "What is the postfix form of the infix expression A * B + C?"],
    ["Unit 3 Q13", "In infix to postfix conversion, what is done when a closing parenthesis is encountered?"],
    ["Unit 4 Q4", "If the root is at height 0, what is the maximum number of nodes in a binary tree of height h?"],
    ["Unit 4 Q11", "Which rotation corrects the Left-Right (LR) imbalance in an AVL tree?"],
    ["Unit 5 Q9", "Dijkstra's algorithm does not give correct results for graphs containing which kind of edges?"],
    ["Unit 5 Q12", "How many edges does a minimum spanning tree of a connected graph with V vertices have?"],
  ],
  codingIntro: `Part B - Coding (about 36 minutes total). Recreate the exact output of the sample cases, then extend with the hidden-style cases listed.`,
  coding: [
    {ref: `Unit 1 Coding Q4 (leap year and days in a month)`, task: `Read year and month; print "Leap Year: Yes/No" and "Days: <d>". Apply the full century rule.`,
     samples: [["2024 2", "Leap Year: Yes\\nDays: 29"], ["2023 2", "Leap Year: No\\nDays: 28"], ["1900 2", "Leap Year: No\\nDays: 28"], ["2000 2", "Leap Year: Yes\\nDays: 29"], ["2022 11", "Leap Year: No\\nDays: 30"]]},
    {ref: `Unit 3 Debugging Q4 (postfix evaluation)`, task: `Read a postfix string of single digits and + - * /; print "Result: <value>" using a stack and integer division.`,
     samples: [["234*+", "Result: 14"], ["92-3*", "Result: 21"], ["531*+9-", "Result: -1"], ["82/34-*", "Result: -4"]]},
    {ref: `Unit 3 Coding Q4 (BST search with depth)`, task: `Build a BST from the insertion order, then search a key and print "Found at depth <d>" (root = depth 0) or "Not Found".`,
     samples: [["5\\n30 20 40 10 25\\n25", "Found at depth 2"], ["3\\n5 2 8\\n9", "Not Found"], ["6\\n10 20 30 40 50 60\\n60", "Found at depth 5"]]},
  ],
  answersIntro: `Part A answer key (verified - see the unit sections for full explanations).`,
},

plan: {
  intro: [
    `Five days remain before the examination on 19 November 2026. The plan below is realistic for a beginner: it front-loads understanding (14-16 November), adds a timed mock (17 November), and reserves the last day for light revision only. Total study time is about 4 to 5 hours per day, split into two sessions with a break. Everything you need is inside this document - you do not need to reopen the original five QB files.`,
  ],
  days: [
    ["Day", "Session plan (about 4-5 h)", "Expected outcome"],
    ["Fri 14 Nov - Unit 1 + setup", "1) Read Section 1 and Section 9 (browser guide) once, slowly. 2) Study Section 2 (Unit 1): read every MCQ explanation, then hand-trace all 9 programs against their sample tables. 3) Open the IAMNEO practice/mock link and re-type the Unit 1 Timer program (U1_C3) in the browser editor, run and submit it. 4) Write the 8.1 skeleton from memory three times.", "You know the exam interface, have solved every Unit 1 problem once, and can type the C++ skeleton without thinking."],
    ["Sat 15 Nov - Units 2 and 3", "1) Morning: Section 3 (Unit 2) - focus on constructor/destructor order and virtual functions; hand-trace U2_D2 and U2_D5. 2) Afternoon: Section 4 (Unit 3) - build U3_D1 (linked list reverse) and U3_D2 (circular queue) on paper with boxes and arrows, then re-type both in the browser editor and run them. 3) Revise the Unit 2 + 3 answer-key rows of Section 7.", "Both units' patterns (inheritance order, list pointer surgery, circular queue with count) are clear and each program has been typed once by hand."],
    ["Sun 16 Nov - Units 4 and 5", "1) Morning: Section 5 (Unit 4) - BST insert/search/traversals; trace U4_D3 (single rotation) and U4_C2 (red-black check) carefully. 2) Afternoon: Section 6 (Unit 5) - BFS/DFS/MST/Dijkstra; trace U5_D4 and U5_D5 on the printed samples. 3) Re-type U3_C4 (BST depth) and U5_C1 (semesters) in the browser editor. 4) Read Section 8 (C++17 quick revision) fully.", "All five units have been worked through once; trees and graphs patterns are familiar; the revision sheet is read."],
    ["Mon 17 Nov - TIMED MOCK DAY", "1) Morning: take a full timed mock - set 40 minutes and solve the Section 10 practice exam (Part A + Part B) in the browser editor under exam conditions. 2) Mark yourself with the Section 10 key. 3) Afternoon: for every mistake, re-read the matching unit section and re-code that exact program from scratch. 4) Evening: skim Sections 7 (answer key) and 8 again.", "One realistic timed attempt completed; weak patterns identified and immediately patched."],
    ["Tue 18 Nov - Light revision", "1) Morning (max 3 h): final-day revision sheet below + Section 9 guide. 2) Re-type ONE easy program (U1_C4 leap year) and ONE stack program (U3_D4 postfix) to keep the fingers warm. 3) NO new topics, NO late-night study. 4) Prepare the exam-day kit: charged laptop, charger, browser updated, login tested, hotspot fallback ready.", "Calm, fast recall of all patterns; everything technical verified the day before."],
  ],
  finalDayTitle: `Final-day revision sheet (18 November evening)`,
  finalDay: [
    `Skeleton: #include <iostream>, #include <iomanip>, using namespace std;, int main(), return 0; - semicolon after every class.`,
    `Headers: iostream (cin/cout), iomanip (setprecision), string (std::string). NEVER studio.h / stdio.h in C++ mode.`,
    `Two decimals: cout << fixed << setprecision(2); set it ONCE before the prints; integers ignore it.`,
    `Constructor order with inheritance: base first; destructors: derived first; static members defined outside the class; this-> needed when parameter names shadow members; return *this for chaining.`,
    `virtual = run-time polymorphism through base pointers; pure virtual ( = 0 ) = abstract class; virtual destructor calls the derived destructor on delete.`,
    `throw string("Not enough seats") inside the class; try { } catch (string msg) { } around EACH request, so later requests still run.`,
    `Linked lists: insertEnd walks while (temp->next != NULL); circular: while (temp->next != head) and last node points to head; reverse with prev/curr/nextNode; doubly linked keeps prev AND tail.`,
    `Stacks/queues: push/pop at the head is O(1); queue = FIFO with front and rear; circular queue full/empty decided by count, indexes move with % capacity.`,
    `Postfix: digits pushed as c - '0'; operator pops b THEN a; result = a op b pushed back; integer division for /.`,
    `BST: left smaller, right larger; inorder = sorted; search walks left/right counting edges (root depth 0); min = leftmost, max = rightmost; AVL: bf = h(l) - h(r), LL fix = right rotation, LR = left-then-right, RR = left rotation, RL = right-then-left.`,
    `Tries: children[26], index = c - 'a', end flag distinguishes word from prefix; prefix counting adds +1 down each inserted word.`,
    `Graphs: adjacency matrix symmetric for undirected (set both cells); BFS with queue = shortest hops, dist -1 = unreachable; DFS with recursion; Prim grows the cheapest tree edge; Dijkstra needs positive weights; Bellman-Ford handles negatives and detects negative cycles; topological sort removes in-degree-zero vertices in layers (semesters problem).`,
    `Exam mechanics: choose C++ (17) FIRST; Run checks samples; Submit Test records marks; extra spaces/newlines fail cases; read the Compiler Message top-down; all-FAIL at 0 ms = compile error.`,
  ],
  checklistTitle: `Exam-day checklist (19 November)`,
  checklist: [
    [`Before leaving`, `Sleep 7+ hours; light breakfast; reach the exam centre / set up the room 30 minutes early; carry college ID, hall ticket and charger as required by your institution.`],
    [`Setup`, `Updated Chrome; login tested on msec563.examly.io; the exam link open; mobile hotspot paired and tested; close all other applications.`],
    [`First 5 minutes`, `Read View Instructions completely (duration, questions, rules, full-screen requirement). Confirm language list; note the Submit Test button location.`],
    [`Per question`, `Select C++ (17) FIRST; read input/output format twice; type the skeleton; code; Run; compare output EXACTLY (labels, spaces, decimals); only then Submit.`],
    [`Time management`, `Check the countdown after every question. Stuck > 12 minutes? Bookmark, move to the next question, come back later. Never leave a question unsubmitted if you have any working code.`],
    [`Last 10 minutes`, `Reopen Bookmarked questions; ensure every question has a submitted attempt; then final Submit Test and wait for confirmation.`],
  ],
},

audit: {
  method: [
    `Every one of the 43 programming problems was saved as an individual C++17 source file, compiled with g++ -std=c++17 -O2, and executed against EVERY test case printed in the question banks: public samples, hidden test cases listed with weightages, and answer-key rows. Inputs and expected outputs were transcribed exactly from the DOCX files (including content recovered from embedded images). Program output was captured and compared byte-for-byte (trailing-whitespace-tolerant comparison also recorded). The four Unit 3 COD reference solutions, printed in C in the QB, were additionally verified in their original C form with gcc -std=c17 before conversion to C++17.`,
    `All 16 code-based MCQs whose snippets exist in the sources (5 transcribed from embedded images in Unit 3, 11 printed as text in Units 4 and 5) were compiled and executed; each produced exactly one of the listed options. The 87 conceptual/verified answers were solved independently and cross-checked against standard C++ semantics; no existing answer key was trusted blindly (the QBs themselves print no MCQ key).`,
  ],
  discrepancies: [
    ["Location", "Issue found in the source", "How it was handled"],
    ["Unit 2 Coding Q4 (Payment), sample 2", "First display block of the sample output stops after \"UPI Closed\"; the repeated block and hidden test 2 800.0 show \"UPI Closed\" + \"Payment Closed\"", "Full output used; noted in the problem's answer; verified by execution"],
    ["Unit 4 Debugging Q2, sample 1", "Input shows \"50 30 70 20 40 / 40\" without the leading count line required by the stated input format", "n = 5 reconstructed; tagged RECONSTRUCTED in the test table"],
    ["Unit 4 Debugging Q4, sample 2", "Input shows only \"+\" but the expected output is (9+(5-1)) / 13 - impossible for that input", "Input reconstructed as 951-+ (the only postfix string producing that exact output); tagged RECONSTRUCTED"],
    ["Unit 4 Debugging Q5, sample 2", "Input shows \"sky skyline / 3 / ...\" without the leading count line", "n = 2 reconstructed; tagged RECONSTRUCTED"],
    ["Unit 5 Debugging Q1 samples; Coding Q3 and Q4 samples", "Sample tables exist only as images embedded in the DOCX (not as text)", "Images extracted and transcribed; tests tagged SAMPLE (from image)"],
    ["Unit 5 Debugging Q3; Coding Q2", "Sample input column present, sample output column blank in the QB", "Outputs computed by the verified programs and tagged INFERRED (not platform-verified)"],
    ["Units 1-3 output-type MCQs (13 questions)", "Code snippets missing: no text, no image, no embedded object exists in those DOCX areas (verified at XML level)", "Marked UNVERIFIABLE; concept guidance given; no answer claimed"],
    ["Unit 3 MCQ Q20", "Snippet image absent for this one question (the other five Unit 3 snippets are embedded images)", "Marked UNVERIFIABLE"],
    ["Unit 3 COD solutions", "QB prints them in C (stdio.h, malloc)", "Original C verified with gcc; C++17 conversions verified with g++; both pass all 6 cases each"],
  ],
  unresolved: [
    `Special mock-test mappings (Input gives Output: 3 1 gives 3, 10 2 gives 12, 2 1 gives 2): the question statement could NOT be found in the five QB files, the two saved Examly pages (they are application shells without question data - verified by searching the raw HTML), or the practice screenshots. The best-fitting hypothesis is: the number of ways to express n as an unordered sum of parts each at least m (equivalently, integer partitions of n with minimum part m): f(3,1)=3, f(2,1)=2, f(10,2)=12 - all three match. However, three input-output pairs cannot distinguish this from other counting functions, so the intended algorithm remains UNRESOLVED. If a similar question appears, look for the statement text above the samples and solve from the statement, not from the samples.`,
    `PAT_Iamneo_Mock Test 2 Question 1 (screenshot): input n followed by n numbers; sample 1: n = 7 with 4 5 8 11 12 17 18 gives 11 5 4 8 17 12 18 (exactly the preorder of the balanced BST built from the sorted array); sample 2: n = 11 with 10 12 20 22 25 15 30 36 26 40 49 gives 20 12 10 15 30 25 22 26 40 36 49 (a valid BST preorder, but NOT the output of the standard sorted-array-to-balanced-BST rule, which would start with 25). The two samples are mutually inconsistent with a single known standard algorithm, so the intended question is UNRESOLVED - its statement is not visible in the screenshot. Treat 'BST construction + preorder printing' as a revision theme, not as the confirmed answer.`,
  ],
  limitations: [
    `Hidden test cases: only the hidden/answer-key cases PRINTED in the QB files were executed. The real platform's hidden tests are inaccessible; passing all 198 listed executions does not prove a program passes the platform's full hidden set.`,
    `The live Examly/IAMNEO sites require your login; the saved pages are course/assessment listing screens without question content, so in-exam details (instruction text, exact enforcement rules) remain NOT VERIFIED.`,
    `The 13 UNVERIFIABLE output MCQs need their code snippets; if you can obtain them (class notes or the original platform question view), trace them with the Section 8 method.`,
  ],
},

};
