# Salary Slip Generator

Browser-based salary slip tool. Enter a CTC, get the monthly breakup, and print A4 slips.
No build step, no server. Open `index.html` in a browser.

## Folder structure

```
salary-slip-generator/
├── index.html          Page layout (form on the left, A4 preview on the right)
├── css/
│   ├── style.css       Screen styles, theme colours, slip design
│   └── print.css       A4 print rules (one slip per page)
├── js/                 Plain scripts, loaded in this order by index.html
│   ├── utils.js        Helpers: $, inr (₹ format), inrWords, E (HTML escape)
│   ├── state.js        Shared state & localStorage persistence
│   ├── calc.js         Salary formulas (Basic, HRA, PF, PT, TDS, LOP proration)
│   ├── slip.js         Builds the HTML of one A4 slip
│   ├── extras.js       Add/remove extra earnings and deductions
│   ├── images.js       Company logo and signature upload
│   ├── excel.js        Excel upload, template, summary export
│   ├── app.js          Wires the form to the preview, filter, print buttons
│   └── pdf.js          Single-click separate PDF / ZIP export per employee
```

## Where to change things

- Formulas, TDS slabs, PF cap: `js/calc.js`
- Slip layout and wording: `js/slip.js` and `css/style.css`
- Excel column names: `js/excel.js`
- Page size or margins for printing: `css/print.css`

## Excel format

Columns: Name, Employee ID, Designation, Department, CTC, Month (YYYY-MM), PAN, LOP Days (optional).
Use the "Download template" button for a ready file.

## Notes

- Excel and PDF/ZIP export use SheetJS, html2canvas, jsPDF, and JSZip from cdnjs, so they need internet. For offline use, download those scripts into `js/vendor/` and update the `<script>` paths in `index.html`.
- TDS is an estimate (new regime, FY 2025-26 style slabs). Check with your CA before using it for real payroll.
- Professional tax is a flat monthly amount you set. It differs by state.
- Company name, formulas, extra items, logo, and signature are saved in browser `localStorage`. Use **Reset defaults** to clear them.
