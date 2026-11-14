#!/usr/bin/env python3
"""Post-process footers per toc.md: Roman footer for front matter, arabic for body;
remove empty <w:pgNumType/> from sections without pageNumbers."""
import zipfile, shutil, re, os, sys

SRC = '/home/z/my-project/download/Complete_Units_1_to_5_QB_Answers_Exam_Preparation.docx'
TMP = '/tmp/docx_patch'

if os.path.exists(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP)
with zipfile.ZipFile(SRC) as z:
    z.extractall(TMP)

doc_path = os.path.join(TMP, 'word', 'document.xml')
with open(doc_path, encoding='utf-8') as f:
    doc = f.read()

# 1) remove empty pgNumType (cover section)
doc = doc.replace('<w:pgNumType/>', '')

# 1b) TOC field paragraph: drop the duplicated first entry that sits inside the
#     field paragraph (begin+instrText+separate+entry); standalone entries follow.
m = re.search(r'<w:instrText[^>]*>\s*TOC[^<]*</w:instrText>', doc)
if m:
    sep = doc.find('fldCharType="separate"', m.end())
    if sep != -1:
        r_end = doc.find('</w:r>', sep)
        if r_end != -1:
            r_end += len('</w:r>')
            pend = doc.find('</w:p>', r_end)
            if pend != -1:
                removed = doc[r_end:pend]
                if '<w:t' in removed:
                    doc = doc[:r_end] + doc[pend:]
                    print('TOC field paragraph: removed duplicated first entry (%d chars)' % len(removed))

# 2) find footer references per section, in order
sect_blocks = re.findall(r'<w:sectPr[^>]*>.*?</w:sectPr>', doc, re.S)
print('sections found:', len(sect_blocks))
rels_path = os.path.join(TMP, 'word', '_rels', 'document.xml.rels')
with open(rels_path, encoding='utf-8') as f:
    rels = f.read()
rid2file = dict(re.findall(r'<Relationship Id="(rId\d+)"[^>]*Target="(footer\d+\.xml)"', rels))

footer_fmt = {}  # filename -> roman|arabic
for idx, blk in enumerate(sect_blocks):
    fmt = None
    m = re.search(r'<w:pgNumType[^>]*w:fmt="([^"]+)"', blk)
    if m:
        fmt = m.group(1)
    for rid in re.findall(r'<w:footerReference[^>]*r:id="(rId\d+)"', blk):
        fn = rid2file.get(rid)
        if not fn:
            continue
        if fmt == 'upperRoman':
            footer_fmt[fn] = 'ROMAN'
        else:
            footer_fmt[fn] = 'arabic'
print('footer formats:', footer_fmt)

for fn, fmt in footer_fmt.items():
    fp = os.path.join(TMP, 'word', fn)
    with open(fp, encoding='utf-8') as f:
        xml = f.read()
    xml2 = re.sub(r'(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)',
                  r'\1 PAGE \\* ' + fmt + r' \\* MERGEFORMAT \2', xml)
    if xml2 != xml:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(xml2)
        print(f'patched {fn} -> {fmt}')

with open(doc_path, 'w', encoding='utf-8') as f:
    f.write(doc)

# rezip
out = SRC
tmpzip = '/tmp/patched.docx'
if os.path.exists(tmpzip):
    os.remove(tmpzip)
zf = zipfile.ZipFile(tmpzip, 'w', zipfile.ZIP_DEFLATED)
for root, dirs, files in os.walk(TMP):
    for file in files:
        full = os.path.join(root, file)
        rel = os.path.relpath(full, TMP)
        zf.write(full, rel)
zf.close()
shutil.copy(tmpzip, out)
print('patched document saved:', out)
