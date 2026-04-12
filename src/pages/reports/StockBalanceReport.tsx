import React, { useState } from "react";
import {
  PackageSearch,
  Filter,
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

type FilterState = {
  from: string;
  to: string;
};

type InventoryRow = {
  id: string;
  code: string;
  name: string;
  unit: string;
  cost: number;
  price: number;
  quantity: number;
  totalCost: number;
  totalPrice: number;
};

export default function StockBalanceReport() {
  const { t, direction } = useLanguage();

  const [entriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    from: "",
    to: "",
  });

  const [submittedFilters, setSubmittedFilters] = useState<FilterState>({
    from: "",
    to: "",
  });

  const rows: InventoryRow[] = [
    {
      id: "1",
      code: "21212121212121",
      name: "مياه",
      unit: "وحده",
      cost: 50.0,
      price: 50.0,
      quantity: 0.0,
      totalCost: 0.0,
      totalPrice: 0.0,
    },
    {
      id: "2",
      code: "6281101700752",
      name: "يونيفود مكرونه",
      unit: "حبة",
      cost: 0.0,
      price: 3.0,
      quantity: 0.0,
      totalCost: 0.0,
      totalPrice: 0.0,
    },
    {
      id: "3",
      code: "6281101700394",
      name: "يونيفود مكرونه",
      unit: "حبة",
      cost: 0.0,
      price: 3.0,
      quantity: 0.0,
      totalCost: 0.0,
      totalPrice: 0.0,
    },
    {
      id: "4",
      code: "6291003081545",
      name: "بونكرو قوة الفول",
      unit: "حبة",
      cost: 0.0,
      price: 12.0,
      quantity: 0.0,
      totalCost: 0.0,
      totalPrice: 0.0,
    },
  ];

  const handleSearch = () => {
    setSubmittedFilters(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const resetState: FilterState = {
      from: "",
      to: "",
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
      <style>
        {`
          .inventory-table .p-datatable-table {
            width: 100% !important;
            table-layout: fixed !important;
          }

          .inventory-table .p-datatable-wrapper {
            overflow-x: hidden !important;
          }

          .inventory-table .p-datatable-thead > tr > th,
          .inventory-table .p-datatable-tbody > tr > td {
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            vertical-align: middle;
            text-align: center !important;
          }
        `}
      </style>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PackageSearch size={20} className="text-[var(--primary)]" />
              {t("inventory_report", "تقرير جرد الأصناف")}
            </CardTitle>
            <CardDescription>{t("customize_report_below")}</CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <Printer size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">Print</span>
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

        <CardContent className="space-y-5">
          {/* Combined Summary & Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* Box 1 */}
              <div className="bg-emerald-500 text-white rounded-xl p-3 shadow flex flex-col justify-center h-[68px] lg:col-span-1">
                <p className="opacity-90 text-[11px] lg:text-xs font-medium mb-0.5 truncate">{t("total_cost", "إجمالي التكلفة")}</p>
                <h2 className="text-lg lg:text-xl font-bold truncate">{formatNumber(7394.27)}</h2>
              </div>
              
              {/* Box 2 */}
              <div className="bg-teal-500 text-white rounded-xl p-3 shadow flex flex-col justify-center h-[68px] lg:col-span-1">
                <p className="opacity-90 text-[11px] lg:text-xs font-medium mb-0.5 truncate">{t("total_selling_price", "إجمالي سعر البيع")}</p>
                <h2 className="text-lg lg:text-xl font-bold truncate">{formatNumber(82124.85)}-</h2>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("from_date", "تاريخ البداية")}
                </label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
                  className="takamol-input h-10 w-full"
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("to_date", "تاريخ النهاية")}
                </label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
                  className="takamol-input h-10 w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-2 lg:col-span-2">
                <Button onClick={handleSearch} variant="default" className="w-full sm:w-auto h-10 px-6 gap-2">
                  <Search size={16} />
                  <span className="truncate">{t("execute_operation", "اتمام العملية")}</span>
                </Button>

                <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto h-10 px-4 gap-2">
                  <RotateCcw size={16} />
                  <span className="sm:hidden">{t("clear")}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden xl:block rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={rows}
              paginator
              rows={entriesPerPage}
              first={(currentPage - 1) * entriesPerPage}
              onPage={(e: DataTablePageEvent) => {
                if (e.page === undefined) return;
                setCurrentPage(e.page + 1);
              }}
              dataKey="id"
              className="custom-green-table custom-compact-table inventory-table"
              emptyMessage={t("no_data")}
              responsiveLayout="stack"
            >
              <Column
                field="code"
                header={t("item_code", "كود الصنف")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-medium">{rowData.code}</span>
                )}
              />

              <Column
                field="name"
                header={t("item_name", "اسم الصنف")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-bold text-[var(--text-main)]">
                    {rowData.name}
                  </span>
                )}
              />

              <Column
                field="unit"
                header={t("unit", "وحدة")}
                sortable
                body={(rowData) => (
                  <span className="text-sm">{rowData.unit}</span>
                )}
              />

              <Column
                field="cost"
                header={t("cost", "تكلفة")}
                sortable
                body={(rowData) => (
                  <span className="text-sm whitespace-nowrap">
                    {formatNumber(rowData.cost)}
                  </span>
                )}
              />

              <Column
                field="price"
                header={t("price", "السعر")}
                sortable
                body={(rowData) => (
                  <span className="text-sm whitespace-nowrap">
                    {formatNumber(rowData.price)}
                  </span>
                )}
              />

              <Column
                field="quantity"
                header={t("quantity", "كمية")}
                sortable
                body={(rowData) => (
                  <span className="text-sm whitespace-nowrap font-medium">
                    {formatNumber(rowData.quantity)}
                  </span>
                )}
              />

              <Column
                field="totalCost"
                header={t("total_cost", "اجمالي التكلفة")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">
                    {formatNumber(rowData.totalCost)}
                  </span>
                )}
              />

              <Column
                field="totalPrice"
                header={t("total_selling_price", "اجمالي سعر البيع")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">
                    {formatNumber(rowData.totalPrice)}
                  </span>
                )}
              />
            </DataTable>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:hidden">
            {rows.length === 0 ? (
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
                    key={row.id}
                    className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                          <PackageSearch size={18} className="text-[var(--primary)]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[var(--text-muted)] mb-0.5">
                            {row.code}
                          </p>
                          <p className="text-sm font-bold text-[var(--text-main)] truncate">
                            {row.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">
                        {row.unit}
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-[#f8fafc] dark:bg-slate-900/60 flex-1 border border-gray-100 dark:border-slate-800">
                          <p className="text-xs text-[var(--text-muted)] mb-1">{t("quantity")}</p>
                          <p className="text-sm font-bold">{formatNumber(row.quantity)}</p>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-[#f8fafc] dark:bg-slate-900/60 flex-1 border border-gray-100 dark:border-slate-800">
                          <p className="text-xs text-[var(--text-muted)] mb-1">{t("cost")}</p>
                          <p className="text-sm font-bold">{formatNumber(row.cost)}</p>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-[#f8fafc] dark:bg-slate-900/60 flex-1 border border-gray-100 dark:border-slate-800">
                          <p className="text-xs text-[var(--text-muted)] mb-1">{t("price")}</p>
                          <p className="text-sm font-bold">{formatNumber(row.price)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[rgba(49,201,110,0.05)] p-3 text-center border border-[rgba(49,201,110,0.1)]">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            {t("total_cost", "إجمالي التكلفة")}
                          </p>
                          <p className="text-sm font-bold text-[var(--primary)]">
                            {formatNumber(row.totalCost)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[rgba(49,201,110,0.05)] p-3 text-center border border-[rgba(49,201,110,0.1)]">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            {t("total_selling_price", "إجمالي سعر البيع")}
                          </p>
                          <p className="text-sm font-bold text-[var(--primary)]">
                            {formatNumber(row.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}

            {rows.length > 0 && (
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
