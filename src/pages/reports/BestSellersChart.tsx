import React, { useState, useMemo } from "react";
import {
  BarChart2,
  CalendarDays,
  Filter,
  RotateCcw,
  Search,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { DataTable } from "primereact/datatable";
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
import { useGetTopSellingProducts } from "@/features/reports/hooks/useGetTopSellingProducts";

import { Input } from "@/components/ui/input";

type FilterState = {
  from: string;
  to: string;
};

export default function BestSellersChart() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  const { data: reportData, isLoading, isFetching } = useGetTopSellingProducts(searchParams);

  const handleSearch = () => {
    setSearchParams(filters);
  };

  const handleClear = () => {
    const resetState: FilterState = {
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    };
    setFilters(resetState);
    setSearchParams(resetState);
  };

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalQty = useMemo(() => reportData?.reduce((s, r) => s + r.totalQuantitySold, 0) || 0, [reportData]);
  const totalSales = useMemo(() => reportData?.reduce((s, r) => s + r.totalSales, 0) || 0, [reportData]);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={20} className="text-[var(--primary)]" />
              {t("top_selling_product_report", "تقرير المنتج الأكثر مبيعا")}
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
         

          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  {t("from_date", "تاريخ البداية")}
                </label>
                <Input
                  type="date"
                  value={filters.from}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, from: e.target.value }))
                  }
                  
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  {t("to_date", "تاريخ النهاية")}
                </label>
                <Input
                  type="date"
                  value={filters.to}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, to: e.target.value }))
                  }
                  
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 py-3 xl:col-span-2">
              <div className="flex flex-row items-end gap-2 xl:col-span-2">
                <Button onClick={handleSearch} className="h-9 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold flex-1 mt-2" disabled={isLoading || isFetching}>
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} />
                </Button>
              </div>
            </div>
          </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={reportData || []}
              loading={isLoading || isFetching}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              paginator
              rows={10}
            >
              <Column 
                header={t("serial", "م")} 
                body={(_, options) => options.rowIndex + 1} 
                className="w-16"
              />
              <Column field="barcode" header={t("barcode", "باركود")} sortable />
              <Column field="productName" header={t("product_name", "اسم المنتج")} sortable />
              <Column 
                field="sellingPrice" 
                header={t("selling_price", "سعر البيع")} 
                body={(r) => formatNumber(r.sellingPrice)} 
                sortable 
              />
              <Column 
                field="totalQuantitySold" 
                header={t("sales_count", "عدد مرات البيع")} 
                sortable 
              />
              <Column 
                field="totalSales" 
                header={t("total_sales", "إجمالي المبيعات")} 
                body={(r) => formatNumber(r.totalSales)} 
                sortable 
              />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
