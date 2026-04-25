import { tafqeet } from "../utils/tafqeet";
import type { BranchInfo } from "@/hooks/useBranch";
import type { Customer } from "@/features/customers/types/customers.types";

export const getA4InvoiceHTML = (order: any, t: any): string => {
  const branch: Partial<BranchInfo> = order.branchInfo   || {};
  const customer: Partial<Customer> = order.customerData || {};
  const items: any[]                = order.items || order.orderItems || [];

  // ── Date formatting ──────────────────────────────────────────────────────────
  let dateVal = order.createdAt || order.date || order.orderDate || order.invoiceDate;
  let formattedDate = "-";
  let formattedTime = "-";
  if (dateVal) {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-GB");
      formattedTime = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
  }

  // ── Customer fields ──────────────────────────────────────────────────────────
  const custName       = customer.customerName       || order.customerName         || "-";
  const custPhone      = customer.mobile             || customer.phone             || order.customerPhone || "-";
  const custTaxNo      = customer.taxNumber          || order.customerTaxNo        || "-";
  const custCommercial = customer.commercialRegister || order.customerCommercialNo || "-";
  const custAddress    = customer.address            || order.customerAddress       || "-";
  const custPostal     = customer.postalCode         || order.customerZipCode       || "-";
  const custSubNo      = customer.additionalNumber   || order.customerSubNo         || "-";
  const custBuilding   = customer.buildingNumber     || order.customerBuildingNo    || "-";
  const invoiceNo      = order.orderNumber || order.invoiceNo || "-";

  // ── Compute items once ───────────────────────────────────────────────────────
  const computedItems = items.map((item: any) => {
    const price    = Number(item.price || item.unitPrice || 0);
    const qty      = Number(item.quantity || 0);
    const subTotal = price * qty;
    const taxAmt   = subTotal * 0.15;
    const netTotal = subTotal + taxAmt;
    return { item, price, qty, subTotal, taxAmt, netTotal };
  });

  const totBeforeVAT = computedItems.reduce((s, r) => s + r.subTotal, 0);
  const totalVAT     = totBeforeVAT * 0.15;
  const discount     = Number(order.discount || 0);
  const finalTotal   = totBeforeVAT + totalVAT - discount;

  const itemRows = computedItems.map(({ item, price, qty, subTotal, taxAmt, netTotal }) => `
    <tr>
      <td style="text-align:right; padding-right:10px;">${item.productName || item.name || "-"}</td>
      <td>${item.unitName || "قطعة"}</td>
      <td>${qty}</td>
      <td>${price.toFixed(2)}</td>
      <td>${subTotal.toFixed(2)}</td>
      <td>${taxAmt.toFixed(2)}</td>
      <td>${netTotal.toFixed(2)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Cairo', sans-serif;
      font-weight: 500;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      background: #fff;
      width: 100%;
      color: #1a1a1a;
      font-size: 10px;
      line-height: 1.4;
    }

    /* ══ HEADER ══ */
    .header-grid {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }
    .header-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .company-title {
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      padding: 4px;
      color: #000;
    }
    .meta-row {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      overflow: hidden;
      min-height: 24px;
      align-items: stretch;
    }
    .meta-label-ar {
      width: 75px;
      font-size: 9px;
      padding: 3px 5px;
      background: #f0f0f0;
      border-left: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #333;
    }
    .meta-value {
      flex: 1;
      font-size: 9px;
      padding: 3px 5px;
      background: #fff;
      border-left: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      white-space: nowrap;
    }
    .meta-label-en {
      width: 60px;
      font-size: 7.5px;
      padding: 3px 4px;
      color: #555;
      background: #fafafa;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .logo-container {
      flex: 0.8;
      border: 1px solid #ccc;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      background: #fafafa;
    }

    /* ══ DOC TYPE BAR ══ */
    .doc-type-bar {
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 6px 12px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #1a1a1a;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      text-align: center;
      flex: 1;
    }

    /* ══ CUSTOMER BOX ══ */
    .section-header {
      background: #f0f0f0;
      padding: 3px 12px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid #ccc;
      border-bottom: none;
      display: inline-block;
      border-radius: 3px 3px 0 0;
      color: #000;
    }
    .customer-box {
      border: 1px solid #ccc;
      margin-bottom: 10px;
      border-radius: 0 3px 3px 3px;
      overflow: hidden;
    }
    .cust-tbl {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    .cust-tbl td {
      border: 1px solid #ccc;
      vertical-align: middle;
    }
    .cust-lbl {
      width: 105px;
      background: #f8f8f8;
      padding: 10px 8px;
      font-size: 9.5px;
      color: #444;
      text-align: right;
      border-left: 1px solid #ccc;
      white-space: nowrap;
    }
    .cust-val {
      padding: 10px 10px;
      font-size: 10px;
      color: #000;
      text-align: right;
    }
    .addr-row td {
      padding: 10px 12px;
      font-size: 9.5px;
      color: #1a1a1a;
      text-align: right;
      line-height: 1.5;
    }

    /* ══ ITEMS TABLE ══ */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .items-table th {
      background: #f0f0f0;
      border: 1px solid #ccc;
      padding: 6px 4px;
      font-size: 10px;
      font-weight: 600;
      text-align: center;
      color: #1a1a1a;
    }
    .items-table th .en-sub {
      display: block;
      font-size: 7.5px;
      color: #555;
      margin-top: 1px;
    }
    .items-table td {
      border: 1px solid #ccc;
      padding: 7px 4px;
      text-align: center;
      font-size: 10px;
      color: #000;
    }

    /* ══ FOOTER SECTION ══ */
    .footer-section {
      display: flex;
      flex-direction: row;
      gap: 12px;
      margin-bottom: 10px;
      align-items: stretch;
    }

    /* QR — صغير على اليمين */
    .qr-section {
      width: 26%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 10px 8px;
      gap: 6px;
      background: #fafafa;
    }
    .qr-code     { width: 75px; height: 75px; }
    .barcode-img { width: 115px; height: 30px; object-fit: contain; }
    .inv-lbl     { font-size: 8px; color: #555; }

    /* الإجماليات — أكبر على الشمال */
    .totals-box {
      flex: 1;
      border: 1px solid #ccc;
      border-radius: 3px;
      overflow: hidden;
    }
    .tot-row {
      display: grid;
      grid-template-columns: 1fr 80px 70px;
      border-bottom: 1px solid #ccc;
      align-items: center;
    }
    .tot-row:last-child { border-bottom: none; }
    .tot-ar  { padding: 8px 12px; font-size: 10px; color: #1a1a1a; text-align: right; background: #f8f8f8; }
    .tot-num { padding: 8px 10px; font-size: 11px; color: #000; text-align: center; border-right: 1px solid #ccc; border-left: 1px solid #ccc; background: #fff; }
    .tot-en  { padding: 8px 8px;  font-size: 8.5px; color: #555; text-align: left; background: #fafafa; }
    .tot-row.hl .tot-ar  { background: #e8e8e8; font-size: 11px; font-weight: 600; }
    .tot-row.hl .tot-num { font-size: 14px; font-weight: 600; background: #f0f0f0; }
    .tot-row.hl .tot-en  { background: #f0f0f0; font-size: 9px; }

    /* ══ NOTES ══ */
    .notes-section {
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 8px 12px;
      margin-bottom: 10px;
      min-height: 40px;
      background: #fafafa;
    }
    .notes-title {
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #1a1a1a;
      text-align: center;
    }

    /* ══ FINAL FOOTER ══ */
    .final-footer {
      text-align: center;
      font-size: 10px;
      padding: 10px 15px;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 3px;
      color: #000;
    }

    /* ══ PRINT ══ */
    @media print {
      body { margin: 0; padding: 0; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>

  <!-- ══ HEADER ══ -->
  <div class="header-grid">
    <div class="header-col">
      <div class="company-title">${branch.name || "-"}</div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("vat_number", "الرقم الضريبي")}</div>
        <div class="meta-value">${branch.taxNumber || "-"}</div>
        <div class="meta-label-en">VAT No.</div>
      </div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("invoice_no", "فاتورة رقم")}</div>
        <div class="meta-value">${invoiceNo}</div>
        <div class="meta-label-en">INV No.</div>
      </div>
    </div>
    <div class="logo-container">
      <img src="${branch.imageUrl || ""}" style="max-height:65px; max-width:100%; object-fit:contain;" />
    </div>
    <div class="header-col">
      <div class="company-title">${branch.nameEn || "-"}</div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("commercial_register", "سجل التجاري")}</div>
        <div class="meta-value">${branch.commercialRegister || "-"}</div>
        <div class="meta-label-en">Commercial No.</div>
      </div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("issue", "إصدار")}</div>
        <div class="meta-value" style="font-size:8px; white-space:nowrap;">${formattedDate} | ${formattedTime}</div>
        <div class="meta-label-en">Release D/T</div>
      </div>
    </div>
  </div>

  <!-- ══ DOC TYPE BAR ══ -->
  <div class="doc-type-bar">
    <div>${t("cash_sales_invoice", "فاتورة مبيعات نقدية")}</div>
    <div class="doc-title">${t("tax_invoice", "فاتورة ضريبية")}</div>
    <div>${t("seller_name", "اسم البائع")} : ${order.createdBy || order.sellerName || order.cashier || "-"}</div>
  </div>

  <!-- ══ CUSTOMER INFO ══ -->
  <div style="margin-bottom:10px;">
    <div style="display:flex; justify-content:flex-start;">
      <div class="section-header">${t("customer_data", "بيانات العميل")}</div>
    </div>
    <div class="customer-box">
      <table class="cust-tbl">
        <tr>
          <td class="cust-lbl">${t("name", "الاسم")} :</td>
          <td class="cust-val">${custName}</td>
          <td class="cust-lbl">${t("phone", "رقم الجوال")} :</td>
          <td class="cust-val">${custPhone}</td>
        </tr>
        <tr>
          <td class="cust-lbl">${t("vat_number", "الرقم الضريبي")} :</td>
          <td class="cust-val">${custTaxNo}</td>
          <td class="cust-lbl">${t("commercial_register", "السجل التجاري")} :</td>
          <td class="cust-val">${custCommercial}</td>
        </tr>
        <tr class="addr-row">
          <td colspan="2" style="border-left: 1px solid #ccc;">
            ${t("national_address", "العنوان الوطني")}: ${custAddress}
          </td>
          <td colspan="2">
            ${t("zip_code", "الرمز البريدي")}: ${custPostal} ،
            ${t("sub_no", "الرقم الفرعي")}: ${custSubNo} ،
            ${t("building_no", "رقم المبنى")}: ${custBuilding}
          </td>
        </tr>
      </table>
    </div>
  </div>

  <!-- ══ ITEMS TABLE ══ -->
  <table class="items-table">
    <thead>
      <tr>
        <th>${t("item_description", "بيان الصنف")}<span class="en-sub">Item Des</span></th>
        <th>${t("unit", "الوحدة")}<span class="en-sub">Unit</span></th>
        <th>${t("quantity", "الكمية")}<span class="en-sub">QTY</span></th>
        <th>${t("price", "السعر")}<span class="en-sub">price</span></th>
        <th>${t("sub_total", "اجمالي فرعي")}<span class="en-sub">Sub Total</span></th>
        <th>${t("tax", "الضريبة")}<span class="en-sub">Tax %15</span></th>
        <th>${t("net_total", "الاجمالي النهائي")}<span class="en-sub">Net Total</span></th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- ══ FOOTER: QR (يمين صغير) + إجماليات (شمال أكبر) ══ -->
  <div class="footer-section">
    <div class="qr-section">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(invoiceNo)}" class="qr-code" alt="QR"/>
      <div class="inv-lbl">${invoiceNo}</div>
      <img src="https://www.barcodesinc.com/generator/image.php?code=${encodeURIComponent(invoiceNo)}&style=196&type=C128B&width=115&height=30&xres=1&font=3" class="barcode-img" alt="Barcode"/>
    </div>
    <div class="totals-box">
      <div class="tot-row">
        <div class="tot-ar">${t("items_count", "عدد المنتجات")}</div>
        <div class="tot-num">${items.length}</div>
        <div class="tot-en">Items</div>
      </div>
      <div class="tot-row">
        <div class="tot-ar">${t("tot_before_vat", "اجمالي السعر قبل الضريبة")}</div>
        <div class="tot-num">${totBeforeVAT.toFixed(2)}</div>
        <div class="tot-en">Tot Before VAT</div>
      </div>
      <div class="tot-row">
        <div class="tot-ar">${t("total_discount", "اجمالي الخصم")}</div>
        <div class="tot-num">${discount.toFixed(2)}</div>
        <div class="tot-en">Discount</div>
      </div>
      <div class="tot-row">
        <div class="tot-ar">${t("total_vat", "ضريبة القيمة المضافة")}</div>
        <div class="tot-num">${totalVAT.toFixed(2)}</div>
        <div class="tot-en">Total VAT %15</div>
      </div>
      <div class="tot-row hl">
        <div class="tot-ar">${t("final_total", "الاجمالي النهائي")}</div>
        <div class="tot-num">${finalTotal.toFixed(2)}</div>
        <div class="tot-en">NET TOTAL</div>
      </div>
    </div>
  </div>

  <!-- ══ NOTES ══ -->
  <div class="notes-section">
    <div class="notes-title">${t("invoice_notes", "ملاحظات علي الفاتورة")}</div>
    <div style="font-size:9.5px; color:#444;">${order.notes || t("no_notes", "لا توجد ملاحظات")}</div>
  </div>

  <!-- ══ FINAL FOOTER ══ -->
  <div class="final-footer">
    ${t("branch_address", "عنوان المؤسسة")} : ${branch.address || branch.street || "-"}
  </div>

</body>
</html>`;
};