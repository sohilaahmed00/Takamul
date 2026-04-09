import * as qz from "qz-tray";
import { sha256 } from "js-sha256";

// إعداد QZ
qz.api.setSha256Type((data: any) => sha256(data));
qz.api.setPromiseType((resolver: any) => new Promise(resolver));

// بدون certificate (مؤقت)
qz.security.setCertificatePromise((resolve: any) => resolve(""));
qz.security.setSignaturePromise(() => (resolve: any) => resolve(""));

// اتصال
async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

// 🧪 طباعة تجريبية (RAW - مضمون)
export async function printTest(): Promise<void> {
  try {
    await connect();

    const printer = await qz.printers.getDefault();

    const config = qz.configs.create(printer);

    const data =
      "\x1B\x40" + // init
      "\x1B\x61\x01" + // center
      "TEST PRINT\n" +
      "\x1B\x61\x00" + // left
      "Hello Ahmed\n" +
      "----------------\n" +
      "Total: 15\n\n\n" +
      "\x1D\x56\x00"; // cut

    await qz.print(config, [
      {
        type: "raw",
        format: "plain",
        data: data,
      },
    ]);

    console.log("✅ Printed successfully");
  } catch (err) {
    console.error("❌ Print Error:", err);
  }
}
