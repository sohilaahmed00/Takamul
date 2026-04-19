// import React, { useState, useMemo } from 'react';
// import { 
//   FileText, 
//   FileSpreadsheet, 
//   Search, 
//   Users, 
//   DollarSign, 
//   Printer, 
//   RotateCcw,
//   UserCheck,
//   CreditCard
// } from 'lucide-react';
// import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { useLanguage } from '@/context/LanguageContext';
// import { useGetAllCustomers } from '@/features/customers/hooks/useGetAllCustomers';
// import { useAuthStore } from "@/store/authStore";
// import { Input } from "@/components/ui/input";
// import { FinancialStatCard } from "@/components/FinancialStatCard";
// import { 
//   generateReportHTML, 
//   printCustomHTML, 
//   exportCustomPDF, 
//   exportToExcel 
// } from "@/utils/customExportUtils";

// export default function CustomersReport() {
//   const { t, direction, language } = useLanguage();
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pdfLoading, setPdfLoading] = useState(false);
//   const [globalFilterValue, setGlobalFilterValue] = useState('');

//   // Data Fetching
//   const { data: customersData, isLoading } = useGetAllCustomers({ 
//     page: currentPage, 
//     limit: entriesPerPage,
//     searchTerm: globalFilterValue || undefined
//   });
  
//   const customers = customersData?.items ?? [];
//   const totalCount = customersData?.totalCount ?? 0;

//   const summary = useMemo(() => {
//     const totalBalance = customers.reduce((s, c) => s + (c.balance || 0), 0);
//     const activeCustomers = customers.length; // Simplified for this report

//     return {
//       totalBalance,
//       activeCustomers,
//       totalCount: totalCount
//     };
//   }, [customers, totalCount]);

//   const fmt = (n: number) => (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const handleSearch = () => {
//     setCurrentPage(1);
//   };

//   const handleClear = () => {
//     setGlobalFilterValue('');
//     setCurrentPage(1);
//   };

//   const reportTitle = t('customers_report', 'تقرير العملاء');

//   const getFiltersInfo = () => {
//     return globalFilterValue ? `${t('search', 'بحث')}: ${globalFilterValue}` : t('all_customers', 'جميع العملاء');
//   };

//   const handlePrint = () => {
//     const columns = [
//       { header: t('customer_name', 'اسم العميل'), field: 'name' },
//       { header: t('phone', 'الهاتف'), field: 'phone' },
//       { header: t('email', 'البريد الإلكتروني'), field: 'email' },
//       { header: t('balance', 'الرصيد'), field: 'balance' }
//     ];

//     const data = customers.map(c => ({
//       ...c,
//       balance: fmt(c.balance || 0)
//     }));

//     const summaryCards = [
//       { title: t('total_customers', 'إجمالي العملاء'), value: String(summary.totalCount), icon: 'Users' },
//       { title: t('total_balance', 'إجمالي الأرصدة'), value: `${fmt(summary.totalBalance)} SAR`, icon: 'CreditCard' }
//     ];

//     const html = generateReportHTML(reportTitle, getFiltersInfo(), summaryCards, columns, data, t, direction);
//     printCustomHTML(reportTitle, html);
//   };

//   const handleExportPDF = async () => {
//     setPdfLoading(true);
//     try {
//       const columns = [
//         { header: t('customer_name', 'اسم العميل'), field: 'name' },
//         { header: t('phone', 'الهاتف'), field: 'phone' },
//         { header: t('balance', 'الرصيد'), field: 'balance' }
//       ];

//       const data = customers.map(c => ({
//         name: c.name,
//         phone: c.phone || '-',
//         balance: fmt(c.balance || 0)
//       }));

//       const summaryCards = [
//         { title: t('total_customers', 'إجمالي العملاء'), value: String(summary.totalCount), icon: 'Users' },
//         { title: t('total_balance', 'إجمالي الأرصدة'), value: `${fmt(summary.totalBalance)} SAR`, icon: 'CreditCard' }
//       ];

//       const html = generateReportHTML(reportTitle, getFiltersInfo(), summaryCards, columns, data, t, direction);
//       await exportCustomPDF(reportTitle, html);
//     } finally {
//       setPdfLoading(false);
//     }
//   };

//   const handleExportExcel = () => {
//     const columns = [
//       { header: t('customer_name', 'اسم العميل'), field: 'name' },
//       { header: t('phone', 'الهاتف'), field: 'phone' },
//       { header: t('email', 'البريد الإلكتروني'), field: 'email' },
//       { header: t('balance', 'الرصيد'), field: 'balance' }
//     ];
//     exportToExcel(customers, columns, reportTitle);
//   };

//   return (
//     <div className="space-y-6 pb-12" dir={direction}>
//       <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950">
//         <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
//           <div>
//             <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
//               <Users className="w-5 h-5 text-[var(--primary)]" />
//               {reportTitle}
//             </CardTitle>
//             <CardDescription className="mt-1">
//               {t('view_customer_reports_below', 'استعراض تقارير العملاء أدناه')}
//             </CardDescription>
//           </div>

//           <div className="flex items-center gap-4 text-sm font-medium">
//             <button 
//               onClick={handlePrint} 
//               className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
//             >
//               <Printer size={16} /> 
//               <span className="hidden sm:inline">{t("print", "طباعة")}</span>
//             </button>
//             <button 
//               onClick={handleExportPDF} 
//               disabled={pdfLoading}
//               className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
//             >
//               <FileText size={16} /> 
//               <span className="hidden sm:inline">{pdfLoading ? t('loading', 'جاري التحميل...') : 'PDF'}</span>
//             </button>
//             <button 
//               onClick={handleExportExcel} 
//               className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
//             >
//               <FileSpreadsheet size={16} /> 
//               <span className="hidden sm:inline">Excel</span>
//             </button>
//           </div>
//         </CardHeader>

//         <CardContent className="pt-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//             <FinancialStatCard
//               title={t('total_customers', 'إجمالي العملاء')}
//               value={String(summary.totalCount)}
//               icon={Users}
//               color="blue"
//             />
//             <FinancialStatCard
//               title={t('active_customers', 'العملاء النشطين')}
//               value={String(summary.activeCustomers)}
//               icon={UserCheck}
//               color="teal"
//             />
//             <FinancialStatCard
//               title={t('total_balance', 'إجمالي الأرصدة')}
//               value={`${fmt(summary.totalBalance)} SAR`}
//               icon={CreditCard}
//               color="orange"
//             />
//           </div>

//           {/* Filters */}
//           <div className="mb-8 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
//             <div className="flex flex-col md:flex-row gap-4 items-end">
//               <div className="flex-1 w-full relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//                 <Input
//                   type="text"
//                   placeholder={t("search_customers", "البحث عن العملاء...")}
//                   className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
//                   value={globalFilterValue}
//                   onChange={(e) => setGlobalFilterValue(e.target.value)}
//                 />
//               </div>

//               <div className="flex gap-2 w-full md:w-auto">
//                 <button 
//                   onClick={handleSearch}
//                   className="h-11 px-8 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 flex-1 md:flex-none rounded-xl shadow-md shadow-emerald-200 dark:shadow-none font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
//                 >
//                   <Search size={18} />
//                   {t("search", "بحث")}
//                 </button>
//                 <button 
//                   onClick={handleClear}
//                   className="h-11 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-xl shadow-sm"
//                 >
//                   <RotateCcw size={18} className="text-slate-500" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <DataTable
//             value={customers} totalRecords={totalCount} loading={isLoading}
//             lazy paginator rows={entriesPerPage} rowsPerPageOptions={[5, 10, 20, 50]}
//             first={(currentPage - 1) * entriesPerPage}
//             onPage={(e: DataTablePageEvent) => {
//               if (e.page === undefined) return;
//               setCurrentPage(e.page + 1);
//               setEntriesPerPage(e.rows ?? entriesPerPage);
//             }}
//             className="custom-standard-table" dataKey="id"
//             emptyMessage={t('no_data', 'لا توجد بيانات')}
//             scrollable scrollHeight="600px"
//           >
//             <Column header={t('customer_name', 'اسم العميل')} field="name" sortable body={(r) => <span className="font-bold text-[var(--primary)]">{r.name}</span>} />
//             <Column header={t('phone', 'الهاتف')} field="phone" sortable />
//             <Column header={t('email', 'البريد الإلكتروني')} field="email" sortable />
//             <Column header={t('balance', 'الرصيد')} field="balance" sortable body={(r) => <span className={`font-bold ${r.balance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{fmt(r.balance)}</span>} />
//           </DataTable>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
