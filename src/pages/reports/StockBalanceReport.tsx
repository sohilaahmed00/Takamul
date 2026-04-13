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
import { useGetInventoryStock } from "@/features/reports/hooks/Usegetinventorystock";

type FilterState = { from: string; to: string };

export default function StockBalanceReport() {
  const { t, direction } = useLanguage();

  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  const { data: reportData, isLoading, isFetching } = useGetInventoryStock(searchParams);

  const handleSearch = () => {
    setSearchParams(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const reset: FilterState = {
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
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <Printer size={16} className="text-gray-600 dark:text-gray-300" /><span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <FileText size={16} className="text-gray-600 dark:text-gray-300" /><span className="hidden sm:inline">PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <FileSpreadsheet size={16} className="text-gray-600 dark:text-gray-300" /><span className="hidden sm:inline">XML</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Filters + Summary */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* ✅ Summary boxes بالداتا الحقيقية */}
              <div className="bg-emerald-500 text-white rounded-xl p-3 shadow flex flex-col justify-center h-[68px] lg:col-span-1">
                <p className="opacity-90 text-[11px] lg:text-xs font-medium mb-0.5 truncate">
                  {t("total_cost", "إجمالي التكلفة")}
                </p>
                <h2 className="text-lg lg:text-xl font-bold truncate">{formatNumber(totalCostValue)}</h2>
              </div>
              <div className="bg-teal-500 text-white rounded-xl p-3 shadow flex flex-col justify-center h-[68px] lg:col-span-1">
                <p className="opacity-90 text-[11px] lg:text-xs font-medium mb-0.5 truncate">
                  {t("total_selling_price", "إجمالي سعر البيع")}
                </p>
                <h2 className="text-lg lg:text-xl font-bold truncate">{formatNumber(totalSaleValue)}</h2>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("from_date", "تاريخ البداية")}
                </label>
                <Input type="date" value={filters.from}
                  onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("to_date", "تاريخ النهاية")}
                </label>
                <Input type="date" value={filters.to}
                  onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))} />
              </div>

              <Button onClick={handleSearch} variant="default"
                className="h-10 gap-2 lg:col-span-1" disabled={isLoading || isFetching}>
                <Search size={16} />{t("execute_operation", "اتمام العملية")}
              </Button>
              <Button onClick={handleClear} variant="outline" className="h-10 lg:col-span-1">
                <RotateCcw size={16} />
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
