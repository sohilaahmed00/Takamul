import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileSpreadsheet, Search, DollarSign, TrendingUp, BarChart2, Edit2 } from 'lucide-react';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { useGetAllSales } from '@/features/sales/hooks/useGetAllSales';
import { useSales } from '@/context/SalesContext';
import { usePurchases } from '@/context/PurchasesContext';
import { useExpenses } from '@/context/ExpensesContext';
import type { SalesOrder } from '@/features/sales/types/sales.types';

import { Input } from "@/components/ui/input";

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useLanguage();
  return (
    <span className="text-xs font-semibold text-gray-700">
      {status === 'Confirmed' ? t('confirmed') : t('not_confirmed')}
    </span>
  );
};

const SummaryCard = ({ title, value, color, icon: Icon }: { title: string; value: string; color: string; icon: any }) => (
  <div className={`rounded-xl p-5 text-white shadow-md relative overflow-hidden ${color}`}>
    <div className="relative z-10">
      <p className="text-white/80 text-xs font-medium mb-1">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20">
      <Icon size={22} className="text-white" />
    </div>
  </div>
);

export default function SalesReport() {
  const { t, direction, language } = useLanguage();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const { data: salesOrders } = useGetAllSales(currentPage, entriesPerPage);
  const orders = salesOrders?.items ?? [];
  const totalCount = salesOrders?.totalCount ?? 0;

  // Use contexts for global summary (matching dashboard)
  const { sales } = useSales();
  const { purchases } = usePurchases();
  const { expenses } = useExpenses();

  const globalSummary = useMemo(() => {
    const totalSales = sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    
    return {
      totalSales,
      totalNoTax: sales.reduce((sum, s) => sum + ((s as any).subTotal || 0), 0),
      totalTax: sales.reduce((sum, s) => sum + ((s as any).taxAmount || 0), 0),
      netProfit: totalSales - totalPurchases - totalExpenses
    };
  }, [sales, purchases, expenses]);

  const fmt = (n: number) => n.toFixed(2);
  const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-GB'); } catch { return d; } };

  const header = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="flex gap-2">
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title={t('download_pdf')}><FileText size={16} className="text-gray-500" /></button>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title={t('download_excel')}><FileSpreadsheet size={16} className="text-gray-500" /></button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"><Search size={16} className="text-gray-400" /></div>
        <Input type="text" value={globalFilterValue} onChange={e => { setGlobalFilterValue(e.target.value); setCurrentPage(1); }}
          placeholder={t('search_placeholder')}
          className="w-full border border-gray-200 focus:border-[var(--primary)] text-gray-700 text-sm rounded-lg py-2 pr-10 pl-4 outline-none transition-all" />
      </div>
    </div>
  ), [globalFilterValue, t]);

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title={t('total_no_tax')} value={`${fmt(globalSummary.totalNoTax)} SAR`} color="bg-teal-500" icon={BarChart2} />
        <SummaryCard title={t('item_vat')} value={`${fmt(globalSummary.totalTax)} SAR`} color="bg-[#2ecc71]" icon={FileText} />
        <SummaryCard title={t('total_sales_report')} value={`${fmt(globalSummary.totalSales)} SAR`} color="bg-[#38bdf8]" icon={DollarSign} />
        <SummaryCard title={t('net_profit')} value={`${fmt(globalSummary.netProfit)} SAR`} color="bg-[#8b5cf6]" icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('sales_report')}</CardTitle>
          <CardDescription>{t('customize_report_below')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            value={orders} totalRecords={totalCount} loading={!salesOrders}
            lazy paginator rows={entriesPerPage} rowsPerPageOptions={[5, 10, 20, 50]}
            first={(currentPage - 1) * entriesPerPage}
            onPage={(e: DataTablePageEvent) => { if (e.page === undefined) return; setCurrentPage(e.page + 1); setEntriesPerPage(e.rows); }}
            header={header} className="custom-green-table custom-compact-table" dataKey="id"
            emptyMessage={t('no_data')} globalFilter={globalFilterValue}
            globalFilterFields={['orderNumber', 'customerName', 'warehouseName']}
          >
            <Column header={t('invoice_number')} field="orderNumber" sortable body={(r: SalesOrder) => r.orderNumber} />
            <Column header={t('date')} field="orderDate" sortable body={(r: SalesOrder) => new Date(r.orderDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')} />
            <Column header={t('customer_name')} field="customerName" sortable />
            <Column header={t('cashier')} field="createdBy" sortable />
            <Column header={t('invoice_status')} field="orderStatus" body={(r: SalesOrder) => <StatusBadge status={r.orderStatus} />} />
            <Column header={t('total_amount')} field="grandTotal" sortable body={(r: SalesOrder) => fmt(r.grandTotal)} />
            <Column header={t('paid_amount')} body={(r: SalesOrder) => fmt(r.payments?.reduce((s, p) => s + p.amount, 0) ?? 0)} />

          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
