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

// Monthly breakup for an annual CTC
function calc(ctc) {
  const c = cfg(), m = ctc / 12;
  const basic = m * c.pB / 100;
  const hra = basic * c.pH / 100;
  const pfBase = c.cap > 0 ? Math.min(basic, c.cap) : basic;
  const pf = pfBase * c.pPf / 100;
  const special = Math.max(0, m - basic - hra - pf);

  const amt = x => x.t === 'p' ? basic * x.v / 100 : x.v;
  const xe = extraE.map(x => [E(x.label || 'Other earning'), amt(x)]);
  const xd = extraD.map(x => [E(x.label || 'Other deduction'), amt(x)]);
  const sum = a => a.reduce((s, x) => s + x[1], 0);

  const gross = basic + hra + special + sum(xe);
  let tds = 0;
  if (c.tds === 'new') tds = annualTax(Math.max(0, gross * 12 - 75000)) / 12;
  else if (c.tds === 'manual') tds = c.tdsM;

  const ded = pf + c.pt + tds + sum(xd);
  return { m, basic, hra, special, gross, pf, pt: c.pt, tds, ded, net: gross - ded, xe, xd };
}
