// printInvoice.ts
// Arabic simplified tax invoice — everything fully visible, thermal-printer safe
// Paper: 80mm wide × 297mm tall

export interface InvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  total: number;
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

  const fmt = (n: number | undefined | null) => (typeof n === "number" && !isNaN(n) ? n.toFixed(2) : "0.00");

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td class="name-col">${item.productName ?? ""}</td>
        <td>${item.quantity ?? 0}</td>
        <td>${fmt(item.unitPrice)}</td>
        <td>${fmt(item.taxAmount)}</td>
        <td>${fmt(item.total)}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>فاتورة ضريبية مبسطة</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  @page {
    size: 80mm 297mm;
    margin: 0mm;
  }

  html, body {
    width: 76mm;           /* 76mm = 80mm minus 2mm each side safe margin */
    margin: 0 auto;
    background: #fff;
    font-family: 'Cairo', 'Tahoma', Arial, sans-serif;
    font-size: 7.5pt;
    color: #000;
    direction: rtl;
    overflow-x: hidden;
  }

  .page {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* ── LOGO ── */
  .logo-row {
    background-color: #d4d4d4 !important;
    text-align: center;
    padding: 8px 4px 10px;
    font-size: 16pt;
    font-weight: 900;
    border-bottom: 1.5px solid #444;
  }
  .logo-row img {
    max-height: 44px;
    max-width: 100%;
    object-fit: contain;
  }

  /* ── TWO-COL ── */
  .two-col {
    display: grid;
    grid-template-columns: 50% 50%;
    border-bottom: 1.5px solid #444;
    width: 100%;
  }
  .two-col.grey { background-color: #e0e0e0 !important; }
  .two-col.white { background-color: #fff !important; }
  .two-col .cell {
    padding: 4px 5px;
    font-size: 7pt;
    line-height: 1.5;
    overflow: hidden;
    word-break: break-word;
  }
  .two-col .cell:first-child { border-left: 1.5px solid #444; }

  /* ── FULL BAND ── */
  .band {
    padding: 5px 6px;
    text-align: center;
    font-weight: 700;
    font-size: 7.5pt;
    border-bottom: 1.5px solid #444;
    overflow: hidden;
    word-break: break-word;
  }
  .band.grey  { background-color: #d4d4d4 !important; }
  .band.white { background-color: #fff !important; }

  /* ── ITEMS TABLE ── */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    /* NO fixed layout — let browser fit content naturally */
    font-size: 6.5pt;
    border-bottom: 2px solid #222;
  }
  .items-table th,
  .items-table td {
    border: 0.8px solid #555;
    padding: 2.5px 2px;
    text-align: center;
    vertical-align: middle;
    line-height: 1.3;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  .items-table thead th {
    background-color: #e0e0e0 !important;
    font-weight: 700;
    font-size: 6pt;
    line-height: 1.4;
  }
  /* name col: widest, right-aligned */
  .items-table th:first-child,
  .items-table td:first-child {
    width: 32%;
    text-align: right;
    padding-right: 3px;
  }
  /* qty: narrowest */
  .items-table th:nth-child(2),
  .items-table td:nth-child(2) {
    width: 9%;
  }
  /* price, tax, total */
  .items-table th:nth-child(3),
  .items-table td:nth-child(3),
  .items-table th:nth-child(4),
  .items-table td:nth-child(4),
  .items-table th:nth-child(5),
  .items-table td:nth-child(5) {
    width: 19.67%;
  }

  /* ── TOTALS TABLE ── */
  .totals-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
  }
  .totals-table td {
    border: 0.8px solid #555;
    padding: 3.5px 6px;
    overflow: hidden;
    word-break: break-word;
  }
  .totals-table td:first-child {
    width: 62%;
    text-align: right;
  }
  .totals-table td:last-child {
    width: 38%;
    text-align: center;
    font-weight: 700;
    white-space: nowrap;
  }
  .totals-table tr:last-child td {
    font-weight: 900;
    font-size: 8.5pt;
    background-color: #eeeeee !important;
  }

  /* ── FOOTER ── */
  .footer-band {
    background-color: #d4d4d4 !important;
    text-align: center;
    padding: 6px 6px;
    font-weight: 700;
    font-size: 7.5pt;
    border-top: 1.5px solid #444;
    border-bottom: 1.5px solid #444;
    margin-top: 2px;
    word-break: break-word;
    overflow: hidden;
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
    padding: 12px 6px 10px;
  }
  .qr-wrap img,
  #qr {
    width: 90px;
    height: 90px;
    display: block;
  }

  @media print {
    html, body { margin: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- LOGO -->
  <div class="logo-row">
    ${data.logoUrl ? `<img src="${data.logoUrl}" alt="logo"/>` : "اللوجو"}
  </div>

  <!-- رقم الفاتورة + نوعها -->
  <div class="two-col grey">
    <div class="cell">رقم الفاتورة:<br/><strong>${data.invoiceNumber}</strong></div>
    <div class="cell" style="text-align:left">فاتورة ضريبية<br/>مبسطة</div>
  </div>

  <!-- اسم المؤسسة -->
  <div class="band grey">اسم المؤسسة: ${data.institutionName}</div>

  <!-- الرقم الضريبي + تاريخ الإصدار -->
  <div class="two-col white">
    <div class="cell">تاريخ اصدار الفاتورة:<br/><strong>${data.invoiceDate}</strong></div>
    <div class="cell" style="text-align:left">الرقم الضريبي:<br/><strong>${data.institutionTaxNumber}</strong></div>
  </div>

  <!-- عنوان المؤسسة -->
  <div class="band grey">عنوان المؤسسة: ${data.institutionAddress}</div>

  <!-- العميل -->
  <div class="two-col white">
    <div class="cell">رقم الجوال:<br/><strong>${data.customerPhone ?? "—"}</strong></div>
    <div class="cell" style="text-align:left">اسم العميل:<br/><strong>${data.customerName ?? "—"}</strong></div>
  </div>

  <!-- جدول المنتجات -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="text-align:center">اسم المنتج</th>
        <th>الكمية</th>
        <th>السعر قبل الضريبة</th>
        <th>ضريبة القيمة المضافة</th>
        <th>الاجمالي النهائي</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- الإجماليات -->
  <table class="totals-table">
    <tr>
      <td>عدد المنتجات</td>
      <td>عدد ${totalQty}</td>
    </tr>
    <tr>
      <td>اجمالي السعر قبل الضريبة</td>
      <td>&#65020; ${fmt(data.subTotal)}</td>
    </tr>
    <tr>
      <td>اجمالي الخصم</td>
      <td>&#65020; ${fmt(data.discountAmount)}</td>
    </tr>
    <tr>
      <td>اجمالي ضريبة القيمة المضافة</td>
      <td>&#65020; ${fmt(data.taxAmount)}</td>
    </tr>
    <tr>
      <td>الاجمالي النهائي</td>
      <td>&#65020; ${fmt(data.grandTotal)}</td>
    </tr>
  </table>

  <!-- رقم جوال المؤسسة -->
  <div class="footer-band">رقم جوال المؤسسة: ${data.institutionPhone}</div>

  <!-- ملاحظات -->
  <div class="footer-band">ملاحظات علي الفاتورة: ${data.notes ?? ""}</div>

  <!-- QR -->
  <div class="qr-wrap">
    ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR Code"/>` : `<canvas id="qr" width="90" height="90"></canvas>`}
  </div>

</div>

<script>
(function () {
  var c = document.getElementById('qr');
  if (!c) return;
  var ctx = c.getContext('2d');
  var S = 90, MOD = 14, cell = S / MOD;

  var pat = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0],
    [1,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1],
  ];

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = '#000';

  for (var r = 0; r < MOD; r++) {
    for (var cc = 0; cc < MOD; cc++) {
      if (pat[r] && pat[r][cc]) {
        ctx.fillRect(
          Math.round(cc * cell),
          Math.round(r * cell),
          Math.round(cell) - 1,
          Math.round(cell) - 1
        );
      }
    }
  }
})();

document.fonts.ready.then(function () { window.print(); });
</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=440,height=980");
  if (!win) {
    alert("يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة");
    return;
  }
  win.document.write(html);
  win.document.close();
}
