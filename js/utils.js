/* Small shared helpers */
const $ = id => document.getElementById(id);

// Indian rupee format: ₹ 12,34,567
const inr = n => '₹ ' + Math.round(n).toLocaleString('en-IN');

// Escape text before putting it into HTML
function E(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
