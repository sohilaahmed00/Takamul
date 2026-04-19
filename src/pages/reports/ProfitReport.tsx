import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Printer,
  FileText,
  FileSpreadsheet,
  Search,
  RotateCcw,
  TrendingUp,
  LineChart
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProfitReport } from "@/features/reports/hooks/Usegetprofitreport";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { FinancialStatCard } from "@/components/FinancialStatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  generateReportHTML,
  printCustomHTML,
  exportCustomPDF,
  exportToExcel
} from "@/utils/customExportUtils";

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

type ProfitRow = {
  id: string;
  label: string;
  value: number;
  isNet?: boolean;
  isGray?: boolean;
};

export default function ProfitReport() {
  const { t, direction } = useLanguage();
  const [pdfLoading, setPdfLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
    fiscalYear: new Date().getFullYear().toString(),
    fiscalQuarter: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // Data Fetching
  const { data: profitData, isLoading, isFetching } = useGetProfitReport({
    branchid: searchParams.branchId.trim() || undefined,
    from: searchParams.from,
    to: searchParams.to,
  });

  const { data: branches = [] } = useGetAllBranches();

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

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const profitRows: ProfitRow[] = [
    { id: "1", label: t("total_sales", "إجمالي المبيعات"), value: profitData?.totalSales ?? 0 },
    { id: "2", label: t("cost_of_total_sales", "تكلفة المبيعات"), value: profitData?.totalCostOfSales ?? 0 },
    { id: "3", label: t("gross_profit", "مجمل الربح"), value: profitData?.grossProfit ?? 0, isGray: true },
    { id: "4", label: t("total_expenses", "إجمالي المصروفات"), value: profitData?.totalExpenses ?? 0 },
  ];

  const title = t("profit_report", "تقرير الأرباح");

  const getFiltersInfo = () => {
    const b = branches.find(x => String(x.id) === searchParams.branchId.trim());
    const qLabel = FISCAL_QUARTERS.find(q => q.value === searchParams.fiscalQuarter)?.label || t("none", "لا يوجد");

    return [
      `${t("branch", "الفرع")}: ${b ? b.name : t("all", "الكل")}`,
      `${t("fiscal_year", "السنة المالية")}: ${searchParams.fiscalYear}`,
      `${t("fiscal_quarter", "الربع المالي")}: ${qLabel}`,
      `${t("from", "من")}: ${searchParams.from}`,
      `${t("to", "إلى")}: ${searchParams.to}`
    ].join(" | ");
  };

  const exportColumns = [
    { header: t("serial", "م"), field: "serial" },
    { header: t("item", "البند"), field: "label" },
    { header: t("amount", "المبلغ"), field: "value", body: (r: any) => formatNumber(r.value) }
  ];

  // For export, we include rows + net profit
  const exportData = [
    ...profitRows,
    { id: "net", label: t("net_profit", "صافي الربح"), value: profitData?.netProfit ?? 0 }
  ];

  const handleExportPDF = async () => {
    if (!profitData) return;
    setPdfLoading(true);
    try {
      const html = generateReportHTML(
        title,
        getFiltersInfo(),
        [],
        exportColumns,
        exportData,
        t,
        direction
      );
      await exportCustomPDF(title, html);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    if (!profitData) return;
    const html = generateReportHTML(
      title,
      getFiltersInfo(),
      [],
      exportColumns,
      exportData,
      t,
      direction
    );
    printCustomHTML(title, html);
  };

  const handleExportExcel = () => {
    if (!profitData) return;
    exportToExcel(exportData, exportColumns, title);
  };

  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  return (
    <div dir={direction} className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} className="text-[var(--primary)]" />
              {title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
            >
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
         
          {/* Filters Card */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 items-end">
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

              {/* Fiscal Year */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-text-main">{t("fiscal_year", "السنة المالية")}</Label>
                <Select
                  value={filters.fiscalYear}
                  onValueChange={(val) => {
                    setFilters(prev => ({ ...prev, fiscalYear: val, fiscalQuarter: "" }));
                  }}
                >
                  <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                    <SelectValue placeholder={t("select_year", "اختر السنة")} />
                  </SelectTrigger>
                  <SelectContent>
                    {FISCAL_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Fiscal Quarter */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-text-main">{t("fiscal_quarter", "الربع المالي")}</Label>
                <Select
                  value={filters.fiscalQuarter}
                  onValueChange={(val) => {
                    const q = FISCAL_QUARTERS.find(item => item.value === val);
                    if (q) {
                      setFilters(prev => ({
                        ...prev,
                        fiscalQuarter: val,
                        from: prev.fiscalYear + q.from,
                        to: prev.fiscalYear + q.to
                      }));
                    } else {
                      setFilters(prev => ({ ...prev, fiscalQuarter: val }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                    <SelectValue placeholder={t("select_quarter", "اختر الربع")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">{t("none", "لا يوجد")}</SelectItem>
                    {FISCAL_QUARTERS.map(q => <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>)}
                  </SelectContent>
                </Select>
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
                    portalId="root-portal"
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
                <Label className="text-xs font-medium text-text-main">
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
                    portalId="root-portal"
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {filters.to
                            ? format(new Date(filters.to), "dd/MM/yyyy")
                            : t("select_date", "يوم/شهر/سنة")}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row items-end gap-2 mb-2 lg:col-span-1">
                <Button onClick={handleSearch} disabled={isLoading || isFetching} className="flex-1 h-9 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold">
                  <Search size={16} />
                  {t("search", "بحث")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} className="text-[var(--primary)]" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-start font-bold text-slate-900 dark:text-white w-16">{t("serial", "م")}</th>
                  <th className="px-6 py-3 text-start font-bold text-slate-900 dark:text-white">{t("item", "البند")}</th>
                  <th className="px-6 py-3 text-end font-bold text-slate-900 dark:text-white">{t("amount", "المبلغ")}</th>
                </tr>
              </thead>
              <tbody>
                {profitRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 dark:border-slate-800 ${row.isGray ? "bg-gray-50/50 dark:bg-slate-900/40" : ""}`}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-500">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatNumber(row.value)}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Net Profit Row */}
                <tr className="bg-[rgba(49,201,110,0.05)] border-t-2 border-[var(--primary)]">
                  <td className="px-6 py-5 font-bold text-[var(--text-main)]">
                    {profitRows.length + 1}
                  </td>
                  <td className="px-6 py-5 text-base font-bold text-[var(--text-main)]">
                    {t("net_profit", "صافي الربح")}
                  </td>
                  <td className="px-6 py-5 text-end">
                    <span className="text-base font-bold text-[var(--primary)]">
                      {formatNumber(profitData?.netProfit)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}