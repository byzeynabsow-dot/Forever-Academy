# -*- coding: utf-8 -*-
"""
Extrait les animations d'un .glb exporté par Avaturn en jetant le maillage,
les matériaux et les textures.

Un export Avaturn pèse ~3,4 Mo alors que l'animation seule en fait quelques
dizaines de Ko : réembarquer le personnage à chaque nouvelle animation
gaspillerait la bande passante des apprenants. Le squelette étant identique
d'un export à l'autre, three.js peut rejouer ces clips sur le modèle déjà
chargé.

Usage :
    python3 tools/extract-animation.py entree.glb sortie.glb
"""
import json
import struct
import sys
import os


def read_glb(path):
    data = open(path, 'rb').read()
    magic, version, _ = struct.unpack('<III', data[:12])
    if magic != 0x46546C67:
        raise SystemExit(f"{path} n'est pas un fichier GLB")
    gltf, buf = None, b''
    off = 12
    while off < len(data):
        clen, ctype = struct.unpack('<II', data[off:off + 8])
        chunk = data[off + 8:off + 8 + clen]
        tag = ctype.to_bytes(4, 'little')
        if tag == b'JSON':
            gltf = json.loads(chunk.decode('utf-8'))
        elif tag == b'BIN\x00':
            buf = chunk
        off += 8 + clen
    return gltf, buf


def write_glb(path, gltf, buf):
    js = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    js += b' ' * ((4 - len(js) % 4) % 4)          # padding 4 octets
    buf += b'\x00' * ((4 - len(buf) % 4) % 4)
    total = 12 + 8 + len(js) + (8 + len(buf) if buf else 0)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(js), 0x4E4F534A)); f.write(js)
        if buf:
            f.write(struct.pack('<II', len(buf), 0x004E4942)); f.write(buf)


def extract(src, dst):
    g, buf = read_glb(src)
    anims = g.get('animations') or []
    if not anims:
        raise SystemExit(f"{src} ne contient aucune animation")

    # 1. accessors réellement utilisés par les échantillonneurs d'animation
    used_acc = []
    for a in anims:
        for s in a['samplers']:
            used_acc += [s['input'], s['output']]
    used_acc = sorted(set(used_acc))
    acc_map = {old: new for new, old in enumerate(used_acc)}

    # 2. bufferViews correspondantes, recopiées bout à bout
    new_views, new_acc, blob = [], [], bytearray()
    for old in used_acc:
        acc = dict(g['accessors'][old])
        bv = g['bufferViews'][acc['bufferView']]
        start = bv.get('byteOffset', 0)
        chunk = buf[start:start + bv['byteLength']]
        while len(blob) % 4:
            blob.append(0)
        acc['bufferView'] = len(new_views)
        new_views.append({'buffer': 0, 'byteOffset': len(blob), 'byteLength': len(chunk)})
        acc.pop('byteOffset', None)
        blob += chunk
        new_acc.append(acc)

    # 3. nœuds ciblés par les animations, plus leurs ancêtres (la hiérarchie
    #    doit rester cohérente pour que three.js résolve les chemins)
    parent = {}
    for i, n in enumerate(g['nodes']):
        for c in n.get('children', []):
            parent[c] = i
    keep = set()
    for a in anims:
        for ch in a['channels']:
            n = ch['target'].get('node')
            while n is not None and n not in keep:
                keep.add(n)
                n = parent.get(n)
    keep = sorted(keep)
    node_map = {old: new for new, old in enumerate(keep)}

    new_nodes = []
    for old in keep:
        n = dict(g['nodes'][old])
        n.pop('mesh', None); n.pop('skin', None); n.pop('camera', None)
        kids = [node_map[c] for c in n.get('children', []) if c in node_map]
        if kids:
            n['children'] = kids
        else:
            n.pop('children', None)
        new_nodes.append(n)

    new_anims = []
    for a in anims:
        na = {'name': a.get('name', 'clip'),
              'samplers': [{'input': acc_map[s['input']],
                            'output': acc_map[s['output']],
                            'interpolation': s.get('interpolation', 'LINEAR')} for s in a['samplers']],
              'channels': [{'sampler': ch['sampler'],
                            'target': {'node': node_map[ch['target']['node']],
                                       'path': ch['target']['path']}}
                           for ch in a['channels'] if ch['target'].get('node') in node_map]}
        new_anims.append(na)

    roots = [node_map[i] for i in keep if parent.get(i) not in keep and parent.get(i) is not None or i not in parent]
    out = {
        'asset': {'version': '2.0', 'generator': 'Talk & Shine — extract-animation'},
        'scene': 0,
        'scenes': [{'nodes': sorted(set(roots))}],
        'nodes': new_nodes,
        'accessors': new_acc,
        'bufferViews': new_views,
        'buffers': [{'byteLength': len(blob)}],
        'animations': new_anims,
    }
    write_glb(dst, out, bytes(blob))

    a_kb, b_kb = os.path.getsize(src) / 1024, os.path.getsize(dst) / 1024
    print(f"{os.path.basename(src)} {a_kb:.0f} Ko → {os.path.basename(dst)} {b_kb:.0f} Ko "
          f"({100 - b_kb / a_kb * 100:.1f} % de moins)")
    print("  clips :", ", ".join(a['name'] for a in new_anims))
    print("  nœuds conservés :", len(new_nodes))


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    extract(sys.argv[1], sys.argv[2])
