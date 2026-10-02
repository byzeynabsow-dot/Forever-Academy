// Paramètres du joueur, gardés dans le navigateur quand c'est possible.
const KEY = 'tempete.settings.v1';

export const DEFAULTS = {
  assist: 'assiste',   // 'libre' | 'assiste' | 'fort'
  sensitivity: 1,      // multiplicateur de la vitesse de visée
  invertY: false,
  volume: 0.8,
  voice: 1,
  subtitles: true,
  quality: 'haute',    // 'haute' | 'basse'
};

export const settings = { ...DEFAULTS };

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) Object.assign(settings, DEFAULTS, JSON.parse(raw));
  } catch { /* stockage indisponible : valeurs par défaut */ }
  return settings;
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* ignoré */ }
}

/* Relie le formulaire #settingsForm aux paramètres ; onChange reçoit la clé modifiée. */
export function bindSettingsForm(form, onChange) {
  const sync = () => {
    form.querySelectorAll('[name="assist"]').forEach((r) => { r.checked = r.value === settings.assist; });
    form.sensitivity.value = settings.sensitivity;
    form.invertY.checked = settings.invertY;
    form.volume.value = settings.volume;
    form.voice.value = settings.voice;
    form.subtitles.checked = settings.subtitles;
    form.querySelectorAll('[name="quality"]').forEach((r) => { r.checked = r.value === settings.quality; });
    form.querySelector('#sensOut').textContent = `${Number(settings.sensitivity).toFixed(1)}×`;
  };
  form.addEventListener('input', (e) => {
    const el = e.target;
    const key = el.name;
    if (!(key in settings)) return;
    if (el.type === 'checkbox') settings[key] = el.checked;
    else if (el.type === 'range') settings[key] = Number(el.value);
    else settings[key] = el.value;
    save();
    sync();
    onChange?.(key);
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  form.querySelector('#resetSettings')?.addEventListener('click', () => {
    Object.assign(settings, DEFAULTS);
    save(); sync();
    Object.keys(DEFAULTS).forEach((k) => onChange?.(k));
  });
  sync();
}
