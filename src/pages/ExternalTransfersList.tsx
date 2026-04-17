import React, { useMemo, useState } from "react";
import { Search, WalletCards, CalendarDays, ReceiptText, UserRound, CreditCard, Filter, RotateCcw, Printer, FileText, FileSpreadsheet } from "lucide-react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import ComboboxField from "@/components/ui/ComboboxField";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetTreasuryStatement } from "@/features/treasury-statement/hooks/useGetTreasuryStatement";
import { Label } from "@/components/ui/label";
import { exportToExcel } from "@/utils/exportUtils";
import { exportCustomPDF, printCustomHTML, getTreasuryHTML } from "@/utils/customExportUtils";

import { Input } from "@/components/ui/input";

type FilterState = {
  treasuryId?: number;
  from: string;
  to: string;
};

type StatementRow = {
  rowId: string;
  date: string;
  type: string;
  number: string;
  debit: number;
  credit: number;
  balance: number;
  partyName: string;
  paymentMethod: string | null;
};

export default function ExternalTransfersList() {
  const { t, direction } = useLanguage();

  const { data: treasurys } = useGetAllTreasurys();

  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    treasuryId: undefined,
    from: "",
    to: "",
  });

  const [submittedFilters, setSubmittedFilters] = useState<FilterState>({
    treasuryId: undefined,
    from: "",
    to: "",
  });

  const statementParams = useMemo(() => {
    if (!submittedFilters.treasuryId) return null;

    const params: {
      treasuryId: number;
      from?: string;
      to?: string;
    } = {
      treasuryId: submittedFilters.treasuryId,
    };

    if (submittedFilters.from) params.from = submittedFilters.from;
    if (submittedFilters.to) params.to = submittedFilters.to;

    return params;
  }, [submittedFilters]);

  const { data: statementData, isFetching } = useGetTreasuryStatement(statementParams);

  const rows: StatementRow[] = useMemo(() => {
    return (statementData ?? []).map((item, index) => ({
      ...item,
      partyName: item.partyName ?? "-",
      paymentMethod: item.paymentMethod ?? null,
      rowId: `${item.number}-${item.date}-${index}`,
    }));
  }, [statementData]);

  const handleSearch = () => {
    setSubmittedFilters(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const resetState: FilterState = {
      treasuryId: undefined,
      from: "",
      to: "",
    };

    setFilters(resetState);
    setSubmittedFilters(resetState);
    setCurrentPage(1);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB");
  };

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US");
  };

  const selectedTreasuryName = treasurys?.find((item) => item.id === submittedFilters.treasuryId)?.name || "";

  const title = t("treasury_statement");

  const getFiltersInfo = () => {
    const fromFmt = submittedFilters.from ? submittedFilters.from.split("-").reverse().join("/") : "-";
    const toFmt = submittedFilters.to ? submittedFilters.to.split("-").reverse().join("/") : "-";
    return `${t("treasury")}: ${selectedTreasuryName || t("all")} | ${t("from_date")}: ${fromFmt} | ${t("to_date")}: ${toFmt}`;
  };

  const handleExportExcel = () => {
    if (!rows.length) return;
    const excelData = rows.map((r, i) => ({
      [t("serial", "م")]: i + 1,
      [t("movement_type", "نوع الحركة")]: r.type,
      [t("date", "التاريخ")]: formatDate(r.date),
      [t("document_number", "رقم المستند")]: r.number,
      [t("party_name", "اسم الجهة")]: r.partyName,
      [t("debit", "مدين")]: r.debit,
      [t("credit", "دائن")]: r.credit,
      [t("balance", "الرصيد")]: r.balance,
    }));
    exportToExcel(excelData, title, t, direction);
  };

  const [pdfLoading, setPdfLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!rows.length) return;
    setPdfLoading(true);
    try {
      const htmlString = getTreasuryHTML(title, getFiltersInfo(), rows, [], t);
      await exportCustomPDF(title, htmlString);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    if (!rows.length) return;
    const htmlString = getTreasuryHTML(title, getFiltersInfo(), rows, [], t);
    printCustomHTML(title, htmlString);
  };

  return (
    <div dir={direction}>
      <style>
        {`
          .treasury-statement-table .p-datatable-table {
            width: 100% !important;
            table-layout: fixed !important;
          }

          .treasury-statement-table .p-datatable-wrapper {
            overflow-x: hidden !important;
          }

          .treasury-statement-table .p-datatable-thead > tr > th,
          .treasury-statement-table .p-datatable-tbody > tr > td {
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            vertical-align: middle;
          }
        `}
      </style>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <WalletCards size={20} className="text-[var(--primary)]" />
              {title}
            </CardTitle>
            <CardDescription>{t("customize_report_below")}</CardDescription>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button onClick={handlePrint} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} />
              <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button onClick={handleExportPDF} disabled={pdfLoading} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} />
              <span className="hidden sm:inline">{pdfLoading ? "تحميل..." : "PDF"}</span>
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center">
                <Filter size={18} className="text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-[var(--text-main)]">{t("report_filters")}</h3>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">{t("treasury_statement_filters_desc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-2 ">
                <Label className="text-sm font-medium text-[var(--text-main)]">{t("treasury")}</Label>
                <ComboboxField
                  value={filters.treasuryId}
                  onValueChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      treasuryId: val ? Number(val) : undefined,
                    }))
                  }
                  items={treasurys ?? []}
                  valueKey="id"
                  labelKey="name"
                  placeholder={t("select_treasury")}
              
                />
              </div>

              <div className="space-y-2 mt-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  {t("from_date")}
                </label>
                <Input
                  type="date"
                  value={filters.from}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, from: e.target.value }))
                  }
                  
                />
              </div>

              <div className="space-y-2 mt-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  {t("to_date")}
                </label>
                <Input
                  type="date"
                  value={filters.to}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, to: e.target.value }))
                  }
                  
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 py-3 mt-2">
                <Button onClick={handleSearch} variant="default" size="xl" className="w-full sm:w-auto">
                  <Search size={18} />
                  {t("show")}
                </Button>

                <Button onClick={handleClear} variant="outline" size="xl" className="w-full sm:w-auto">
                  <RotateCcw size={16} />
                  {t("clear")}
                </Button>
              </div>
            </div>
          </div>

          {submittedFilters.treasuryId && (
            <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 px-4 py-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">{t("selected_treasury")}:</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">{selectedTreasuryName || t("treasury")}</span>

              {submittedFilters.from && (
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[var(--text-main)]">
                  {t("from")}: {submittedFilters.from}
                </span>
              )}

              {submittedFilters.to && (
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[var(--text-main)]">
                  {t("to")}: {submittedFilters.to}
                </span>
              )}
            </div>
          )}

          <div className="hidden lg:block rounded-xl border border-gray-100 overflow-hidden">
            <DataTable
              value={rows}
              paginator
              rows={entriesPerPage}
              first={(currentPage - 1) * entriesPerPage}
              onPage={(e: DataTablePageEvent) => {
                if (e.page === undefined) return;
                setCurrentPage(e.page + 1);
              }}
              dataKey="rowId"
              className="custom-green-table custom-compact-table treasury-statement-table"
              loading={isFetching}
              emptyMessage={t("no_data")}
              responsiveLayout="stack"
            >
              <Column field="type" header={t("movement_type")} sortable style={{ minWidth: "12rem" }} body={(rowData) => <span className="text-sm break-words">{rowData.type}</span>} />

              <Column field="date" header={t("date")} sortable style={{ minWidth: "10rem" }} body={(rowData) => <span className="text-sm whitespace-nowrap">{formatDate(rowData.date)}</span>} />

              <Column field="number" header={t("document_number")} sortable style={{ minWidth: "12rem" }} body={(rowData) => <span className="text-sm break-all">{rowData.number}</span>} />

              <Column field="partyName" header={t("party_name")} sortable style={{ minWidth: "12rem" }} body={(rowData) => <span className="text-sm break-words">{rowData.partyName}</span>} />

              <Column field="paymentMethod" header={t("payment_method")} sortable style={{ minWidth: "11rem" }} body={(rowData) => <span className="text-sm break-words">{rowData.paymentMethod || "-"}</span>} />

              <Column field="debit" header={t("debit")} sortable style={{ minWidth: "8rem" }} body={(rowData) => <span className="text-sm whitespace-nowrap">{formatNumber(rowData.debit)}</span>} />

              <Column field="credit" header={t("credit")} sortable style={{ minWidth: "8rem" }} body={(rowData) => <span className="text-sm whitespace-nowrap">{formatNumber(rowData.credit)}</span>} />

              <Column field="balance" header={t("balance")} sortable style={{ minWidth: "8rem" }} body={(rowData) => <span className="text-sm font-semibold text-[var(--primary)] whitespace-nowrap">{formatNumber(rowData.balance)}</span>} />
            </DataTable>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:hidden">
            {isFetching ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">{t("loading")}</div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">{t("no_data")}</div>
            ) : (
              rows.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((row) => (
                <div key={row.rowId} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                        <ReceiptText size={18} className="text-[var(--primary)]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text-muted)]">{t("movement_type")}</p>
                        <p className="text-sm font-bold text-[var(--text-main)] truncate">{row.type}</p>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">{selectedTreasuryName || t("treasury")}</div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-0">
                        <p className="text-xs text-[var(--text-muted)] mb-1">{t("document_number")}</p>
                        <p className="text-sm font-semibold text-[var(--text-main)] break-all">{row.number}</p>
                      </div>

                      <div className="shrink-0 text-left">
                        <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs mb-1">
                          <CalendarDays size={14} />
                          <span>{t("date")}</span>
                        </div>
                        <p className="text-sm font-medium text-[var(--text-main)]">{formatDate(row.date)}</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <UserRound size={14} className="text-[var(--text-muted)]" />
                        <p className="text-xs text-[var(--text-muted)]">{t("party_name")}</p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-main)] break-words">{row.partyName}</p>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={14} className="text-[var(--text-muted)]" />
                        <p className="text-xs text-[var(--text-muted)]">{t("payment_method")}</p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-main)] break-words">{row.paymentMethod || "-"}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3 text-center">
                        <p className="text-xs text-[var(--text-muted)] mb-1">{t("debit")}</p>
                        <p className="text-sm font-bold text-[var(--text-main)]">{formatNumber(row.debit)}</p>
                      </div>

                      <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3 text-center">
                        <p className="text-xs text-[var(--text-muted)] mb-1">{t("credit")}</p>
                        <p className="text-sm font-bold text-[var(--text-main)]">{formatNumber(row.credit)}</p>
                      </div>

                      <div className="rounded-xl bg-[rgba(49,201,110,0.08)] p-3 text-center border border-[rgba(49,201,110,0.14)]">
                        <p className="text-xs text-[var(--text-muted)] mb-1">{t("balance")}</p>
                        <p className="text-sm font-bold text-[var(--primary)]">{formatNumber(row.balance)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {!isFetching && rows.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-[var(--text-main)] text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {t("previous")}
                </button>

                <div className="h-10 min-w-10 px-4 rounded-xl bg-[rgba(49,201,110,0.12)] text-[var(--primary)] flex items-center justify-center text-sm font-bold">{currentPage}</div>

                <button type="button" onClick={() => setCurrentPage((prev) => (prev < Math.ceil(rows.length / entriesPerPage) ? prev + 1 : prev))} disabled={currentPage >= Math.ceil(rows.length / entriesPerPage)} className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-[var(--text-main)] text-sm disabled:opacity-50 disabled:cursor-not-allowed">
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
