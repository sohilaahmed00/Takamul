import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Wallet, CreditCard, ClipboardList } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import { Input } from "@/components/ui/input";

import { useGetAllExpenses } from "@/features/expenses/hooks/useGetAllExpenses";
import { useGetAllCategories } from "@/features/categories/hooks/useGetAllCategories";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";

interface FilterState {
  categoryId: string;
  treasuryId: string;
  from: string;
  to: string;
}

export default function ExpensesDetailReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    categoryId: "",
    treasuryId: "",
    from: "",
    to: "",
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // Data Fetching
  const { data: expensesData, isLoading: expensesLoading } = useGetAllExpenses({
    searchTerm: "", // We can enhance this if needed
  });

  const { data: categories = [] } = useGetAllCategories();

  const { data: treasuries = [] } = useGetAllTreasurys();
  const handleSearch = () => {
    setSearchParams(filters);
  };

  const handleClear = () => {
    const reset = { categoryId: "", treasuryId: "", from: "", to: "" };
    setFilters(reset);
    setSearchParams(reset);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  // Filtered Data (In-memory filtering for demo since useGetAllExpenses is basic)
  const filteredRows = useMemo(() => {
    let data = expensesData?.items ?? [];
    if (searchParams.categoryId) {
      data = data.filter(r => r.itemId === Number(searchParams.categoryId));
    }
    if (searchParams.treasuryId) {
      data = data.filter(r => r.treasuryId === Number(searchParams.treasuryId));
    }
    if (searchParams.from) {
      data = data.filter(r => new Date(r.date) >= new Date(searchParams.from));
    }
    if (searchParams.to) {
      data = data.filter(r => new Date(r.date) <= new Date(searchParams.to));
    }
    return data;
  }, [expensesData, searchParams]);

  const totalExpenses = useMemo(() => filteredRows.reduce((s, r) => s + (r.amount || 0), 0), [filteredRows]);
  const operationCount = filteredRows.length;

  return (
    <div dir={direction} className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet size={20} className="text-[var(--primary)]" />
              {t("expenses_report", "تقرير المصروفات")}
            </CardTitle>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} /> <span className="hidden sm:inline">{t("print", "Print")}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} /> <span className="hidden sm:inline">XML</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="opacity-90 text-xs font-medium mb-1">{t("total_expenses", "إجمالي المصروفات")}</p>
                <h2 className="text-2xl font-bold font-mono">{formatNumber(totalExpenses)}</h2>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20">
                <CreditCard size={28} />
              </div>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="opacity-90 text-xs font-medium mb-1">{t("operation_count", "عدد العمليات")}</p>
                <h2 className="text-2xl font-bold font-mono">{operationCount}</h2>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20">
                <ClipboardList size={28} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("item", "البند")}</label>
                <ComboboxField
                  items={categories.map(c => ({ label: direction === 'rtl' ? c.categoryNameAr : c.categoryNameEn, value: String(c.id) }))}
                  value={filters.categoryId}
                  onChange={val => setFilters(p => ({ ...p, categoryId: String(val) }))}
                  valueKey="value"
                  labelKey="label"
                  placeholder={t("select_item", "اختر البند")}
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("treasury", "الخزينة")}</label>
                <ComboboxField
                  items={treasuries.map(t => ({ label: t.name, value: String(t.id) }))}
                  value={filters.treasuryId}
                  onChange={val => setFilters(p => ({ ...p, treasuryId: String(val) }))}
                  valueKey="value"
                  labelKey="label"
                  placeholder={t("select_treasury", "اختر الخزينة")}
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <Input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))} className="mb-2" />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <Input type="date" value={filters.to} onChange={e => setFilters(p => ({ ...p, to: e.target.value }))} className="mb-2" />
              </div>
              <div className="flex flex-row items-end gap-2 mb-2">
                <Button onClick={handleSearch} className="flex-1 h-9 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold">
                  <Search size={16} />{t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} /> {t("clear", "مسح")}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <DataTable
              value={filteredRows}
              paginator
              rows={10}
              loading={expensesLoading}
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column header={t("operation_date", "تاريخ العملية")} body={r => <span className="text-sm">{formatDate(r.date)}</span>} sortable />
              <Column field="treasuryName" header={t("treasury", "الخزينة")} sortable />
              <Column field="amount" header={t("amount", "المبلغ")} sortable body={r => <span className="text-sm font-bold text-red-500">{formatNumber(r.amount)}</span>} />
              <Column field="itemName" header={t("item", "البند")} sortable body={r => <span className="text-[var(--primary)] font-medium">{r.itemName || "-"}</span>} />
              <Column field="notes" header={t("statement", "البيان")} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
