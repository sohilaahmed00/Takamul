export const getStockReceiptHTML = (order: any, t: any): string => {
  let dateVal = order.createdAt || order.date || order.invoiceDate || order.issueDate || order.created_at || order.saleDate;
  console.log("order", order);
  if (!dateVal) {
    for (const key in order) {
      if (key.toLowerCase().includes("date") && order[key]) {
        dateVal = order[key];
        break;
      }
    }
  }

  let formattedDate = "-";
  if (dateVal) {
    if (dateVal instanceof Date) {
      formattedDate = dateVal.toLocaleDateString("en-GB");
    } else if (typeof dateVal === "string") {
      const cleanDate = dateVal.split(" ")[0].split("T")[0];
      formattedDate = cleanDate;
      const p = cleanDate.includes("/") ? cleanDate.split("/") : cleanDate.includes("-") ? cleanDate.split("-") : [];
      if (p.length === 3) {
        const d = p[0].length === 4 ? new Date(`${p[0]}-${p[1]}-${p[2]}`) : new Date(`${p[2]}-${p[1]}-${p[0]}`);
        if (!isNaN(d.getTime())) formattedDate = d.toLocaleDateString("en-GB");
      }
    }
  }

  const items = order.items || order.orderItems || [];

  const itemRows = items
    .map(
      (item: any) => `
    <tr>
      <td style="border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; font-weight: 700;">
        ${item.productName || item.name}
      </td>
      <td style="border-left: 1px solid #e2e8f0; padding: 10px; font-weight: 700;">
        ${item.unitName || "قطعة"}
      </td>
      <td style="padding: 10px; font-weight: 700;">${item.quantity}</td>
    </tr>
  `,
    )
    .join("");

  const emptyRows = Array(Math.max(0, 10 - items.length))
    .fill(0)
    .map(
      () => `
    <tr style="height: 35px;">
      <td style="border-left: 1px solid #e2e8f0;"></td>
      <td style="border-left: 1px solid #e2e8f0;"></td>
      <td></td>
    </tr>
  `,
    )
    .join("");

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    @page { size: A4 portrait; margin: 8mm; margin-top: 0; margin-bottom: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
    body { padding: 5mm; background: #fff; width: 100%; color: #334155; }

    .header-grid {
      display: grid;
      grid-template-columns: 1fr 0.8fr 1fr;
      gap: 10px;
      margin-bottom: 5px;
    }
    .header-col { display: flex; flex-direction: column; gap: 5px; }
    .company-title { font-size: 14px; font-weight: 800; text-align: center; margin-bottom: 5px; padding: 5px; }

    .meta-row {
      display: grid;
      grid-template-columns: 1.2fr 1.3fr 0.7fr;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      font-size: 10px;
      text-align: center;
      align-items: center;
    }
    .meta-label-ar { font-weight: 800; padding: 4px; border-right: 1px solid #e2e8f0; background: #f1f5f9; white-space: nowrap; }
    .meta-value { font-weight: 900; padding: 4px; border-right: 1px solid #e2e8f0; background: #fff; min-height: 24px; display: flex; align-items: center; justify-content: center; white-space: nowrap; }
    .meta-label-en { font-weight: 700; padding: 4px; color: #64748b; font-size: 8px; white-space: nowrap; }

    .logo-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 80px;
    }

    .doc-type-bar {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 8px;
      text-align: center;
      font-size: 16px;
      font-weight: 900;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    .customer-section { margin-bottom: 15px; }
    .section-header {
      background: #f1f5f9;
      padding: 4px 15px;
      font-size: 13px;
      font-weight: 900;
      border: 1px solid #e2e8f0;
      border-bottom: none;
      display: inline-block;
      margin-left: auto;
      border-radius: 4px 4px 0 0;
    }
    .customer-info-box {
      border: 1px solid #e2e8f0;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
    }
    .info-group { display: flex; gap: 10px; font-size: 13px; font-weight: 800; }
    .info-label { color: #64748b; }
    .info-val { color: #0f172a; }
    .v-separator { width: 1px; height: 20px; background: #e2e8f0; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px;
      font-size: 12px;
      font-weight: 900;
      text-align: center;
    }
    th .en-sub { display: block; font-size: 9px; font-weight: 700; color: #64748b; margin-top: -2px; }
    td { border: 1px solid #e2e8f0; padding: 8px; text-align: center; font-size: 13px; font-weight: 800; }

    .signatures { margin-top: 30px; display: flex; justify-content: space-around; }
    .sig-block { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .sig-line { width: 180px; border-bottom: 1.5px solid #cbd5e1; margin-bottom: 5px; }
    .sig-text { font-size: 13px; font-weight: 900; }
  </style>
</head>
<body>
  <div class="header-grid">
    <div class="header-col">
      <div class="company-title">${order.branchInfo?.name || "-"}</div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("vat_number", "الرقم الضريبي")}</div>
        <div class="meta-value">${order.branchInfo?.taxNumber || "-"}</div>
        <div class="meta-label-en">VAT No.</div>
      </div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("invoice_no", "فاتورة رقم")}</div>
        <div class="meta-value">${order.orderNumber || order.invoiceNo || "-"}</div>
        <div class="meta-label-en">INV No.</div>
      </div>
    </div>

    <div class="logo-container">
      <img
        src="${order.branchInfo?.imageUrl}"
        style="max-height: 70px; max-width: 100%; object-fit: contain;"
      />
    </div>

    <div class="header-col">
      <div class="company-title">${order.branchInfo?.nameEN || "-"}</div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("commercial_register", "سجل التجاري")}</div>
        <div class="meta-value">${order.branchInfo?.commercialRegister || order.commercialNo || "-"}</div>
        <div class="meta-label-en">Commercial No.</div>
      </div>
      <div class="meta-row">
        <div class="meta-label-ar">${t("issue", "إصدار")}</div>
        <div class="meta-value" style="font-size: 7.5px;">${formattedDate} | ${currentTime}</div>
        <div class="meta-label-en">Release D/T</div>
      </div>
    </div>
  </div>

  <div class="doc-type-bar">
    <div style="font-size: 18px; font-weight: 900; color: #1e293b;">
      ${t("stock_receipt", "اذن مخزني")}
    </div>
  </div>

  <div class="customer-section">
    <div style="display: flex; justify-content: flex-start;">
      <div class="section-header">${t("customer_data", "بيانات العميل")}</div>
    </div>
    <div class="customer-info-box">
      <div class="info-group">
        <span class="info-label">${t("name", "الاسم")} :</span>
        <span class="info-val">${order.customerName || order.customer || t("cash_customer", "عميل نقدي")}</span>
      </div>
      <div class="v-separator"></div>
      <div class="info-group">
        <span class="info-label">${t("phone", "رقم الجوال")} :</span>
        <span class="info-val">${order.customerPhone && order.customerPhone !== "-" ? order.customerPhone : "-"}</span>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50%;">
          ${t("item_description", "بيان الصنف")}
          <span class="en-sub">Item Des</span>
        </th>
        <th style="width: 25%;">
          ${t("unit", "الوحدة")}
          <span class="en-sub">Unit</span>
        </th>
        <th style="width: 25%;">
          ${t("quantity", "الكمية")}
          <span class="en-sub">QTY</span>
        </th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      ${emptyRows}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-text">${t("recipient_signature", "توقيع المستلم")}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-text">${t("warehouse_keeper", "أمين المستودع")}</div>
    </div>
  </div>
</body>
</html>`;
};
