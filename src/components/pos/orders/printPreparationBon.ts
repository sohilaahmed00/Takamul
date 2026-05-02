import { printKitchenPrinter } from "@/lib/qzService";

export interface BonItem {
  productName: string;
  quantity: number;
}

export interface BonData {
  institutionName: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName?: string;
  items: BonItem[];
}

export async function printPreparationBon(data: BonData): Promise<void> {
  const bonTitle = data?.institutionName;
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td class="td-name">${item.productName ?? ""}</td>
        <td>${item.quantity ?? 0}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<title>بون التحضير</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

html, body {
  width: 100%;
  font-size: 7pt;
  color: #000;
  direction: rtl;
  background: #fff;
  font-family: Tahoma, Arial, sans-serif;
}

.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── HEADER ── */
.header {
  text-align: center;
  font-size: 12pt;
  font-weight: 900;
  padding: 6px 4px 8px;
  border: 2px solid #000;
  text-decoration: underline;
}

/* ── INFO GRID ── */
.info-grid {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  border-top: none;
}

.info-grid td {
  padding: 4px 6px;
  font-size: 7pt;
  line-height: 1.5;
  vertical-align: middle;
  border: 1px solid #000;
  font-weight: 700;
  word-break: break-word;
}

.info-grid td.lbl {
  background: #f0f0f0 !important;
  text-align: right;
  width: 35%;
}

.info-grid td.val {
  text-align: center;
  font-weight: 900;
  font-size: 8pt;
}

.sep {
  border-left: 2px solid #000 !important;
}

/* ── ITEMS TABLE ── */
.items-table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  border-top: none;
  table-layout: fixed;
}

.items-table th {
  background: #d9d9d9 !important;
  font-weight: 700;
  font-size: 6pt;
  text-align: center;
  padding: 3px 2px;
  border: 1px solid #000;
  line-height: 1.3;
  vertical-align: middle;
}

.items-table td {
  border: 1px solid #000;
  padding: 4px 2px;
  text-align: center;
  font-weight: 900;
  font-size: 7pt;
  vertical-align: middle;
  line-height: 1.4;
  word-break: break-word;
}

.td-name {
  text-align: right !important;
  padding-right: 5px !important;
  font-weight: 900;
  font-size: 8pt;
}

/* عمود الصنف */
.items-table th:nth-child(1),
.items-table td:nth-child(1) { width: 78%; }

/* عمود الكمية */
.items-table th:nth-child(2),
.items-table td:nth-child(2) { width: 22%; }

@media print {
  html, body { margin: 0; }
  .info-grid td.lbl,
  .items-table th {
    background: #fff !important;
  }
}
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">${bonTitle}</div>

  <!-- INFO GRID -->
  <table class="info-grid">
    <tr>
      <td class="lbl">رقم الفاتورة</td>
      <td class="val sep">${data.invoiceNumber}</td>
    </tr>
    <tr>
      <td class="lbl">الوقت / التاريخ</td>
      <td class="val sep">${data.invoiceDate}</td>
    </tr>
    <tr>
      <td class="lbl">اسم العميل</td>
      <td class="val sep">${data.customerName ?? "—"}</td>
    </tr>
  </table>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th class="td-name">اسم المنتج</th>
        <th>الكمية</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

</div>
</body>
</html>`;

  try {
    await printKitchenPrinter(html);
    // const win = window.open("", "_blank", "width=440,height=700");
    // if (!win) {
    //   alert("يرجى السماح بالنوافذ المنبثقة لطباعة البون");
    //   return;
    // }
    // win.document.write(html);
  } catch (err: any) {
    const win = window.open("", "_blank", "width=440,height=700");
    if (!win) {
      alert("يرجى السماح بالنوافذ المنبثقة لطباعة البون");
      return;
    }
    win.document.write(html);
    win.document.close();
  }
}

// ── داتا تجريبية ──

// printPreparationBon(sampleBon);
