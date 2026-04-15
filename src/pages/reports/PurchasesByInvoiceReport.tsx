import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { useGetPurchaseInvoicesReport } from "@/features/reports/hooks/Usegetpurchaseinvoicesreport";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";


interface FilterState {
  branchId: string;
  fiscalYear: string;
  fiscalQuarter: string;
  from: string;
  to: string;
}

const FISCAL_YEARS = ["2022", "2023", "2024", "2025", "2026"];
const FISCAL_QUARTERS = [
  { value: "Q1", label: "🟢 الربع الأول Q1 (يناير - مارس)", from: "-01-01", to: "-03-31" },
  { value: "Q2", label: "🔵 الربع الثاني Q2 (أبريل - يونيو)", from: "-04-01", to: "-06-30" },
  { value: "Q3", label: "🟡 الربع الثالث Q3 (يوليو - سبتمبر)", from: "-07-01", to: "-09-30" },
  { value: "Q4", label: "🔴 الربع الرابع Q4 (أكتوبر - ديسمبر)", from: "-10-01", to: "-12-31" },
];

const mockRows = [
  { id: "1", date: "2026-01-05", invoiceNumber: "PO-1001", purchases: 1800.0, tax: 270.0, total: 2070.0 },
  { id: "2", date: "2026-01-10", invoiceNumber: "PO-1002", purchases: 3200.0, tax: 480.0, total: 3680.0 },
  { id: "3", date: "2026-02-03", invoiceNumber: "PO-1003", purchases: 900.0, tax: 135.0, total: 1035.0 },
  { id: "4", date: "2026-02-18", invoiceNumber: "PO-1004", purchases: 4500.0, tax: 675.0, total: 5175.0 },
  { id: "5", date: "2026-03-07", invoiceNumber: "PO-1005", purchases: 620.0, tax: 93.0, total: 713.0 },
];

export default function PurchasesByInvoiceReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
    fiscalYear: new Date().getFullYear().toString(),
    fiscalQuarter: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // Data Fetching
  const { data: purchasesData = [], isLoading: purchasesLoading, isFetching: purchasesFetching } = useGetPurchaseInvoicesReport({
    branchid: searchParams.branchId.trim() || undefined,
    From: searchParams.from,
    To: searchParams.to,
  });

  const { data: branches = [] } = useGetAllBranches();

  const handleQuarterChange = (quarter: string) => {
    const q = FISCAL_QUARTERS.find((q) => q.value === quarter);
    const year = filters.fiscalYear || new Date().getFullYear().toString();
    setFilters((prev) => ({
      ...prev,
      fiscalQuarter: quarter,
      from: q ? `${year}${q.from}` : prev.from,
      to: q ? `${year}${q.to}` : prev.to,
    }));
  };

  const handleYearChange = (year: string) => {
    const q = FISCAL_QUARTERS.find((q) => q.value === filters.fiscalQuarter);
    setFilters((prev) => ({
      ...prev,
      fiscalYear: year,
      from: q && year ? `${year}${q.from}` : prev.from,
      to: q && year ? `${year}${q.to}` : prev.to,
    }));
  };

  const handleSearch = () => setSearchParams(filters);
  const handleClear = () => {
    const reset = {
      branchId: " ",
      fiscalYear: new Date().getFullYear().toString(),
      fiscalQuarter: "",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0]
    };
    setFilters(reset);
    setSearchParams(reset);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalPurchases = useMemo(() => purchasesData.reduce((s, r) => s + r.subTotal, 0), [purchasesData]);
  const totalTax = useMemo(() => purchasesData.reduce((s, r) => s + (r.grandTotal - r.subTotal), 0), [purchasesData]);
  const totalFinal = useMemo(() => purchasesData.reduce((s, r) => s + r.grandTotal, 0), [purchasesData]);
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);
  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} className="text-[var(--primary)]" />
              {t("purchases_by_invoice", "تحليل مشتريات على مستوى أرقام الفواتير")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_purchases_excl_tax", "إجمالي المشتريات بدون ضريبة")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalPurchases)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_tax", "إجمالي الضريبة")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalTax)}</h2>
            </div>
            <div className="bg-teal-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("grand_total_with_tax", "الإجمالي النهائي")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalFinal)}</h2>
            </div>
          </div>


          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
                <div className="space-y-2 lg:col-span-1 ">
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
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("fiscal_year", "السنة المالية")}
                </label>
                <Select value={filters.fiscalYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder={t("select_year", "اختر السنة")} />
                  </SelectTrigger>
                  <SelectContent>
                    {FISCAL_YEARS.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">
                  {t("fiscal_quarter", "الربع المالي")}
                </label>
                <Select value={filters.fiscalQuarter} onValueChange={handleQuarterChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("select_quarter", "اختر الربع")} />
                  </SelectTrigger>
                  <SelectContent>
                    {FISCAL_QUARTERS.map((q) => (
                      <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="flex flex-row items-end gap-2 lg:col-span-2">
                <Button onClick={handleSearch} disabled={purchasesLoading || purchasesFetching} className="h-9 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold flex-1">
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



          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={purchasesData}
              paginator rows={10}
              loading={purchasesLoading || purchasesFetching}
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column field="date" header={t("date", "التاريخ")} sortable body={(r) => <span className="text-sm">{new Date(r.date).toLocaleDateString("en-GB")}</span>} />
              <Column field="orderNumber" header={t("invoice_number", "رقم الفاتورة")} sortable body={(r) => <span className="text-sm font-bold text-[var(--text-main)]">{r.orderNumber}</span>} />
              <Column field="subTotal" header={t("purchases_excl_tax", "المشتريات")} sortable body={(r) => <span className="text-sm font-medium">{formatNumber(r.subTotal)}</span>} />
              <Column header={t("tax", "الضريبة")} sortable body={(r) => <span className="text-sm">{formatNumber(r.grandTotal - r.subTotal)}</span>} />
              <Column field="grandTotal" header={t("document_total", "إجمالي المستند")} sortable body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.grandTotal)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
