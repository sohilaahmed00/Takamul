import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  { id: "1", date: "2026-01-05", invoiceNumber: "INV-1001", sales: 1000.0, tax: 150.0, total: 1150.0 },
  { id: "2", date: "2026-01-10", invoiceNumber: "INV-1002", sales: 2500.0, tax: 375.0, total: 2875.0 },
  { id: "3", date: "2026-02-03", invoiceNumber: "INV-1003", sales: 780.0, tax: 117.0, total: 897.0 },
  { id: "4", date: "2026-02-18", invoiceNumber: "INV-1004", sales: 3200.0, tax: 480.0, total: 3680.0 },
  { id: "5", date: "2026-03-07", invoiceNumber: "INV-1005", sales: 560.0, tax: 84.0, total: 644.0 },
];

export default function SalesByInvoiceReport() {
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

  const handleSearch = () => { };
  const handleClear = () => {
    setFilters({ fiscalYear: new Date().getFullYear().toString(), fiscalQuarter: "", from: "", to: "" });
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalSales = useMemo(() => mockRows.reduce((s, r) => s + r.sales, 0), []);
  const totalTax = useMemo(() => mockRows.reduce((s, r) => s + r.tax, 0), []);
  const totalFinal = useMemo(() => mockRows.reduce((s, r) => s + r.total, 0), []);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} className="text-[var(--primary)]" />
              {t("sales_by_invoice", "تقرير إجمالي المبيعات على مستوى أرقام الفواتير")}
            </CardTitle>
           
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} /> <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} /> <span className="hidden sm:inline">XML</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">

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

          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
             <div className="space-y-2 lg:col-span-1">
  <label className="text-xs font-medium text-[var(--text-main)]">
    {t("fiscal_year", "السنة المالية")}
  </label>
  <Select value={filters.fiscalYear} onValueChange={handleYearChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={t("select_year", "اختر السنة")} />
    </SelectTrigger>
    <SelectContent>
      {FISCAL_YEARS.map((y) => (
        <SelectItem key={y} value={y}>{y}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

<div className="space-y-2 lg:col-span-1">
  <label className="text-xs font-medium text-[var(--text-main)]">
    {t("fiscal_quarter", "الربع المالي")}
  </label>
  <Select value={filters.fiscalQuarter} onValueChange={handleQuarterChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={t("select_quarter", "اختر الربع")} />
    </SelectTrigger>
    <SelectContent>
      {FISCAL_QUARTERS.map((q) => (
        <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
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

              <div className="flex flex-row items-end gap-2 lg:col-span-2 ">
                <Button onClick={handleSearch} className="h-9 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold">
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} />
                  {t("clear", "مسح")}
                </Button>
              </div>
            </div>
          </div>


          {/* Table - no serial, no customer */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={mockRows}
              paginator rows={5}
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column field="date" header={t("date", "التاريخ")} sortable body={(r) => <span className="text-sm">{r.date}</span>} />
              <Column field="invoiceNumber" header={t("invoice_number", "رقم الفاتورة")} sortable body={(r) => <span className="text-sm font-bold text-[var(--text-main)]">{r.invoiceNumber}</span>} />
              <Column field="sales" header={t("sales_excl_tax", "المبيعات")} sortable body={(r) => <span className="text-sm font-medium">{formatNumber(r.sales)}</span>} />
              <Column field="tax" header={t("tax", "الضريبة")} sortable body={(r) => <span className="text-sm">{formatNumber(r.tax)}</span>} />
              <Column field="total" header={t("document_total", "إجمالي المستند")} sortable body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.total)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
