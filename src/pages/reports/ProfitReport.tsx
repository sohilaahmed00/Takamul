import React, { useState } from "react";
import {
  DollarSign,
  Printer,
  FileText,
  FileSpreadsheet,
  Search,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProfitReport } from "@/features/reports/hooks/Usegetprofitreport";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
interface FilterState {
  branchId: string;
  from: string;
  to: string;
}

type ProfitRow = {
  id: string;
  label: string;
  value: number;
  isNet?: boolean;
  isGray?: boolean;
};

export default function ProfitReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
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

  const rows: ProfitRow[] = [
    { id: "1", label: t("total_sales", "إجمالي المبيعات"), value: profitData?.totalSales ?? 0 },
    { id: "2", label: t("cost_of_total_sales", "تكلفة المبيعات"), value: profitData?.totalCostOfSales ?? 0 },
    { id: "3", label: t("gross_profit", "مجمل الربح"), value: profitData?.grossProfit ?? 0, isGray: true },
    { id: "4", label: t("total_expenses", "إجمالي المصروفات"), value: profitData?.totalExpenses ?? 0 },
  ];

  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);
  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} className="text-[var(--primary)]" />
              {t("profit_report")}
            </CardTitle>

          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">{t("print")}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">XML</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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
              <div className="flex flex-row items-end gap-2">
                <Button onClick={handleSearch} disabled={isLoading || isFetching} className="h-10 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold flex-1">
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-10 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} />
                  {t("clear", "مسح")}
                </Button>
              </div>
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 dark:border-slate-800 ${row.isGray ? "bg-gray-50 dark:bg-slate-900/60" : ""
                      }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <span className="text-sm font-bold text-[var(--primary)]">
                        {formatNumber(row.value)}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Net Profit */}
                <tr className="border-t-2 border-gray-200 dark:border-slate-700">
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

          {/* Cards - Mobile */}
          <div className="grid grid-cols-1 gap-5 md:hidden">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                      <DollarSign size={18} className="text-[var(--primary)]" />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">
                      {row.label}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[var(--primary)]">
                    {formatNumber(row.value)}
                  </span>
                </div>
              </div>
            ))}

            {/* Net Profit Card */}
            <div className="rounded-2xl border-2 border-[var(--primary)] bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-4">
                <p className="text-base font-bold text-[var(--text-main)]">
                  {t("net_profit", "صافي الربح")}
                </p>
                <span className="text-base font-bold text-[var(--primary)]">
                  {formatNumber(profitData?.netProfit)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}