/* Small shared helpers */
const $ = id => document.getElementById(id);

// Indian rupee format: ₹ 12,34,567
const inr = n => '₹ ' + Math.round(n).toLocaleString('en-IN');

// Escape text before putting it into HTML
function E(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Convert a non-negative rupee amount to Indian words (Crore, Lakh, Thousand)
function inrWords(amount) {
  const n = Math.round(Math.max(0, Number(amount) || 0));
  if (n === 0) return 'Rupees Zero Only';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const twoDigits = v => v < 20 ? ones[v] : `${tens[Math.floor(v / 10)]}${v % 10 ? ' ' + ones[v % 10] : ''}`;
  const threeDigits = v => {
    const h = Math.floor(v / 100), r = v % 100;
    return [h ? `${ones[h]} Hundred` : '', r ? twoDigits(r) : ''].filter(Boolean).join(' ');
  };

  const parts = [];
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  if (crore) parts.push(`${inrWordsNum(crore, twoDigits, threeDigits)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (rest) parts.push(threeDigits(rest));
  return `Rupees ${parts.join(' ')} Only`;
}

function inrWordsNum(v, twoDigits, threeDigits) {
  return v < 100 ? twoDigits(v) : threeDigits(v);
}
