/* Download separate A4 PDFs for all employees in a single click */

// Build a clean, filesystem-safe PDF filename for an employee
function slipPdfName(e, used) {
  const clean = s => String(s || '').trim().replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  const parts = [clean(e.eid), clean(e.name), clean(e.month)].filter(Boolean);
  const base = parts.length ? parts.join('_') : 'salary-slip';
  let name = `${base}.pdf`;
  let n = 2;
  while (used.has(name)) {
    name = `${base}_${n++}.pdf`;
  }
  used.add(name);
  return name;
}

// Trigger a browser download for a Blob
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Delay revocation so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Render one employee's slip HTML offscreen and return an A4 PDF Blob
async function renderSlipPdfBlob(e, stage) {
  stage.innerHTML = slipHTML(e);
  const slipEl = stage.firstElementChild;

  const imgs = Array.from(slipEl.querySelectorAll('img'));
  await Promise.all(imgs.map(img => (img.decode ? img.decode().catch(() => { }) : Promise.resolve())));

  const canvas = await window.html2canvas(slipEl, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true
  });

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pageW = 210;
  const pageH = 297;
  // Scale proportionally so tall slips with many extra items never distort
  const scale = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * scale;
  const h = canvas.height * scale;
  pdf.addImage(imgData, 'JPEG', (pageW - w) / 2, 0, w, h);
  return pdf.output('blob');
}

$('downloadAll').onclick = async () => {
  if (!window.html2canvas || !window.jspdf || !window.JSZip) {
    alert('PDF libraries failed to load. Check your internet connection or add them locally.');
    return;
  }

  const btn = $('downloadAll');
  const label = btn.textContent;
  const list = emps.length ? emps : [cur()];
  const used = new Set();

  // Offscreen container kept in layout (not display:none) so html2canvas can measure it
  const stage = document.createElement('div');
  stage.style.cssText = 'position:fixed;left:-99999px;top:0;width:210mm;background:#fff;pointer-events:none;';
  document.body.appendChild(stage);

  btn.disabled = true;
  try {
    if (list.length === 1) {
      btn.textContent = 'Generating PDF...';
      const blob = await renderSlipPdfBlob(list[0], stage);
      downloadBlob(blob, slipPdfName(list[0], used));
      return;
    }

    const zip = new window.JSZip();
    for (let i = 0; i < list.length; i++) {
      btn.textContent = `Generating ${i + 1}/${list.length}...`;
      const blob = await renderSlipPdfBlob(list[i], stage);
      zip.file(slipPdfName(list[i], used), blob);
    }

    btn.textContent = 'Zipping PDFs...';
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const monthTag = list[0] && list[0].month ? `-${list[0].month}` : '';
    downloadBlob(zipBlob, `salary-slips${monthTag}.zip`);
  } catch (err) {
    console.error(err);
    alert('Could not generate PDFs. Please try again.');
  } finally {
    stage.remove();
    btn.disabled = false;
    btn.textContent = label;
  }
};
