import { printHtmlSilently } from "@/lib/qzService";

export async function printInvoice(): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<style>
@page {
  size: 80mm 200mm;
  margin: 0;
}

html, body {
  width: 100%;
  max-width: 80mm;
  margin: 0 auto;
  font-family: Arial;
  font-size: 14px;
  text-align: center;
}
</style>
</head>

<body>

  <div>🔥 TEST PRINT 🔥</div>
  <div>فاتورة تجريبية</div>
  <div>--------------------</div>

  <div>منتج 1 - 10 جنيه</div>
  <div>منتج 2 - 5 جنيه</div>

  <div>--------------------</div>

  <div>الإجمالي: 15 جنيه</div>

  <div>شكراً ❤️</div>

</body>
</html>
`;

  await printHtmlSilently(html);
}
