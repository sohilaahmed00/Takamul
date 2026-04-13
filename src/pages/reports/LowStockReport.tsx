import React, { useState } from "react";
import {
  AlertTriangle,
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
import { InputText } from "primereact/inputtext";

type FilterState = {
  searchQuery: string;
};

type LowStockRow = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  alertQuantity: number;
};

export default function LowStockReport() {
  const { t, direction } = useLanguage();

  const [entriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
  });

  const [submittedFilters, setSubmittedFilters] = useState<FilterState>({
    searchQuery: "",
  });

  const rows: LowStockRow[] = [
    {
      id: "1",
      code: "21212121212121",
      name: "مياه",
      quantity: -6.0,
      alertQuantity: 50.0,
    },
    {
      id: "2",
      code: "6291100277919",
      name: "غسول نايتشرز باونتي 150 مل",
      quantity: 0.0,
      alertQuantity: 10.0,
    },
  ];

  const handleSearch = () => {
    setSubmittedFilters(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const resetState: FilterState = {
      searchQuery: "",
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

        <CardContent className="space-y-5">


          <div className="hidden md:block rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
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
              className="custom-green-table custom-compact-table low-stock-table"
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
                field="quantity"
                header={t("quantity", "كمية")}
                sortable
                body={(rowData) => (
                  <span className="text-sm border border-red-200 bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold inline-block">
                    {formatNumber(rowData.quantity)}
                  </span>
                )}
              />

              <Column
                field="alertQuantity"
                header={t("alert_low_stock_quantity", "تنبيه بكميات الأصناف منخفضة العدد")}
                sortable
                body={(rowData) => (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatNumber(rowData.alertQuantity)}
                  </span>
                )}
              />
            </DataTable>
          </div>

          <div className="grid grid-cols-1 gap-5 md:hidden">
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
                          <AlertTriangle size={18} className="text-amber-500" />
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
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3 text-center border border-gray-100 dark:border-slate-800">
                          <p className="text-xs text-[var(--text-muted)] mb-2">
                            {t("alert_low_stock_quantity", "حد التنبيه")}
                          </p>
                          <p className="text-sm font-bold">
                            {formatNumber(row.alertQuantity)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-3 text-center border border-red-100 dark:border-red-900/30">
                          <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                            {t("quantity", "الكمية الحالية")}
                          </p>
                          <p className="text-sm font-bold text-red-700 dark:text-red-300">
                            {formatNumber(row.quantity)}
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
