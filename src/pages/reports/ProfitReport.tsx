import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, TrendingUp, DollarSign, ArrowDownRight, ArrowUpRight, MinusCircle } from "lucide-react";
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

export default function ProfitReport() {
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

  const data = {
    sales: 150000.0,
    costOfGoodsSold: 90000.0,
    grossProfit: 60000.0,
    expenses: 15000.0,
    netProfit: 45000.0
  };

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[var(--primary)]" />
              {t("profit_report", "تقرير الأرباح")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Printer size={16} /><span className="hidden sm:inline">Print</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileText size={16} /><span className="hidden sm:inline">PDF</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileSpreadsheet size={16} /><span className="hidden sm:inline">XML</span></Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">{t("total_sales", "إجمالي المبيعات")}</p>
                  <p className="text-2xl font-bold text-[var(--text-main)]">{formatNumber(data.sales)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <MinusCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">{t("cost_of_goods_sold", "تكلفة البضاعة المباعة")}</p>
                  <p className="text-2xl font-bold text-[var(--text-main)]">{formatNumber(data.costOfGoodsSold)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <ArrowUpRight size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">{t("gross_profit", "إجمالي الربح")}</p>
                  <p className="text-2xl font-bold text-teal-500">{formatNumber(data.grossProfit)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                  <ArrowDownRight size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">{t("total_expenses", "إجمالي المصاريف")}</p>
                  <p className="text-2xl font-bold text-red-500">{formatNumber(data.expenses)}</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--primary)] border border-[var(--primary-hover)] rounded-2xl p-6 relative overflow-hidden shadow-lg lg:col-span-2">
               <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{t("net_profit", "صافي الربح")}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">{formatNumber(data.netProfit)}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 p-2 opacity-10">
                 <TrendingUp size={120} className="text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
