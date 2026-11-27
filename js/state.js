/* App state (shared across scripts) */
let emps = [];      // employees loaded from Excel
let sel = -1;       // selected employee index, -1 = use the form
let extraE = [];    // extra earnings:   { label, t: 'f' | 'p', v }
let extraD = [];    // extra deductions: { label, t: 'f' | 'p', v }
let logo = '';      // company logo as data URL
let sig = '';       // authorised signature as data URL
