import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Wallet, CreditCard, ClipboardList } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import { Input } from "@/components/ui/input";

import { useGetExpensesReport } from "@/features/reports/hooks/Usegetexpensesreport";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useGetItems } from "@/features/items/hooks/useGetItems"; // التغيير هنا لجلب البنود
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";

interface FilterState {
  branchId: string;
  itemId: string;
  treasuryId: string;
  from: string;
  to: string;
}

export default function ExpensesDetailReport() {
  const { t, direction } = useLanguage();

  const initialFilters: FilterState = {
    branchId: "1",
    itemId: "",
    treasuryId: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchParams, setSearchParams] = useState<FilterState>(initialFilters);

  // ─── Data Fetching ──────────────────────────────────────────
  const { data: branches = [] } = useGetAllBranches();
  const { data: treasuries = [] } = useGetAllTreasurys();
  const { data: itemsRes } = useGetItems(); // جلب البنود بدلاً من الكاتيجوري

  const itemsList = useMemo(() => {
    const data = Array.isArray(itemsRes) ? itemsRes : itemsRes?.items || [];
    return data.map((item: any) => ({
      label: direction === "rtl" ? item.nameAr || item.name : item.nameEn || item.name,
      value: String(item.id),
    }));
  }, [itemsRes, direction]);

  const { data: expensesResponse, isLoading: expensesLoading, isFetching: expensesFetching } = useGetExpensesReport({
    branchid: searchParams.branchId,
    TreasuryId: searchParams.treasuryId || undefined,
    ItemId: searchParams.itemId || undefined,
    FromDate: searchParams.from,
    ToDate: searchParams.to,
  });

  const handleSearch = () => setSearchParams(filters);

  const handleClear = () => {
    setFilters(initialFilters);
    setSearchParams(initialFilters);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

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
              <Printer size={16} /> <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="opacity-90 text-xs font-medium mb-1">{t("total_expenses", "إجمالي المصروفات")}</p>
                <h2 className="text-2xl font-bold font-mono">{formatNumber(expensesResponse?.totalAmount)}</h2>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20">
                <CreditCard size={28} />
              </div>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="opacity-90 text-xs font-medium mb-1">{t("operation_count", "عدد العمليات")}</p>
                <h2 className="text-2xl font-bold font-mono">{expensesResponse?.totalCount ?? 0}</h2>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20">
                <ClipboardList size={28} />
              </div>
            </div>
          </div>

          {/* Filters - الالتزام بالديزاين الثاني */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
                <div className="space-y-2 lg:col-span-1 mb-2">
                  <label className="text-xs font-medium text-[var(--text-main)]">{t("branch", "الفرع")}</label>
                  <Select
                    value={filters.branchId}
                    onValueChange={val => setFilters(p => ({ ...p, branchId: val }))}
                  >
                    <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                      <SelectValue placeholder={t("select_branch", "الكل")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">{t("all", "الكل")}</SelectItem>
                      {branches.map(b => (
                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* استخدام ComboboxField للبنود كما في الديزاين */}
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("item", "البند")}</label>
                <ComboboxField
                  items={itemsList}
                  value={filters.itemId}
                  onChange={val => setFilters(p => ({ ...p, itemId: String(val) }))}
                  valueKey="value"
                  labelKey="label"
                  placeholder={t("select_item", "اختر البند")}
                />
              </div>

              {/* استخدام ComboboxField للخزينة كما في الديزاين */}
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

              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("from_date", "تاريخ البداية")}
                </label>
                <div className="relative flex items-center border border-input rounded-md bg-background">
                  <DatePicker
                    selected={filters.from ? new Date(filters.from) : null}
                    onChange={(date) =>
                      setFilters((p) => ({ ...p, from: date ? format(date, "yyyy-MM-dd") : "" }))
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("select_date", "يوم/شهر/سنة")}
                    popperPlacement="bottom-start"
                    portalId="root-portal" // لحل مشكلة الطبقات (z-index)
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {filters.from
                            ? format(new Date(filters.from), "dd/MM/yyyy")
                            : t("select_date", "يوم/شهر/سنة")}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("to_date", "تاريخ النهاية")}
                </label>
                <div className="relative flex items-center border border-input rounded-md bg-background">
                  <DatePicker
                    selected={filters.to ? new Date(filters.to) : null}
                    onChange={(date) =>
                      setFilters((p) => ({ ...p, to: date ? format(date, "yyyy-MM-dd") : "" }))
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("select_date", "يوم/شهر/سنة")}
                    popperPlacement="bottom-start"
                    portalId="root-portal" // لحل مشكلة الطبقات (z-index)
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {/* هنا تم التعديل من filters.from إلى filters.to */}
                          {filters.to
                            ? format(new Date(filters.to), "dd/MM/yyyy")
                            : t("select_date", "يوم/شهر/سنة")}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row items-end gap-2 mb-2 lg:col-span-1">
                <Button onClick={handleSearch} disabled={expensesLoading || expensesFetching} className="flex-1 h-9 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold">
                  <Search size={16} />{t("search", "بحث")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800">
                  <RotateCcw size={15} />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <DataTable
              value={expensesResponse?.data ?? []}
              paginator
              rows={10}
              loading={expensesLoading || expensesFetching}
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column header="م" body={(_, opt) => opt.rowIndex + 1} headerStyle={{ width: '50px' }} />
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