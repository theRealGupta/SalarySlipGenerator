/* Excel: upload employees, download template, export summary */
const normKey = s => String(s).toLowerCase().replace(/[^a-z]/g, '');

$('file').addEventListener('change', async ev => {
  const f = ev.target.files[0];
  if (!f) return;
  try {
    const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
    const out = rows.map(r => {
      const o = {};
      for (const k in r) o[normKey(k)] = r[k];
      let mo = o.month || o.paymonth || $('month').value;
      if (typeof mo === 'number') mo = new Date(Math.round((mo - 25569) * 864e5)).toISOString().slice(0, 7);
      return {
        name: o.name || o.employeename || '',
        eid: o.employeeid || o.empid || o.id || '',
        desig: o.designation || '',
        dept: o.department || '',
        pan: o.pan || '',
        month: String(mo).slice(0, 7),
        ctc: Number(String(o.ctc || o.annualctc || 0).replace(/,/g, '')) || 0
      };
    }).filter(x => x.name || x.eid);

    if (!out.length) { alert('No rows found. Check the column names: Name, Employee ID, CTC.'); return; }
    emps = out; sel = 0; load(emps[0]); render();
  } catch (err) {
    alert('Could not read this file. Use .xlsx, .xls or .csv.');
  }
});

$('tpl').onclick = () => {
  const ws = XLSX.utils.json_to_sheet([{ Name: 'Rahul Sharma', 'Employee ID': 'EMP001', Designation: 'Software Engineer', Department: 'Engineering', CTC: 1200000, Month: '2026-11', PAN: 'ABCDE1234F' }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Employees');
  XLSX.writeFile(wb, 'salary-template.xlsx');
};

$('exp').onclick = () => {
  const list = emps.length ? emps : [cur()];
  const sum = a => a.reduce((s, x) => s + x[1], 0);
  const ws = XLSX.utils.json_to_sheet(list.map(e => {
    const r = calc(e.ctc);
    return {
      Name: e.name, 'Employee ID': e.eid, Month: e.month, 'Annual CTC': e.ctc,
      Basic: Math.round(r.basic), HRA: Math.round(r.hra), 'Special allowance': Math.round(r.special),
      'Extra earnings': Math.round(sum(r.xe)), Gross: Math.round(r.gross),
      PF: Math.round(r.pf), 'Professional tax': r.pt, TDS: Math.round(r.tds),
      'Extra deductions': Math.round(sum(r.xd)), 'Net pay': Math.round(r.net)
    };
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Summary');
  XLSX.writeFile(wb, 'salary-summary.xlsx');
};
