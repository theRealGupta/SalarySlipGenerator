/* Salary calculation: formulas live here */

// Read the formula settings from the form
function cfg() {
  return {
    pB: +$('pBasic').value || 0,   // Basic % of monthly CTC
    pH: +$('pHra').value || 0,     // HRA % of Basic
    pPf: +$('pPf').value || 0,     // PF % of Basic
    cap: +$('pfCap').value || 0,   // PF wage cap per month (0 = none)
    pt: +$('pt').value || 0,       // Professional tax per month
    tds: $('tds').value,           // 'new' | 'manual' | 'none'
    tdsM: +$('tdsM').value || 0
  };
}

// New-regime slabs, 4% cess, rebate up to 12L taxable income. Estimate only.
function annualTax(taxable) {
  const slabs = [[400000, 0], [800000, .05], [1200000, .10], [1600000, .15], [2000000, .20], [2400000, .25], [Infinity, .30]];
  let t = 0, prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxable > prev) t += (Math.min(taxable, limit) - prev) * rate;
    prev = limit;
  }
  if (taxable <= 1200000) t = 0;
  else t = Math.min(t, taxable - 1200000);   // marginal relief
  return t * 1.04;
}

// Days in a YYYY-MM month (defaults to 30 if invalid)
function monthDays(ym) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(ym || ''));
  if (!m) return 30;
  return new Date(+m[1], +m[2], 0).getDate();
}

// Monthly breakup for an annual CTC (rounded per component so displayed rows sum exactly)
function calc(ctc, month, lopDays = 0) {
  const c = cfg();
  const totalDays = monthDays(month);
  const lop = Math.min(totalDays, Math.max(0, Number(lopDays) || 0));
  const paidDays = totalDays - lop;
  const factor = totalDays > 0 ? paidDays / totalDays : 1;

  const m = (ctc / 12) * factor;
  const basic = Math.round(m * c.pB / 100);
  const hra = Math.round(basic * c.pH / 100);
  const pfBase = c.cap > 0 ? Math.min(basic, c.cap * factor) : basic;
  const pf = Math.round(pfBase * c.pPf / 100);
  const special = Math.max(0, Math.round(m) - basic - hra - pf);

  const amt = x => Math.round(x.t === 'p' ? basic * x.v / 100 : x.v * factor);
  const xe = extraE.map(x => [E(x.label || 'Other earning'), amt(x)]);
  const xd = extraD.map(x => [E(x.label || 'Other deduction'), amt(x)]);
  const sum = a => a.reduce((s, x) => s + x[1], 0);

  const gross = basic + hra + special + sum(xe);
  let tds = 0;
  if (c.tds === 'new') tds = Math.round(annualTax(Math.max(0, gross * 12 - 75000)) / 12);
  else if (c.tds === 'manual') tds = Math.round(c.tdsM);

  const pt = Math.round(c.pt);
  const ded = pf + pt + tds + sum(xd);
  return { m, totalDays, paidDays, lop, basic, hra, special, gross, pf, pt, tds, ded, net: gross - ded, xe, xd };
}
