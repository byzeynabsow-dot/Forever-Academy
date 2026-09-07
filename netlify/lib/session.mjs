/* Session partagée entre les fonctions : jeton signé HMAC-SHA256 dans un
   cookie httpOnly. Aucun stockage — la signature suffit à prouver que le
   jeton vient de nous et n'a pas été modifié. */
import { timingSafeEqual, createHmac } from 'node:crypto';

export const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (str) =>
  Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

export function sessionSecret() {
  const s = Netlify.env.get('SESSION_SECRET');
  return (!s || s.length < 24) ? null : s;
}

export function signToken(payload, key) {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${b64url(createHmac('sha256', key).update(body).digest())}`;
}

export function readToken(token, key) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = b64url(createHmac('sha256', key).update(body).digest());
  const a = Buffer.from(sig || ''), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let payload;
  try { payload = JSON.parse(unb64url(body).toString('utf8')); } catch { return null; }
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

export function readCookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export function cookieHeader(token, maxAgeSeconds) {
  return [`ts_session=${token || ''}`, 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Strict',
          `Max-Age=${maxAgeSeconds}`].join('; ');
}

/* Renvoie l'email de l'utilisateur connecté, ou null. */
export function currentUser(req) {
  const key = sessionSecret();
  if (!key) return null;
  const payload = readToken(readCookie(req, 'ts_session'), key);
  return payload ? payload.sub : null;
}
