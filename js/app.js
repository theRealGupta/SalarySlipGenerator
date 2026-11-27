/* Main: form <-> preview wiring. Loaded last. */

// Current form values as an employee object
function cur() {
  return {
    name: $('name').value, eid: $('eid').value, desig: $('desig').value, dept: $('dept').value,
    pan: $('pan').value, month: $('month').value, ctc: +$('ctc').value || 0, lop: +$('lop').value || 0
  };
}

// Put an employee's values into the form
function load(e) {
  ['name', 'eid', 'desig', 'dept', 'pan', 'month'].forEach(k => { if (e[k] !== undefined) $(k).value = e[k]; });
  $('ctc').value = e.ctc;
  $('lop').value = e.lop || 0;
}

// Enable Manual TDS input only when TDS mode is "manual"
function syncTdsState() {
  $('tdsM').disabled = $('tds').value !== 'manual';
}

// Redraw the slip preview and the employee list
function render() {
  const e = sel >= 0 ? emps[sel] : cur();
  $('prev').innerHTML = slipHTML(e);
  $('listTools').hidden = emps.length === 0;
  const q = ($('empSearch').value || '').trim().toLowerCase();
  $('list').innerHTML = emps
    .map((x, i) => ({ x, i }))
    .filter(({ x }) => !q || `${x.name} ${x.eid} ${x.dept}`.toLowerCase().includes(q))
    .map(({ x, i }) =>
      `<div class="emp ${i === sel ? 'on' : ''}" data-i="${i}"><span>${E(x.name)} (${E(x.eid)})</span><span>${inr(x.ctc)}</span></div>`)
    .join('');
}

// Live update when any form field changes
const EMP_FIELDS = ['name', 'eid', 'desig', 'dept', 'pan', 'month', 'ctc', 'lop'];
document.querySelectorAll('#left input, #left select').forEach(el => {
  if (el.type === 'file' || el.id === 'empSearch') return;
  el.addEventListener('input', () => {
    if (sel >= 0 && EMP_FIELDS.includes(el.id)) emps[sel] = cur();
    if (SETTING_IDS.includes(el.id)) saveSettings();
    if (el.id === 'tds') syncTdsState();
    render();
  });
});

// Filter bulk employee list
$('empSearch').addEventListener('input', render);

// Clear bulk employee list and return to single-form mode
$('clrList').onclick = () => {
  emps = [];
  sel = -1;
  $('file').value = '';
  $('empSearch').value = '';
  render();
};

// Reset saved company and formula settings
$('resetCfg').onclick = () => {
  resetSettings();
  syncTdsState();
  renderX();
  render();
};

// Click an employee in the list
$('list').addEventListener('click', ev => {
  const d = ev.target.closest('.emp');
  if (!d) return;
  sel = +d.dataset.i;
  load(emps[sel]);
  render();
});

// Print buttons (A4 rules are in css/print.css)
$('print').onclick = () => {
  document.body.classList.add('single');
  $('all').classList.remove('on');
  window.print();
};
$('printAll').onclick = () => {
  const list = emps.length ? emps : [cur()];
  $('all').innerHTML = list.map(slipHTML).join('');
  $('all').classList.add('on');
  document.body.classList.remove('single');
  window.print();
};

// Start
$('month').value = new Date().toISOString().slice(0, 7);
loadSettings();
syncTdsState();
renderX();
render();
