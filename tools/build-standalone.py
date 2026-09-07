# -*- coding: utf-8 -*-
"""Fusionne l'application en un seul fichier HTML autonome."""
import base64, json, re, os

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
    if s == 'js/config.js':
        continue          # remonté tout en haut du fichier, voir plus bas
    bundle.append('/* ===== %s ===== */\n%s' % (s, read(s)))
block = '<script>\n' + '\n'.join(bundle) + '\n</script>'
first = html.index('<script src="js/config.js"></script>')
last  = html.index('<script src="js/app.js"></script>') + len('<script src="js/app.js"></script>')
html = html[:first] + block + html[last:]

# --- configuration hissée en tête de fichier ---
# Sans cela, le bloc où l'on colle la clé Gemini se retrouve après plusieurs
# mégaoctets de données encodées : introuvable au défilement.
config_block = ('<script>\n'
                '/* ==== CONFIGURATION — C\'EST ICI QUE TU COLLES TA CLÉ ==== */\n'
                + read('js/config.js') + '\n</script>\n')
html = html.replace('<style>', config_block + '<style>', 1)

# --- three.js, GLTFLoader et les modèles 3D embarqués ---
# Les modules ES ne peuvent pas s'importer depuis un fichier ouvert en
# local : on les republie en Blob URL au chargement de la page, et les
# modèles .glb en data: URI. Le fichier n'a alors besoin de rien d'externe.
three_src = read('vendor/three/three.module.js')
bgu_src = read('vendor/three/utils/BufferGeometryUtils.js')
gltf_src = read('vendor/three/loaders/GLTFLoader.js')

bundle_js = """<script>
/* Fichier autonome : three.js, ses modules et les modèles 3D sont
   embarqués ici. Aucun fichier externe, aucun CDN. */
(function () {
  function blob(code) { return URL.createObjectURL(new Blob([code], { type: 'text/javascript' })); }
  var threeSrc = %s;
  var bguSrc   = %s;
  var gltfSrc  = %s;
  var T = blob(threeSrc);
  var Bg = blob(bguSrc.replace("'../three.module.js'", JSON.stringify(T)));
  var G = blob(gltfSrc
      .replace("'../three.module.js'", JSON.stringify(T))
      .replace("'../utils/BufferGeometryUtils.js'", JSON.stringify(Bg)));
  window.TS_BUNDLED = { three: T, gltf: G, model: %s, anims: [%s] };
})();
</script>
""" % (json.dumps(three_src), json.dumps(bgu_src), json.dumps(gltf_src),
       json.dumps(datauri('assets/3d/shine.glb', 'model/gltf-binary')),
       json.dumps(datauri('assets/3d/anim-gesture.glb', 'model/gltf-binary')))

# le bloc doit précéder les scripts de l'application
# config.js ayant été hissé plus haut, le bloc applicatif commence par le
# premier script restant : c'est là qu'on insère three.js et les modèles.
anchor = '<script>\n/* ===== ' + scripts[1]
assert anchor in html, "ancre du bloc applicatif introuvable"
html = html.replace(anchor, bundle_js + anchor, 1)

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
