/* =========================================================
   Talk & Shine — fabrique de jetons éphémères Gemini Live
   ---------------------------------------------------------
   La clé GEMINI_API_KEY reste ici, côté serveur. Le navigateur
   ne reçoit qu'un jeton court, verrouillé sur un seul modèle.
   Elle n'est jamais journalisée, ni renvoyée, ni incluse dans
   un message d'erreur.
   ========================================================= */

const API_HOST = 'https://generativelanguage.googleapis.com';
// Les jetons éphémères ne sont servis que par une version précise de l'API.
// Modifiable sans redéployer le code : variable GEMINI_API_VERSION.
const API_VERSION = process.env.GEMINI_API_VERSION || 'v1alpha';
const MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview';

/* Durées de vie — volontairement courtes (§34 contrôle des coûts) */
const SESSION_START_WINDOW_MS = 60 * 1000;        // ouvrir la session : 1 min
const SESSION_MAX_MS = 10 * 60 * 1000;            // parler : 10 min maximum

/* Garde-fou anti-abus : mémoire de l'instance, best-effort.
   Netlify peut faire tourner plusieurs instances en parallèle, donc ce
   compteur limite les rafales, il ne remplace pas un vrai quota en base. */
const RATE_WINDOW_MS = 60 * 60 * 1000;            // fenêtre : 1 heure
const RATE_MAX = Number(process.env.GEMINI_TOKENS_PER_HOUR || 12);
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const fresh = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (fresh.length >= RATE_MAX) {
    hits.set(ip, fresh);
    return true;
  }
  fresh.push(now);
  hits.set(ip, fresh);
  if (hits.size > 5000) hits.clear();   // borne mémoire
  return false;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { allow: 'POST' }, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Message explicite pour l'exploitant, aucune fuite de secret.
    return json(503, {
      error: 'not_configured',
      message: "La variable GEMINI_API_KEY n'est pas définie sur ce déploiement. SHINE vocal reste indisponible."
    });
  }

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'inconnu';
  if (rateLimited(ip)) {
    return json(429, {
      error: 'rate_limited',
      message: `Limite atteinte : ${RATE_MAX} sessions vocales par heure. Réessaie plus tard.`
    });
  }

  /* Consigne pédagogique : construite ici, côté serveur, et verrouillée
     dans le jeton — le navigateur ne peut donc pas la détourner. */
  let profile = {};
  try { profile = JSON.parse(event.body || '{}'); } catch (_) { profile = {}; }
  const systemInstruction = buildInstruction(profile);

  const now = Date.now();
  const payload = {
    uses: 1,
    newSessionExpireTime: new Date(now + SESSION_START_WINDOW_MS).toISOString(),
    expireTime: new Date(now + SESSION_MAX_MS).toISOString(),
    liveConnectConstraints: {
      model: MODEL,
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    },
    lockAdditionalFields: []
  };

  let upstream;
  try {
    upstream = await fetch(`${API_HOST}/${API_VERSION}/auth_tokens`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    return json(502, { error: 'upstream_unreachable', message: "Impossible de joindre Gemini. Réessaie dans un instant." });
  }

  const raw = await upstream.text();
  if (!upstream.ok) {
    // On relaie le motif exact de Google (utile au diagnostic) sans jamais
    // renvoyer la clé, qui n'apparaît pas dans ces réponses.
    let reason = raw.slice(0, 400);
    try { reason = JSON.parse(raw).error?.message || reason; } catch (_) {}
    return json(upstream.status, {
      error: 'token_refused',
      apiVersion: API_VERSION,
      message: reason
    });
  }

  let data;
  try { data = JSON.parse(raw); } catch (_) {
    return json(502, { error: 'bad_upstream_response' });
  }

  // `name` porte le jeton éphémère ; c'est la seule valeur transmise au client.
  const token = data.name || data.token;
  if (!token) return json(502, { error: 'no_token_in_response' });

  return json(200, {
    token,
    model: MODEL,
    apiVersion: API_VERSION,
    expiresInMs: SESSION_MAX_MS,
    startWindowMs: SESSION_START_WINDOW_MS
  });
};

/* --------------------------------------------------------- */
function buildInstruction(profile) {
  const level = ['A1', 'A2', 'B1', 'B2', 'C1'].includes(profile.level) ? profile.level : 'A2';
  const name = String(profile.name || '').replace(/[^\p{L}\p{N} '-]/gu, '').slice(0, 40) || 'the learner';
  const topic = String(profile.topic || '').replace(/[\r\n]+/g, ' ').slice(0, 300);

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
