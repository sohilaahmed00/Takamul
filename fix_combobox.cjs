
const fs = require('fs');
const files = [
  'src/pages/reports/SalesByInvoiceReport.tsx',
  'src/pages/reports/SalesByDayReport.tsx',
  'src/pages/reports/PurchasesByInvoiceReport.tsx',
  'src/pages/reports/PurchasesByDayReport.tsx',
  'src/pages/reports/ItemSalesReport.tsx',
  'src/pages/reports/ItemPurchasesReport.tsx',
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Fix fiscal years combobox
  content = content.replace(
    /options=\{FISCAL_YEARS\.map\(\(y\) =\> \(\{ value: y, label: y \}\)\)\}/g,
    'items={FISCAL_YEARS.map((y) => ({ id: y, name: y }))} valueKey="id" labelKey="name"'
  );
  // Fix fiscal quarters combobox
  content = content.replace(
    /options=\{FISCAL_QUARTERS\.map\(\(q\) =\> \(\{ value: q\.value, label: q\.label \}\)\)\}/g,
    'items={FISCAL_QUARTERS.map((q) => ({ id: q.value, name: q.label }))} valueKey="id" labelKey="name"'
  );
  // Fix product/item combobox
  content = content.replace(
    /options=\{mockProducts\}/g,
    'items={mockProducts.map((p) => ({ id: p.value, name: p.label }))} valueKey="id" labelKey="name"'
  );
  fs.writeFileSync(f, content);
  console.log('Fixed: ' + f);
});

console.log('All done!');
