/* Main: form <-> preview wiring. Loaded last. */

// Current form values as an employee object
function cur() {
  return {
    name: $('name').value, eid: $('eid').value, desig: $('desig').value, dept: $('dept').value,
    pan: $('pan').value, month: $('month').value, ctc: +$('ctc').value || 0
  };
}

// Put an employee's values into the form
function load(e) {
  ['name', 'eid', 'desig', 'dept', 'pan', 'month'].forEach(k => { if (e[k] !== undefined) $(k).value = e[k]; });
  $('ctc').value = e.ctc;
}

// Redraw the slip preview and the employee list
function render() {
  const e = sel >= 0 ? emps[sel] : cur();
  $('prev').innerHTML = slipHTML(e);
  $('list').innerHTML = emps.map((x, i) =>
    `<div class="emp ${i === sel ? 'on' : ''}" data-i="${i}"><span>${E(x.name)} (${E(x.eid)})</span><span>${inr(x.ctc)}</span></div>`).join('');
}

// Live update when any form field changes
const EMP_FIELDS = ['name', 'eid', 'desig', 'dept', 'pan', 'month', 'ctc'];
document.querySelectorAll('#left input, #left select').forEach(el => {
  if (el.type === 'file') return;
  el.addEventListener('input', () => {
    if (sel >= 0 && EMP_FIELDS.includes(el.id)) emps[sel] = cur();
    render();
  });
});

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
render();
