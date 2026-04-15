// import { useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FileText, FileSpreadsheet, Search, ShoppingBag, BarChart2, Edit2 } from 'lucide-react';
// import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useLanguage } from '@/context/LanguageContext';
// import { useGetAllPurchases } from '@/features/purchases/hooks/useGetAllSales';
// import type { Purchase } from '@/features/purchases/types/purchase.types';

// import { Input } from "@/components/ui/input";

// const StatusBadge = ({ status }: { status: string }) => {
//   const { t } = useLanguage();
//   return (
//     <span className="text-xs font-semibold text-gray-700">
//       {status || t('received')}
//     </span>
//   );
// };

// const SummaryCard = ({ title, value, color, icon: Icon }: { title: string; value: string; color: string; icon: any }) => (
//   <div className={`rounded-xl p-5 text-white shadow-md relative overflow-hidden ${color}`}>
//     <div className="relative z-10">
//       <p className="text-white/80 text-xs font-medium mb-1">{title}</p>
//       <h3 className="text-xl font-bold">{value}</h3>
//     </div>
//     <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20">
//       <Icon size={22} className="text-white" />
//     </div>
//   </div>
// );

// export default function PurchasesReport() {
//   const { t, direction, language } = useLanguage();
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [globalFilterValue, setGlobalFilterValue] = useState('');

//   const { data: purchasesData } = useGetAllPurchases({
//     page: currentPage,
//     limit: entriesPerPage,
//     searchTerm: globalFilterValue,
//   });

//   const items = purchasesData?.items ?? [];
//   const totalCount = purchasesData?.totalCount ?? 0;

//   const summary = useMemo(() => ({
//     total: items.reduce((s, p) => s + (p.totalAmount || 0), 0),
//     paid: items.reduce((s, p) => s + (p.paidAmount || 0), 0),
//     tax: items.reduce((s, p) => s + (p.taxAmount || 0), 0),
//   }), [items]);

//   const fmt = (n: number) => (n || 0).toFixed(2);
//   const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-GB'); } catch { return d; } };

//   const header = useMemo(() => (
//     <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
//       <div className="flex items-center gap-4 text-sm font-medium">
//         <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
//           <FileText size={16} /> <span className="hidden sm:inline">PDF</span>
//         </button>
//         <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
//           <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Excel</span>
//         </button>
//       </div>
//       <div className="relative w-full sm:w-64">
//         <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
//           <Search size={16} className="text-gray-400" />
//         </div>
//         <Input 
//           type="text" 
//           value={globalFilterValue} 
//           onChange={e => { setGlobalFilterValue(e.target.value); setCurrentPage(1); }} 
//           placeholder={t('search_placeholder')} 
//           className="w-full h-9 border border-gray-200 focus:border-[var(--primary)] text-gray-700 text-sm rounded-lg py-2 pr-10 pl-4 outline-none transition-all" 
//         />
//       </div>
//     </div>
//   ), [globalFilterValue, t]);

//   return (
//     <div className="space-y-4 pb-12" dir={direction}>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <SummaryCard title={t('total_purchases')} value={`${fmt(summary.total)} SAR`} color="bg-[#f97316]" icon={ShoppingBag} />
//         <SummaryCard title={t('paid_amount')} value={`${fmt(summary.paid)} SAR`} color="bg-teal-500" icon={BarChart2} />
//         <SummaryCard title={t('total_tax')} value={`${fmt(summary.tax)} SAR`} color="bg-[#2ecc71]" icon={FileText} />
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>{t('purchases_report')}</CardTitle>
//           <CardDescription>{t('customize_report_below')}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             value={items} totalRecords={totalCount} loading={!purchasesData}
//             lazy paginator rows={entriesPerPage} rowsPerPageOptions={[5, 10, 20, 50]}
//             first={(currentPage - 1) * entriesPerPage}
//             onPage={(e: DataTablePageEvent) => { if (e.page === undefined) return; setCurrentPage(e.page + 1); setEntriesPerPage(e.rows); }}
//             header={header} className="custom-green-table custom-compact-table" dataKey="id"
//             emptyMessage={t('no_data')}
//           >
//             <Column header="#" body={(_r, { rowIndex }) => (currentPage - 1) * entriesPerPage + rowIndex + 1} style={{ width: 50 }} />
//             <Column header={t('invoice_number')} field="purchaseOrderNumber" sortable body={(r: Purchase) => <b className="text-[var(--primary)]">{r.purchaseOrderNumber}</b>} />
//             <Column header={t('date')} field="orderDate" sortable body={(r: Purchase) => new Date(r.orderDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')} />
//             <Column header={t('supplier_name')} field="supplierName" sortable />
//             <Column header={t('total_amount')} field="totalAmount" sortable body={(r: Purchase) => fmt(r.totalAmount)} />
//             <Column header={t('tax_amount')} field="taxAmount" sortable body={(r: Purchase) => fmt(r.taxAmount)} />
//             <Column header={t('paid_amount')} field="paidAmount" sortable body={(r: Purchase) => fmt(r.paidAmount)} />
//             <Column header={t('purchase_order_status')} field="orderStatus" body={(r: Purchase) => <StatusBadge status={r.orderStatus} />} />

//           </DataTable>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
