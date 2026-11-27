/* Builds the HTML of one A4 salary slip */
function slipHTML(e) {
  const r = calc(e.ctc);
  const d = new Date(e.month + '-01');
  const mo = isNaN(d) ? '' : d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const earn = [['Basic salary', r.basic], ['House rent allowance', r.hra], ['Special allowance', r.special]].concat(r.xe);
  const ded = [['Provident fund', r.pf], ['Professional tax', r.pt], ['Income tax (TDS)', r.tds]].concat(r.xd);

  const n = Math.max(earn.length, ded.length);
  let rows = '';
  for (let i = 0; i < n; i++) {
    const a = earn[i], b = ded[i];
    rows += `<tr><td>${a ? a[0] : ''}</td><td class="n">${a ? inr(a[1]) : ''}</td><td>${b ? b[0] : ''}</td><td class="n">${b ? inr(b[1]) : ''}</td></tr>`;
  }

  return `<div class="slip">
  <div class="head">${logo ? `<img src="${logo}" alt="Company logo">` : ''}
    <div><h3>${E($('company').value)}</h3><div class="sub">Salary slip for ${mo}</div></div></div>
  <div class="info">
    <div>Name: <b>${E(e.name)}</b></div><div>Employee ID: <b>${E(e.eid)}</b></div>
    <div>Designation: ${E(e.desig)}</div><div>Department: ${E(e.dept)}</div>
    <div>PAN: ${E(e.pan)}</div><div>Annual CTC: ${inr(e.ctc)}</div>
  </div>
  <table>
    <tr><th>Earnings</th><th class="n">Amount</th><th>Deductions</th><th class="n">Amount</th></tr>
    ${rows}
    <tr><th>Gross earnings</th><th class="n">${inr(r.gross)}</th><th>Total deductions</th><th class="n">${inr(r.ded)}</th></tr>
  </table>
  <div class="net"><span>Net pay</span><span>${inr(r.net)}</span></div>
  <p class="note">Employer PF contribution (part of CTC): ${inr(r.pf)}. This is a computer-generated slip.</p>
  <div class="sign"><span>Employee signature</span>
    <span class="auth">${sig ? `<img src="${sig}" alt="Signature">` : ''}Authorised signatory</span></div>
</div>`;
}
