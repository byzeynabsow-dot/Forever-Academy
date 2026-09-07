/* =========================================================
   Talk & Shine — fabrique de jetons éphémères Gemini Live
   ---------------------------------------------------------
   La clé GEMINI_API_KEY reste ici, côté serveur. Le navigateur
   ne reçoit qu'un jeton court, verrouillé sur un seul modèle.
   Elle n'est jamais journalisée, ni renvoyée, ni incluse dans
   un message d'erreur.
   ========================================================= */

const API_HOST = 'https://generativelanguage.googleapis.com';

/* Durées de vie volontairement courtes (contrôle des coûts) */
const SESSION_START_WINDOW_MS = 60 * 1000;   // ouvrir la session : 1 min
const SESSION_MAX_MS = 10 * 60 * 1000;       // parler : 10 min au plus

/* Garde-fou anti-abus, en mémoire de l'instance. Netlify peut lancer
   plusieurs instances en parallèle : cela limite les rafales, ce n'est
   pas un quota comptable. */
let hits;
function rateLimited(ip, max) {
  if (!hits) hits = new Map();
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const fresh = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (fresh.length >= max) { hits.set(ip, fresh); return true; }
  fresh.push(now);
  hits.set(ip, fresh);
  if (hits.size > 5000) hits.clear();
  return false;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const apiKey = Netlify.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return json({
      error: 'not_configured',
      message: "La variable GEMINI_API_KEY n'est pas définie sur ce déploiement. SHINE vocal reste indisponible."
    }, 503);
  }

  const model = Netlify.env.get('GEMINI_LIVE_MODEL') || 'gemini-3.1-flash-live-preview';
  const apiVersion = Netlify.env.get('GEMINI_API_VERSION') || 'v1alpha';
  const maxPerHour = Number(Netlify.env.get('GEMINI_TOKENS_PER_HOUR') || 12);

  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || 'inconnu';
  if (rateLimited(ip, maxPerHour)) {
    return json({
      error: 'rate_limited',
      message: `Limite atteinte : ${maxPerHour} sessions vocales par heure. Réessaie plus tard.`
    }, 429);
  }

  /* La consigne pédagogique est construite ici, côté serveur, puis
     verrouillée dans le jeton : le navigateur ne peut pas la détourner. */
  let profile = {};
  try { profile = await req.json(); } catch { profile = {}; }

  const now = Date.now();
  const payload = {
    uses: 1,
    newSessionExpireTime: new Date(now + SESSION_START_WINDOW_MS).toISOString(),
    expireTime: new Date(now + SESSION_MAX_MS).toISOString(),
    liveConnectConstraints: {
      model,
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: buildInstruction(profile) }] },
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    },
    lockAdditionalFields: []
  };

  let upstream;
  try {
    upstream = await fetch(`${API_HOST}/${apiVersion}/auth_tokens`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(payload)
    });
  } catch {
    return json({ error: 'upstream_unreachable', message: "Impossible de joindre Gemini. Réessaie dans un instant." }, 502);
  }

  const raw = await upstream.text();
  if (!upstream.ok) {
    /* On relaie le motif exact de Google — précieux au premier essai —
       sans jamais renvoyer la clé, absente de ces réponses. */
    let reason = raw.slice(0, 400);
    try { reason = JSON.parse(raw)?.error?.message || reason; } catch {}
    return json({ error: 'token_refused', apiVersion, model, message: reason }, upstream.status);
  }

  let data;
  try { data = JSON.parse(raw); } catch {
    return json({ error: 'bad_upstream_response' }, 502);
  }

  const token = data.name || data.token;
  if (!token) return json({ error: 'no_token_in_response' }, 502);

  return json({
    token,
    model,
    apiVersion,
    expiresInMs: SESSION_MAX_MS,
    startWindowMs: SESSION_START_WINDOW_MS
  });
};

export const config = { path: '/api/token' };

/* --------------------------------------------------------- */
function buildInstruction(profile) {
  const level = ['A1', 'A2', 'B1', 'B2', 'C1'].includes(profile?.level) ? profile.level : 'A2';
  const name = String(profile?.name || '').replace(/[^\p{L}\p{N} '-]/gu, '').slice(0, 40) || 'the learner';
  const topic = String(profile?.topic || '').replace(/[\r\n]+/g, ' ').slice(0, 300);

  const pace = {
    A1: "Speak very slowly and simply. Use short present-tense sentences and the 500 most common words. Ask one short question at a time. Expect one- or two-word answers and celebrate them.",
    A2: "Speak slowly and clearly. Use everyday vocabulary and simple past and future. Ask short questions and help the learner extend answers to a full sentence.",
    B1: "Speak at a natural but unhurried pace. Encourage full sentences, opinions and reasons. Introduce useful connectors and phrasal verbs.",
    B2: "Speak at natural pace. Push for nuance, hypotheticals and argument. Correct register and collocation errors, not just grammar.",
    C1: "Speak at full natural pace, including idiom and understatement. Challenge precision, register and structure. Corrections should be about style and subtlety."
  }[level];

  return [
    "You are SHINE, the English teacher of the Talk & Shine academy.",
    `You are speaking with ${name}, a French-speaking learner at CEFR level ${level}.`,
    pace,
    topic ? `Today's focus, taken from the lesson the learner has open: ${topic}` : "Start by asking what the learner would like to practise today.",
    "",
    "How you correct, in this exact order:",
    "1. Let the learner finish their sentence. Never interrupt to correct.",
    "2. React to the meaning first, warmly and briefly.",
    "3. Name one error only — the one that matters most.",
    "4. Give the correct form and say why in one short sentence.",
    "5. Ask the learner to say the corrected sentence back to you.",
    "",
    "Rules you never break:",
    "- Never mock, never say the learner is bad. Encourage every attempt.",
    "- Speak English by default. Switch to French only to unblock a genuine misunderstanding, then return to English.",
    "- Keep your turns short: two or three sentences, then hand the floor back.",
    "- Never claim to score or measure pronunciation numerically. Give qualitative feedback in words.",
    "- You are SHINE from Talk & Shine. Never mention Google, Gemini, or that you are a language model."
  ].join('\n');
}
