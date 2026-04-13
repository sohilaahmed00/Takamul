import { useMemo, useState } from 'react';
import { Search, FileText, Truck, CreditCard, DollarSign, BarChart3 } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from "@/components/ui/input";

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

export default function VendorAgingReport() {
  const { t, direction } = useLanguage();
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const agingData = [
    { id: 1, company: 'مورد', name: 'مورد', less30: 0.00, range30_60: 500.01, range60_90: 0.00, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
    { id: 2, company: '', name: 'مورد 2', less30: 0.00, range30_60: 0.00, range60_90: 0.00, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
  ];

  const totalPayables = agingData.reduce((sum, item) =>
    sum + item.less30 + item.range30_60 + item.range60_90 + item.range90_120 + item.range120_150 + item.more150, 0
  );

  const fmt = (n: number) => (n || 0).toFixed(2);

  const header = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="flex gap-2">
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <FileText size={16} className="text-gray-500" />
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <Input
          type="text"
          value={globalFilterValue}
          onChange={e => setGlobalFilterValue(e.target.value)}
          placeholder={t('search', 'بحث...')}
          className="w-full pr-10"
        />
      </div>
    </div>
  ), [globalFilterValue, t]);

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title={t('total_payables', 'إجمالي المستحقات للموردين')} value={`${fmt(totalPayables)} SAR`} color="bg-[#d97706]" icon={CreditCard} />
        <SummaryCard title={t('active_suppliers', 'الموردين النشطين')} value={`${agingData.length}`} color="bg-teal-500" icon={Truck} />
        <SummaryCard title={t('overdue_payables', 'المبالغ المتأخرة')} value={`${fmt(totalPayables * 0.3)} SAR`} color="bg-red-500" icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck size={20} className="text-[var(--primary)]" />
            {t('vendor_aging_report', 'تقرير أعمار ديون الموردين')}
          </CardTitle>
          <CardDescription>{t('check_vendor_debts_below', 'استعراض ديون الموردين مصنفة حسب الفترة الزمنية')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={agingData}
              paginator
              rows={10}
              header={header}
              className="custom-green-table custom-compact-table"
              dataKey="id"
              emptyMessage={t('no_data', 'لا توجد بيانات')}
              globalFilter={globalFilterValue}
              responsiveLayout="stack"
            >
              <Column header={t('supplier_name', 'اسم المورد')} field="name" sortable body={(r) => <b className="text-[var(--primary)]">{r.name}</b>} />
              <Column header={t('less_30_days', 'أقل من 30 يوم')} field="less30" sortable body={(r) => fmt(r.less30)} />
              <Column header={t('range_30_60', 'من 30 إلى 60 يوم')} field="range30_60" sortable body={(r) => fmt(r.range30_60)} />
              <Column header={t('range_60_90', 'من 60 إلى 90 يوم')} field="range60_90" sortable body={(r) => fmt(r.range60_90)} />
              <Column header={t('range_90_120', 'من 90 إلى 120 يوم')} field="range90_120" sortable body={(r) => fmt(r.range90_120)} />
              <Column header={t('more_150_days', 'أكبر من 150 يوم')} field="more150" sortable body={(r) => fmt(r.more150)} />
              <Column
                header={t('total', 'الإجمالي')}
                body={(r) => (
                  <span className="font-bold">
                    {fmt(r.less30 + r.range30_60 + r.range60_90 + r.range90_120 + r.range120_150 + r.more150)}
                  </span>
                )}
              />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
