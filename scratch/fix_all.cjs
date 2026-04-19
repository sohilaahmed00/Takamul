// const fs = require('fs');
// const path = require('path');
// const dir = 'src/pages/reports/';
// const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('Category'));

// files.forEach(f => {
//   let content = fs.readFileSync(path.join(dir, f), 'utf-8');
//   let gridMatch = content.match(/<div className=\"grid [^\"]* items-end\"/);
//   if (!gridMatch) return;

//   // calculate real grid columns based on components
//   let searchIdx = content.indexOf('onClick={handleSearch}');
//   if (searchIdx === -1) return;
  
//   let gridStart = gridMatch.index;
//   let rest = content.substring(gridStart);
  
//   // Find grid cols count
//   let tableIndex = rest.indexOf('{/* Table');
//   if (tableIndex === -1) tableIndex = rest.indexOf('<DataTable');
//   if (tableIndex === -1) tableIndex = rest.indexOf('Table');
//   if (tableIndex === -1) tableIndex = rest.length;
//   // match both <Label and <label, also match filters without Label like <Button or <Select if any?
//   // Actually, counting <Label> is just estimating. Better to count direct children of the grid!
  
//   // Actually, we can just use the provided correct Columns via manual mapping, it's 14 files!
//   let mapCols = {
//      'CustomerStatementReport.tsx': 5,
//      'SupplierStatementReport.tsx': 5,
//      'ExpensesDetailReport.tsx': 5,
//      'ItemMovementReport.tsx': 5,
//      'ItemPurchasesReport.tsx': 5,
//      'ItemSalesReport.tsx': 5,
//      'LowStockReport.tsx': 2,
//      'ProfitReport.tsx': 5,
//      'PurchasesByDayReport.tsx': 6,
//      'PurchasesByInvoiceReport.tsx': 6,
//      'SalesByDayReport.tsx': 6,
//      'SalesByInvoiceReport.tsx': 6,
//      'StockBalanceReport.tsx': 4,
//      'BestSellersChart.tsx': 4
//   };
  
//   let expectedCols = mapCols[f] || 4;
  
//   // Create responsive grid class
//   let newGridClass = '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-' + expectedCols + ' xl:grid-cols-' + expectedCols + ' gap-4 items-end"';

//   // Replace Buttons block carefully. We know it starts with <div className="flex..." or directly <Button
//   let searchBtnIdx = content.lastIndexOf('<Button ', searchIdx);
//   let clearIdx = content.indexOf('onClick={handleClear}', searchIdx);
//   let clearEndBtn = content.indexOf('</Button>', clearIdx) + 9;
  
//   let blockStart = searchBtnIdx;
//   let wrapperDivIdx = content.lastIndexOf('<div', searchBtnIdx);
//   let isWrapped = false;
//   // check if wrapper is directly adjacent with only whitespaces
//   if (wrapperDivIdx > -1 && wrapperDivIdx > gridStart) {
//       let spaceBetween = content.substring(content.indexOf('>', wrapperDivIdx)+1, searchBtnIdx);
//       if (spaceBetween.trim() === '') {
//           blockStart = wrapperDivIdx;
//           isWrapped = true;
//       }
//   }
  
//   let blockEnd = clearEndBtn;
//   if (isWrapped) {
//       blockEnd = content.indexOf('</div>', clearEndBtn) + 6;
//   }
  
//   let oldBtnBlock = content.substring(blockStart, blockEnd);

//   // Extract disabled attr
//   let disabledCond = 'false';
//   let disabledIsCustom = false;
//   let disabledMatch = oldBtnBlock.match(/disabled=\{([^\}]+)\}/);
//   if (disabledMatch) {
//       disabledCond = disabledMatch[1];
//       disabledIsCustom = true;
//   }
  
//   let disabledAttr = disabledIsCustom ? `disabled={` + disabledCond + `}` : ``;
//   let newBtnBlock = `<div className="flex flex-row items-end gap-2 mb-2 lg:col-span-1">
//                 <Button onClick={handleSearch} `+disabledAttr+` className="flex-1 h-9 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold">
//                   <Search size={16} />
//                   {t("search", "بحث")}
//                 </Button>
//                 <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
//                   <RotateCcw size={15} className="text-[var(--primary)]" />
//                 </Button>
//               </div>`;

//   let updatedContent = content.replace(oldBtnBlock, newBtnBlock);
//   updatedContent = updatedContent.replace(gridMatch[0], newGridClass);
  
//   if (content !== updatedContent) {
//       fs.writeFileSync(path.join(dir, f), updatedContent);
//       console.log("Fixed: " + f);
//   }
// });
