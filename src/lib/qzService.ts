import * as qz from "qz-tray";
import { sha256 } from "js-sha256";

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
    size: { width: 80, height: 0, units: "mm" },
    scaleContent: false,
  });

  await qz.print(config, [
    {
      type: "pixel",
      format: "html",
      flavor: "plain",
      data: html,
      options: { pageWidth: 72, pageHeight: 0, units: "mm" },
    },
  ]);
}
