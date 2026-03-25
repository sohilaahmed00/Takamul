import React, { useMemo, useState } from "react";
import {
  Search,
  WalletCards,
  CalendarDays,
  ReceiptText,
  UserRound,
  CreditCard,
  Filter,
  RotateCcw,
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

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetTreasuryStatement } from "@/features/treasury-statement/hooks/useGetTreasuryStatement";

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

  const { data: statementData, isFetching } =
    useGetTreasuryStatement(statementParams);

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

  const selectedTreasuryName =
    treasurys?.find((item) => item.id === submittedFilters.treasuryId)?.name ||
    "";

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards size={20} className="text-[var(--primary)]" />
            كشف حساب خزينة
          </CardTitle>

          <CardDescription>
            {t("customize_report_below") || "يمكنك تخصيص التقرير من خلال الفلاتر بالأسفل"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center">
                <Filter size={18} className="text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-[var(--text-main)]">
                  فلاتر التقرير
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">
                  اختر الخزينة والفترة الزمنية لعرض كشف الحساب
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  الخزينة
                </label>
                <select
                  value={filters.treasuryId ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      treasuryId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-xl py-3 px-4 transition-all outline-none"
                >
                  <option value="">اختار الخزينة</option>
                  {(treasurys ?? []).map((treasury) => (
                    <option key={treasury.id} value={treasury.id}>
                      {treasury.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-xl py-3 px-4 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-main)]">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-xl py-3 px-4 transition-all outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                <Button onClick={handleSearch} variant="default" size="xl" className="w-full sm:w-auto">
                  <Search size={18} />
                  عرض
                </Button>

                <Button onClick={handleClear} variant="outline" size="xl" className="w-full sm:w-auto">
                  <RotateCcw size={16} />
                  مسح
                </Button>
              </div>
            </div>
          </div>

          {submittedFilters.treasuryId && (
            <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] px-4 py-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">الخزينة المختارة:</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">
                {selectedTreasuryName || "الخزينة"}
              </span>

              {submittedFilters.from && (
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-[var(--text-main)]">
                  من: {submittedFilters.from}
                </span>
              )}

              {submittedFilters.to && (
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-[var(--text-main)]">
                  إلى: {submittedFilters.to}
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
              emptyMessage="لا توجد بيانات"
              responsiveLayout="stack"
            >
              <Column
                field="type"
                header="نوع الحركة"
                sortable
                style={{ minWidth: "12rem" }}
                body={(rowData) => (
                  <span className="text-sm break-words">{rowData.type}</span>
                )}
              />

              <Column
                field="date"
                header="التاريخ"
                sortable
                style={{ minWidth: "10rem" }}
                body={(rowData) => (
                  <span className="text-sm whitespace-nowrap">
                    {formatDate(rowData.date)}
                  </span>
                )}
              />

              <Column
                field="number"
                header="رقم المستند"
                sortable
                style={{ minWidth: "12rem" }}
                body={(rowData) => (
                  <span className="text-sm break-all">{rowData.number}</span>
                )}
              />

              <Column
                field="partyName"
                header="اسم الجهة"
                sortable
                style={{ minWidth: "12rem" }}
                body={(rowData) => (
                  <span className="text-sm break-words">{rowData.partyName}</span>
                )}
              />

              <Column
                field="paymentMethod"
                header="طريقة الدفع"
                sortable
                style={{ minWidth: "11rem" }}
                body={(rowData) => (
                  <span className="text-sm break-words">
                    {rowData.paymentMethod || "-"}
                  </span>
                )}
              />

              <Column
                field="debit"
                header="مدين"
                sortable
                style={{ minWidth: "8rem" }}
                body={(rowData) => (
                  <span className="text-sm whitespace-nowrap">
                    {formatNumber(rowData.debit)}
                  </span>
                )}
              />

              <Column
                field="credit"
                header="دائن"
                sortable
                style={{ minWidth: "8rem" }}
                body={(rowData) => (
                  <span className="text-sm whitespace-nowrap">
                    {formatNumber(rowData.credit)}
                  </span>
                )}
              />

              <Column
                field="balance"
                header="الرصيد"
                sortable
                style={{ minWidth: "8rem" }}
                body={(rowData) => (
                  <span className="text-sm font-semibold text-[var(--primary)] whitespace-nowrap">
                    {formatNumber(rowData.balance)}
                  </span>
                )}
              />
            </DataTable>
          </div>

          <div className="lg:hidden space-y-3">
            {isFetching ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse"
                  >
                    <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 bg-gray-100 rounded-xl" />
                      <div className="h-12 bg-gray-100 rounded-xl" />
                      <div className="h-12 bg-gray-100 rounded-xl" />
                      <div className="h-12 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fafafa] p-8 text-center text-sm text-[var(--text-muted)]">
                لا توجد بيانات
              </div>
            ) : (
              rows
                .slice(
                  (currentPage - 1) * entriesPerPage,
                  currentPage * entriesPerPage
                )
                .map((row) => (
                  <div
                    key={row.rowId}
                    className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] border-b border-gray-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                          <ReceiptText size={18} className="text-[var(--primary)]" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-[var(--text-muted)]">
                            نوع الحركة
                          </p>
                          <p className="text-sm font-bold text-[var(--text-main)] truncate">
                            {row.type}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">
                        {selectedTreasuryName || "الخزينة"}
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            رقم المستند
                          </p>
                          <p className="text-sm font-semibold text-[var(--text-main)] break-all">
                            {row.number}
                          </p>
                        </div>

                        <div className="shrink-0 text-left">
                          <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs mb-1">
                            <CalendarDays size={14} />
                            <span>التاريخ</span>
                          </div>
                          <p className="text-sm font-medium text-[var(--text-main)]">
                            {formatDate(row.date)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#f8fafc] p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <UserRound size={14} className="text-[var(--text-muted)]" />
                          <p className="text-xs text-[var(--text-muted)]">
                            اسم الجهة
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-main)] break-words">
                          {row.partyName}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#f8fafc] p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard size={14} className="text-[var(--text-muted)]" />
                          <p className="text-xs text-[var(--text-muted)]">
                            طريقة الدفع
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-main)] break-words">
                          {row.paymentMethod || "-"}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-[#f8fafc] p-3 text-center">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            مدين
                          </p>
                          <p className="text-sm font-bold text-[var(--text-main)]">
                            {formatNumber(row.debit)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f8fafc] p-3 text-center">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            دائن
                          </p>
                          <p className="text-sm font-bold text-[var(--text-main)]">
                            {formatNumber(row.credit)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[rgba(49,201,110,0.08)] p-3 text-center border border-[rgba(49,201,110,0.14)]">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            الرصيد
                          </p>
                          <p className="text-sm font-bold text-[var(--primary)]">
                            {formatNumber(row.balance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}

            {!isFetching && rows.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
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
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}