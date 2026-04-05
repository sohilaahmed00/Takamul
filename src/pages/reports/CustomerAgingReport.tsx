import { useMemo, useState } from 'react';
import { Search, FileText, Users, BarChart3, CreditCard, DollarSign } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

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

export default function CustomerAgingReport() {
  const { t, direction } = useLanguage();
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // Mock data for aging (could be replaced by a hook later)
  const agingData = [
    { id: 1, company: 'تكامل البيانات', name: 'عميل 1', less30: 500.00, range30_60: 150.00, range60_90: 0.00, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
    { id: 2, company: '', name: 'عميل 2', less30: 0.00, range30_60: 0.00, range60_90: 0.00, range90_120: 0.00, range120_150: 8.00, more150: 0.00 },
    { id: 3, company: 'شخص عام', name: 'عميل افتراضي', less30: 8.35, range30_60: 122.00, range60_90: 120.25, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
  ];

  const totalReceivables = agingData.reduce((sum, item) =>
    sum + item.less30 + item.range30_60 + item.range60_90 + item.range90_120 + item.range120_150 + item.more150, 0
  );

  const fmt = (n: number) => (n || 0).toFixed(2);

  const header = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="flex gap-2">
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><FileText size={16} className="text-gray-500" /></button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"><Search size={16} className="text-gray-400" /></div>
        <input type="text" value={globalFilterValue} onChange={e => setGlobalFilterValue(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full border border-gray-200 focus:border-[var(--primary)] text-gray-700 text-sm rounded-lg py-2 pr-10 pl-4 outline-none transition-all" />
      </div>
    </div>
  ), [globalFilterValue, t]);

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title={t('total_receivables')} value={`${fmt(totalReceivables)} SAR`} color="bg-[#d97706]" icon={CreditCard} />
        <SummaryCard title={t('active_customers')} value={`${agingData.length}`} color="bg-teal-500" icon={Users} />
        <SummaryCard title={t('overdue_balance')} value={`${fmt(totalReceivables * 0.3)} SAR`} color="bg-red-500" icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('customer_aging_report')}</CardTitle>
          <CardDescription>{t('check_customer_debts_below')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            value={agingData} paginator rows={10} header={header}
            className="custom-green-table custom-compact-table" dataKey="id"
            emptyMessage={t('no_data')} globalFilter={globalFilterValue}
          >
            <Column header={t('customer_name')} field="name" sortable body={(r) => <b className="text-[var(--primary)]">{r.name}</b>} />
            <Column header={t('less_30_days')} field="less30" sortable body={(r) => fmt(r.less30)} />
            <Column header={t('range_30_60')} field="range30_60" sortable body={(r) => fmt(r.range30_60)} />
            <Column header={t('range_60_90')} field="range60_90" sortable body={(r) => fmt(r.range60_90)} />
            <Column header={t('range_90_120')} field="range90_120" sortable body={(r) => fmt(r.range90_120)} />
            <Column header={t('more_150_days')} field="more150" sortable body={(r) => fmt(r.more150)} />
            <Column header={t('total')} body={(r) => <span className="font-bold">{fmt(r.less30 + r.range30_60 + r.range60_90 + r.range90_120 + r.range120_150 + r.more150)}</span>} />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
