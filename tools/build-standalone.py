# -*- coding: utf-8 -*-
"""Fusionne l'application en un seul fichier HTML autonome."""
import base64, re, os

import pathlib
root = str(pathlib.Path(__file__).resolve().parent.parent)
html = open(os.path.join(root, 'index.html'), encoding='utf-8').read()

def read(p): return open(os.path.join(root, p), encoding='utf-8').read()
def datauri(p, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(os.path.join(root, p), 'rb').read()).decode())

# --- CSS en ligne ---
css = read('css/base.css') + '\n' + read('css/app.css')
html = html.replace('<link rel="stylesheet" href="css/base.css">\n<link rel="stylesheet" href="css/app.css">',
                    '<style>\n' + css + '\n</style>')

# --- JS en ligne, dans l'ordre du document ---
scripts = re.findall(r'<script src="([^"]+)"></script>', html)
bundle = []
for s in scripts:
    bundle.append('/* ===== %s ===== */\n%s' % (s, read(s)))
block = '<script>\n' + '\n'.join(bundle) + '\n</script>'
first = html.index('<script src="js/config.js"></script>')
last  = html.index('<script src="js/app.js"></script>') + len('<script src="js/app.js"></script>')
html = html[:first] + block + html[last:]

# --- images et vidéos en ligne ---
logo = datauri('assets/logo.jpg', 'image/jpeg')
html = html.replace('src="assets/logo.jpg"', 'src="' + logo + '"')
html = html.replace('href="assets/logo.jpg"', 'href="' + logo + '"')
for i in (1, 2, 3):
    html = html.replace('src="assets/video/bg-%d.mp4"' % i,
                        'src="' + datauri('assets/video/bg-%d.mp4' % i, 'video/mp4') + '"')

# --- titre du fichier autonome ---
html = html.replace('<!-- ============================ FOND VIDÉO ============================ -->',
                    '<!-- Fichier autonome : CSS, JavaScript, cours, logo et vidéos sont tous inclus ici. -->\n'
                    '<!-- ============================ FOND VIDÉO ============================ -->')

out = os.path.join(root, 'talkandshine.html')
open(out, 'w', encoding='utf-8').write(html)
print('écrit :', out, round(os.path.getsize(out)/1024/1024, 2), 'Mo')
print('restes de liens externes :', re.findall(r'(?:src|href)="(?!data:|https:|#)[^"]+"', html))
