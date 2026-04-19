import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { tafqeet } from "./tafqeet";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// =============================================
// PDF Export - للتقارير (جداول وكشوفات)
// =============================================
export const exportCustomPDF = async (
  title: string,
  htmlString: string,
  orientation: "portrait" | "landscape" = "portrait",
  width: number = 794
) => {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    width: `${width}px`,
    height: "2000px",
    border: "none",
    visibility: "hidden",
  });
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    iframe.srcdoc = htmlString;
  });

  await iframe.contentDocument?.fonts.ready;
  await new Promise((r) => setTimeout(r, 500));

  const iframeBody = iframe.contentDocument!.body;
  const actualHeight = iframeBody.scrollHeight;
  iframe.style.height = `${actualHeight}px`;

  const canvas = await html2canvas(iframeBody, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: width,
    width: width,
    height: actualHeight,
  });

  document.body.removeChild(iframe);

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation, unit: "px", format: "a4" });

  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  const canvasRatio = canvas.height / canvas.width;
  const imgH = pdfW * canvasRatio;

  let yPos = 0;
  let pageCount = 0;

  while (yPos < imgH) {
    if (pageCount > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -yPos, pdfW, imgH);
    yPos += pdfH;
    pageCount++;
  }

  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// =============================================
// Print Voucher - سند قبض / صرف (ورقة واحدة A4)
// =============================================
export const printVoucher = (htmlString: string) => {
  const w = 900;
  const h = 700;
  const left = window.screen.width / 2 - w / 2;
  const top = window.screen.height / 2 - h / 2;
  const win = window.open("", "_blank", `width=${w},height=${h},left=${left},top=${top}`);
  if (!win) return;

  const printCSS = `
    @page { size: A4 portrait; margin: 10mm 10mm; }
    @media print {
      html, body {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 5mm !important;
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `;

  const injected = htmlString.includes("</head>")
    ? htmlString.replace("</head>", `<style>${printCSS}</style></head>`)
    : `<style>${printCSS}</style>` + htmlString;

  win.document.open();
  win.document.write(injected);
  win.document.close();

  win.document.fonts.ready.then(() => {
    setTimeout(() => {
      win.focus();
      win.print();
      setTimeout(() => win.close(), 1000);
    }, 600);
  });
};

// =============================================
// Export Voucher as PDF - سند قبض / صرف
// =============================================
export const exportVoucherPDF = (title: string, htmlString: string) => {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "210mm",
    height: "297mm",
    border: "none",
    opacity: "0",
    zIndex: "-9999",
    pointerEvents: "none",
  });

  const htmlWithPrint = htmlString.replace(
    "</body>",
    `<script>
      document.fonts.ready.then(() => {
        setTimeout(() => {
          window.print();
        }, 800);
      });
    </script>
    </body>`
  );

  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 5000);
  };

  iframe.srcdoc = htmlWithPrint;
};

// =============================================
// printCustomHTML - للتقارير العامة
// =============================================
export const printCustomHTML = (title: string, htmlString: string) => {
  printVoucher(htmlString);
};

// =============================================
// Voucher HTML Template
// =============================================
const gStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', Arial, sans-serif;
    padding: 30px 45px;
    background: #fff;
    color: #1a1a1a;
    width: 794px;
    margin: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
  @media print {
    body { 
      padding: 10px 10px !important; 
      width: 100% !important; 
      box-sizing: border-box !important; 
    }
    @page { margin: 10mm 5mm; }
    table { font-size: 10px !important; margin-bottom: 10px; }
    th { padding: 6px 3px !important; }
    td { padding: 5px 3px !important; }
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 16px;
    margin-bottom: 20px;
  }
  .header h1 { font-size: 22px; font-weight: 700; color: #0f172a; }
  .header p { font-size: 13px; color: #475569; margin-top: 6px; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }
  th {
    background: #f8fafc;
    padding: 8px 4px;
    border: 1px solid #e2e8f0;
    font-weight: 700;
    text-align: center;
    color: #334155;
    white-space: nowrap;
  }
  td {
    padding: 6px 4px;
    border: 1px solid #e2e8f0;
    text-align: center;
    color: #0f172a;
    white-space: nowrap;
  }
  tr:nth-child(even) td { background: #fdfdfd; }
  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .s-box.blue { background-color: #3b82f6 !important; }
    .s-box.green { background-color: #10b981 !important; }
    .s-box.orange { background-color: #f97316 !important; }
  }
`;

export const getVoucherHTML = (type: "receipt" | "payment", data: any, t: any, lang: any = "ar") => {
  const isReceipt = type === "receipt";
  const arTitle = isReceipt ? t("receipt_bond", "سند قبض") : t("payment_bond", "سند صرف");
  const enTitle = isReceipt ? "RECEIPT VOUCHER" : "PAYMENT VOUCHER";
  const arPartyLabel = isReceipt
    ? t("received_from", "استلمنا من السيد / السادة :")
    : t("to_mrs", "يصرف للسيد / السادة :");
  const enPartyLabel = isReceipt ? "Received From M/s." : "Pay To M/s.";
  const amountStr = Number(data.amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  return `<!DOCTYPE html>
<html dir="${t("dir", "rtl")}" lang="${t("lang", "ar")}">
<head>
  <meta charset="UTF-8"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html {
      /* ← التغيير: بدل 210mm نخلي html يملا الـ viewport اللي هو الـ iframe */
      width: 100%;
    }

    body {
      font-family: 'Cairo', Arial, sans-serif;
      background: #fff;
      color: #000;
      /* ← التغيير: نسبة مئوية بدل mm الثابتة عشان يتوافق مع عرض الـ iframe */
      width: 100%;
      margin: 0 auto;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* ← إضافة: تأكيد الـ layout عند الطباعة */
    @media print {
      html, body {
        width: 100% !important;
        direction: rtl;
        padding: 0 10mm !important;
        box-sizing: border-box !important;
      }
      .voucher-border {
        width: 100% !important;
        border: 3px double #3b3b3b !important;
        box-sizing: border-box !important;
      }
    }

    .voucher-border {
      border: 3px double #3b3b3b;
      padding: 12mm 10mm;
      width: 100%;
      box-sizing: border-box;
    }
    .header-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .logo-box {
      width: 25%;
      text-align: center;
      font-weight: 800;
      font-size: 15px;
      color: #333;
    }
    .title-box {
      width: 50%;
      text-align: center;
    }
    .title-box h1 {
      font-size: 22px;
      font-weight: 800;
      border: 2px solid #333;
      border-radius: 10px;
      display: inline-block;
      padding: 2px 22px;
      margin-bottom: 4px;
    }
    .title-box p {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .sub-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }
    .meta-data table {
      width: auto;
      font-size: 12px;
      font-weight: 700;
      border: none;
      border-collapse: collapse;
    }
    .meta-data td, .meta-data th {
      border: none;
      padding: 3px 5px;
      text-align: right;
    }
    .amount-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .amount-display-inner {
      border: 2px solid #333;
      padding: 4px 14px;
      font-size: 17px;
      font-weight: 800;
      min-width: 120px;
      text-align: center;
      background: #fdfbf7 !important;
    }
    .amount-display-labels {
      font-size: 11px;
      font-weight: 700;
      text-align: center;
      line-height: 1.4;
    }
    .content-rows { margin-bottom: 16px; }
    .c-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: 700;
    }
    .c-label-ar { white-space: nowrap; padding-left: 6px; }
    .c-value {
      flex: 1;
      border-bottom: 1px dotted #666;
      text-align: center;
      padding: 0 6px 2px;
      color: #111;
    }
    .c-label-en {
      white-space: nowrap;
      padding-right: 6px;
      font-family: Arial, sans-serif;
      font-size: 10px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
      padding: 0 8px;
    }
    .sig-col {
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      width: 30%;
    }
    .sig-line {
      border-bottom: 1px solid #333;
      margin-top: 30px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div class="voucher-border">
    <div class="header-grid" dir="rtl">
      <div class="logo-box" style="display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:18px;color:#1e3a8a;font-weight:900;">${t("takamul_data", "تكامل البيانات")}</div>
      </div>
      <div class="title-box">
        <h1>${arTitle}</h1>
        <p>${enTitle}</p>
      </div>
      <div class="logo-box" style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:38px;height:38px;border:3px solid #1e3a8a;border-radius:50%;display:inline-block;line-height:32px;font-size:22px;font-weight:900;color:#1e3a8a;text-align:center;">T</div>
      </div>
    </div>

    <div class="sub-header" dir="rtl">
      <div class="meta-data">
        <table>
          <tr>
            <th>${t("date", "التاريخ")} :</th>
            <td style="border-bottom:1px dotted #333;width:85px;text-align:center;">
              ${new Date(data.transactionDate || Date.now()).toLocaleDateString("en-GB")}
            </td>
            <th style="font-family:Arial;font-size:10px;">: Date</th>
          </tr>
          <tr>
            <th>${t("number", "رقم")} :</th>
            <td style="border-bottom:1px dotted #333;width:85px;text-align:center;">${data.id || "-"}</td>
            <th style="font-family:Arial;font-size:10px;">: No</th>
          </tr>
        </table>
      </div>
      <div class="amount-display">
        <div class="amount-display-labels">
          <div>${t("currency", "ريال")}</div>
          <div>S. R.</div>
        </div>
        <div class="amount-display-inner">${amountStr}</div>
      </div>
    </div>

    <div class="content-rows" dir="rtl">
      <div class="c-row">
        <div class="c-label-ar">${arPartyLabel}</div>
        <div class="c-value">${data.partyName || data.customerName || data.supplierName || "-"}</div>
        <div class="c-label-en" dir="ltr">${enPartyLabel}</div>
      </div>
      <div class="c-row">
        <div class="c-label-ar">${t("the_sum_of", "مبلغ وقدره :")}</div>
        <div class="c-value">${tafqeet(data.amount || 0, lang)}</div>
        <div class="c-label-en" dir="ltr">The sum of S.R.</div>
      </div>
      <div class="c-row">
        <div class="c-label-ar">${t("being", "وذلك عن / يمثل :")}</div>
        <div class="c-value">${data.description || "-"}</div>
        <div class="c-label-en" dir="ltr">Being</div>
      </div>
      <div class="c-row">
        <div class="c-label-ar">${t("bank_cash", "طريقة الدفع / البنك :")}</div>
        <div class="c-value">${data.treasuryName || t("cash", "نقداً")}</div>
        <div class="c-label-en" dir="ltr">Bank / Cash</div>
      </div>
    </div>

    <div class="signatures" dir="rtl">
      <div class="sig-col">
        <div><span dir="ltr">Accountant</span> ${t("accountant", "المحاسب")}</div>
        <div class="sig-line"></div>
      </div>
      <div class="sig-col">
        <div><span dir="ltr">Receiver</span> ${t("receiver", "المستلم")}</div>
        <div class="sig-line"></div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// =============================================
// Treasury Statement
// =============================================
export const getTreasuryHTML = (title: string, filtersInfo: string, data: any[], columns: any[], t: any, direction: "rtl" | "ltr" = "rtl") => {
  const tableRows = data.map((row, i) => {
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${row.type || "-"}</td>
        <td>${row.date ? new Date(row.date).toLocaleDateString("en-GB") : "-"}</td>
        <td>${row.number || "-"}</td>
        <td>${row.partyName || "-"}</td>
        <td style="color:#d97706;font-weight:700;">${row.debit > 0 ? Number(row.debit).toLocaleString() : (row.credit > 0 ? Number(row.credit).toLocaleString() : "-")}</td>
        <td style="font-weight:bold;color:#059669;">
          ${row.balance > 0 ? '<span style="color:#1d4ed8;">↑</span>' : '<span style="color:#dc2626;">↓</span>'}
          ${Number(row.balance).toLocaleString()}
        </td>
      </tr>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${direction === "rtl" ? "ar" : "en"}">
    <head>
      <meta charset="UTF-8"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>${gStyles}</style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>${filtersInfo.split(" | ").join("<br/>")}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>${t("serial","م")}</th>
            <th>${t("movement_type","نوع الحركة")}</th>
            <th>${t("date","التاريخ")}</th>
            <th>${t("document_number","رقم المستند")}</th>
            <th>${t("party_name","اسم الجهة")}</th>
            <th>${t("amount","المبلغ")}</th>
            <th>${t("balance","الرصيد")}</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;
};

// =============================================
// Account Statement
// =============================================
export const getAccountStatementHTML = (
  title: string,
  partyInfo: { name: string; label: string },
  filtersInfo: string,
  summary: { total1: number; label1: string; total2: number; label2: string; total3: number; label3: string; tableCol1?: string; tableCol2?: string },
  data: any[],
  t: any,
  direction: "rtl" | "ltr" = "rtl"
) => {
  const tableRows = data.map((row, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${row.date ? new Date(row.date).toLocaleDateString("en-GB") : "-"}</td>
      <td>${row.type || "-"} <span style="color:#666;font-size:11px;margin:0 5px;">${row.reference ? `(${row.reference})` : ""}</span></td>
      <td style="color:#dc2626;font-weight:600;">${row.debit > 0 ? Number(row.debit).toLocaleString() : "-"}</td>
      <td style="color:#059669;font-weight:600;">${row.credit > 0 ? Number(row.credit).toLocaleString() : "-"}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${direction === "rtl" ? "ar" : "en"}">
    <head>
      <meta charset="UTF-8"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>
        ${gStyles}
        .summary-boxes { display:flex; gap:15px; margin-bottom:30px; }
        .s-box { 
          flex:1; 
          padding:15px; 
          border-radius:12px; 
          text-align:right; 
          border: 1px solid #e2e8f0;
          background: #fff;
        }
        .s-box h4 { 
          font-size:11px; 
          color:#64748b; 
          margin-bottom:6px; 
          font-weight:700; 
          text-transform: uppercase;
        }
        .s-box h2 { 
          font-size:20px; 
          font-weight:800; 
          margin:0; 
          color:#0f172a; 
        }
        .s-box.blue { border-left: 4px solid #3b82f6; }
        .s-box.green { border-left: 4px solid #10b981; }
        .s-box.orange { border-left: 4px solid #f97316; }
        [dir="rtl"] .s-box.blue { border-left: 0; border-right: 4px solid #3b82f6; }
        [dir="rtl"] .s-box.green { border-left: 0; border-right: 4px solid #10b981; }
        [dir="rtl"] .s-box.orange { border-left: 0; border-right: 4px solid #f97316; }
      </style>
    </head>
    <body style="-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;">
      <table style="border:none;margin-bottom:25px;border-bottom:2px solid #e2e8f0;padding-bottom:15px;width:100%;">
        <tr>
          <td style="width:33%;border:none;text-align:right;vertical-align:top;">
            <table style="width:auto;border:none;float:right;margin:0;">
              <tr>
                <th style="padding:4px 10px;border:none;font-size:14px;background:transparent;text-align:right;color:#475569;">${partyInfo.label} :</th>
                <td style="font-weight:bold;padding:4px 10px;border:none;font-size:14px;text-align:right;">${partyInfo.name}</td>
              </tr>
            </table>
          </td>
          <td style="width:34%;border:none;text-align:center;vertical-align:top;">
            <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin-bottom:5px;margin-top:0;">${title}</h2>
            <p style="font-size:14px;color:#475569;font-weight:600;margin:0;">${t("account_statement","Account Statement")}</p>
          </td>
          <td style="width:33%;border:none;text-align:left;vertical-align:top;">
            <div style="background:#f8fafc !important;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;text-align:right;direction:${direction};display:inline-block;">
              ${filtersInfo.split(" | ").join("<br/>")}
            </div>
          </td>
        </tr>
      </table>
      <div class="summary-boxes" dir="rtl">
        <div class="s-box blue">
          <h4>${summary.label3}</h4><h2>${Number(summary.total3).toLocaleString()} <span style="font-size:12px;color:#64748b;">${t("currency_sar", "ر.س")}</span></h2>
        </div>
        <div class="s-box green">
          <h4>${summary.label2}</h4><h2>${Number(summary.total2).toLocaleString()} <span style="font-size:12px;color:#64748b;">${t("currency_sar", "ر.س")}</span></h2>
        </div>
        <div class="s-box orange">
          <h4>${summary.label1}</h4><h2>${Number(summary.total1).toLocaleString()} <span style="font-size:12px;color:#64748b;">${t("currency_sar", "ر.س")}</span></h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>${t("serial","م")}</th>
            <th>${t("date","التاريخ")}</th>
            <th>${t("type","النوع")}</th>
            <th>${summary.tableCol1 || summary.label1}</th>
            <th>${summary.tableCol2 || summary.label2}</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;
};

// =============================================
// Quantity Adjustments
// =============================================
export const getQuantityAdjustmentHTML = (data: any, lines: any[], t: any, direction: "rtl" | "ltr" = "rtl") => {
  const tableRows = lines.map((row, i) => {
    const typeTranslated = row.type === "IN"
      ? t("in", "إضافة")
      : row.type === "OUT"
      ? t("out", "خصم")
      : t(row.type?.toLowerCase() || "", row.type || "-");
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${row.productName || "-"} <span style="color:#666;font-size:11px;margin:0 5px;">${row.barcode ? `(${row.barcode})` : ""}</span></td>
        <td>${typeTranslated}</td>
        <td style="font-weight:700;">${Number(row.quantity || 0).toLocaleString()}</td>
      </tr>
    `;
  }).join("");

  const totalQty = lines.reduce((s, r) => s + Number(r.quantity || 0), 0);

  return `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${direction === "rtl" ? "ar" : "en"}">
    <head>
      <meta charset="UTF-8"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>
        ${gStyles}
        .header-boxes { display:flex; justify-content:center; gap:40px; margin-bottom:30px; }
        .h-box { text-align:center; width:150px; }
        .h-box .title { font-weight:700; margin-bottom:8px; }
        .h-box .value { border:1px solid #e2e8f0; padding:8px; border-radius:6px; background:#f8fafc; }
        .footer-info { margin-top:30px; display:flex; flex-direction:column; align-items:flex-start; gap:10px; }
        .summary-total { border:1px solid #000; display:flex; font-weight:700; }
        .summary-total div { padding:8px 15px; }
        .summary-total div:first-child { border-left:1px solid #000; }
      </style>
    </head>
    <body>
      <div style="text-align:center;margin-bottom:40px;">
        <h2 style="font-size:20px;font-weight:800;">${t("quantity_adjustments","تعديلات كمية")}</h2>
      </div>
      <div class="header-boxes">
        <div class="h-box">
          <div class="title">${t("warehouse","المخزن")}</div>
          <div class="value">${data.warehouseName || "-"}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>${t("serial","م")}</th>
            <th>${direction === "ltr" ? "Barcode / Name" : "باركود / اسم"}</th>
            <th>${t("type","نوع")}</th>
            <th>${t("quantity","كمية")}</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer-info">
        <div class="summary-total">
          <div>${totalQty}</div>
          <div>${t("total_quantities","إجمالي الكميات")}</div>
        </div>
        <div style="margin-top:20px;font-size:14px;color:#333;">
          <div>${t("data_entry","مدخل البيانات")} : ${data.performedBy || "-"}</div>
          <div>${t("date","التاريخ")} : ${data.operationDate ? new Date(data.operationDate).toLocaleDateString("en-GB") : "-"}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// =============================================
// Standardized Report HTML Template
// =============================================
export const generateReportHTML = (
  title: string,
  filtersInfo: string,
  summaryCards: { title: string; value: any; suffix?: string; color?: string }[],
  columns: { header: string; field: string; body?: (row: any) => string }[],
  data: any[],
  t: any,
  direction: "rtl" | "ltr" = "rtl"
) => {
  const tableHeaders = columns.map(col => `<th>${col.header}</th>`).join("");
  const tableRows = data.map((row, i) => {
    const cells = columns.map(col => {
      let val = "";
      if (col.field === "serial") {
        val = (i + 1).toString();
      } else if (col.body) {
        val = col.body(row);
      } else {
        const parts = col.field.split(".");
        let tempVal = row;
        for (const p of parts) {
          tempVal = tempVal ? tempVal[p] : "-";
        }
        val = tempVal !== null && tempVal !== undefined ? tempVal : "-";
      }
      return `<td>${val}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  const filtersArray = typeof filtersInfo === 'string' ? filtersInfo.split(" | ") : [];
  const filtersHTML = filtersArray.length > 0 
    ? `<div class="filters-row">
        ${filtersArray.map(f => {
          const parts = f.split(": ");
          if (parts.length < 2) return "";
          const label = parts[0];
          const value = parts.slice(1).join(": ");
          return `
            <div class="filter-item">
              <span class="filter-label">${label}:</span>
              <span class="filter-value">${value || '-'}</span>
            </div>
          `;
        }).join("")}
       </div>`
    : "";

  const cardsHTML = (summaryCards && summaryCards.length > 0) 
    ? `<div class="report-cards-container">
        ${summaryCards.map(card => {
          const colorHex = card.color === 'blue' ? '#3b82f6' : 
                          card.color === 'green' ? '#10b981' : 
                          card.color === 'orange' ? '#f59e0b' : 
                          card.color === 'red' ? '#ef4444' : 
                          card.color === 'purple' ? '#8b5cf6' : 
                          card.color === 'teal' ? '#14b8a6' : '#3b82f6';
          return `
            <div class="report-card ${card.color || 'blue'}">
              <div class="card-accent" style="background-color: ${colorHex}"></div>
              <div class="card-content">
                <div class="card-title">${card.title}</div>
                <div class="card-value">
                  ${card.value}
                  ${card.suffix ? `<span class="card-suffix">${card.suffix}</span>` : ""}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>`
    : "";

  const customStyles = `
    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      direction: ${direction};
    }
    .filter-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 5px 12px;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    .filter-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
      white-space: nowrap;
    }
    .filter-value {
      font-size: 11px;
      color: #0f172a;
      font-weight: 700;
      white-space: nowrap;
    }
    .report-cards-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 30px;
      direction: ${direction};
    }
    .report-card {
      background: #fff !important;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 180px;
      flex: 1;
      text-align: ${direction === 'rtl' ? 'right' : 'left'};
      position: relative;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .card-accent {
      position: absolute;
      top: 0;
      ${direction === 'rtl' ? 'right: 0;' : 'left: 0;'}
      width: 4px;
      height: 100%;
    }
    
    .card-content {
      flex: 1;
    }
    .card-title {
      font-size: 10px;
      color: #64748b;
      font-weight: 700;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    .card-value {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .card-suffix {
      font-size: 10px;
      color: #94a3b8;
    }
  `;

  return `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${direction === "rtl" ? "ar" : "en"}">
    <head>
      <meta charset="UTF-8"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <style>
        ${gStyles}
        ${customStyles}
      </style>
    </head>
    <body style="-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
      <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="font-size: 16px; font-weight: 800; color: #1e40af;">${t("takamul_data", "تكامل البيانات")}</div>
          <h1 style="margin: 0; font-size: 20px;">${title}</h1>
          <div style="font-size: 11px; color: #64748b;">${new Date().toLocaleString(direction === 'rtl' ? 'ar-SA' : 'en-GB')}</div>
        </div>
      </div>
      
      ${filtersHTML}
      ${cardsHTML}

      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      
      <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center;">
        ${t("printed_via_takamul", "تمت الطباعة عبر نظام تكامل لإدارة البيانات")}
      </div>
    </body>
    </html>
  `;
};

// =============================================
// Excel Export - الموحد لكافة التقارير
// =============================================
export const exportToExcel = (
  data: any[],
  columns: { header: string; field: string; body?: (row: any) => any }[],
  fileName: string
) => {
  const excelData = data.map((row, i) => {
    const obj: any = {};
    columns.forEach((col) => {
      let val = "";
      if (col.field === "serial") {
        val = (i + 1).toString();
      } else if (col.body) {
        val = col.body(row);
        // إذا كانت القيمة كائن (React Element)، نحاول استخراج النص منه
        if (typeof val === "object" && val !== null && (val as any).props && (val as any).props.children) {
          val = (val as any).props.children;
        }
      } else {
        const parts = col.field.split(".");
        let tempVal = row;
        for (const p of parts) {
          tempVal = tempVal ? tempVal[p] : "-";
        }
        val = tempVal !== null && tempVal !== undefined ? tempVal : "-";
      }
      if (col.header) {
        obj[col.header] = val !== null && val !== undefined ? String(val) : "-";
      }
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
  // ضبط اتجاه الورقة ليكون من اليمين لليسار إذا كان العنوان بالعربي
  worksheet["!views"] = [{ RTL: true }];

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}_${Date.now()}.xlsx`);
};
