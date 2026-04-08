// printInvoice.ts
// Arabic simplified tax invoice — pixel-perfect match to reference image
// Paper: 80mm wide × 297mm tall

export interface InvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;    // price BEFORE tax
  taxAmount: number;    // line total tax
  total: number;        // grand line total inc. tax
}

export interface InvoiceData {
  logoUrl?: string;
  invoiceNumber: string;
  institutionName: string;
  institutionTaxNumber: string;
  invoiceDate: string;
  institutionAddress: string;
  institutionPhone: string;
  customerName?: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  notes?: string;
  qrCodeUrl?: string;
}

export function printInvoice(data: InvoiceData): void {
  const totalQty = data.items.reduce((s, i) => s + i.quantity, 0);

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td>${item.total.toFixed(2)}</td>
        <td>${item.taxAmount.toFixed(2)}</td>
        <td>${item.unitPrice.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td class="name-col">${item.productName}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<title>فاتورة ضريبية مبسطة</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  @page {
    size: 70mm 297mm;
    margin: 0;
  }

  html, body {
    width: 80mm;
    min-height: 297mm;
    background: #ffffff;
    font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
    font-size: 9pt;
    color: #111111;
    direction: rtl;
  }

  .page {
    width: 80mm;
    min-height: 297mm;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  /* ── LOGO ── */
  .logo-row {
    background: #d9d9d9;
    text-align: center;
    padding: 12px 6px 14px;
    font-size: 20pt;
    font-weight: 900;
    color: #111;
    border-bottom: 1.5px solid #999;
  }
  .logo-row img {
    max-height: 52px;
    object-fit: contain;
  }

  /* ── TWO-COL ROW (grey bg) ── */
  .two-col-grey {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #f0f0f0;
    border-bottom: 1.5px solid #999;
  }
  .two-col-grey .cell {
    padding: 5px 7px;
    font-size: 8pt;
    line-height: 1.45;
  }
  .two-col-grey .cell:first-child {
    border-left: 1.5px solid #999;
  }

  /* ── FULL-WIDTH DARK-GREY ROW ── */
  .full-dark {
    background: #d9d9d9;
    padding: 6px 8px;
    text-align: center;
    font-weight: 700;
    font-size: 9pt;
    border-bottom: 1.5px solid #999;
  }

  /* ── TWO-COL ROW (white bg, for tax-no/date + customer) ── */
  .two-col-white {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #ffffff;
    border-bottom: 1.5px solid #999;
  }
  .two-col-white .cell {
    padding: 5px 7px;
    font-size: 8pt;
    line-height: 1.45;
  }
  .two-col-white .cell:first-child {
    border-left: 1.5px solid #999;
  }

  /* ── ITEMS TABLE ── */
  .items-wrap {
    border-bottom: 2px solid #777;
  }
  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
  }
  .items-table th,
  .items-table td {
    border: 1px solid #999;
    padding: 3.5px 2px;
    text-align: center;
    vertical-align: middle;
    line-height: 1.3;
  }
  .items-table thead th {
    background: #f0f0f0;
    font-weight: 700;
    font-size: 7pt;
  }
  .name-col {
    text-align: right;
    padding-right: 4px !important;
  }
  .items-table thead .name-col {
    text-align: center;
  }

  /* ── TOTALS TABLE ── */
  .totals-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
  }
  .totals-table td {
    border: 1px solid #999;
    padding: 4px 8px;
  }
  .totals-table .t-label { text-align: right; }
  .totals-table .t-value {
    text-align: center;
    font-weight: 700;
    white-space: nowrap;
  }
  .totals-table tr:last-child td {
    font-weight: 900;
    font-size: 9.5pt;
  }

  /* ── FOOTER GREY BANDS ── */
  .footer-band {
    background: #d9d9d9;
    text-align: center;
    padding: 8px 8px;
    font-weight: 700;
    font-size: 9pt;
    border-top: 1.5px solid #999;
    border-bottom: 1.5px solid #999;
    margin-top: 3px;
  }
  .footer-band + .footer-band {
    border-top: none;
    margin-top: 0;
  }

  /* ── QR ── */
  .qr-wrap {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 16px 8px 14px;
  }
  .qr-wrap img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  /* Decorative QR placeholder */
  .qr-placeholder {
    width: 100px;
    height: 100px;
    position: relative;
  }
  .qr-placeholder canvas { display: none; }
  /* drawn via JS below */

  @media print {
    html, body { width: 80mm; margin: 0; }
    .page { min-height: auto; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- LOGO -->
  <div class="logo-row">
    ${data.logoUrl ? `<img src="${data.logoUrl}" alt="logo"/>` : "اللوجو"}
  </div>

  <!-- Invoice type + number -->
  <div class="two-col-grey">
    <div class="cell">رقم الفاتورة: <strong>${data.invoiceNumber}</strong></div>
    <div class="cell" style="text-align:left">فاتورة ضريبية مبسطة</div>
  </div>

  <!-- Institution name -->
  <div class="full-dark">اسم المؤسسة: ${data.institutionName}</div>

  <!-- Tax number + date -->
  <div class="two-col-white">
    <div class="cell">تاريخ اصدار الفاتورة:<br/><strong>${data.invoiceDate}</strong></div>
    <div class="cell" style="text-align:left">الرقم الضريبية للمؤسسة:<br/><strong>${data.institutionTaxNumber}</strong></div>
  </div>

  <!-- Address -->
  <div class="full-dark">عنوان المؤسسة: ${data.institutionAddress}</div>

  <!-- Customer info -->
  <div class="two-col-white" style="background:#f7f7f7">
    <div class="cell">رقم الجوال: <strong>${data.customerPhone ?? "—"}</strong></div>
    <div class="cell" style="text-align:left">اسم العميل: <strong>${data.customerName ?? "—"}</strong></div>
  </div>

  <!-- Items table -->
  <div class="items-wrap">
    <table class="items-table">
      <thead>
        <tr>
          <th>الاجمالي<br/>النهائي</th>
          <th>ضريبة<br/>القيمة المضافة</th>
          <th>السعر<br/>قبل الضريبة</th>
          <th>الكمية</th>
          <th class="name-col">اسم المنتج</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <table class="totals-table">
    <tr>
      <td class="t-label">عدد المنتجات</td>
      <td class="t-value">عدد ${totalQty}</td>
    </tr>
    <tr>
      <td class="t-label">اجمالي السعر قبل الضريبة</td>
      <td class="t-value">&#65020; ${data.subTotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="t-label">اجمالي الخصم</td>
      <td class="t-value">&#65020; ${data.discountAmount.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="t-label">اجمالي ضريبة القيمة المضافة</td>
      <td class="t-value">&#65020; ${data.taxAmount.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="t-label">الاجمالي النهائي</td>
      <td class="t-value">&#65020; ${data.grandTotal.toFixed(2)}</td>
    </tr>
  </table>

  <!-- Institution phone -->
  <div class="footer-band">رقم جوال المؤسسة: ${data.institutionPhone}</div>

  <!-- Notes -->
  <div class="footer-band">ملاحظات علي الفاتورة: ${data.notes ?? ""}</div>

  <!-- QR Code -->
  <div class="qr-wrap">
    ${
      data.qrCodeUrl
        ? `<img src="${data.qrCodeUrl}" alt="QR Code"/>`
        : `<canvas id="qr" width="100" height="100"></canvas>`
    }
  </div>

</div>

<script>
// Draw a simple decorative QR pattern on the canvas
(function() {
  var c = document.getElementById('qr');
  if (!c) return;
  var ctx = c.getContext('2d');
  var S = 100, mod = 10, cell = S / mod;

  // random seed pattern (deterministic)
  var pattern = [
    [1,1,1,0,1,1,0,1,1,1],
    [1,0,1,0,0,1,0,1,0,1],
    [1,0,1,1,0,0,1,1,0,1],
    [1,1,1,0,1,0,0,0,1,1],
    [0,0,0,1,0,1,1,0,0,0],
    [1,0,1,0,1,0,0,1,0,1],
    [1,1,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,1,0,1,1],
    [1,0,1,1,0,1,0,1,0,1],
    [1,1,0,0,1,1,1,0,1,1],
  ];

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = '#111';

  for (var r = 0; r < mod; r++) {
    for (var cc = 0; cc < mod; cc++) {
      if (pattern[r][cc]) {
        ctx.fillRect(cc * cell + 1, r * cell + 1, cell - 1, cell - 1);
      }
    }
  }

  // Corner squares
  function square(x, y, outer, inner) {
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, outer * cell, outer * cell);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + cell, y + cell, (outer-2) * cell, (outer-2) * cell);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + inner, y + inner, (outer - inner*2/cell) * cell, (outer - inner*2/cell) * cell);
  }

  // Redraw corners cleanly
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 3*cell, 3*cell);
  ctx.fillRect(S - 3*cell, 0, 3*cell, 3*cell);
  ctx.fillRect(0, S - 3*cell, 3*cell, 3*cell);

  [[0,0],[S-3*cell,0],[0,S-3*cell]].forEach(function(p) {
    ctx.fillStyle = '#111';
    ctx.fillRect(p[0], p[1], 3*cell, 3*cell);
    ctx.fillStyle = '#fff';
    ctx.fillRect(p[0]+cell*0.5, p[1]+cell*0.5, 2*cell, 2*cell);
    ctx.fillStyle = '#111';
    ctx.fillRect(p[0]+cell, p[1]+cell, cell, cell);
  });

  // Center dot
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(S/2, S/2, cell*0.7, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(S/2, S/2, cell*0.35, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(S/2, S/2, cell*0.15, 0, Math.PI*2);
  ctx.fill();

  c.style.display = 'block';
})();

document.fonts.ready.then(function() { window.print(); });
</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=420,height=960");
  if (!win) {
    alert("يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة");
    return;
  }
  win.document.write(html);
  win.document.close();
}