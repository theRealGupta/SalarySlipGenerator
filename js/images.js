/* Company logo and authorised signature upload */
function readImg(input, set) {
  input.addEventListener('change', () => {
    const f = input.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('Please choose an image file (PNG or JPG).'); input.value = ''; return; }
    if (f.size > 2e6) { alert('Image is larger than 2 MB. Please use a smaller file.'); input.value = ''; return; }
    const r = new FileReader();
    r.onload = () => { set(r.result); saveSettings(); render(); };
    r.readAsDataURL(f);
  });
}

readImg($('logoF'), v => logo = v);
readImg($('sigF'), v => sig = v);

$('clrImg').onclick = () => {
  logo = ''; sig = '';
  $('logoF').value = ''; $('sigF').value = '';
  saveSettings();
  render();
};
