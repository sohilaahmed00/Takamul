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
export async function printHtmlSilently(): Promise<void> {
  await connect();

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  // @page { size: 80mm auto; margin: 0; }

  body {
    width: 80mm;
    font-family: Arial;
    font-size: 14px;
    text-align: center;
  }

  .line {
    border-bottom: 1px dashed #000;
    margin: 8px 0;
  }
</style>
</head>

<body>

  <h3>TEST PRINT</h3>

  <div class="line"></div>

  <p>Product 1 - 10 EGP</p>
  <p>Product 2 - 5 EGP</p>

  <div class="line"></div>

  <h4>Total: 15 EGP</h4>

</body>
</html>
`;

  const printer = await qz.printers.getDefault();

  const config = qz.configs.create(printer, {
    copies: 1,
    margins: 0,
    scaleContent: false,
    rasterize: false,
    size: {
      width: 80,
      height: 200,
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
