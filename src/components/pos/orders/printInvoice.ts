// printInvoice.ts — thermal 80mm — matches design exactly

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
        <td class="td-name">${item.productName ?? ""}</td>
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
<title>فاتورة ضريبية مبسطة</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');

  * {
    margin: 0; padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: 80mm auto;
    margin: 3mm 3mm;
  }

  html, body {
    width: 100%;
    font-family: 'Tajawal', 'Tahoma', Arial, sans-serif;
    font-size: 7.5pt;
    color: #000;
    direction: rtl;
    background: #fff;
  }

  .page {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* ── LOGO ── */
  .logo {
    text-align: center;
    font-size: 18pt;
    font-weight: 900;
    padding: 6px 4px 8px;
    border: 1.5px solid #333;
    background: #d9d9d9 !important;
  }
  .logo img { max-height: 44px; max-width: 100%; object-fit: contain; }

  /* ── TWO-COLUMN INFO GRID ── */
  .info-grid {
    width: 100%;
    border-collapse: collapse;
    border: 1.5px solid #333;
  }
  .info-grid td {
    padding: 3px 3px;
    font-size: 6pt;
    line-height: 1.4;
    vertical-align: middle;
    border: 0.8px solid #bbb;
    word-break: break-word;
    text-align: right;
  }
  .info-grid td.left-cell {
    border-right: 1.5px solid #555;
  }
  /* full-width row inside info-grid */
  .info-grid .full td {
    text-align: center;
    font-weight: 700;
    font-size: 8pt;
    background: #d9d9d9 !important;
  }

  /* ── ITEMS TABLE ── */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 6pt;
    border: 1.5px solid #333;
  }
  .items-table th {
    background: #d9d9d9 !important;
    font-weight: 700;
    font-size: 5.5pt;
    text-align: center;
    padding: 2px 1px;
    border: 0.8px solid #555;
    line-height: 1.3;
    vertical-align: middle;
  }
  .items-table td {
    border: 0.8px solid #555;
    padding: 2px 1px;
    text-align: center;
    vertical-align: middle;
    line-height: 1.3;
    word-break: break-word;
  }
  .td-name {
    text-align: right !important;
    padding-right: 3px !important;
  }
  .items-table th:nth-child(1),
  .items-table td:nth-child(1) { width: 30%; }
  .items-table th:nth-child(2),
  .items-table td:nth-child(2) { width: 10%; }
  .items-table th:nth-child(3),
  .items-table td:nth-child(3) { width: 18%; }
  .items-table th:nth-child(4),
  .items-table td:nth-child(4) { width: 18%; }
  .items-table th:nth-child(5),
  .items-table td:nth-child(5) { width: 24%; }

  /* ── TOTALS TABLE ── */
  .totals-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
    border: 1.5px solid #333;
  }
  .totals-table td {
    border: 0.8px solid #555;
    padding: 3px 5px;
    vertical-align: middle;
    text-align: right;
  }
  .totals-table td:first-child {
    width: 64%;
    text-align: right;
    border-left: 1.5px solid #555;
  }
  .totals-table td:last-child {
    width: 36%;
    font-weight: 700;
    white-space: nowrap;
    text-align: center;
  }
  .totals-table tr:last-child td {
    font-weight: 900;
    font-size: 8.5pt;
    background: #d9d9d9 !important;
  }

  /* ── FOOTER ROWS ── */
  .footer-row {
    border: 1.5px solid #333;
    text-align: center;
    font-weight: 700;
    font-size: 7.5pt;
    padding: 5px 4px;
    background: #d9d9d9 !important;
    word-break: break-word;
    margin-top: 3px;
  }

  /* ── QR ── */
  .qr-wrap {
    text-align: center;
    padding: 8px 0 6px;
    border: 1.5px solid #333;
  }
  #qr, .qr-wrap img { width: 90px; height: 90px; display: inline-block; }

  @media print {
    html, body { margin: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- LOGO -->
  <div class="logo">
    ${data.logoUrl ? `<img src="${data.logoUrl}" alt="logo"/>` : "اللوجو"}
  </div>

  <!-- INFO GRID -->
  <table class="info-grid">
    <tr>
      <td>رقم الفاتورة: <strong>${data.invoiceNumber}</strong></td>
      <td class="left-cell">فاتورة ضريبيية مبسطة</td>
    </tr>
    <tr class="full">
      <td colspan="2">${data.institutionName}</td>
    </tr>
    <tr>
      <td>الرقم الضريبي للمؤسسة: <strong>${data.institutionTaxNumber}</strong></td>
      <td class="left-cell">تاريخ اصدار الفاتورة: <strong>${data.invoiceDate}</strong></td>
    </tr>
    <tr class="full">
      <td colspan="2">${data.institutionAddress}</td>
    </tr>
    <tr>
      <td>رقم الجوال: <strong>${data.customerPhone ?? "—"}</strong></td>
      <td class="left-cell">اسم العميل: <strong>${data.customerName ?? "—"}</strong></td>
    </tr>
  </table>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th class="td-name">اسم المنتج</th>
        <th>الكمية</th>
        <th>السعر قبل الضريبة</th>
        <th>ضريبة القيمة المضافة</th>
        <th>الاجمالي النهائي</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- TOTALS TABLE -->
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

  <!-- FOOTER -->
  <div class="footer-row">رقم جوال المؤسسة: ${data.institutionPhone}</div>
  <div class="footer-row">ملاحظات علي الفاتورة: ${data.notes ?? ""}</div>

  <!-- QR -->
  <div class="qr-wrap">
    ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR"/>` : `<canvas id="qr" width="90" height="90"></canvas>`}
  </div>

</div>
<script>
(function(){
  var c=document.getElementById('qr'); if(!c)return;
  var ctx=c.getContext('2d'),S=90,MOD=14,cell=S/MOD;
  var pat=[
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
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,S,S);
  ctx.fillStyle='#000';
  for(var r=0;r<MOD;r++) for(var cc=0;cc<MOD;cc++)
    if(pat[r][cc]) ctx.fillRect(Math.round(cc*cell),Math.round(r*cell),Math.round(cell)-1,Math.round(cell)-1);
})();
document.fonts.ready.then(function(){ window.print(); });
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
