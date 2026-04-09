import * as qz from "qz-tray";
import { sha256 } from "js-sha256";

// ── Setup مرة واحدة ──
qz.api.setSha256Type((data: any) => sha256(data));
qz.api.setPromiseType((resolver: any) => new Promise(resolver));

// لو مش عندك certificate (للتطوير بس) — هيظهر popup مرة واحدة وبعدها silent
qz.security.setCertificatePromise((resolve: any) => resolve(""));
qz.security.setSignaturePromise(() => (resolve: any) => resolve(""));

async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

export async function getAvailablePrinters(): Promise<string[]> {
  await connect();
  const printers = await qz.printers.find();
  return Array.isArray(printers) ? printers : [printers];
}

export async function printHtmlSilently(html: string, printerName?: string): Promise<void> {
  await connect();

  // لو مفيش printer محدد — هياخد الـ default
  const printer = printerName ?? (await qz.printers.getDefault());

  const config = qz.configs.create(printer, {
    colorType: "blackwhite",
    copies: 1,
  });

  await qz.print(config, [
    {
      type: "pixel",
      format: "html",
      flavor: "plain", // بيبعت الـ HTML string مباشرة
      data: html,
      options: { pageWidth: 80 }, // مم
    },
  ]);
}
