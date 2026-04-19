// const fs = require('fs');
// const path = require('path');
// const dir = 'src/pages/reports/';
// const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('Category'));

// files.forEach(f => {
//   let content = fs.readFileSync(path.join(dir, f), 'utf-8');
//   let gridMatch = content.match(/<div className=\"grid [^\"]* items-end\"/);
//   if (!gridMatch) return;

//   let rest = content.substring(gridMatch.index);
  
//   // Find grid cols count
//   let tableIndex = rest.indexOf('{/* Table');
//   if (tableIndex === -1) tableIndex = rest.indexOf('Table');
//   if (tableIndex === -1) tableIndex = rest.length;
//   // match both <Label and <label
//   let labelCount = (rest.substring(0, tableIndex).match(/<[Ll]abel/g) || []).length;
//   let expectedCols = labelCount + 1;
  
//   // Create responsive grid class prioritizing all items on one line for lg and above
//   let newGridClass = '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-' + expectedCols + ' xl:grid-cols-' + expectedCols + ' gap-4 items-end"';

//   let updatedContent = content.replace(gridMatch[0], newGridClass);
  
//   if (content !== updatedContent) {
//       fs.writeFileSync(path.join(dir, f), updatedContent);
//       console.log("Fixed grid: " + f + " -> Cols: " + expectedCols);
//   }
// });
