/* =========================================================
   Talk & Shine — comptes vérifiés côté serveur
   ---------------------------------------------------------
   Jusqu'ici les comptes vivaient dans le navigateur : personne ne
   pouvait prouver qui il était, donc ni messagerie, ni classes, ni
   accès réservé. Cette fonction donne une identité vérifiable.

   • mot de passe : scrypt (sel aléatoire, comparaison à durée constante)
   • session : jeton signé HMAC-SHA256, dans un cookie httpOnly
   • stockage : Netlify Blobs, en cohérence forte — un compte créé est
     immédiatement lisible pour la connexion qui suit
   • la progression suit l'élève d'un appareil à l'autre

   Points d'entrée :
     POST /api/auth/signup   {email, password, name}
     POST /api/auth/login    {email, password}
     POST /api/auth/logout
     GET  /api/auth/me
     GET  /api/auth/sync     → progression enregistrée
     POST /api/auth/sync     → enregistre la progression
   ========================================================= */
import { getStore } from '@netlify/blobs';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { signToken, readToken, readCookie, cookieHeader, sessionSecret } from '../lib/session.mjs';

const SESSION_DAYS = 30;
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };
const MAX_LOGIN_FAILURES = 8;
const LOCKOUT_MS = 15 * 60 * 1000;

/* ---------- utilitaires ---------- */
function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p },
      (err, key) => (err ? reject(err) : resolve(key)));
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt);
  return { alg: 'scrypt', N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, salt: salt.toString('hex'), hash: key.toString('hex') };
}

async function verifyPassword(password, rec) {
  if (!rec || !rec.hash || !rec.salt) return false;
  const key = await scryptAsync(password, Buffer.from(rec.salt, 'hex'));
  const stored = Buffer.from(rec.hash, 'hex');
  if (stored.length !== key.length) return false;
  return timingSafeEqual(stored, key);
}

/* ---------- stockage ---------- */
function store(name) {
  // Point d'injection réservé aux tests : permet d'exercer tout le
  // parcours (inscription, connexion, blocage, synchronisation) sans
  // déployer. Jamais défini en production.
  if (globalThis.__TS_TEST_STORE__) return globalThis.__TS_TEST_STORE__(name);
  // Cohérence forte : une inscription doit être lisible par la connexion
  // qui suit immédiatement, sans attendre la propagation.
  return getStore({ name, consistency: 'strong' });
}

const userKey = (email) => `u:${email}`;
const progKey = (email) => `p:${email}`;

function normalizeEmail(v) {
  return String(v || '').trim().toLowerCase();
}
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v) && v.length <= 160;
}

/* Ce que le navigateur a le droit de connaître d'un compte. */
function publicUser(u) {
  return { email: u.email, name: u.name, role: u.role || 'student', level: u.level || '', createdAt: u.createdAt };
}

/* =========================================================
   Point d'entrée
   ========================================================= */
export default async (req, context) => {
  const key = sessionSecret();
  if (!key) {
    return json({
      error: 'not_configured',
      message: "La variable SESSION_SECRET n'est pas définie sur ce déploiement. Les comptes en ligne sont désactivés."
    }, 503);
  }

  const action = new URL(req.url).pathname.split('/').filter(Boolean).pop();
  const users = store('ts-users');

  /* ---- qui suis-je ---- */
  if (action === 'me') {
    const payload = readToken(readCookie(req, 'ts_session'), key);
    if (!payload) return json({ error: 'not_signed_in' }, 401);
    const u = await users.get(userKey(payload.sub), { type: 'json' });
    if (!u || (u.tokenVersion || 0) !== (payload.tv || 0)) return json({ error: 'not_signed_in' }, 401);
    return json({ user: publicUser(u) });
  }

  /* ---- progression, dans les deux sens ---- */
  if (action === 'sync') {
    const payload = readToken(readCookie(req, 'ts_session'), key);
    if (!payload) return json({ error: 'not_signed_in' }, 401);
    const progress = store('ts-progress');

    if (req.method === 'GET') {
      const data = await progress.get(progKey(payload.sub), { type: 'json' });
      return json({ progress: data || null });
    }
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (!body) return json({ error: 'bad_request' }, 400);
      // On ne stocke que les champs pédagogiques attendus.
      const clean = {
        level: String(body.level || '').slice(0, 4),
        progress: body.progress && typeof body.progress === 'object' ? body.progress : {},
        devoirs: body.devoirs && typeof body.devoirs === 'object' ? body.devoirs : {},
        compos: body.compos && typeof body.compos === 'object' ? body.compos : {},
        finals: body.finals && typeof body.finals === 'object' ? body.finals : {},
        granted: body.granted && typeof body.granted === 'object' ? body.granted : {},
        lastModule: String(body.lastModule || '').slice(0, 40),
        updatedAt: Date.now()
      };
      await progress.setJSON(progKey(payload.sub), clean);
      // Le niveau reste aussi sur la fiche du compte, pour le professeur.
      const u = await users.get(userKey(payload.sub), { type: 'json' });
      if (u && clean.level && u.level !== clean.level) {
        u.level = clean.level;
        await users.setJSON(userKey(payload.sub), u);
      }
      return json({ saved: true, updatedAt: clean.updatedAt });
    }
    return json({ error: 'method_not_allowed' }, 405);
  }

  /* ---- déconnexion ---- */
  if (action === 'logout') {
    return json({ ok: true }, 200, { 'set-cookie': cookieHeader('', 0) });
  }

  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const body = await readBody(req);
  if (!body) return json({ error: 'bad_request' }, 400);

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!validEmail(email)) return json({ error: 'bad_email', message: 'Adresse email invalide.' }, 400);
  if (password.length < 8) {
    return json({ error: 'weak_password', message: 'Le mot de passe doit contenir au moins 8 caractères.' }, 400);
  }
  if (password.length > 200) return json({ error: 'bad_request' }, 400);

  /* ---- inscription ---- */
  if (action === 'signup') {
    const name = String(body.name || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 60);
    if (name.length < 2) return json({ error: 'bad_name', message: 'Indique ton nom.' }, 400);

    const existing = await users.get(userKey(email), { type: 'json' });
    if (existing) {
      return json({ error: 'email_taken', message: 'Un compte existe déjà avec cet email.' }, 409);
    }

    const user = {
      email, name,
      pw: await hashPassword(password),
      role: 'student',
      level: '',
      tokenVersion: 0,
      failures: 0,
      lockedUntil: 0,
      createdAt: Date.now()
    };
    await users.setJSON(userKey(email), user);

    const token = signToken({ sub: email, tv: 0, exp: Date.now() + SESSION_DAYS * 86400000 }, key);
    return json({ user: publicUser(user) }, 201,
      { 'set-cookie': cookieHeader(token, SESSION_DAYS * 86400) });
  }

  /* ---- connexion ---- */
  if (action === 'login') {
    const u = await users.get(userKey(email), { type: 'json' });

    if (u && u.lockedUntil && Date.now() < u.lockedUntil) {
      const min = Math.ceil((u.lockedUntil - Date.now()) / 60000);
      return json({ error: 'locked', message: `Trop de tentatives. Réessaie dans ${min} minute(s).` }, 429);
    }

    const ok = u ? await verifyPassword(password, u.pw) : false;

    if (!ok) {
      if (u) {
        u.failures = (u.failures || 0) + 1;
        if (u.failures >= MAX_LOGIN_FAILURES) {
          u.lockedUntil = Date.now() + LOCKOUT_MS;
          u.failures = 0;
        }
        await users.setJSON(userKey(email), u);
      }
      // Même réponse que le compte existe ou non : on n'aide pas à
      // découvrir quelles adresses sont inscrites.
      return json({ error: 'bad_credentials', message: 'Email ou mot de passe incorrect.' }, 401);
    }

    if (u.failures || u.lockedUntil) {
      u.failures = 0; u.lockedUntil = 0;
      await users.setJSON(userKey(email), u);
    }

    const token = signToken({ sub: email, tv: u.tokenVersion || 0, exp: Date.now() + SESSION_DAYS * 86400000 }, key);
    return json({ user: publicUser(u) }, 200,
      { 'set-cookie': cookieHeader(token, SESSION_DAYS * 86400) });
  }

  return json({ error: 'unknown_action' }, 404);
};

async function readBody(req) {
  try {
    const text = await req.text();
    if (!text || text.length > 200000) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const config = { path: '/api/auth/:action' };

