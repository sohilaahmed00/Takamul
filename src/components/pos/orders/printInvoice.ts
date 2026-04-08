// printInvoice.ts
// Arabic simplified tax invoice — fully visible on thermal 80mm printer
// All header rows are stacked (no side-by-side columns) to prevent clipping

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
  const fmt = (n: number | undefined | null) =>
    typeof n === "number" && !isNaN(n) ? n.toFixed(2) : "0.00";

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td class="td-name">${item.productName ?? ""}</td>
        <td>${item.quantity ?? 0}</td>
        <td>${fmt(item.unitPrice)}</td>
        <td>${fmt(item.taxAmount)}</td>
        <td>${fmt(item.total)}</td>
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

  * {
    margin: 0; padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page { size: 80mm 297mm; margin: 0; }

  html, body {
    /* Use 68mm so we have safe margin on both sides for any thermal printer */
    width: 64mm;
    margin-right: 8mm;
    margin-left: 2mm;
    font-family: 'Cairo', 'Tahoma', Arial, sans-serif;
    font-size: 8pt;
    color: #000;
    direction: rtl;
    background: #fff;
  }

  /* ─── LOGO ─── */
  .logo {
    text-align: center;
    font-size: 18pt;
    font-weight: 900;
    padding: 8px 0 10px;
    border-bottom: 1.5px solid #333;
    background: #d9d9d9 !important;
  }
  .logo img { max-height: 46px; max-width: 100%; object-fit: contain; }

  /* ─── GENERIC ROW ─── */
  /* Every meta row is full-width, stacked. NO side-by-side grids. */
  .row {
    width: 100%;
    padding: 5px 4px;
    border-bottom: 1px dashed #666;
    font-size: 7.5pt;
    line-height: 1.6;
    word-break: break-word;
  }
  .row.grey { background: #e0e0e0 !important; }
  .row.center { text-align: center; font-weight: 700; }

  .row-grid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4px;
    padding: 5px 4px;
    border-bottom: 1px dashed #666;
    font-size: 7.5pt;
    line-height: 1.6;
    word-break: break-word;
  }
  .row-grid.grey { background: #e0e0e0 !important; }
  .row-grid .g-r { text-align: right; flex: 1; }
  .row-grid .g-l { text-align: left;  flex: 1; }

  /* ─── ITEMS TABLE ─── */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 6pt;
    margin-top: 2px;
    border-bottom: 2px solid #222;
  }
  .items-table th,
  .items-table td {
    border: 0.8px solid #444;
    padding: 2.5px 1.5px;
    text-align: center;
    vertical-align: middle;
    line-height: 1.35;
    word-break: break-word;
  }
  .items-table thead th {
    background: #e0e0e0 !important;
    font-weight: 700;
    font-size: 5.5pt;
  }
  /* name col wider */
  .th-name, .td-name {
    width: 30%;
    text-align: right;
    padding-right: 2px !important;
    font-size: 6pt;
  }
  /* numeric cols equal */
  .items-table th:not(.th-name),
  .items-table td:not(.td-name) {
    width: 17.5%;
  }

  /* ─── TOTALS TABLE ─── */
  .totals-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
    margin-top: 2px;
  }
  .totals-table td {
    border: 0.8px solid #444;
    padding: 3.5px 5px;
    word-break: break-word;
  }
  .totals-table td:first-child { text-align: right; width: 60%; }
  .totals-table td:last-child  { text-align: left;  width: 40%; font-weight: 700; white-space: nowrap; }
  .totals-table tr:last-child td {
    font-weight: 900;
    font-size: 8.5pt;
    background: #e8e8e8 !important;
  }

  /* ─── FOOTER ─── */
  .footer {
    background: #e0e0e0 !important;
    text-align: center;
    font-weight: 700;
    font-size: 7.5pt;
    padding: 6px 4px;
    border-top: 1.5px solid #333;
    border-bottom: 1.5px solid #333;
    margin-top: 3px;
    word-break: break-word;
  }
  .footer + .footer { border-top: none; margin-top: 0; }

  /* ─── QR ─── */
  .qr-wrap {
    text-align: center;
    padding: 12px 0 10px;
  }
  #qr, .qr-wrap img { width: 80px; height: 80px; display: inline-block; }

  @media print {
    html, body { margin: 0; }
  }
</style>
</head>
<body>

  <!-- LOGO -->
  <div class="logo">
    ${data.logoUrl ? `<img src="${data.logoUrl}" alt="logo"/>` : "اللوجو"}
  </div>

  <!-- فاتورة ضريبية مبسطة -->
  <div class="row grey center">فاتورة ضريبية مبسطة</div>

  <!-- رقم الفاتورة -->
  <div class="row">رقم الفاتورة: <strong>${data.invoiceNumber}</strong></div>

  <!-- اسم المؤسسة -->
  <div class="row grey center">اسم المؤسسة: ${data.institutionName}</div>

  <!-- تاريخ الإصدار -->
  <div class="row">تاريخ اصدار الفاتورة: <strong>${data.invoiceDate}</strong></div>

  <!-- الرقم الضريبي -->
  <div class="row">الرقم الضريبي للمؤسسة: <strong>${data.institutionTaxNumber}</strong></div>

  <!-- عنوان المؤسسة -->
  <div class="row grey center">عنوان المؤسسة: ${data.institutionAddress}</div>

  <!-- اسم العميل -->
  <div class="row">اسم العميل: <strong>${data.customerName ?? "—"}</strong></div>

  <!-- رقم الجوال -->
  <div class="row">رقم الجوال: <strong>${data.customerPhone ?? "—"}</strong></div>

  <!-- جدول المنتجات -->
  <table class="items-table">
    <thead>
      <tr>
        <th class="th-name">اسم المنتج</th>
        <th>الكمية</th>
        <th>السعر قبل الضريبة</th>
        <th>ضريبة القيمة المضافة</th>
        <th>الاجمالي النهائي</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
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
  <div class="footer">رقم جوال المؤسسة: ${data.institutionPhone}</div>

  <!-- ملاحظات -->
  <div class="footer">ملاحظات علي الفاتورة: ${data.notes ?? ""}</div>

  <!-- QR Code -->
  <div class="qr-wrap">
    ${
      data.qrCodeUrl
        ? `<img src="${data.qrCodeUrl}" alt="QR"/>`
        : `<canvas id="qr" width="80" height="80"></canvas>`
    }
  </div>

<script>
(function () {
  var c = document.getElementById('qr');
  if (!c) return;
  var ctx = c.getContext('2d');
  var S = 80, MOD = 14, cell = S / MOD;
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
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,S,S);
  ctx.fillStyle = '#000';
  for (var r=0;r<MOD;r++) for (var cc=0;cc<MOD;cc++)
    if (pat[r][cc]) ctx.fillRect(Math.round(cc*cell),Math.round(r*cell),Math.round(cell)-1,Math.round(cell)-1);
})();
document.fonts.ready.then(function(){ window.print(); });
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