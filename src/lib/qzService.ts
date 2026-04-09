import * as qz from "qz-tray";
import { sha256 } from "js-sha256";

// إعداد QZ
qz.api.setSha256Type((data: any) => sha256(data));
qz.api.setPromiseType((resolver: any) => new Promise(resolver));

// مؤقت (بدون certificate)
qz.security.setCertificatePromise((resolve: any) => resolve(""));
qz.security.setSignaturePromise(() => (resolve: any) => resolve(""));

// اتصال
async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

// تنظيف HTML
function cleanHtml(html: string) {
  return html.replace(/window\.print\(\);?/g, "").replace(/window\.close\(\);?/g, "");
}

// الطباعة
export async function printHtmlSilently(html: string): Promise<void> {
  await connect();
  const printer = await qz.printers.getDefault();
  const config = qz.configs.create(printer, {
    copies: 1,
    margins: 0,
    scaleContent: true, // 👈 مهم جدًا
    rasterize: true,
    size: {
      width: 80,
      units: "mm",
      custom: true,
    },
  });

  await qz.print(config, [
    {
      type: "html",
      format: "plain",
      data: html,
    },
  ]);
}
