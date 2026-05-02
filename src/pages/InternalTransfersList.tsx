
import React, { useMemo, useState } from "react";
import { ArrowLeftRight, Plus, Search } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import AddInternalTreasuryTransferModal from "@/components/modals/AddInternalTreasuryTransferModal";
import { useGetAllInternalTreasuryTransfers } from "@/features/internal-treasury-transfers/hooks/useGetAllInternalTreasuryTransfers";
import type { InternalTreasuryTransferRow } from "@/features/internal-treasury-transfers/types/internalTreasuryTransfers.types";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";

export default function InternalTransfersList() {
  const { t, direction } = useLanguage();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetAllInternalTreasuryTransfers();

  const transfers: InternalTreasuryTransferRow[] = useMemo(() => {
    return (data ?? []).map((item) => ({
      id: item.id,
      fromTreasuryId: item.fromTreasuryId,
      toTreasuryId: item.toTreasuryId,
      fromTreasuryName: item.fromTreasuryName,
      toTreasuryName: item.toTreasuryName,
      amount: item.amount,
      date: item.date,
      notes: item.notes || "",
    }));
  }, [data]);

  const filteredTransfers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return transfers
      .filter((transfer) => {
        return transfer.fromTreasuryName.toLowerCase().includes(term) || transfer.toTreasuryName.toLowerCase().includes(term) || transfer.notes?.toLowerCase().includes(term) || String(transfer.amount).includes(term);
      })
      .sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return bDate - aDate;
      });
  }, [transfers, searchTerm]);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB");
  };

  const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString("en-US");

  const header = (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>

        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder={t("search_internal_transfers")}
          className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none"
        />
      </div>
    </div>
  );

  return (
    <div dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight size={20} className="text-[var(--primary)]" />
            {t("internal_transfers")}
          </CardTitle>

          <CardDescription>{t("customize_report_below")}</CardDescription>

          <CardAction>
            {hasPermission(Permissions.treasury.transferadd) && (
              <Button size="xl" onClick={() => setIsAddModalOpen(true)} variant="default">
                <Plus size={18} />
                {t("add_internal_transfer")}
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="hidden lg:block rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <DataTable value={filteredTransfers} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage((e.page ?? 0) + 1)} dataKey="id" className="custom-green-table custom-compact-table" stripedRows={false} loading={isFetching} emptyMessage={t("no_data")} header={header} responsiveLayout="stack">
                <Column field="date" header={t("date")} sortable style={{ minWidth: "9rem", whiteSpace: "nowrap" }} body={(rowData) => formatDate(rowData.date)} />

                <Column field="fromTreasuryName" header={t("from_treasury")} sortable style={{ minWidth: "12rem", whiteSpace: "nowrap" }} />

                <Column field="toTreasuryName" header={t("to_treasury")} sortable style={{ minWidth: "12rem", whiteSpace: "nowrap" }} />

                <Column field="amount" header={t("amount")} sortable style={{ minWidth: "8rem", whiteSpace: "nowrap" }} body={(rowData) => formatNumber(rowData.amount)} />

                <Column field="notes" header={t("statement")} style={{ minWidth: "16rem" }} body={(rowData) => rowData.notes || "-"} />
              </DataTable>
            </div>
          </div>

          <div className="mt-4 lg:hidden">{header}</div>

          <div className="grid grid-cols-1 gap-5 lg:hidden mt-4">
            {isFetching ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">{t("loading")}</div>
            ) : filteredTransfers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">{t("no_data")}</div>
            ) : (
              filteredTransfers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((row) => (
                <div key={row.id} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                        <ArrowLeftRight size={18} className="text-[var(--primary)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text-muted)]">{t("internal_transfer")}</p>
                        <p className="text-sm font-bold text-[var(--text-main)]">{formatDate(row.date)}</p>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">{formatNumber(row.amount)}</div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                        <p className="text-xs text-[var(--text-muted)] mb-1">{t("from_treasury")}</p>
                        <p className="text-sm font-semibold text-[var(--text-main)] break-words">{row.fromTreasuryName}</p>
                      </div>

                      <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                        <p className="text-xs text-[var(--text-muted)] mb-1">{t("to_treasury")}</p>
                        <p className="text-sm font-semibold text-[var(--text-main)] break-words">{row.toTreasuryName}</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-[var(--text-muted)] mb-1">{t("statement")}</p>
                      <p className="text-sm text-[var(--text-main)] break-words">{row.notes || "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddInternalTreasuryTransferModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
