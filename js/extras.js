/* Manual extra earnings / deductions */
function renderX() {
  [['xe', extraE], ['xd', extraD]].forEach(([id, arr]) => {
    $(id).innerHTML = arr.map((x, i) => `<div class="xr" data-i="${i}">
      <input class="xl" placeholder="Label" value="${E(x.label)}">
      <select class="xt"><option value="f"${x.t === 'f' ? ' selected' : ''}>₹</option><option value="p"${x.t === 'p' ? ' selected' : ''}>% Basic</option></select>
      <input class="xv" type="number" value="${x.v}">
      <button class="ghost xdel" aria-label="Remove">×</button></div>`).join('');
  });
}

['xe', 'xd'].forEach(id => {
  const list = () => id === 'xe' ? extraE : extraD;
  $(id).addEventListener('input', ev => {
    const row = ev.target.closest('.xr');
    if (!row) return;
    const x = list()[+row.dataset.i];
    if (ev.target.classList.contains('xl')) x.label = ev.target.value;
    else if (ev.target.classList.contains('xt')) x.t = ev.target.value;
    else x.v = +ev.target.value || 0;
    saveSettings();
    render();
  });
  $(id).addEventListener('click', ev => {
    if (!ev.target.classList.contains('xdel')) return;
    list().splice(+ev.target.closest('.xr').dataset.i, 1);
    saveSettings();
    renderX();
    render();
  });
});

$('addE').onclick = () => { extraE.push({ label: '', t: 'f', v: 0 }); saveSettings(); renderX(); };
$('addD').onclick = () => { extraD.push({ label: '', t: 'f', v: 0 }); saveSettings(); renderX(); };
