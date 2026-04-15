import React, { useState, useMemo } from "react";
import {
  RefreshCw,
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
import ComboboxField from "@/components/ui/ComboboxField";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useGetProductMovement } from "@/features/reports/hooks/useGetProductMovement";

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
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";


type FilterState = {
  branchId: string;
  productId: string;
  from: string;
  to: string;
};

export default function ItemMovementReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
    productId: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  const { data: productsResponse, isLoading: productsLoading } =
    useGetAllProducts({ page: 1, limit: 500 });


  const productsList = useMemo(
    () => productsResponse?.items ?? [],
    [productsResponse]
  );

  const { data: movementData, isLoading, isFetching } =
    useGetProductMovement({
      productId: searchParams.productId ? Number(searchParams.productId) : "",
      from: searchParams.from,
      to: searchParams.to,
      branchid: searchParams.branchId.trim() || undefined,
    });

  const { data: branches = [] } = useGetAllBranches();

  const handleSearch = () => {
    setSearchParams(filters);
  };

  const handleClear = () => {
    const defaultFilters: FilterState = {
      branchId: " ",
      productId: "",
      from: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split("T")[0],
      to: new Date().toISOString().split("T")[0],
    };
    setFilters(defaultFilters);
    setSearchParams(defaultFilters);
  };


  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

  const totalIn = useMemo(
    () => movementData?.reduce((s, r) => s + (r.qtyIn ?? 0), 0) || 0,
    [movementData]
  );
  const totalOut = useMemo(
    () => movementData?.reduce((s, r) => s + (r.qtyOut ?? 0), 0) || 0,
    [movementData]
  );
  const currentBalance = useMemo(
    () => movementData?.[movementData.length - 1]?.runningBalance || 0,
    [movementData]
  );

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw size={20} className="text-[var(--primary)]" />
              {t("item_movement_report", "تقرير حركة الصنف")}
            </CardTitle>
            <CardDescription>
              {t(
                "movement_description",
                "عرض تفصيلي لعمليات الدخول والخروج لصنف محدد"
              )}
            </CardDescription>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

              {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
                <div className="space-y-2 lg:col-span-1 ">
                  <Label className="text-xs font-medium text-text-main">{t("branch", "الفرع")}</Label>
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
              <div className=" lg:col-span-1 ">
                <Label className="text-xs font-medium text-text-main mb-2">
                  {t("select_product", "اختر الصنف")}
                </Label>
                <ComboboxField
                  value={filters.productId}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, productId: String(val) }))
                  }
                  items={productsList}
                  valueKey="id"
                  labelKey="productNameAr"
                  placeholder={
                    productsLoading
                      ? t("loading", "جاري التحميل...")
                      : t("select_product", "اختر الصنف")
                  }
                  disabled={productsLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-text-main">
                  {t("from_date", "تاريخ البداية")}
                </Label>
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
                <Label className="text-xs font-medium text-main">
                  {t("to_date", "تاريخ النهاية")}
                </Label>
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
              <div className="flex items-center gap-2  mb-2">
                <Button onClick={handleSearch} className="h-9 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold flex-1" disabled={isLoading || isFetching || !filters.productId}>
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
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
                body={(r) => (
                  <span className="text-sm font-medium">{r.barcode}</span>
                )}
              />
              <Column
                field="productNameAr"
                header={t("item_name", "اسم الصنف")}
                sortable
                body={(r) => (
                  <span className="text-sm font-bold text-[var(--text-main)]">
                    {r.productNameAr}
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
              {/* <Column
                field="qtyIn"
                header={t("qty_in", "الداخل")}
                sortable
                body={(r) => (
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {r.qtyIn > 0 ? `+${r.qtyIn}` : "-"}
                  </span>
                )}
              /> */}
              {/* <Column
                field="qtyOut"
                header={t("qty_out", "الخارج")}
                sortable
                body={(r) => (
                  <span className="text-sm font-medium text-red-500 dark:text-red-400">
                    {r.qtyOut > 0 ? `-${r.qtyOut}` : "-"}
                  </span>
                )}
              /> */}
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
