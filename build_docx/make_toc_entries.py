#!/usr/bin/env python3
"""Build H1/H2-only TOC entries with REAL page numbers from the rendered PDF."""
import subprocess, json, re, zipfile

DOCX = '/home/z/my-project/download/Complete_Units_1_to_5_QB_Answers_Exam_Preparation.docx'
PDF = '/home/z/my-project/download/Complete_Units_1_to_5_QB_Answers_Exam_Preparation.pdf'

# 1) get all Heading1/Heading2 paragraphs in document order (python-docx style detection)
with zipfile.ZipFile(DOCX) as z:
    xml = z.read('word/document.xml').decode('utf-8')

headings = []
for m in re.finditer(r'<w:p\b.*?</w:p>', xml, re.S):
    p = m.group(0)
    sm = re.search(r'<w:pStyle w:val="Heading([12])"', p)
    if not sm:
        continue
    level = int(sm.group(1))
    texts = re.findall(r'<w:t[^>]*>([^<]*)</w:t>', p)
    text = ''.join(texts).strip()
    if text:
        headings.append({'level': level, 'text': text})

print('H1/H2 headings:', len(headings))

# 2) locate each heading in the rendered PDF text, page by page
n_pages = 187
page_texts = []
for i in range(1, n_pages + 1):
    r = subprocess.run(['pdftotext', '-f', str(i), '-l', str(i), '-layout', PDF, '-'],
                       capture_output=True, text=True)
    page_texts.append(re.sub(r'\s+', ' ', r.stdout))

def norm(s):
    return re.sub(r'\s+', ' ', s).strip().lower()

# find where the TOC ends (page with the refresh-hint note), body starts next page
toc_end = 1
for i, t in enumerate(page_texts):
    if 'field codes' in t.lower() and 'update field' in t.lower():
        toc_end = i + 1
print('TOC ends at absolute page', toc_end)
body_start_abs = toc_end + 1

entries = []
search_from = body_start_abs - 1
for h in headings:
    tgt = norm(h['text'])
    found = None
    for i in range(search_from, n_pages):
        if tgt in norm(page_texts[i]):
            found = i + 1  # absolute page (1-based)
            break
    if found is None:
        # fallback: fuzzy (first 30 chars)
        t30 = tgt[:30]
        for i in range(search_from, n_pages):
            if t30 in norm(page_texts[i]):
                found = i + 1
                break
    if found is None:
        print('NOT FOUND:', h['text'])
        found = search_from + 1
    body_page = found - body_start_abs + 1
    entries.append({'level': h['level'], 'text': h['text'], 'page': str(body_page)})
    search_from = max(found - 1, 0)  # headings are in order; allow same page

with open('/home/z/my-project/scripts/build_docx/toc_entries.json', 'w') as f:
    json.dump(entries, f, indent=1)
print('body starts at absolute page', body_start_abs)
print('entries:', len(entries), 'sample:', entries[:3], '...', entries[-2:])
