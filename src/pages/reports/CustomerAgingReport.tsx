// import React, { useMemo, useState } from 'react';
// import { 
//   Search, 
//   FileText, 
//   Users, 
//   BarChart3, 
//   CreditCard, 
//   DollarSign, 
//   Printer, 
//   FileSpreadsheet,
//   RotateCcw
// } from 'lucide-react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useLanguage } from '@/context/LanguageContext';
// import { FinancialStatCard } from "@/components/FinancialStatCard";
// import { Input } from "@/components/ui/input";
// import { 
//   generateReportHTML, 
//   printCustomHTML, 
//   exportCustomPDF, 
//   exportToExcel 
// } from "@/utils/customExportUtils";

// export default function CustomerAgingReport() {
//   const { t, direction, language } = useLanguage();
//   const [globalFilterValue, setGlobalFilterValue] = useState('');
//   const [pdfLoading, setPdfLoading] = useState(false);

//   // Mock data for aging (could be replaced by a hook later)
//   const agingData = [
//     { id: 1, company: 'تكامل البيانات', name: 'عميل 1', less30: 500.00, range30_60: 150.00, range60_90: 0.00, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
//     { id: 2, company: '', name: 'عميل 2', less30: 0.00, range30_60: 0.00, range60_90: 0.00, range90_120: 0.00, range120_150: 8.00, more150: 0.00 },
//     { id: 3, company: 'شخص عام', name: 'عميل افتراضي', less30: 8.35, range30_60: 122.00, range60_90: 120.25, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
//   ];

//   const totalReceivables = agingData.reduce((sum, item) =>
//     sum + item.less30 + item.range30_60 + item.range60_90 + item.range90_120 + item.range120_150 + item.more150, 0
//   );

//   const fmt = (n: number) => (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   const reportTitle = t('customer_aging_report', 'تقرير أعمار ديون العملاء');

//   const handlePrint = () => {
//     const columns = [
//       { header: t('customer_name', 'اسم العميل'), field: 'name' },
//       { header: t('less_30_days', 'أقل من 30 يوم'), field: 'less30' },
//       { header: t('range_30_60', '30-60 يوم'), field: 'range30_60' },
//       { header: t('range_60_90', '60-90 يوم'), field: 'range60_90' },
//       { header: t('total', 'الإجمالي'), field: 'total' }
//     ];

//     const data = agingData.map(r => ({
//       ...r,
//       less30: fmt(r.less30),
//       range30_60: fmt(r.range30_60),
//       range60_90: fmt(r.range60_90),
//       total: fmt(r.less30 + r.range30_60 + r.range60_90 + r.range90_120 + r.range120_150 + r.more150)
//     }));

//     const summaryCards = [
//       { title: t('total_receivables', 'إجمالي المستحقات'), value: `${fmt(totalReceivables)} SAR`, icon: 'CreditCard' },
//       { title: t('active_customers', 'العملاء النشطين'), value: String(agingData.length), icon: 'Users' }
//     ];

//     const html = generateReportHTML(reportTitle, getFiltersInfo(), summaryCards, columns, data, t, direction);
//     printCustomHTML(reportTitle, html);
//   };

//   const handleExportPDF = async () => {
//     setPdfLoading(true);
//     try {
//       const columns = [
//         { header: t('customer_name', 'اسم العميل'), field: 'name' },
//         { header: t('less_30_days', 'أقل من 30 يوم'), field: 'less30' },
//         { header: t('total', 'الإجمالي'), field: 'total' }
//       ];

//       const data = agingData.map(r => ({
//         name: r.name,
//         less30: fmt(r.less30),
//         total: fmt(r.less30 + r.range30_60 + r.range60_90 + r.range90_120 + r.range120_150 + r.more150)
//       }));

//       const summaryCards = [
//         { title: t('total_receivables', 'إجمالي المستحقات'), value: `${fmt(totalReceivables)} SAR`, icon: 'CreditCard' }
//       ];

//       const html = generateReportHTML(reportTitle, getFiltersInfo(), summaryCards, columns, data, t, direction);
//       await exportCustomPDF(reportTitle, html);
//     } finally {
//       setPdfLoading(false);
//     }
//   };

//   const handleExportExcel = () => {
//     const data = agingData.map(r => ({
//       [t('customer_name')]: r.name,
//       [t('less_30_days')]: r.less30,
//       ['30-60']: r.range30_60,
//       ['60-90']: r.range60_90,
//       [t('total')]: r.less30 + r.range30_60 + r.range60_90 + r.range90_120 + r.range120_150 + r.more150
//     }));
//     exportToExcel(data, reportTitle, t, direction);
//   };

//   return (
//     <div className="space-y-6 pb-12" dir={direction}>
//       <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950">
//         <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
//           <div>
//             <CardHeader className="p-0">
//               <CardTitle className="text-xl font-bold flex items-center gap-2">
//                 <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
//                 {reportTitle}
//               </CardTitle>
//               <CardDescription className="mt-1">
//                 {t('check_customer_debts_below', 'استعراض ديون العملاء مصنفة حسب الفترة الزمنية')}
//               </CardDescription>
//             </CardHeader>
//           </div>

//           <div className="flex items-center gap-4 text-sm font-medium">
//             <button onClick={handlePrint} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
//               <Printer size={16} /> <span className="hidden sm:inline">{t("print", "طباعة")}</span>
//             </button>
//             <button onClick={handleExportPDF} disabled={pdfLoading} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
//               <FileText size={16} /> <span className="hidden sm:inline">{pdfLoading ? t('loading') : 'PDF'}</span>
//             </button>
//             <button onClick={handleExportExcel} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
//               <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Excel</span>
//             </button>
//           </div>
//         </CardHeader>

//         <CardContent className="pt-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//             <FinancialStatCard 
//               title={t('total_receivables', 'إجمالي المستحقات')} 
//               value={`${fmt(totalReceivables)} SAR`} 
//               icon={CreditCard}
//               color="orange"
//             />
//             <FinancialStatCard 
//               title={t('active_customers', 'العملاء النشطين')} 
//               value={`${agingData.length}`} 
//               icon={Users}
//               color="teal"
//             />
//             <FinancialStatCard 
//               title={t('overdue_balance', 'المبالغ المتأخرة')} 
//               value={`${fmt(totalReceivables * 0.3)} SAR`} 
//               icon={DollarSign}
//               color="red"
//             />
//           </div>
//           <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
//             <div className="relative w-full md:w-80">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//               <Input 
//                 type="text" 
//                 value={globalFilterValue} 
//                 onChange={e => setGlobalFilterValue(e.target.value)}
//                 placeholder={t('search_placeholder', 'بحث...')}
//                 className="pl-10 h-11 bg-slate-50 border-none rounded-xl" 
//               />
//             </div>
//             {globalFilterValue && (
//               <button 
//                 onClick={() => setGlobalFilterValue('')}
//                 className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-lg"
//               >
//                 <RotateCcw size={16} />
//               </button>
//             )}
//           </div>

//           <DataTable
//             value={agingData} paginator rows={10} 
//             className="custom-standard-table" dataKey="id"
//             emptyMessage={t('no_data', 'لا توجد بيانات')} 
//             globalFilter={globalFilterValue}
//             scrollable scrollHeight="600px"
//           >
//             <Column header={t('customer_name', 'اسم العميل')} field="name" sortable body={(r) => <b className="text-[var(--primary)]">{r.name}</b>} />
//             <Column header={t('less_30_days', 'أقل من 30 يوم')} field="less30" sortable body={(r) => fmt(r.less30)} />
//             <Column header={t('range_30_60', 'من 30 إلى 60 يوم')} field="range30_60" sortable body={(r) => fmt(r.range30_60)} />
//             <Column header={t('range_60_90', 'من 60 إلى 90 يوم')} field="range60_90" sortable body={(r) => fmt(r.range60_90)} />
//             <Column header={t('range_90_120', 'من 90 إلى 120 يوم')} field="range90_120" sortable body={(r) => fmt(r.range90_120)} />
//             <Column header={t('more_150_days', 'أكبر من 150 يوم')} field="more150" sortable body={(r) => fmt(r.more150)} />
//             <Column header={t('total', 'الإجمالي')} body={(r) => <span className="font-bold">{fmt(r.less30 + r.range30_60 + r.range60_90 + r.range90_120 + r.range120_150 + r.more150)}</span>} />
//           </DataTable>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
