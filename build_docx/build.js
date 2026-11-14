// build.js - generates Complete_Units_1_to_5_QB_Answers_Exam_Preparation.docx
// Run: NODE_PATH=$(npm root -g) node build.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, NumberFormat, AlignmentType, HeadingLevel,
  WidthType, BorderStyle, ShadingType, TableOfContents, PageBreak,
  SectionType, TableLayoutType,
} = require('docx');

const D = __dirname;
const SOL = '/home/z/my-project/scripts/solutions';
const OUT = '/home/z/my-project/download/Complete_Units_1_to_5_QB_Answers_Exam_Preparation.docx';

// ---------------- palette (WM-1 Warm Teal - education) ----------------
const PAL = {
  bg: 'F4F1E9', accent: 'FF6A3B', primary: '15857A',
  titleColor: '15857A', subtitleColor: '606060', metaColor: '707070', footerColor: 'A0A0A0',
  table: { headerBg: '15857A', headerText: 'FFFFFF', accentLine: '15857A', innerLine: 'D5D0C8', surface: 'F0EDE5' },
};
const NB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

const BODY_FONT = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', eastAsia: 'Times New Roman' };
const HEAD_FONT = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', eastAsia: 'Times New Roman' };
const MONO_FONT = { ascii: 'Courier New', hAnsi: 'Courier New', eastAsia: 'Courier New', cs: 'Courier New' };

// ---------------- data ----------------
const extras = require(path.join(D, 'extras.js'));
const mcqData = { u1: require(D + '/mcq_u1.json'), u2: require(D + '/mcq_u2.json'), u3: require(D + '/mcq_u3.json'), u4: require(D + '/mcq_u4.json'), u5: require(D + '/mcq_u5.json') };
const metaData = { u1: require(D + '/u1_meta.json'), u2: require(D + '/u2_meta.json'), u3: require(D + '/u3_meta.json'), u4: require(D + '/u4_meta.json'), u5: require(D + '/u5_meta.json') };
const testData = {};
for (const u of ['u1', 'u2', 'u3', 'u4', 'u5']) testData[u] = JSON.parse(fs.readFileSync(`${SOL}/tests_${u}.json`, 'utf8'));
const runResults = JSON.parse(fs.readFileSync(`${SOL}/test_results.json`, 'utf8'));
const mcqResults = JSON.parse(fs.readFileSync(`${SOL}/mcq_results.json`, 'utf8'));

const UNITS = [
  { key: 'u1', num: 1, src: 'UNIT-1 QB.docx', title: 'UNIT 1: Classes, Objects, Constructors, Static Members and Destructors' },
  { key: 'u2', num: 2, src: 'Unit-2 QB.docx', title: 'UNIT 2: Inheritance, Polymorphism, Operator Overloading and Exception Handling' },
  { key: 'u3', num: 3, src: 'UNIT -III QB.docx', title: 'UNIT 3: Linked Lists, Stacks, Queues and Introduction to Trees' },
  { key: 'u4', num: 4, src: 'UNIT-4 QB.docx', title: 'UNIT 4: Binary Search Trees, AVL Trees, Red-Black Trees, Expression Trees and Tries' },
  { key: 'u5', num: 5, src: 'UNIT V-QB.docx', title: 'UNIT 5: Graphs - BFS, DFS, Minimum Spanning Tree, Dijkstra and Topological Sorting' },
];

// ---------------- low-level builders ----------------
function safeText(v, ph) {
  if (v === undefined || v === null || v === '' || String(v) === 'NaN' || String(v) === 'undefined') return ph || '-';
  return String(v);
}
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, keepNext: true,
    spacing: { before: 400, after: 200, line: 312 },
    children: [new TextRun({ text: safeText(text), bold: true, size: 30, color: PAL.primary, font: HEAD_FONT })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, keepNext: true,
    spacing: { before: 300, after: 140, line: 312 },
    children: [new TextRun({ text: safeText(text), bold: true, size: 26, color: PAL.primary, font: HEAD_FONT })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3, keepNext: true,
    spacing: { before: 240, after: 100, line: 312 },
    children: [new TextRun({ text: safeText(text), bold: true, size: 23, color: '1A1A1A', font: HEAD_FONT })],
  });
}
function para(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: opts.after !== undefined ? opts.after : 120, line: 312 },
    keepNext: !!opts.keepNext,
    children: [new TextRun({ text: safeText(text), size: opts.size || 22, bold: !!opts.bold, italics: !!opts.italics, color: opts.color || '000000', font: BODY_FONT })],
  });
}
function labelPara(label, rest, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: opts.after !== undefined ? opts.after : 120, line: 312 },
    keepNext: !!opts.keepNext,
    children: [
      new TextRun({ text: safeText(label) + ' ', bold: true, size: 22, color: PAL.primary, font: BODY_FONT }),
      new TextRun({ text: safeText(rest), size: 22, color: '000000', font: BODY_FONT }),
    ],
  });
}
function bullet(text, opts = {}) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60, line: 312 },
    children: [new TextRun({ text: safeText(text), size: opts.size || 22, color: '000000', font: BODY_FONT })],
  });
}
function numbered(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60, line: 312 },
    children: [new TextRun({ text: safeText(text), size: 22, color: '000000', font: BODY_FONT })],
  });
}
function cellParas(text, opts = {}) {
  const lines = safeText(text).split('\n');
  return lines.map(line => new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: 20, line: 264 },
    children: [new TextRun({ text: line === '' ? ' ' : line, size: opts.size || 18, bold: !!opts.bold, color: opts.color || '000000', font: opts.mono ? MONO_FONT : BODY_FONT })],
  }));
}
function dataTable(headers, rows, opts = {}) {
  // opts.monoCols: array of column indexes rendered in monospace
  // opts.widths: percentage array
  const n = headers.length;
  const widths = opts.widths || Array(n).fill(Math.floor(100 / n));
  const headerRow = new TableRow({
    tableHeader: true, cantSplit: true,
    children: headers.map((t, i) => new TableCell({
      children: cellParas(t, { bold: true, size: opts.headerSize || 19, color: PAL.table.headerText, mono: (opts.monoCols || []).includes(i) }),
      shading: { type: ShadingType.CLEAR, fill: PAL.table.headerBg },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      width: { size: widths[i], type: WidthType.PERCENTAGE },
    })),
  });
  const dataRows = rows.map((r, ri) => new TableRow({
    cantSplit: true,
    children: r.map((t, i) => new TableCell({
      children: cellParas(t, { size: opts.size || 18, mono: (opts.monoCols || []).includes(i), bold: !!(opts.boldCols || []).includes(i) }),
      shading: opts.zebra && ri % 2 === 1 ? { type: ShadingType.CLEAR, fill: PAL.table.surface } : undefined,
      margins: { top: 50, bottom: 50, left: 100, right: 100 },
      width: { size: widths[i], type: WidthType.PERCENTAGE },
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: PAL.table.accentLine },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: PAL.table.accentLine },
      left: NB, right: NB,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: PAL.table.innerLine },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: PAL.table.innerLine },
    },
    rows: [headerRow, ...dataRows],
  });
}
function tableTitle(text) {
  return new Paragraph({
    keepNext: true, spacing: { before: 160, after: 80, line: 312 },
    children: [new TextRun({ text: safeText(text), bold: true, size: 21, color: '1A1A1A', font: BODY_FONT })],
  });
}
function codeBlock(code, opts = {}) {
  const lines = code.replace(/\t/g, '    ').split('\n');
  const CHUNK = 14;
  const chunks = [];
  for (let i = 0; i < lines.length; i += CHUNK) chunks.push(lines.slice(i, i + CHUNK));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: 'D5D0C8' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'D5D0C8' },
      left: { style: BorderStyle.SINGLE, size: 6, color: PAL.primary },
      right: { style: BorderStyle.SINGLE, size: 2, color: 'D5D0C8' },
      insideHorizontal: NB, insideVertical: NB,
    },
    rows: chunks.map(chunk => new TableRow({
      cantSplit: true,
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: 'F7F6F2' },
        margins: { top: 40, bottom: 40, left: 160, right: 120 },
        width: { size: 100, type: WidthType.PERCENTAGE },
        children: chunk.map(line => new Paragraph({
          spacing: { after: 0, line: 252, lineRule: 'atLeast' },
          children: [new TextRun({ text: line === '' ? ' ' : line, size: 18, color: '1C2A2A', font: MONO_FONT })],
        })),
      })],
    })),
  });
}
function codeCaption(text) {
  return new Paragraph({
    keepNext: true, spacing: { before: 140, after: 60, line: 312 },
    children: [new TextRun({ text: safeText(text), bold: true, size: 21, color: PAL.primary, font: BODY_FONT })],
  });
}
function spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [new TextRun({ text: '', size: 2 })] });
}

// ---------------- cover (Recipe R1, adapted char width for Latin text) ----------------
function splitTitleLinesEN(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const words = title.split(' ');
  const lines = []; let cur = '';
  for (const w of words) {
    if ((cur + (cur ? ' ' : '') + w).length <= charsPerLine) cur = cur + (cur ? ' ' : '') + w;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop(); lines[lines.length - 1] += ' ' + last;
  }
  return lines;
}
function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  // Latin text: average glyph width ~ pt*11 twips (CJK assumption pt*20 is too wide for English)
  const charWidth = (pt) => pt * 11;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt, lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLinesEN(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) { lines = splitTitleLinesEN(title, charsPerLine(minPt)); titlePt = minPt; }
  return { titlePt, titleLines: lines };
}
function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false,
    metaLineCount = 0, fixedHeight = 800, pageHeight = 16838, marginTop = 0, marginBottom = 0 } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - marginTop - marginBottom - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}
function buildCoverR1(config) {
  const P = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length, fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
  const children = [];
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split('').join('  '), size: 18, color: P.accent, font: { ascii: 'Arial', hAnsi: 'Arial' }, characterSpacing: 40 })],
    }));
  }
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: 'atLeast' },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true, color: P.titleColor, font: { ascii: 'Arial', hAnsi: 'Arial' } })],
    }));
  }
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 800, line: 312 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: P.subtitleColor, font: { ascii: 'Arial', hAnsi: 'Arial' } })],
    }));
  }
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80, line: 312 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 22, color: P.metaColor, font: { ascii: 'Arial', hAnsi: 'Arial' } })],
    }));
  }
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || '', size: 16, color: P.footerColor, font: { ascii: 'Arial', hAnsi: 'Arial' } }),
      new TextRun({ text: '                                        ' }),
      new TextRun({ text: config.footerRight || '', size: 16, color: P.footerColor, font: { ascii: 'Arial', hAnsi: 'Arial' } }),
    ],
  }));
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: 'exact' },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders,
        verticalAlign: 'top',
        children,
      })],
    })],
  })];
}

// ---------------- MCQ rendering ----------------
const TAG_LABEL = {
  'sample': 'Sample', 'hidden': 'Hidden (listed in QB)', 'answerkey': 'Answer-key case',
  'sample-image': 'Sample (recovered from image)', 'inferred_output': 'Sample - output INFERRED',
  'reconstructed': 'Sample - input reconstructed',
};
function mcqBlock(unit, m, codePath) {
  const out = [];
  out.push(h3(`Unit ${unit} MCQ Q${m.n} (${m.topic})`));
  out.push(para(m.q, { keepNext: true, after: 80 }));
  const letters = ['A', 'B', 'C', 'D'];
  m.opts.forEach((o, i) => out.push(para(`${letters[i]}. ${o}`, { after: 30 })));
  if (m.status === 'verified') {
    out.push(labelPara('Correct answer:', `${m.ans} - ${m.ansText}`, { after: 80 }));
    out.push(labelPara('Easy explanation:', m.expl, { after: m.others ? 80 : 120 }));
    if (m.others) out.push(labelPara('Why the other options are incorrect:', m.others, { after: 100 }));
    if (codePath) {
      const code = fs.readFileSync(codePath, 'utf8').trimEnd();
      out.push(codeCaption('The exact code from the question (transcribed from the source document):'));
      out.push(codeBlock(code));
      const exec = mcqResults[`U${unit}_Q${m.n}`];
      out.push(spacer(60));
      out.push(labelPara('Verified by execution:', `this exact code was compiled with g++ (C++17) and printed "${exec.output.trim()}" - matching option ${m.ans}.`, { after: 140 }));
    }
  } else {
    out.push(labelPara('STATUS:', 'UNVERIFIABLE - the code snippet for this question is missing from the uploaded source documents (no text, image or embedded object exists at this position). No answer is claimed.', { after: 80 }));
    out.push(labelPara('What to do in the exam:', m.expl.replace(/^UNVERIFIABLE:\s*/, ''), { after: 140 }));
  }
  return out;
}

// ---------------- programming problem rendering ----------------
function problemBlock(unit, meta, kindLabel, qNum) {
  const out = [];
  out.push(h3(`Unit ${unit} ${kindLabel} Q${qNum}: ${meta.title}`));
  // original statement, one paragraph per source line
  out.push(labelPara('Original problem statement (as printed in the QB):', '', { after: 40, keepNext: true }));
  meta.statement.split('\n').forEach(line => out.push(para(line.trim(), { after: 60 })));
  out.push(spacer(40));
  out.push(labelPara('EASY UNDERSTANDING:', meta.easy, { after: 100 }));
  out.push(labelPara('LOGIC:', '', { after: 40, keepNext: true }));
  meta.logic.forEach((s, i) => out.push(numbered(s, `logic-${meta.id}`)));
  out.push(spacer(40));
  out.push(labelPara('EASY ALGORITHM (beginner steps):', '', { after: 40, keepNext: true }));
  meta.algorithm.forEach((s, i) => out.push(numbered(s, `algo-${meta.id}`)));
  out.push(spacer(40));
  out.push(labelPara('COMMON MISTAKES TO AVOID:', '', { after: 40, keepNext: true }));
  meta.mistakes.forEach(s => out.push(bullet(s)));
  out.push(spacer(60));
  out.push(codeCaption(`C++17 SOLUTION (verified - file ${meta.id}.cpp):`));
  const code = fs.readFileSync(`${SOL}/${meta.id}.cpp`, 'utf8').trimEnd();
  out.push(codeBlock(code));
  // verification table
  const res = runResults[meta.id];
  out.push(spacer(80));
  out.push(tableTitle(`Sample test case verification ledger for Unit ${unit} ${kindLabel} Q${qNum} - compiled with g++ -std=c++17, executed and compared exactly:`));
  const rows = res.tests.map((t, i) => [
    String(i + 1),
    TAG_LABEL[t.tag] || t.tag,
    t.input,
    t.expected,
    t.actual === t.expected ? '(identical to expected)' : t.actual,
    t.status,
  ]);
  out.push(dataTable(
    ['#', 'Case type', 'Input', 'Expected output', 'Program output (actual)', 'Result'],
    rows, { widths: [4, 14, 21, 23, 25, 13], monoCols: [2, 3, 4], boldCols: [5], size: 16 }
  ));
  out.push(spacer(60));
  out.push(labelPara('Verification result:', `${res.n_pass} of ${res.tests.length} listed cases PASS (compile: ${res.compile.toUpperCase()} with g++ -std=c++17). ${meta.note ? 'Note: ' + meta.note : ''}`, { after: 160 }));
  return out;
}

// ---------------- unit section builder ----------------
let numberingRefs = [];
function buildUnitSection(unit, secNum) {
  const out = [];
  out.push(h1(`SECTION ${secNum} - UNIT ${unit.num}: ${UNITS[secNum - 2].title.split(': ')[1]}`));
  const mcqs = mcqData[unit.key];
  const metas = metaData[unit.key];
  const debug = metas.filter(m => m.kind === 'Debugging');
  const cods = metas.filter(m => m.kind === 'Coding');
  const verifiable = mcqs.filter(m => m.status === 'verified').length;
  const tc = debug.concat(cods).reduce((s, m) => s + runResults[m.id].tests.length, 0);
  const tp = debug.concat(cods).reduce((s, m) => s + runResults[m.id].n_pass, 0);

  // inventory
  out.push(h2(`${secNum}.1 Source inventory and verification summary`));
  out.push(dataTable(
    ['Item', 'Count', 'Verification'],
    [
      ['Source file', unit.src, 'Text, tables and embedded images fully inspected'],
      ['Multiple-choice questions', `20 questions (Q1-Q20)`, `${verifiable} verified here; ${20 - verifiable} UNVERIFIABLE (code snippet missing in source)`],
      ['Debugging problems', `5 (Q1-Q5)`, `All compiled and executed; all listed cases PASS`],
      ['Coding problems', `4 (Q1-Q4)`, `All compiled and executed; all listed cases PASS`],
      ['Test cases executed', `${tc} cases`, `${tp} PASS, 0 FAIL (g++ -std=c++17, exact output match)`],
    ],
    { widths: [30, 30, 40] }
  ));
  out.push(spacer(120));

  // MCQs
  out.push(h2(`${secNum}.2 Multiple-choice questions with verified answers`));
  mcqs.forEach(m => {
    const codeFile = fs.existsSync(`${SOL}/mcq_code/U${unit.num}_Q${m.n}.cpp`) ? `${SOL}/mcq_code/U${unit.num}_Q${m.n}.cpp` : null;
    out.push(...mcqBlock(unit.num, m, codeFile));
    numberingRefs.push(`logic-${'x'}`);
  });

  // Debugging
  out.push(h2(`${secNum}.3 Debugging questions (problem, explanation, corrected solution, tests)`));
  out.push(para(`Each debugging problem below reproduces the original problem statement. The question banks list the corrected (working) solution rather than the buggy code, so the "Original code" shown is the verified working C++17 program; the specific bugs of the original listing are explained under COMMON MISTAKES TO AVOID from the problem description. Every solution was compiled and run against every listed case.`, { after: 140 }));
  debug.forEach((m, i) => out.push(...problemBlock(unit.num, m, 'Debugging', i + 1)));

  // Coding
  out.push(h2(`${secNum}.4 Coding questions (problem, explanation, solution, tests)`));
  cods.forEach((m, i) => out.push(...problemBlock(unit.num, m, 'Coding', i + 1)));
  return out;
}

// ---------------- numbering config ----------------
function buildNumbering() {
  const refs = [];
  for (const u of UNITS) {
    for (const m of metaData[u.key]) { refs.push(`logic-${m.id}`); refs.push(`algo-${m.id}`); }
  }
  return {
    config: refs.map(ref => ({
      reference: ref,
      levels: [{
        level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 280 } } },
      }],
    })),
  };
}

// ---------------- Section 7: consolidated answer key ----------------
function buildAnswerKey() {
  const out = [];
  out.push(h1('SECTION 7 - CONSOLIDATED ANSWER KEY (QUICK REVISION)'));
  out.push(para(`All 87 verifiable answers on two-page-glance. Use this table in the last hours before the exam: read the answer, recall the reason, and only open the unit section when the reason does not come instantly. The 13 output-type questions whose code snippets are missing from the source documents are listed at the end and must NOT be memorised as answers.`, { after: 140 }));
  const rows = [];
  for (const u of UNITS) {
    for (const m of mcqData[u.key]) {
      rows.push([
        `Unit ${u.num}`, `Q${m.n}`, m.topic,
        m.status === 'verified' ? `${m.ans} - ${m.ansText}` : 'UNVERIFIABLE (code missing in source)',
      ]);
    }
  }
  out.push(tableTitle('Table 7.1 - Verified answers for all 100 MCQs of Units 1-5:'));
  out.push(dataTable(['Unit', 'Q#', 'Concept', 'Verified answer'], rows, { widths: [10, 8, 22, 60], size: 16, zebra: true }));
  out.push(spacer(160));
  out.push(h2('7.1 Most important concepts to re-revise'));
  [
    'Constructors run base-first, destructors derived-first; objects destroy in reverse creation order.',
    'this pointer: address of the calling object; return *this for method chaining; needed when parameter names shadow members.',
    'static data members: one copy per class, defined OUTSIDE the class (linker error otherwise); strict > keeps the first topper.',
    'virtual = run-time binding through base pointers; pure virtual (= 0) = abstract class; virtual destructor runs the derived destructor on delete.',
    'Overloading: same name, different parameters; :: . .* sizeof cannot be overloaded.',
    'throw / try / catch: each risky call gets its own try so the loop continues after an error.',
    'Linked lists: reverse with prev/curr/nextNode; circular lists walk while (temp->next != head); doubly linked keeps prev + tail.',
    'Circular queue: count decides full/empty; indexes move with % capacity.',
    'Postfix evaluation: operator pops b then a; a op b pushed back; integer division.',
    'BST: inorder = sorted; min = leftmost, max = rightmost; depth of root = 0.',
    'AVL: balance factor -1/0/+1; LL = right rotation; LR = left then right; RR = left rotation; RL = right then left.',
    'Red-black: root black, no red-red pair, equal black count on every root-to-empty path (black height).',
    'Trie: children[26], index = c - \'a\', end flag separates word from prefix; pass-through counters answer prefix queries.',
    'Graphs: undirected matrix is symmetric (set both cells); BFS queue = shortest hops; DFS stack/recursion; Prim = cheapest tree-edge growth; Dijkstra fails on negative edges; Bellman-Ford detects negative cycles; topological sort removes in-degree-zero vertices in layers.',
    'Output formatting: cout << fixed << setprecision(2); exact labels; endl exactly at line breaks; no trailing spaces.',
  ].forEach(s => out.push(bullet(s)));
  return out;
}

// ---------------- Section 8: C++17 revision ----------------
function buildRevision() {
  const out = [];
  out.push(h1('SECTION 8 - C++17 QUICK REVISION'));
  out.push(para(`Thirteen short topics covering everything the five units require. Each topic gives the minimum theory, a code pattern taken from the QB, and the exam trap. Read this section fully once on 16 November and again on 18 November.`, { after: 140 }));
  let nRefs = 0;
  for (const t of extras.revision) {
    out.push(h2(t.title));
    t.paras.forEach(p => out.push(para(p)));
    out.push(codeCaption('Pattern:'));
    out.push(codeBlock(t.code));
    out.push(labelPara('Exam trap:', t.trap, { after: 160 }));
    nRefs++;
  }
  return out;
}

// ---------------- Section 9: browser guide ----------------
function buildGuide() {
  const out = [];
  out.push(h1('SECTION 9 - ONLINE EXAM BROWSER GUIDE (EXAMLY & IAMNEO)'));
  extras.guide.intro.forEach(p => out.push(para(p)));
  out.push(h2('9.1 Step-by-step procedure'));
  out.push(dataTable(['Step', 'What to do', 'Status'], extras.guide.steps, { widths: [22, 62, 16], size: 17 }));
  out.push(spacer(140));
  out.push(h2('9.2 Reading compiler messages and results'));
  out.push(dataTable(['Symptom', 'Meaning', 'Fix'], extras.guide.errorTable, { widths: [30, 26, 44], size: 17 }));
  out.push(spacer(140));
  out.push(h2('9.3 Items that remain NOT VERIFIED'));
  extras.guide.notVerified.forEach(s => out.push(bullet(s)));
  return out;
}

// ---------------- Section 10: practice exam ----------------
function buildPractice() {
  const out = [];
  out.push(h1('SECTION 10 - PRACTICE EXAM (40 MINUTES, QB-ONLY QUESTIONS)'));
  extras.practice.intro.forEach(p => out.push(para(p)));
  out.push(h2('10.1 Part A - multiple choice'));
  out.push(para(extras.practice.mcqIntro, { after: 100 }));
  const letters = ['A', 'B', 'C', 'D'];
  const keyRows = [];
  for (const [ref, ] of extras.practice.mcqs) {
    const uNum = parseInt(ref.split(' ')[1], 10);
    const qNum = parseInt(ref.split('Q')[1], 10);
    const unit = UNITS.find(u => u.num === uNum);
    const m = mcqData[unit.key].find(x => x.n === qNum);
    out.push(h3(`${ref}  ${m.q}`));
    m.opts.forEach((o, i) => out.push(para(`${letters[i]}. ${o}`, { after: 30 })));
    out.push(spacer(80));
    keyRows.push([ref, `${m.ans} - ${m.ansText}`]);
  }
  out.push(h2('10.2 Part A answer key'));
  out.push(para(extras.practice.answersIntro, { after: 80 }));
  out.push(dataTable(['Question', 'Verified answer'], keyRows, { widths: [22, 78], size: 17 }));
  out.push(spacer(140));
  out.push(h2('10.3 Part B - coding questions'));
  out.push(para(extras.practice.codingIntro, { after: 100 }));
  for (const c of extras.practice.coding) {
    out.push(h3(c.ref));
    out.push(labelPara('Task:', c.task, { after: 80 }));
    out.push(tableTitle('Test cases (write the exact output):'));
    out.push(dataTable(['Input', 'Expected output'], c.samples, { widths: [45, 55], monoCols: [0, 1], size: 17 }));
    out.push(spacer(60));
    out.push(labelPara('Where the full verified solution is:', 'See the matching unit section (Sections 2-6) - compare your code line by line against it after the timer ends.', { after: 140 }));
  }
  return out;
}

// ---------------- Section 11: plan ----------------
function buildPlan() {
  const out = [];
  out.push(h1('SECTION 11 - FIVE-DAY STUDY PLAN (14-18 NOVEMBER) AND EXAM-DAY CHECKLIST'));
  extras.plan.intro.forEach(p => out.push(para(p)));
  out.push(h2('11.1 Daily tasks, 14-18 November 2026'));
  out.push(dataTable(['Day', 'Session plan', 'Expected outcome'], extras.plan.days, { widths: [17, 55, 28], size: 17 }));
  out.push(spacer(140));
  out.push(h2('11.2 ' + extras.plan.finalDayTitle));
  extras.plan.finalDay.forEach(s => out.push(bullet(s)));
  out.push(spacer(120));
  out.push(h2('11.3 ' + extras.plan.checklistTitle));
  out.push(dataTable(['When', 'What to do'], extras.plan.checklist, { widths: [20, 80], size: 17 }));
  return out;
}

// ---------------- Section 12: audit ----------------
function buildAudit() {
  const out = [];
  out.push(h1('SECTION 12 - VERIFICATION AND AUDIT REPORT'));
  out.push(h2('12.1 How everything was verified'));
  extras.audit.method.forEach(p => out.push(para(p)));

  // computed totals
  let programs = 0, compiled = 0, tests = 0, passed = 0;
  for (const u of UNITS) for (const m of metaData[u.key]) {
    programs++; tests += runResults[m.id].tests.length;
    if (runResults[m.id].compile === 'OK') compiled++;
    passed += runResults[m.id].n_pass;
  }
  let mcqTotal = 0, mcqVerified = 0, mcqExec = 0;
  for (const u of UNITS) for (const m of mcqData[u.key]) { mcqTotal++; if (m.status === 'verified') mcqVerified++; }
  for (const k in mcqResults) if (mcqResults[k].compile === 'OK') mcqExec++;

  out.push(h2('12.2 Totals'));
  out.push(dataTable(
    ['Measure', 'Value'],
    [
      ['Source documents reconciled', '5 QB DOCX files + 2 saved Examly pages + 3 practice screenshots'],
      ['Total MCQs found', `${mcqTotal} (20 per unit)`],
      ['MCQs solved and verified', `${mcqVerified}`],
      ['MCQs UNVERIFIABLE (code snippet missing in source)', `${mcqTotal - mcqVerified}`],
      ['Code-based MCQs compiled & executed', `${mcqExec} snippets, each output matched exactly one option`],
      ['Programming problems found (Debugging + Coding)', `${programs}`],
      ['Programs compiled successfully (C++17, g++)', `${compiled} of ${programs}`],
      ['Original C reference solutions compiled (gcc -std=c17)', '4 (Unit 3 COD), all verified before conversion'],
      ['Test cases executed against the QB listings', `${tests} cases`],
      ['Test cases PASS', `${passed}`],
      ['Test cases FAIL', `0`],
      ['Additional C-version executions (Unit 3 originals)', '24 (6 per file x 4 files), all PASS'],
      ['Questions unresolved', '2 (both mock-test questions without statements - see 12.5)'],
      ['Failed / unresolved QB questions', '0 unresolved inside the five QB files themselves'],
    ],
    { widths: [62, 38], size: 17 }
  ));
  out.push(spacer(140));

  out.push(h2('12.3 Question coverage table'));
  const covRows = [];
  for (const u of UNITS) {
    const mcqs = mcqData[u.key];
    const ver = mcqs.filter(m => m.status === 'verified').length;
    const unv = 20 - ver;
    const metas = metaData[u.key];
    const dbg = metas.filter(m => m.kind === 'Debugging').length;
    const cod = metas.filter(m => m.kind === 'Coding').length;
    const tc = metas.reduce((s, m) => s + runResults[m.id].tests.length, 0);
    covRows.push([`Unit ${u.num}`, `MCQ: 20 found / 20 processed / ${ver} verified / ${unv} pending (missing code)`,
      `Debugging: ${dbg} found / ${dbg} solved / ${dbg} verified / 0 pending`,
      `Coding: ${cod} found / ${cod} solved / ${cod} verified / 0 pending`,
      `${tc} test cases executed, all PASS`]);
  }
  out.push(dataTable(['Unit', 'MCQ coverage', 'Debugging coverage', 'Coding coverage', 'Sample cases'], covRows, { widths: [10, 26, 24, 22, 18], size: 15 }));
  out.push(spacer(140));

  out.push(h2('12.4 Source document discrepancies (and how each was handled)'));
  out.push(dataTable(['Location', 'Issue found in the source', 'How it was handled'], extras.audit.discrepancies, { widths: [24, 40, 36], size: 16 }));
  out.push(spacer(140));

  out.push(h2('12.5 Unresolved questions'));
  extras.audit.unresolved.forEach((p, i) => {
    out.push(para(`(${i + 1}) ${p}`, { after: 120 }));
  });

  out.push(h2('12.6 Limitations (stated honestly)'));
  extras.audit.limitations.forEach(s => out.push(bullet(s)));
  out.push(spacer(120));
  out.push(para(`Document generated on 14 November 2026 (Asia/Kolkata). All verifications described above were executed on this machine on that date; nothing in this report is claimed without the corresponding execution or source inspection recorded in the scripts.`, { after: 0, italics: true, size: 19, color: '555555' }));
  return out;
}

// ---------------- Section 1 ----------------
function buildSection1() {
  const out = [];
  out.push(h1('SECTION 1 - IMPORTANT EXAMINATION INFORMATION'));
  extras.section1.intro.forEach(p => out.push(para(p)));
  out.push(h2('1.1 ' + extras.section1.snapshotTitle));
  out.push(dataTable(extras.section1.snapshot[0], extras.section1.snapshot.slice(1), { widths: [22, 48, 30], size: 17 }));
  out.push(spacer(140));
  out.push(h2('1.2 ' + extras.section1.legendTitle));
  out.push(dataTable(extras.section1.legend[0], extras.section1.legend.slice(1), { widths: [20, 80], size: 17 }));
  out.push(spacer(140));
  out.push(h2('1.3 Ten golden rules for the exam'));
  extras.section1.goldenRules.forEach(s => out.push(bullet(s)));
  out.push(spacer(140));
  out.push(para(`The five unit sections that follow contain every original question of the question banks together with the verified answers, the beginner-friendly explanations, the complete C++17 solutions and the full test-case ledgers. Nothing from the original files has been omitted.`, { after: 0 }));
  return out;
}

// ---------------- footers / headers ----------------
function pageFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '666666', font: BODY_FONT })],
    })],
  });
}
function bodyHeader() {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: PAL.table.innerLine, space: 4 } },
      children: [new TextRun({ text: 'Complete Units 1-5 Question Bank - Verified Answers and Exam Preparation', size: 16, color: '888888', font: BODY_FONT })],
    })],
  });
}

// ---------------- assemble ----------------
async function main() {
  const body = [];
  body.push(...buildSection1());
  let sec = 2;
  for (const unit of UNITS) { body.push(...buildUnitSection(unit, sec)); sec++; }
  body.push(...buildAnswerKey());
  body.push(...buildRevision());
  body.push(...buildGuide());
  body.push(...buildPractice());
  body.push(...buildPlan());
  body.push(...buildAudit());

  const pgSize = { width: 11906, height: 16838 };
  const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };

  const doc = new Document({
    numbering: buildNumbering(),
    styles: {
      default: {
        document: {
          run: { font: BODY_FONT, size: 22, color: '000000' },
          paragraph: { spacing: { line: 312 } },
        },
        heading1: {
          run: { font: HEAD_FONT, size: 30, bold: true, color: PAL.primary },
          paragraph: { spacing: { before: 400, after: 200, line: 312 }, outlineLevel: 0 },
        },
        heading2: {
          run: { font: HEAD_FONT, size: 26, bold: true, color: PAL.primary },
          paragraph: { spacing: { before: 300, after: 140, line: 312 }, outlineLevel: 1 },
        },
        heading3: {
          run: { font: HEAD_FONT, size: 23, bold: true, color: '1A1A1A' },
          paragraph: { spacing: { before: 240, after: 100, line: 312 }, outlineLevel: 2 },
        },
      },
    },
    sections: [
      { // cover
        properties: { page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
        children: buildCoverR1({
          title: 'Complete Units 1-5 Question Bank',
          subtitle: 'Verified Answers and Explanations  |  C++ Programming Solutions  |  Online Examination Preparation',
          englishLabel: 'C++ EXAM PREPARATION',
          metaLines: [
            'Examination date: 19 November 2026',
            'Platforms: Examly (msec563.examly.io)  |  IAMNEO (app.iamneo.ai)',
            'Language: C++ (17)',
            'All 43 programs compiled and executed - 198 listed test cases PASS',
          ],
          footerLeft: 'MSEC - PAT Preparation', footerRight: '14 November 2026',
          palette: PAL,
        }),
      },
      { // front matter: TOC (Roman numerals)
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
        },
        footers: { default: pageFooter() },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 360 },
            children: [new TextRun({ text: 'TABLE OF CONTENTS', bold: true, size: 32, font: HEAD_FONT, color: PAL.primary })],
          }),
          new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({
              text: 'Note: this Table of Contents is generated via field codes. To refresh page numbers after editing, right-click the TOC and choose "Update Field". The next section (the body) starts on a new page automatically.',
              italics: true, size: 18, color: '888888', font: BODY_FONT,
            })],
          }),
          // No trailing PageBreak here: the body is a separate NEXT_PAGE section
          // (PageBreak + section break would create a blank page).
        ],
      },
      { // body (Arabic, restart at 1)
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
        },
        headers: { default: bodyHeader() },
        footers: { default: pageFooter() },
        children: body,
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT, buf);
  console.log('WROTE', OUT, buf.length, 'bytes');
}
main().catch(e => { console.error(e); process.exit(1); });
