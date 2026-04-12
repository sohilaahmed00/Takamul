import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Wallet } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";

import { Input } from "@/components/ui/input";

interface FilterState { fiscalYear: string; fiscalQuarter: string; from: string; to: string; }

const FISCAL_YEARS = ["2024", "2025", "2026"];
const FISCAL_QUARTERS = [
  { value: "Q1", label: "🟢 الربع الأول Q1 (يناير - مارس)", from: "-01-01", to: "-03-31" },
  { value: "Q2", label: "🔵 الربع الثاني Q2 (أبريل - يونيو)", from: "-04-01", to: "-06-30" },
  { value: "Q3", label: "🟡 الربع الثالث Q3 (يوليو - سبتمبر)", from: "-07-01", to: "-09-30" },
  { value: "Q4", label: "🔴 الربع الرابع Q4 (أكتوبر - ديسمبر)", from: "-10-01", to: "-12-31" },
];

const mockRows = [
  { id: "1", date: "2026-01-05", category: "إيجار", description: "إيجار المكتب الشهري", amount: 5000.0 },
  { id: "2", date: "2026-01-10", category: "كهرباء", description: "فاتورة كهرباء فرع الرئيسي", amount: 450.0 },
  { id: "3", date: "2026-02-03", category: "أدوات مكتبية", description: "شراء أحبار وأوراق", amount: 120.0 },
];

export default function ExpensesDetailReport() {
  const { t, direction } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    fiscalYear: new Date().getFullYear().toString(),
    fiscalQuarter: "",
    from: "",
    to: "",
  });

  const handleQuarterChange = (quarter: string) => {
    const q = FISCAL_QUARTERS.find((q) => q.value === quarter);
    const year = filters.fiscalYear || new Date().getFullYear().toString();
    setFilters((prev) => ({
      ...prev,
      fiscalQuarter: quarter,
      from: q ? `${year}${q.from}` : prev.from,
      to: q ? `${year}${q.to}` : prev.to,
    }));
  };

  const handleYearChange = (year: string) => {
    const q = FISCAL_QUARTERS.find((q) => q.value === filters.fiscalQuarter);
    setFilters((prev) => ({
      ...prev,
      fiscalYear: year,
      from: q && year ? `${year}${q.from}` : prev.from,
      to: q && year ? `${year}${q.to}` : prev.to,
    }));
  };

  const handleSearch = () => {};
  const handleClear = () => setFilters({ fiscalYear: new Date().getFullYear().toString(), fiscalQuarter: "", from: "", to: "" });

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalExpenses = useMemo(() => mockRows.reduce((s, r) => s + r.amount, 0), []);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet size={20} className="text-[var(--primary)]" />
              {t("expenses_detail_report", "تقرير تفصيلي للمصروفات")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Printer size={16} /><span className="hidden sm:inline">Print</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileText size={16} /><span className="hidden sm:inline">PDF</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileSpreadsheet size={16} /><span className="hidden sm:inline">XML</span></Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
           {/* Summary Box */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-red-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_expenses", "إجمالي المصروفات")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalExpenses)}</h2>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("fiscal_year", "السنة المالية")}</label>
                <ComboboxField items={FISCAL_YEARS.map(y => ({label: y, value: y}))} value={filters.fiscalYear} onChange={handleYearChange} valueKey="value" labelKey="label" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("fiscal_quarter", "الربع المالي")}</label>
                <ComboboxField items={FISCAL_QUARTERS} value={filters.fiscalQuarter} onChange={handleQuarterChange} valueKey="value" labelKey="label" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <Input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))}  />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <Input type="date" value={filters.to} onChange={e => setFilters(p => ({ ...p, to: e.target.value }))}  />
              </div>
              <div className="flex flex-row items-end gap-2 lg:col-span-4 justify-end">
                <Button onClick={handleSearch} variant="default" className="h-10 px-6 gap-2"><Search size={16} />{t("execute_operation", "اتمام العملية")}</Button>
                <Button onClick={handleClear} variant="outline" className="h-10 px-3 gap-1"><RotateCcw size={15} /></Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable value={mockRows} paginator rows={5} className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")} responsiveLayout="stack">
              <Column field="date" header={t("date", "التاريخ")} sortable />
              <Column field="category" header={t("category", "التصنيف")} sortable />
              <Column field="description" header={t("description", "وصف المصروف")} />
              <Column field="amount" header={t("amount", "المبلغ")} sortable body={r => <span className="text-sm font-bold text-red-500">{formatNumber(r.amount)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
