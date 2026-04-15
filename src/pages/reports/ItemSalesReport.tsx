import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Barcode } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";

import { useGetItemSalesReport } from "@/features/reports/hooks/Usegetitemsalesreport";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";

interface FilterState {
  branchId: string;
  productId: string;
  from: string;
  to: string;
}

export default function ItemSalesReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
    productId: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // Data Fetching
  const { data: salesResponse, isLoading: salesLoading, isFetching: salesFetching } = useGetItemSalesReport({
    branchid: searchParams.branchId.trim() || undefined,
    productCode: searchParams.productId,
    from: searchParams.from,
    to: searchParams.to,
  });

  const { data: productsData } = useGetAllProducts({ page: 1, limit: 1000 });
  const { data: branches = [] } = useGetAllBranches();

  const handleSearch = () => setSearchParams(filters);
  const handleClear = () => {
    const reset = {
      branchId: " ",
      productId: "",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0]
    };
    setFilters(reset);
    setSearchParams(reset);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows = useMemo(() => salesResponse?.details ?? [], [salesResponse]);
  const totalSalesAmount = salesResponse?.summary.totalSales ?? 0;
  const totalQuantity = salesResponse?.summary.totalQuantitySold ?? 0;
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Barcode size={20} className="text-[var(--primary)]" />
              {t("item_sales_report", "تقرير مبيعات صنف")}
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
          {/* 2 Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_item_sales", "إجمالي مبيعات الصنف")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalSalesAmount)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_sales_quantity", "عدد عمليات البيع")}</p>
              <h2 className="text-2xl font-bold">{totalQuantity.toLocaleString()}</h2>
            </div>
          </div>

          {/* Filters */}
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
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("product_name", "اسم الصنف")}</label>
                <ComboboxField
                  value={filters.productId}
                  onChange={(val) => setFilters((p) => ({ ...p, productId: String(val) }))}
                  items={(productsData?.items ?? []).map((p) => ({ id: String(p.id), name: p.productNameAr }))}
                  valueKey="id"
                  labelKey="name"
                  placeholder={t("select_product", "اختر الصنف")}
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <Input type="date" value={filters.from}
                  onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                  className="mb-2"
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <Input type="date" value={filters.to}
                  onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                  className="mb-2"
                />
              </div>
              <div className="flex flex-row items-end gap-2 mb-2 lg:col-span-1">
                <Button onClick={handleSearch} disabled={salesLoading || salesFetching || !filters.productId} className="h-9 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold flex-1">
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


          {/* Table: م، التاريخ، رقم الفاتورة، الكمية المباعة، إجمالي البيع */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={rows} paginator rows={10}
              loading={salesLoading || salesFetching}
              className="custom-green-table custom-compact-table"
              emptyMessage={!searchParams.productId ? t("select_product_first", "اختر صنفاً أولاً لعرض التقرير") : t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column header={t("serial", "م")} body={(_, opt) => <span className="text-sm font-semibold">{opt.rowIndex + 1}</span>} />
              <Column field="date" header={t("date", "التاريخ")} sortable body={(r) => <span className="text-sm">{new Date(r.date).toLocaleDateString("en-GB")}</span>} />
              <Column field="orderNumber" header={t("invoice_number", "رقم الفاتورة")} sortable body={(r) => <span className="text-sm font-bold text-[var(--text-main)]">{r.orderNumber}</span>} />
              <Column field="quantitySold" header={t("sold_quantity", "الكمية المباعة")} sortable body={(r) => <span className="text-sm font-medium">{r.quantitySold}</span>} />
              <Column field="totalSales" header={t("total_sales_value", "إجمالي البيع")} sortable body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.totalSales)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
