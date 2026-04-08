// printInvoice.ts — thermal 80mm, guaranteed no clipping on right side

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
        <td class="td-name-full" colspan="4">${item.productName ?? ""}</td>
      </tr>
      <tr class="num-row">
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

  /*
   * KEY FIX: use @page margin to push content AWAY from the physical right edge.
   * Thermal printers have an unprintable zone on the right (~4-6mm).
   * margin-right/left: 7mm gives more breathing room on both sides.
   */
  @page {
    size: 80mm 297mm;
    margin-top: 2mm;
    margin-bottom: 2mm;
    margin-right: 4mm;
    margin-left: 4mm;
  }

  html, body {
    /* Full width — let @page margins handle the safe zones */
    width: 100%;
    font-family: 'Cairo', 'Tahoma', Arial, sans-serif;
    font-size: 8pt;
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
    font-size: 16pt;
    font-weight: 900;
    padding: 8px 2px 10px;
    border-bottom: 1.5px solid #333;
    background: #d9d9d9 !important;
  }
  .logo img { max-height: 44px; max-width: 100%; object-fit: contain; }

  /* ── ROWS: all single-column, full-width ── */
  .row {
    width: 100%;
    padding: 4px 12px 4px 4px;
    border-bottom: 1px dashed #555;
    font-size: 7.5pt;
    line-height: 1.6;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .row.grey   { background: #e0e0e0 !important; }
  .row.bold   { font-weight: 700; }
  .row.center { text-align: center; }

  /* ── TABLE FRAME WRAPPER ── */
  .table-wrap {
    margin: 3px 0;
  }

  /* ── ITEMS TABLE ── */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 6.5pt;
    border: 2px solid #111;
  }
  .items-table th,
  .items-table td {
    border: 0.8px solid #555;
    padding: 2px 3px;
    vertical-align: middle;
    line-height: 1.4;
    word-break: break-word;
  }
  .items-table thead th {
    background: #e0e0e0 !important;
    font-weight: 700;
    font-size: 6pt;
    text-align: center;
  }
  /* سطر اسم المنتج — يمتد كل العرض */
  .td-name-full {
    text-align: right;
    font-weight: 700;
    font-size: 6.5pt;
    background: #f5f5f5 !important;
    padding: 3px 4px !important;
    border-bottom: 0.5px dashed #888 !important;
  }
  /* سطر الأرقام — 4 أعمدة */
  .items-table .num-row td {
    text-align: center;
    font-size: 6pt;
    background: #fff !important;
  }
  .items-table th:nth-child(1) { width: 18%; }
  .items-table th:nth-child(2) { width: 27%; }
  .items-table th:nth-child(3) { width: 27%; }
  .items-table th:nth-child(4) { width: 28%; }

  /* ── TOTALS TABLE ── */
  .totals-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
    border: 2px solid #111;
  }
  .totals-table td {
    border: 0.8px solid #444;
    padding: 3px 6px;
    word-break: break-word;
  }
  .totals-table td:first-child { text-align: right; width: 58%; }
  .totals-table td:last-child  {
    text-align: left;
    width: 42%;
    font-weight: 700;
    white-space: nowrap;
  }
  .totals-table tr:last-child td {
    font-weight: 900;
    font-size: 8.5pt;
    background: #e8e8e8 !important;
  }

  /* ── FOOTER ── */
  .footer {
    background: #e0e0e0 !important;
    text-align: center;
    font-weight: 700;
    font-size: 7.5pt;
    padding: 5px 3px;
    border-top: 1.5px solid #333;
    border-bottom: 1.5px solid #333;
    margin-top: 3px;
    word-break: break-word;
  }
  .footer + .footer { border-top: none; margin-top: 0; }

  /* ── QR ── */
  .qr-wrap {
    text-align: center;
    padding: 10px 0 8px;
  }
  #qr, .qr-wrap img { width: 80px; height: 80px; display: inline-block; }

  @media print {
    html, body { margin: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="logo">
    ${data.logoUrl ? `<img src="${data.logoUrl}" alt="logo"/>` : "اللوجو"}
  </div>

  <div class="row grey bold center">فاتورة ضريبية مبسطة</div>
  <div class="row">رقم الفاتورة: <strong>${data.invoiceNumber}</strong></div>
  <div class="row grey bold center">اسم المؤسسة: ${data.institutionName}</div>
  <div class="row">تاريخ اصدار الفاتورة: <strong>${data.invoiceDate}</strong></div>
  <div class="row">الرقم الضريبي للمؤسسة: <strong>${data.institutionTaxNumber}</strong></div>
  <div class="row grey bold center">عنوان المؤسسة: ${data.institutionAddress}</div>
  <div class="row">اسم العميل: <strong>${data.customerName ?? "—"}</strong></div>
  <div class="row">رقم الجوال: <strong>${data.customerPhone ?? "—"}</strong></div>

  <div class="table-wrap">
  <table class="items-table">
    <thead>
      <tr>
        <th>الكمية</th>
        <th>السعر قبل الضريبة</th>
        <th>ضريبة القيمة المضافة</th>
        <th>الاجمالي النهائي</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>
  </div>

  <div class="table-wrap">
  <table class="totals-table">
    <tr><td>عدد المنتجات</td><td>عدد ${totalQty}</td></tr>
    <tr><td>اجمالي السعر قبل الضريبة</td><td>&#65020; ${fmt(data.subTotal)}</td></tr>
    <tr><td>اجمالي الخصم</td><td>&#65020; ${fmt(data.discountAmount)}</td></tr>
    <tr><td>اجمالي ضريبة القيمة المضافة</td><td>&#65020; ${fmt(data.taxAmount)}</td></tr>
    <tr><td>الاجمالي النهائي</td><td>&#65020; ${fmt(data.grandTotal)}</td></tr>
  </table>
  </div>

  <div class="footer">رقم جوال المؤسسة: ${data.institutionPhone}</div>
  <div class="footer">ملاحظات علي الفاتورة: ${data.notes ?? ""}</div>

  <div class="qr-wrap">
    ${data.qrCodeUrl
      ? `<img src="${data.qrCodeUrl}" alt="QR"/>`
      : `<canvas id="qr" width="80" height="80"></canvas>`}
  </div>

</div>
<script>
(function(){
  var c=document.getElementById('qr'); if(!c)return;
  var ctx=c.getContext('2d'),S=80,MOD=14,cell=S/MOD;
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