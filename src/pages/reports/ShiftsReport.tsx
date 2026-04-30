import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  RotateCcw,
  RefreshCw,
  Clock,
  User,
  CreditCard,
  DollarSign,
  Wallet
} from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { FinancialStatCard } from "@/components/FinancialStatCard";
import { Input } from "@/components/ui/input";
import { 
  generateReportHTML, 
  printCustomHTML, 
  exportCustomPDF, 
  exportToExcel 
} from "@/utils/customExportUtils";

export default function ShiftsReport() {
  const { t, direction, language } = useLanguage();
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  // Mock data based on the previous implementation
  const shifts = [
    { id: 59, openTime: '16:54:29 28/02/2026', closeTime: '-', user: 'market market mtawfik12b@gmail.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 58, openTime: '14:59:42 31/01/2026', closeTime: '-', user: 'admin ds@hotmail.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 57, openTime: '19:20:59 30/01/2026', closeTime: '-', user: 'salon salon info11@posit2030.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 55, openTime: '20:22:18 21/01/2026', closeTime: '02:34:33 24/01/2026', user: 'salon salon info11@posit2030.com', cash: 0.00, network: 102.00, bank: 0.00, total: 105.00, notes: '' },
    { id: 54, openTime: '16:04:23 18/01/2026', closeTime: '14:59:31 31/01/2026', user: 'admin ds@hotmail.com', cash: 0.00, network: 16.00, bank: 0.00, total: 16.00, notes: '' },
    { id: 52, openTime: '23:24:52 10/01/2026', closeTime: '02:31:35 24/01/2026', user: 'rest rest mmmmmmm@gmail.com', cash: 100.00, network: 278.00, bank: 0.00, total: 378.00, notes: '' },
  ];

  const summary = useMemo(() => {
    const totalCash = shifts.reduce((s, r) => s + (r.cash || 0), 0);
    const totalNetwork = shifts.reduce((s, r) => s + (r.network || 0), 0);
    const totalAll = shifts.reduce((s, r) => s + (r.total || 0), 0);

    return {
      totalCash,
      totalNetwork,
      totalAll,
      activeShifts: shifts.filter(s => s.closeTime === '-').length
    };
  }, [shifts]);

  const fmt = (n: number) => (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const reportTitle = t('shifts_report', 'تقرير الورديات');

  const handlePrint = () => {
    const columns = [
      { header: t("serial", "م"), field: "serial" },
      { header: t('shift_id', 'رقم الوردية'), field: 'id' },
      { header: t('open_time', 'وقت الافتتاح'), field: 'openTime' },
      { header: t('user', 'المستخدم'), field: 'user' },
      { header: t('cash', 'نقدي'), field: 'cash' },
      { header: t('network', 'شبكة'), field: 'network' },
      { header: t('total', 'الإجمالي'), field: 'total' }
    ];

    const data = shifts.map(s => ({
      ...s,
      cash: fmt(s.cash),
      network: fmt(s.network),
      total: fmt(s.total)
    }));

    const summaryCards = [
      { title: t('total_sales', 'إجمالي المبيعات'), value: `${fmt(summary.totalAll)} ${t('sar', 'ر.س')}`, icon: 'DollarSign' },
      { title: t('total_cash', 'إجمالي النقدي'), value: `${fmt(summary.totalCash)} ${t('sar', 'ر.س')}`, icon: 'Wallet' }
    ];

    const html = generateReportHTML(reportTitle, t('all_shifts', 'جميع الورديات'), summaryCards, columns, data, t, direction);
    printCustomHTML(reportTitle, html);
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const columns = [
        { header: t("serial", "م"), field: "serial" },
        { header: t('shift_id', 'رقم الوردية'), field: 'id' },
        { header: t('user', 'المستخدم'), field: 'user' },
        { header: t('total', 'الإجمالي'), field: 'total' }
      ];

      const data = shifts.map(s => ({
        id: s.id,
        user: s.user,
        total: fmt(s.total)
      }));

      const summaryCards = [
        { title: t('total_sales', 'إجمالي المبيعات'), value: `${fmt(summary.totalAll)} ${t('sar', 'ر.س')}`, icon: 'DollarSign' }
      ];

      const html = generateReportHTML(reportTitle, t('all_shifts', 'جميع الورديات'), summaryCards, columns, data, t, direction);
      await exportCustomPDF(reportTitle, html);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExportExcel = () => {
    const columns = [
      { header: t("serial", "م"), field: "serial" },
      { header: t('shift_id', 'رقم الوردية'), field: 'id' },
      { header: t('open_time', 'وقت الافتتاح'), field: 'openTime' },
      { header: t('user', 'المستخدم'), field: 'user' },
      { header: t('cash', 'نقدي'), field: 'cash' },
      { header: t('network', 'شبكة'), field: 'network' },
      { header: t('total', 'الإجمالي'), field: 'total' }
    ];
    exportToExcel(shifts, columns, reportTitle);
  };

  return (
    <div className="space-y-6 pb-12" dir={direction}>
      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <RefreshCw className="w-5 h-5 text-[var(--primary)]" />
              {reportTitle}
            </CardTitle>
            <CardDescription className="mt-1">
              {t('shifts_report_desc', 'استعراض تفاصيل الورديات والمبالغ المحصلة')}
            </CardDescription>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button onClick={handlePrint} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} /> <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button onClick={handleExportPDF} disabled={pdfLoading} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} /> <span className="hidden sm:inline">{pdfLoading ? t('loading') : 'PDF'}</span>
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <FinancialStatCard 
              title={t('total_all', 'الإجمالي الكلي')} 
              value={fmt(summary.totalAll)}
              suffix="SAR"
              icon={DollarSign}
              color="blue"
            />
            <FinancialStatCard 
              title={t('total_cash', 'إجمالي النقدي')} 
              value={fmt(summary.totalCash)}
              suffix="SAR"
              icon={Wallet}
              color="teal"
            />
            <FinancialStatCard 
              title={t('total_network', 'إجمالي الشبكة')} 
              value={fmt(summary.totalNetwork)}
              suffix="SAR"
              icon={CreditCard}
              color="orange"
            />
            <FinancialStatCard 
              title={t('active_shifts', 'الورديات المفتوحة')} 
              value={String(summary.activeShifts)} 
              icon={Clock}
              color="purple"
            />
          </div>
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                type="text" 
                value={globalFilterValue} 
                onChange={e => setGlobalFilterValue(e.target.value)}
                placeholder={t('search_placeholder', 'بحث...')}
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl" 
              />
            </div>
            {globalFilterValue && (
              <button 
                onClick={() => setGlobalFilterValue('')}
                className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-lg"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          <DataTable
            value={shifts} paginator 
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            rows={10} 
            className="custom-standard-table" dataKey="id"
            emptyMessage={t('no_data', 'لا توجد بيانات')} 
            globalFilter={globalFilterValue}
            scrollable scrollHeight="600px"
          >
            <Column
              header={t("serial", "م")}
              body={(_, opt) => <span className="text-sm font-semibold">{opt.rowIndex + 1}</span>}
              className="w-16"
            />
            <Column header={t('shift_id', 'رقم الوردية')} field="id" sortable body={(r) => <span className="font-bold">{r.id}</span>} />
            <Column header={t('open_time', 'وقت الافتتاح')} field="openTime" sortable />
            <Column header={t('close_time', 'وقت الاغلاق')} field="closeTime" sortable body={(r) => <span className={r.closeTime === '-' ? 'text-blue-500 font-medium' : ''}>{r.closeTime}</span>} />
            <Column header={t('user', 'المستخدم')} field="user" sortable className="max-w-[200px] overflow-hidden truncate" />
            <Column header={t('cash', 'نقدي')} field="cash" sortable body={(r) => fmt(r.cash)} />
            <Column header={t('network', 'شبكة')} field="network" sortable body={(r) => fmt(r.network)} />
            <Column header={t('total', 'الإجمالي')} body={(r) => <span className="font-bold text-[var(--primary)]">{fmt(r.total)}</span>} />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
