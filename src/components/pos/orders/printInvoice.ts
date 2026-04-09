// printInvoice.ts — thermal 80mm — matches design exactly

import { printHtmlSilently } from "@/lib/qzService";

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

export async function printInvoice(data: InvoiceData): Promise<void> {
  const fmt = (n: number | undefined | null) => (typeof n === "number" && !isNaN(n) ? n.toFixed(2) : "0.00");

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<style>
  body {
    width: 72mm;
    margin: 0;
    padding: 4px;
    font-family: Tahoma, Arial, sans-serif;
    font-size: 10pt;
    direction: rtl;
  }
  h2 { text-align: center; font-size: 12pt; margin-bottom: 6px; }
  p { margin: 3px 0; font-size: 9pt; }
  hr { border: 1px dashed #000; margin: 6px 0; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  th, td { border: 1px solid #000; padding: 2px 4px; text-align: center; }
  th { background: #eee; }
  .total { font-weight: bold; font-size: 10pt; text-align: center; margin-top: 6px; }
</style>
</head>
<body>

  <h2>${data.institutionName}</h2>
  <hr/>
  <p>رقم الفاتورة: ${data.invoiceNumber}</p>
  <p>التاريخ: ${data.invoiceDate}</p>
  <p>العميل: ${data.customerName ?? "—"}</p>
  <hr/>

  <table>
    <thead>
      <tr>
        <th>الصنف</th>
        <th>الكمية</th>
        <th>السعر</th>
        <th>الإجمالي</th>
      </tr>
    </thead>
    <tbody>
      ${data.items
        .map(
          (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.quantity}</td>
          <td>${fmt(item.unitPrice)}</td>
          <td>${fmt(item.total)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <hr/>
  <p>قبل الضريبة: ${fmt(data.subTotal)} ر.س</p>
  <p>الضريبة: ${fmt(data.taxAmount)} ر.س</p>
  <p class="total">الإجمالي: ${fmt(data.grandTotal)} ر.س</p>
  <hr/>
  <p style="text-align:center">${data.institutionAddress}</p>

</body>
</html>`;

  try {
    await printHtmlSilently(html);
  } catch (err: any) {
    console.error("Print error:", err);
  }
}
