import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Calendar } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";

import { Input } from "@/components/ui/input";

interface FilterState {
  fiscalYear: string;
  fiscalQuarter: string;
  from: string;
  to: string;
}

const FISCAL_YEARS = ["2022", "2023", "2024", "2025", "2026"];
const FISCAL_QUARTERS = [
  { value: "Q1", label: "🟢 الربع الأول Q1 (يناير - مارس)", from: "-01-01", to: "-03-31" },
  { value: "Q2", label: "🔵 الربع الثاني Q2 (أبريل - يونيو)", from: "-04-01", to: "-06-30" },
  { value: "Q3", label: "🟡 الربع الثالث Q3 (يوليو - سبتمبر)", from: "-07-01", to: "-09-30" },
  { value: "Q4", label: "🔴 الربع الرابع Q4 (أكتوبر - ديسمبر)", from: "-10-01", to: "-12-31" },
];

const mockRows = [
  { id: "1", date: "2026-01-05", sales: 5200.0, tax: 780.0, totalWithTax: 5980.0 },
  { id: "2", date: "2026-01-10", sales: 3100.0, tax: 465.0, totalWithTax: 3565.0 },
  { id: "3", date: "2026-01-15", sales: 8700.0, tax: 1305.0, totalWithTax: 10005.0 },
  { id: "4", date: "2026-01-22", sales: 1800.0, tax: 270.0, totalWithTax: 2070.0 },
  { id: "5", date: "2026-01-30", sales: 6400.0, tax: 960.0, totalWithTax: 7360.0 },
];

export default function SalesByDayReport() {
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
  const handleClear = () => {
    setFilters({ fiscalYear: new Date().getFullYear().toString(), fiscalQuarter: "", from: "", to: "" });
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalSales = useMemo(() => mockRows.reduce((s, r) => s + r.sales, 0), []);
  const totalTax = useMemo(() => mockRows.reduce((s, r) => s + r.tax, 0), []);
  const totalFinal = useMemo(() => mockRows.reduce((s, r) => s + r.totalWithTax, 0), []);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} className="text-[var(--primary)]" />
              {t("sales_by_day", "تقرير إجمالي المبيعات على مستوى الأيام")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <Printer size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <FileText size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <FileSpreadsheet size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">XML</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("fiscal_year", "السنة المالية")}</label>
                <ComboboxField
                  value={filters.fiscalYear}
                  onChange={handleYearChange}
                  items={FISCAL_YEARS.map((y) => ({ id: y, name: y }))} valueKey="id" labelKey="name"
                  placeholder={t("select_year", "اختر السنة")}
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("fiscal_quarter", "الربع المالي")}</label>
                <ComboboxField
                  value={filters.fiscalQuarter}
                  onChange={handleQuarterChange}
                  items={FISCAL_QUARTERS.map((q) => ({ id: q.value, name: q.label }))} valueKey="id" labelKey="name"
                  placeholder={t("select_quarter", "اختر الربع")}
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <Input
                  type="date" value={filters.from}
                  onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value, fiscalQuarter: "" }))}
                  
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <Input
                  type="date" value={filters.to}
                  onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value, fiscalQuarter: "" }))}
                  
                />
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-2 lg:col-span-2">
                <Button onClick={handleSearch} variant="default" className="w-full sm:w-auto h-10 px-6 gap-2">
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto h-10 px-4 gap-2">
                  <RotateCcw size={16} />
                  {t("clear", "مسح")}
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_sales_excl_tax", "إجمالي المبيعات بدون ضريبة")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalSales)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_tax", "إجمالي الضريبة")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalTax)}</h2>
            </div>
            <div className="bg-teal-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("grand_total_with_tax", "الإجمالي النهائي")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalFinal)}</h2>
            </div>
          </div>

          {/* Table - no serial, no invoicesCount */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={mockRows}
              paginator rows={5}
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column field="date" header={t("date", "التاريخ")} sortable body={(r) => <span className="text-sm font-bold text-[var(--text-main)]">{r.date}</span>} />
              <Column field="sales" header={t("sales_excl_tax", "المبيعات")} sortable body={(r) => <span className="text-sm font-medium">{formatNumber(r.sales)}</span>} />
              <Column field="tax" header={t("tax", "الضريبة")} sortable body={(r) => <span className="text-sm">{formatNumber(r.tax)}</span>} />
              <Column field="totalWithTax" header={t("total_with_tax", "إجمالي المستندات بعد الضريبة")} sortable body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.totalWithTax)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
