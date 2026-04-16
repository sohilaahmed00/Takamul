
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 1. Excel Export (كما هو)
export const exportToExcel = (data: any[], fileName: string, _t: any, direction: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  if (direction === "rtl") worksheet["!views"] = [{ RTL: true }];
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${fileName}_${Date.now()}.xlsx`);
};

// exportUtils.ts - استبدل دالة exportToPDF بالكامل

// export const exportToPDF = async (
//   title: string,
//   filtersInfo: string,
//   data: any[],
//   columns: { header: string; field: string }[]
// ) => {
//   // ── 1. بناء HTML الجدول ──
//   const tableRows = data
//     .map(
//       (row) => `
//       <tr>
//         ${columns.map((col) => `<td>${row[col.field] ?? ""}</td>`).join("")}
//       </tr>`
//     )
//     .join("");

//   const tableHeaders = columns
//     .map((col) => `<th>${col.header}</th>`)
//     .join("");

//   const html = `
//     <!DOCTYPE html>
//     <html dir="rtl" lang="ar">
//     <head>
//       <meta charset="UTF-8"/>
//       <link rel="preconnect" href="https://fonts.googleapis.com"/>
//       <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet"/>
//       <style>
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body {
//           font-family: 'Cairo', Arial, sans-serif;
//           padding: 30px;
//           background: #fff;
//           color: #1a1a1a;
//           direction: rtl;
//         }
//         .header {
//           text-align: center;
//           border-bottom: 2px solid #e2e8f0;
//           padding-bottom: 16px;
//           margin-bottom: 20px;
//         }
//         .header h1 { font-size: 22px; font-weight: 700; }
//         .header p  { font-size: 12px; color: #666; margin-top: 6px; }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 12px;
//         }
//         th {
//           background: #f1f5f9;
//           padding: 10px 8px;
//           border: 1px solid #cbd5e1;
//           font-weight: 700;
//           text-align: center;
//         }
//         td {
//           padding: 9px 8px;
//           border: 1px solid #e2e8f0;
//           text-align: center;
//         }
//         tr:nth-child(even) td { background: #f8fafc; }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>${title}</h1>
//         <p>${filtersInfo}</p>
//       </div>
//       <table>
//         <thead><tr>${tableHeaders}</tr></thead>
//         <tbody>${tableRows}</tbody>
//       </table>
//     </body>
//     </html>
//   `;

//   // ── 2. إنشاء iframe مخفي ──
//   const iframe = document.createElement("iframe");
//   Object.assign(iframe.style, {
//     position: "fixed",
//     top: "-9999px",
//     left: "-9999px",
//     width: "1100px",
//     height: "800px",
//     border: "none",
//     visibility: "hidden",
//   });
//   document.body.appendChild(iframe);

//   await new Promise<void>((resolve) => {
//     iframe.onload = () => resolve();
//     iframe.srcdoc = html;
//   });

//   // ── 3. انتظر تحميل الـ Font ──
//   await iframe.contentDocument?.fonts.ready;
//   await new Promise((r) => setTimeout(r, 300));

//   // ── 4. html2canvas على محتوى الـ iframe ──
//   const iframeBody = iframe.contentDocument!.body;
//   iframeBody.style.width = "1100px";

//   const canvas = await html2canvas(iframeBody, {
//     scale: 2,
//     useCORS: true,
//     backgroundColor: "#ffffff",
//     logging: false,
//     windowWidth: 1100,
//   });

//   document.body.removeChild(iframe);

//   // ── 5. تحويل لـ PDF ──
//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//   const pdfW = pdf.internal.pageSize.getWidth();
//   const pdfH = pdf.internal.pageSize.getHeight();
//   const ratio = canvas.width / canvas.height;
//   const imgH = pdfW / ratio;

//   // لو الصورة أطول من صفحة A4، نقسمها لصفحات
//   let yPos = 0;
//   while (yPos < imgH) {
//     if (yPos > 0) pdf.addPage();
//     pdf.addImage(imgData, "PNG", 0, -yPos, pdfW, imgH);
//     yPos += pdfH;
//   }

//   // ── 6. تحميل الملف ──
//   const blob = pdf.output("blob");
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `${title}_${Date.now()}.pdf`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   setTimeout(() => URL.revokeObjectURL(url), 1000);
// };
export const exportToPDF = async (
  title: string,
  filtersInfo: string,
  data: any[],
  columns: { header: string; field: string }[]
) => {
  const tableRows = data
    .map(
      (row) => `
      <tr>
        ${columns.map((col) => `<td>${row[col.field] ?? ""}</td>`).join("")}
      </tr>`
    )
    .join("");

  const tableHeaders = columns.map((col) => `<th>${col.header}</th>`).join("");

  // ── نفس HTML الطباعة بالضبط ──
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet"/>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Cairo', Arial, sans-serif;
          padding: 30px;
          background: #fff;
          color: #1a1a1a;
          direction: rtl;
          width: 794px; /* A4 width at 96dpi */
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .header h1 { font-size: 22px; font-weight: 700; }
        .header p  { font-size: 12px; color: #666; margin-top: 6px; }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background: #f1f5f9;
          padding: 10px 8px;
          border: 1px solid #cbd5e1;
          font-weight: 700;
          text-align: center;
        }
        td {
          padding: 9px 8px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        tr:nth-child(even) td { background: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>${filtersInfo}</p>
      </div>
      <table>
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    width: "794px",   // ← A4 width بالضبط
    height: "1123px", // ← A4 height بالضبط
    border: "none",
    visibility: "hidden",
  });
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    iframe.srcdoc = html;
  });

  await iframe.contentDocument?.fonts.ready;
  await new Promise((r) => setTimeout(r, 400));

  const iframeBody = iframe.contentDocument!.body;

  const canvas = await html2canvas(iframeBody, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 794,
    width: 794,
  });

  document.body.removeChild(iframe);

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
  
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  
  // نحسب الارتفاع بناءً على نسبة العرض
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

export const printReport = (
  title: string,
  filtersInfo: string,
  data: any[],
  columns: { header: string; field: string }[]
) => {
  const tableRows = data
    .map(
      (row) => `
      <tr>
        ${columns.map((col) => `<td>${row[col.field] ?? ""}</td>`).join("")}
      </tr>`
    )
    .join("");

  const tableHeaders = columns.map((col) => `<th>${col.header}</th>`).join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet"/>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Cairo', Arial, sans-serif;
          padding: 30px;
          background: #fff;
          color: #1a1a1a;
          direction: rtl;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .header h1 { font-size: 22px; font-weight: 700; }
        .header p  { font-size: 12px; color: #666; margin-top: 6px; }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background: #f1f5f9;
          padding: 10px 8px;
          border: 1px solid #cbd5e1;
          font-weight: 700;
          text-align: center;
        }
        td {
          padding: 9px 8px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        tr:nth-child(even) td { background: #f8fafc; }
        @media print {
          body { padding: 15px; }
          @page { margin: 10mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>${filtersInfo}</p>
      </div>
      <table>
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <script>
        document.fonts.ready.then(() => {
          setTimeout(() => { window.print(); window.close(); }, 300);
        });
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};