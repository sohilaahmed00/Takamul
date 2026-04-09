import * as qz from "qz-tray";
import { sha256 } from "js-sha256";

// ── Setup مرة واحدة ──
qz.api.setSha256Type((data: any) => sha256(data));
qz.api.setPromiseType((resolver: any) => new Promise(resolver));

qz.security.setCertificatePromise((resolve: any) => resolve(""));
qz.security.setSignaturePromise(() => (resolve: any) => resolve(""));

async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

export async function printHtmlSilently(html: string): Promise<void> {
  await connect();

  const printer = await qz.printers.getDefault();

  const config = qz.configs.create(printer, {
    colorType: "blackwhite",
    copies: 1,
  });

  await qz.print(config, [
    {
      type: "pixel",
      format: "html",
      flavor: "plain",
      data: html,
      options: { pageWidth: 80 },
    },
  ]);
}
