import React, { useState, useMemo } from "react";
import {
  PackageSearch,
  RotateCcw,
  Search,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useGetInventoryStock } from "@/features/reports/hooks/Usegetinventorystock";

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


type FilterState = { branchId: string; from: string; to: string };

export default function StockBalanceReport() {
  const { t, direction } = useLanguage();

  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  const { data: reportData, isLoading, isFetching } = useGetInventoryStock({
    branchid: searchParams.branchId.trim() || undefined,
    from: searchParams.from,
    to: searchParams.to,
  });

  const { data: branches = [] } = useGetAllBranches();

  const handleSearch = () => {
    setSearchParams(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const reset: FilterState = {
      branchId: " ",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
    };
    setFilters(reset);
    setSearchParams(reset);
    setCurrentPage(1);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ✅ Summary totals من الداتا الحقيقية
  const totalCostValue = useMemo(
    () => reportData?.reduce((s, r) => s + r.totalCostValue, 0) ?? 0,
    [reportData]
  );
  const totalSaleValue = useMemo(
    () => reportData?.reduce((s, r) => s + r.totalSaleValue, 0) ?? 0,
    [reportData]
  );
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  return (
    <div dir={direction}>
      <style>{`
        .inventory-table .p-datatable-table { width: 100% !important; table-layout: fixed !important; }
        .inventory-table .p-datatable-wrapper { overflow-x: hidden !important; }
        .inventory-table .p-datatable-thead > tr > th,
        .inventory-table .p-datatable-tbody > tr > td {
          white-space: normal !important; word-break: break-word !important;
          overflow-wrap: anywhere !important; vertical-align: middle; text-align: center !important;
        }
      `}</style>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PackageSearch size={20} className="text-[var(--primary)]" />
              {t("inventory_report", "تقرير جرد الأصناف")}
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

        <CardContent className="space-y-5">
          {/* Filters + Summary */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5 space-y-4">

            {/* Summary Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500 text-white rounded-xl p-3 shadow flex flex-col justify-center h-[68px]">
                <p className="opacity-90 text-[11px] lg:text-xs font-medium mb-0.5 truncate">
                  {t("total_cost", "إجمالي التكلفة")}
                </p>
                <h2 className="text-lg lg:text-xl font-bold truncate">{formatNumber(totalCostValue)}</h2>
              </div>
              <div className="bg-teal-500 text-white rounded-xl p-3 shadow flex flex-col justify-center h-[68px]">
                <p className="opacity-90 text-[11px] lg:text-xs font-medium mb-0.5 truncate">
                  {t("total_selling_price", "إجمالي سعر البيع")}
                </p>
                <h2 className="text-lg lg:text-xl font-bold truncate">{formatNumber(totalSaleValue)}</h2>
              </div>
            </div>
            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-4 shadow-sm p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-all duration-300">
              {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-xs font-medium text-[var(--text-main)]">{t("branch", "الفرع")}</label>
                  <Select
                    value={filters.branchId}
                    onValueChange={val => setFilters(p => ({ ...p, branchId: val }))}
                  >
                    <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                      <SelectValue placeholder={t("select_branch", "اختر الفرع")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">{t("all", "الكل")}</SelectItem>
                      {branches.map(b => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
              <Button onClick={handleSearch} size="sm" className="h-10 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold transition-all duration-300 hover:scale-[1.02] transform" disabled={isLoading || isFetching}>
                <Search size={16} /> {t("execute_operation", "اتمام العملية")}
              </Button>
              <Button onClick={handleClear} size="sm" variant="outline" className="h-10 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300">
                <RotateCcw size={15} /> {t("clear", "مسح")}
              </Button>
            </div>

          </div>
          {/* Desktop Table */}
          <div className="hidden xl:block rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={reportData || []}
              loading={isLoading || isFetching}
              paginator
              rows={entriesPerPage}
              first={(currentPage - 1) * entriesPerPage}
              onPage={(e: DataTablePageEvent) => { if (e.page !== undefined) setCurrentPage(e.page + 1); }}
              dataKey="productId"
              className="custom-green-table custom-compact-table inventory-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column field="productName" header={t("item_name", "اسم الصنف")} sortable
                body={(r) => <span className="text-sm font-bold text-[var(--text-main)]">{r.productName}</span>} />
              <Column field="unitName" header={t("unit", "وحدة")} sortable
                body={(r) => <span className="text-sm">{r.unitName}</span>} />
              <Column field="costPrice" header={t("cost", "تكلفة")} sortable
                body={(r) => <span className="text-sm whitespace-nowrap">{formatNumber(r.costPrice)}</span>} />
              <Column field="salePrice" header={t("price", "السعر")} sortable
                body={(r) => <span className="text-sm whitespace-nowrap">{formatNumber(r.salePrice)}</span>} />
              <Column field="currentQty" header={t("quantity", "كمية")} sortable
                body={(r) => <span className="text-sm whitespace-nowrap font-medium">{formatNumber(r.currentQty)}</span>} />
              <Column field="totalCostValue" header={t("total_cost", "إجمالي التكلفة")} sortable
                body={(r) => <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">{formatNumber(r.totalCostValue)}</span>} />
              <Column field="totalSaleValue" header={t("total_selling_price", "إجمالي سعر البيع")} sortable
                body={(r) => <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">{formatNumber(r.totalSaleValue)}</span>} />
            </DataTable>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-5 xl:hidden">
            {(isLoading || isFetching) ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">{t("loading", "جاري التحميل...")}</div>
            ) : !reportData?.length ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">
                {t("no_data", "لا توجد بيانات")}
              </div>
            ) : (
              reportData
                .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                .map((row) => (
                  <div key={row.productId} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                          <PackageSearch size={18} className="text-[var(--primary)]" />
                        </div>
                        <p className="text-sm font-bold text-[var(--text-main)] truncate">{row.productName}</p>
                      </div>
                      <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">
                        {row.unitName}
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3 justify-between">
                        {[
                          { label: t("quantity", "كمية"), val: formatNumber(row.currentQty) },
                          { label: t("cost", "تكلفة"), val: formatNumber(row.costPrice) },
                          { label: t("price", "السعر"), val: formatNumber(row.salePrice) },
                        ].map((item) => (
                          <div key={item.label} className="flex flex-col items-center p-2 rounded-lg bg-[#f8fafc] dark:bg-slate-900/60 flex-1 border border-gray-100 dark:border-slate-800">
                            <p className="text-xs text-[var(--text-muted)] mb-1">{item.label}</p>
                            <p className="text-sm font-bold">{item.val}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[rgba(49,201,110,0.05)] p-3 text-center border border-[rgba(49,201,110,0.1)]">
                          <p className="text-xs text-[var(--text-muted)] mb-1">{t("total_cost", "إجمالي التكلفة")}</p>
                          <p className="text-sm font-bold text-[var(--primary)]">{formatNumber(row.totalCostValue)}</p>
                        </div>
                        <div className="rounded-xl bg-[rgba(49,201,110,0.05)] p-3 text-center border border-[rgba(49,201,110,0.1)]">
                          <p className="text-xs text-[var(--text-muted)] mb-1">{t("total_selling_price", "إجمالي سعر البيع")}</p>
                          <p className="text-sm font-bold text-[var(--primary)]">{formatNumber(row.totalSaleValue)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
            {reportData && reportData.length > entriesPerPage && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-sm disabled:opacity-50">
                  {t("previous", "السابق")}
                </button>
                <div className="h-10 min-w-10 px-4 rounded-xl bg-[rgba(49,201,110,0.12)] text-[var(--primary)] flex items-center justify-center text-sm font-bold">
                  {currentPage}
                </div>
                <button type="button"
                  onClick={() => setCurrentPage((p) => p < Math.ceil((reportData?.length ?? 0) / entriesPerPage) ? p + 1 : p)}
                  disabled={currentPage >= Math.ceil((reportData?.length ?? 0) / entriesPerPage)}
                  className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-sm disabled:opacity-50">
                  {t("next", "التالي")}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
