// Télécharge les voix et illustrations générées avec Higgsfield, puis écrit
// assets.json pour que le jeu les charge. Usage : node tools/fetch-assets.mjs
// (depuis le dossier tempete/). Les images sont converties en JPEG si ffmpeg
// est disponible, sinon gardées en PNG.
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'tools/higgsfield-assets.json'), 'utf8'));
mkdirSync(join(root, 'audio/vo'), { recursive: true });
mkdirSync(join(root, 'art'), { recursive: true });

async function get(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}
const hasFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

const out = { voices: [], art: {} };
for (const [id, url] of Object.entries(manifest.voices)) {
  const dest = join(root, 'audio/vo', `${id}.mp3`);
  try { if (!existsSync(dest)) await get(url, dest); out.voices.push(id); } catch (e) { console.warn('voix manquante', id, e.message); }
}
for (const [id, url] of Object.entries(manifest.art)) {
  const png = join(root, 'art', `${id}.png`), jpg = join(root, 'art', `${id}.jpg`);
  try {
    if (!existsSync(jpg) && !existsSync(png)) await get(url, png);
    if (hasFfmpeg && existsSync(png)) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', 'scale=1600:-2', '-q:v', '4', jpg]);
      unlinkSync(png);
    }
    out.art[id] = existsSync(jpg) ? `art/${id}.jpg` : `art/${id}.png`;
  } catch (e) { console.warn('image manquante', id, e.message); }
}
writeFileSync(join(root, 'assets.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`${out.voices.length} voix, ${Object.keys(out.art).length} images → assets.json`);
