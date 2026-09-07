# -*- coding: utf-8 -*-
"""
Refuse de laisser partir une clé en production.

Vérifie deux choses avant chaque livraison :
  1. aucune clé Google (AIza… ou AQ.…) n'apparaît dans les fichiers suivis ;
  2. geminiApiKey est bien vide dans js/config.js — sinon la clé serait
     lisible par tous les visiteurs du site.

Sortie 1 en cas de problème : utilisable tel quel dans une CI.
"""
import re
import subprocess
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
KEY_PATTERNS = [
    (re.compile(r'AIza[0-9A-Za-z_\-]{30,}'), 'clé Google au format AIza'),
    (re.compile(r'\bAQ\.[A-Za-z0-9_\-]{20,}'), 'jeton Google au format AQ.'),
]

def tracked_files():
    out = subprocess.run(['git', 'ls-files'], cwd=ROOT, capture_output=True, text=True)
    return [ROOT / f for f in out.stdout.splitlines() if f]

def main():
    problems = []

    for path in tracked_files():
        if not path.is_file() or path.suffix in {'.mp4', '.glb', '.jpg', '.png', '.zip'}:
            continue
        try:
            text = path.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        for pattern, label in KEY_PATTERNS:
            if pattern.search(text):
                problems.append(f"{path.relative_to(ROOT)} : {label} détectée")

    cfg = ROOT / 'js' / 'config.js'
    if cfg.exists():
        m = re.search(r"geminiApiKey:\s*'([^']*)'", cfg.read_text(encoding='utf-8'))
        if m and m.group(1).strip():
            problems.append(
                "js/config.js : geminiApiKey est renseignée. En ligne, cette clé serait "
                "lisible par tous les visiteurs. Videz-la et utilisez /api/token."
            )

    if problems:
        print("Contrôle de sécurité : ÉCHEC\n")
        for p in problems:
            print("  ✗", p)
        print("\nAucune clé ne doit être livrée dans les fichiers du site.")
        return 1

    print("Contrôle de sécurité : aucune clé dans les fichiers livrés ✓")
    return 0

if __name__ == '__main__':
    sys.exit(main())
