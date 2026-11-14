#!/usr/bin/env python3
"""Stack embedded DOCX images into labelled composites for transcription."""
from PIL import Image, ImageDraw, ImageFont

M = '/home/z/my-project/scripts/media'

def compose(items, out, pad=14, bg=(255,255,255)):
    imgs = []
    for label, path in items:
        im = Image.open(path).convert('RGB')
        imgs.append((label, im))
    W = max(im.width for _, im in imgs) + 2 * pad
    H = sum(im.height + 46 + pad for _, im in imgs) + pad
    canvas = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    except Exception:
        font = ImageFont.load_default()
    y = pad
    for label, im in imgs:
        d.rectangle([0, y, W, y + 40], fill=(230, 230, 250))
        d.text((10, y + 6), label, fill=(0, 0, 0), font=font)
        y += 46
        canvas.paste(im, (pad, y))
        y += im.height + pad
        d.line([(0, y - 2), (W, y - 2)], fill=(180, 180, 180), width=2)
    canvas.save(out)
    print(out, canvas.size)

u3 = f'{M}/UNIT -III QB/docx_zip/word/media'
u5 = f'{M}/UNIT V-QB/docx_zip/word/media'

compose([
    ('UNIT-3 MCQ Q14 code:', f'{u3}/image1.png'),
    ('UNIT-3 MCQ Q16 code:', f'{u3}/image2.png'),
    ('UNIT-3 MCQ Q17 code:', f'{u3}/image3.png'),
], f'{M}/composite_unit3_A.png')

compose([
    ('UNIT-3 MCQ Q18 code:', f'{u3}/image4.png'),
    ('UNIT-3 MCQ Q19 code:', f'{u3}/image5.png'),
], f'{M}/composite_unit3_B.png')

compose([
    ('UNIT-5 DEBUG Q1 sample table:', f'{u5}/image2.png'),
    ('UNIT-5 CODING Q3 sample table:', f'{u5}/image3.png'),
    ('UNIT-5 CODING Q4 sample table:', f'{u5}/image4.png'),
], f'{M}/composite_unit5.png')
