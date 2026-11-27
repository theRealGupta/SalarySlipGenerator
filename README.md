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
│   ├── utils.js        Helpers: $, inr (₹ format), E (HTML escape)
│   ├── state.js        Shared state: employees, extras, logo, signature
│   ├── calc.js         Salary formulas (Basic, HRA, PF, PT, TDS)
│   ├── slip.js         Builds the HTML of one A4 slip
│   ├── extras.js       Add/remove extra earnings and deductions
│   ├── images.js       Company logo and signature upload
│   ├── excel.js        Excel upload, template, summary export
│   └── app.js          Wires the form to the preview, print buttons
```

## Where to change things

- Formulas, TDS slabs, PF cap: `js/calc.js`
- Slip layout and wording: `js/slip.js` and `css/style.css`
- Excel column names: `js/excel.js`
- Page size or margins for printing: `css/print.css`

## Excel format

Columns: Name, Employee ID, Designation, Department, CTC, Month (YYYY-MM), PAN.
Use the "Download template" button for a ready file.

## Notes

- Excel features use SheetJS from a CDN, so they need internet. For offline use, download
  `xlsx.full.min.js`, put it in `js/vendor/`, and change the script path in `index.html`.
- TDS is an estimate (new regime, FY 2025-26 style slabs). Check with your CA before using it for real payroll.
- Professional tax is a flat monthly amount you set. It differs by state.
- Logo and signature are not saved. Upload them again after a refresh.
