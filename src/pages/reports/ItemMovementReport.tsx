import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  RotateCcw,
  Search,
  Printer,
  FileText,
  FileSpreadsheet,
  Package,
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
import ComboboxField from "@/components/ui/ComboboxField";
import { useGetItems } from "@/features/items/hooks/useGetItems";
import { useGetProductMovement } from "@/features/reports/hooks/useGetProductMovement";

import { Input } from "@/components/ui/input";

type FilterState = {
  productId: string;
  from: string;
  to: string;
};

export default function ItemMovementReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    productId: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // ✅ Fix: Extract items correctly whether they are in .items or the whole array
  const { data: itemsResponse, isLoading: itemsLoading } = useGetItems({ pageSize: 500 });
  const itemsList = useMemo(() => {
    if (!itemsResponse) return [];
    if (Array.isArray(itemsResponse)) return itemsResponse;
    if (Array.isArray((itemsResponse as any).items)) return (itemsResponse as any).items;
    return [];
  }, [itemsResponse]);

  // ✅ Fix: Ensure productId is a number for the API
  const movementParams = useMemo(
    () => ({
      ...searchParams,
      productId: searchParams.productId ? Number(searchParams.productId) : "",
    }),
    [searchParams]
  );

  const { data: movementData, isLoading, isFetching } = useGetProductMovement(movementParams);

  const handleSearch = () => {
    setSearchParams(filters);
  };

  const handleClear = () => {
    const defaultFilters: FilterState = {
      productId: "",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    };
    setFilters(defaultFilters);
    setSearchParams(defaultFilters);
  };

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalIn = useMemo(() => movementData?.reduce((s, r) => s + (r.qtyIn ?? 0), 0) || 0, [movementData]);
  const totalOut = useMemo(() => movementData?.reduce((s, r) => s + (r.qtyOut ?? 0), 0) || 0, [movementData]);
  const currentBalance = useMemo(() => movementData?.[movementData.length - 1]?.runningBalance || 0, [movementData]);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw size={20} className="text-[var(--primary)]" />
              {t("item_movement_report", "تقرير حركة الصنف")}
            </CardTitle>
            <CardDescription>{t("movement_description", "عرض تفصيلي لعمليات الدخول والخروج لصنف محدد")}</CardDescription>
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
           {/* Summary Boxes */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow-sm flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_qty_in", "إجمالي الداخل")}</p>
              <h2 className="text-2xl font-bold">{totalIn}</h2>
            </div>
            <div className="bg-teal-500 text-white rounded-xl p-4 shadow-sm flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_qty_out", "إجمالي الخارج")}</p>
              <h2 className="text-2xl font-bold">{totalOut}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow-sm flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("current_balance", "الرصيد الحالي")}</p>
              <h2 className="text-2xl font-bold">{currentBalance}</h2>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-medium text-[var(--text-main)] mb-1 block">
                  {t("select_product", "اختر الصنف")}
                </label>
                <ComboboxField
                  value={filters.productId}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, productId: String(val) }))
                  }
                  items={itemsList}
                  valueKey="id"
                  labelKey="name"
                  placeholder={
                    itemsLoading
                      ? t("loading", "جاري التحميل...")
                      : t("select_product", "اختر الصنف")
                  }
                  disabled={itemsLoading}
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-medium text-[var(--text-main)] mb-1 block">
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

              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-medium text-[var(--text-main)] mb-1 block">
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

              <div className="flex items-center gap-2 lg:col-span-2">
                <Button 
                  onClick={handleSearch} 
                  variant="default" 
                  className="h-10 px-6 gap-2 flex-1"
                  disabled={isLoading || isFetching || !filters.productId}
                >
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>

                <Button onClick={handleClear} variant="outline" className="h-10 px-3 gap-1">
                  <RotateCcw size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={movementData || []}
              loading={isLoading || isFetching}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              emptyMessage={
                !searchParams.productId
                  ? t("select_product_first", "اختر صنفاً أولاً لعرض الحركة")
                  : t("no_data", "لا توجد بيانات في الجدول")
              }
              paginator
              rows={10}
            >
              <Column
                field="transDate"
                header={t("trans_date", "التاريخ")}
                sortable
                body={(r) => (
                  <span className="text-sm whitespace-nowrap">
                    {formatDate(r.transDate)}
                  </span>
                )}
              />

              <Column
                field="barcode"
                header={t("item_code", "كود الصنف")}
                sortable
                body={(r) => <span className="text-sm font-medium">{r.barcode}</span>}
              />

              <Column
                field="productName"
                header={t("item_name", "اسم الصنف")}
                sortable
                body={(r) => (
                  <span className="text-sm font-bold text-[var(--text-main)]">
                    {r.productNameAr || r.productName}
                  </span>
                )}
              />

              <Column
                field="transType"
                header={t("movement_type", "نوع الحركة")}
                sortable
                body={(r) => <span className="text-sm">{r.transType}</span>}
              />

              <Column
                field="invoiceNo"
                header={t("reference", "المرجع")}
                sortable
                body={(r) => <span className="text-sm">{r.invoiceNo}</span>}
              />

              <Column
                field="qtyIn"
                header={t("qty_in", "الداخل")}
                sortable
                body={(r) => (
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {r.qtyIn > 0 ? `+${r.qtyIn}` : "-"}
                  </span>
                )}
              />
              <Column
                field="qtyOut"
                header={t("qty_out", "الخارج")}
                sortable
                body={(r) => (
                  <span className="text-sm font-medium text-red-500 dark:text-red-400">
                    {r.qtyOut > 0 ? `-${r.qtyOut}` : "-"}
                  </span>
                )}
              />

              <Column
                field="runningBalance"
                header={t("quantity_after", "الكمية بعد")}
                sortable
                body={(r) => (
                  <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">
                    {formatNumber(r.runningBalance)}
                  </span>
                )}
              />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}
