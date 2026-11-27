/* App state (shared across scripts) */
let emps = [];      // employees loaded from Excel
let sel = -1;       // selected employee index, -1 = use the form
let extraE = [];    // extra earnings:   { label, t: 'f' | 'p', v }
let extraD = [];    // extra deductions: { label, t: 'f' | 'p', v }
let logo = '';      // company logo as data URL
let sig = '';       // authorised signature as data URL

const STORAGE_KEY = 'ssg_settings_v1';
const SETTING_IDS = ['company', 'pBasic', 'pHra', 'pPf', 'pfCap', 'pt', 'tds', 'tdsM'];
const DEFAULTS = { company: 'Your Company Pvt. Ltd.', pBasic: 40, pHra: 50, pPf: 12, pfCap: 15000, pt: 200, tds: 'new', tdsM: 0 };

// Persist company info, formulas, extras, and images in localStorage
function saveSettings() {
  try {
    const fields = {};
    SETTING_IDS.forEach(id => { fields[id] = $(id).value; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fields, extraE, extraD, logo, sig }));
  } catch (_) {
    // Ignore storage quota or private-mode errors
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.fields) {
      SETTING_IDS.forEach(id => { if (data.fields[id] !== undefined) $(id).value = data.fields[id]; });
    }
    if (Array.isArray(data.extraE)) extraE = data.extraE;
    if (Array.isArray(data.extraD)) extraD = data.extraD;
    if (typeof data.logo === 'string') logo = data.logo;
    if (typeof data.sig === 'string') sig = data.sig;
  } catch (_) {
    // Ignore malformed saved state
  }
}

function resetSettings() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) { }
  SETTING_IDS.forEach(id => { $(id).value = DEFAULTS[id]; });
  extraE = [];
  extraD = [];
  logo = '';
  sig = '';
  $('logoF').value = '';
  $('sigF').value = '';
}

const STORAGE_KEY = 'ssg_settings_v1';
const SETTING_IDS = ['company', 'pBasic', 'pHra', 'pPf', 'pfCap', 'pt', 'tds', 'tdsM'];
const DEFAULTS = { company: 'Your Company Pvt. Ltd.', pBasic: 40, pHra: 50, pPf: 12, pfCap: 15000, pt: 200, tds: 'new', tdsM: 0 };

// Persist company info, formulas, extras, and images in localStorage
function saveSettings() {
  try {
    const fields = {};
    SETTING_IDS.forEach(id => { fields[id] = $(id).value; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fields, extraE, extraD, logo, sig }));
  } catch (_) {
    // Ignore storage quota or private-mode errors
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.fields) {
      SETTING_IDS.forEach(id => { if (data.fields[id] !== undefined) $(id).value = data.fields[id]; });
    }
    if (Array.isArray(data.extraE)) extraE = data.extraE;
    if (Array.isArray(data.extraD)) extraD = data.extraD;
    if (typeof data.logo === 'string') logo = data.logo;
    if (typeof data.sig === 'string') sig = data.sig;
  } catch (_) {
    // Ignore malformed saved state
  }
}

function resetSettings() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  SETTING_IDS.forEach(id => { $(id).value = DEFAULTS[id]; });
  extraE = [];
  extraD = [];
  logo = '';
  sig = '';
  $('logoF').value = '';
  $('sigF').value = '';
}
