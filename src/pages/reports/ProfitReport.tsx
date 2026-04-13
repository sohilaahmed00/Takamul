import React, { useState } from "react";
import {
  DollarSign,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProfitRow = {
  id: string;
  label: string;
  value: number;
  isNet?: boolean;
  isGray?: boolean;
};

export default function ProfitReport() {
  const { t, direction } = useLanguage();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const rows: ProfitRow[] = [
    { id: "1", label: t("total_sales"), value: 1000 },
    { id: "2", label: t("cost_of_total_sales"), value: 600 },
    { id: "3", label: t("profit"), value: 400, isGray: true },
    { id: "4", label: t("total_expenses"), value: 250 },
  ];

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
          {/* Date Filter */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">{t("start_date")}</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">{t("end_date")}</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button className="bg-primary text-white">{t("complete")}</Button>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 dark:border-slate-800 ${
                      row.isGray ? "bg-gray-50 dark:bg-slate-900/60" : ""
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
                    {t("net_profit")}
                  </td>
                  <td className="px-6 py-5 text-end">
                    <span className="text-base font-bold text-[var(--primary)]">
                      {formatNumber(150)}
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
                  {t("net_profit")}
                </p>
                <span className="text-base font-bold text-[var(--primary)]">
                  {formatNumber(150)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}