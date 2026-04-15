import React, { useState } from "react";
import {
  AlertTriangle,
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
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useGetStockAlertsReport } from "@/features/reports/hooks/useGetStockAlertsReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";

export default function LowStockReport() {
  const { t, direction } = useLanguage();
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    branchId: " ",
  });

  const [submittedFilters, setSubmittedFilters] = useState({
    branchId: " ",
  });

  const { data: rows = [], isLoading, isFetching } = useGetStockAlertsReport({
    branchId: submittedFilters.branchId.trim() || undefined,
  });

  const { data: branches = [] } = useGetAllBranches();

  const handleSearch = () => {
    setSubmittedFilters(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const resetState = {
      branchId: " ",
    };
    setFilters(resetState);
    setSubmittedFilters(resetState);
    setCurrentPage(1);
  };

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[var(--primary)]" />
              {t("low_stock_alerts", "تنبيهات المخزون")}
            </CardTitle>
            <CardDescription>{t("customize_report_below")}</CardDescription>
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
          {/* Filters Row */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-xs font-medium text-text-main">{t("branch", "الفرع")}</Label>
                  <Select value={filters.branchId} onValueChange={(val) => setFilters((p) => ({ ...p, branchId: val }))}>
                    <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                      <SelectValue placeholder={t("select_branch", "اختر الفرع")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">{t("all", "الكل")}</SelectItem>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button onClick={handleSearch} size="sm" className="h-10 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold transition-all duration-300 hover:scale-[1.02] transform" disabled={isLoading || isFetching}>
                <Search size={16} /> {t("execute_operation", "اتمام العملية")}
              </Button>
              <Button onClick={handleClear} size="sm" variant="outline" className="h-10 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300">
                <RotateCcw size={15} /> {t("clear", "مسح")}
              </Button>
            </div>
          </div>

          <div className="hidden md:block rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={rows}
              loading={isLoading || isFetching}
              paginator
              rows={entriesPerPage}
              first={(currentPage - 1) * entriesPerPage}
              onPage={(e: DataTablePageEvent) => {
                if (e.page === undefined) return;
                setCurrentPage(e.page + 1);
              }}
              dataKey="productId"
              className="custom-green-table custom-compact-table low-stock-table"
              emptyMessage={t("no_data")}
              responsiveLayout="stack"
            >
              <Column
                field="barcode"
                header={t("barcode", "باركود")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-medium">{rowData.barcode}</span>
                )}
              />

              <Column
                field="productName"
                header={t("item_name", "اسم الصنف")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-bold text-[var(--text-main)]">
                    {rowData.productName}
                  </span>
                )}
              />

              <Column
                field="currentQty"
                header={t("current_quantity", "الكمية الحالية")}
                sortable
                body={(rowData) => (
                  <span className="text-sm border border-red-200 bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold inline-block">
                    {formatNumber(rowData.currentQty)}
                  </span>
                )}
              />

              <Column
                field="minStockLevel"
                header={t("min_stock_level", "حد الطلب")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatNumber(rowData.minStockLevel)}
                  </span>
                )}
              />
            </DataTable>
          </div>

          <div className="grid grid-cols-1 gap-5 md:hidden">
            {isLoading || isFetching ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">{t("loading", "جاري التحميل...")}</div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">
                {t("no_data")}
              </div>
            ) : (
              rows
                .slice(
                  (currentPage - 1) * entriesPerPage,
                  currentPage * entriesPerPage
                )
                .map((row) => (
                  <div
                    key={row.productId}
                    className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                          <AlertTriangle size={18} className="text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[var(--text-muted)] mb-0.5">
                            {row.barcode}
                          </p>
                          <p className="text-sm font-bold text-[var(--text-main)] truncate">
                            {row.productName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3 text-center border border-gray-100 dark:border-slate-800">
                          <p className="text-xs text-[var(--text-muted)] mb-2">
                            {t("min_stock_level", "حد الطلب")}
                          </p>
                          <p className="text-sm font-bold">
                            {formatNumber(row.minStockLevel)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-3 text-center border border-red-100 dark:border-red-900/30">
                          <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                            {t("current_quantity", "الكمية الحالية")}
                          </p>
                          <p className="text-sm font-bold text-red-700 dark:text-red-300">
                            {formatNumber(row.currentQty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}

            {rows.length > entriesPerPage && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-[var(--text-main)] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("previous")}
                </button>
                <div className="h-10 min-w-10 px-4 rounded-xl bg-[rgba(49,201,110,0.12)] text-[var(--primary)] flex items-center justify-center text-sm font-bold">
                  {currentPage}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < Math.ceil(rows.length / entriesPerPage)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={currentPage >= Math.ceil(rows.length / entriesPerPage)}
                  className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-[var(--text-main)] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
