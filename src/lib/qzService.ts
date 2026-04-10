import * as qz from "qz-tray";
import { sha256 } from "js-sha256";
import { KJUR, KEYUTIL, hextob64 } from "jsrsasign";

qz.api.setSha256Type((data: any) => sha256(data));
qz.api.setPromiseType((resolver: any) => new Promise(resolver));

qz.security.setCertificatePromise((resolve, reject) => {
  fetch("/qz/certificate.pem")
    .then((res) => res.text())
    .then((cert) => resolve(cert.trim()))
    .catch(reject);
});

qz.security.setSignatureAlgorithm("SHA512");

qz.security.setSignaturePromise((toSign) => {
  return (resolve, reject) => {
    fetch("/qz/private-key.pem")
      .then((res) => res.text())
      .then((privateKey) => {
        const pk = KEYUTIL.getKey(privateKey);

        const sig = new KJUR.crypto.Signature({
          alg: "SHA512withRSA",
        });

        sig.init(pk);
        sig.updateString(toSign);

        resolve(hextob64(sig.sign()));
      })
      .catch(reject);
  };
});

async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

// الطباعة
export async function printHtmlSilently(html: string): Promise<void> {
  await connect();
  const printer = await qz.printers.getDefault();
  // const config = qz.configs.create(printer, {
  //   copies: 1,
  //   margins: { top: 0, bottom: 0, left: 0, right: 0 },
  //   scaleContent: false,
  //   rasterize: true,
  //   size: { width: 80, units: "mm" },
  // });
  const config = qz.configs.create(printer, {
    copies: 1,
    margins: { top: 0, bottom: 0, left: 5, right: 5 },
    scaleContent: true,
    rasterize: true,
    size: {
      width: 80,
      custom: false,
    },
    units: "mm",
  });

  await qz.print(config, [
    {
      type: "pixel",
      format: "html",
      flavor: "plain",
      data: html,
    },
  ]);
}
