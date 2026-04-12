import React, { useMemo, useState } from "react";
import { Edit2, Plus, Search, Trash2, Wallet } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useDeleteTreasury } from "@/features/treasurys/hooks/useDeleteTreasury";
import TreasuryModal from "@/components/modals/TreasuryModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";

import { Input } from "@/components/ui/input";

type TreasuryRow = {
  id: number;
  name: string;
  openingBalance: number;
  currentBalance?: number;
};

export default function TreasurysList() {
  const { t, direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const { data: treasurys, isLoading } = useGetAllTreasurys();
  const { mutateAsync: deleteTreasury, isPending: isDeleting } = useDeleteTreasury();

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState<number | undefined>();

  const [deleteTarget, setDeleteTarget] = useState<TreasuryRow | null>(null);

  const filteredTreasurys = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return (
      treasurys
        ?.filter((item) => {
          if (!term) return true;

          return (
            item.name?.toLowerCase().includes(term) ||
            String(item.id).includes(term) ||
            String(item.openingBalance ?? "").includes(term)
          );
        })
        ?.sort((a, b) => b.id - a.id) ?? []
    );
  }, [treasurys, searchTerm]);

  const handleEdit = (id: number) => {
    setSelectedTreasuryId(id);
    setIsModalOpen(true);
  };

  const askDelete = (row: TreasuryRow) => {
    setDeleteTarget(row);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await deleteTreasury(deleteTarget.id);
      notifySuccess(
        typeof res === "string" ? res : t("treasury_deleted_successfully")
      );
      setDeleteTarget(null);
    } catch (error: any) {
      notifyError(error?.message || t("delete_treasury_error"));
    }
  };

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US");
  };

  const renderHeader = () => {
    return (
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
            placeholder={t("treasury_search_placeholder")}
            className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none"
          />
        </div>
      </div>
    );
  };

  const header = useMemo(() => renderHeader(), [searchTerm, t]);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={20} className="text-[var(--primary)]" />
            {t("treasuries_page_title")}
          </CardTitle>

          <CardDescription>{t("treasuries_page_desc")}</CardDescription>

          <CardAction>
            <Button
              variant="default"
              onClick={() => {
                setSelectedTreasuryId(undefined);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              {t("add_treasury_btn")}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="hidden lg:block rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <DataTable
                value={filteredTreasurys}
                loading={isLoading}
                paginator
                rows={entriesPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
                first={(currentPage - 1) * entriesPerPage}
                onPage={(e: DataTablePageEvent) => {
                  if (e.page === undefined) return;
                  setCurrentPage(e.page + 1);
                  setEntriesPerPage(e.rows);
                }}
                dataKey="id"
                header={header}
                className="custom-green-table custom-compact-table"
                emptyMessage={t("no_data")}
                responsiveLayout="stack"
              >
                <Column
                  field="id"
                  header={t("treasury_code")}
                  sortable
                  style={{ minWidth: "10rem", whiteSpace: "nowrap" }}
                />

                <Column
                  field="name"
                  header={t("treasury_name")}
                  sortable
                  style={{ minWidth: "16rem" }}
                  body={(row: TreasuryRow) => (
                    <div className="cell-data-stack">
                      <span className="customer-name-main">{row.name}</span>
                    </div>
                  )}
                />

                <Column
                  field="openingBalance"
                  header={t("treasury_opening_balance")}
                  sortable
                  style={{ minWidth: "12rem", whiteSpace: "nowrap" }}
                  body={(row: TreasuryRow) => formatNumber(row.openingBalance)}
                />

                <Column
                  field="currentBalance"
                  header={t("treasury_current_balance")}
                  sortable
                  style={{ minWidth: "12rem", whiteSpace: "nowrap" }}
                  body={(row: TreasuryRow) => formatNumber(row.currentBalance)}
                />

                <Column
                  header={t("actions")}
                  style={{ minWidth: "9rem", whiteSpace: "nowrap" }}
                  body={(row: TreasuryRow) => (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(row.id)}
                        className="btn-minimal-action btn-compact-action"
                        type="button"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => askDelete(row)}
                        className="btn-minimal-action btn-compact-action"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </div>

          <div className="mt-4 lg:hidden">{header}</div>

          <div className="grid grid-cols-1 gap-5 lg:hidden mt-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">
                {t("loading")}
              </div>
            ) : filteredTreasurys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">
                {t("no_data")}
              </div>
            ) : (
              filteredTreasurys
                .slice(
                  (currentPage - 1) * entriesPerPage,
                  currentPage * entriesPerPage
                )
                .map((row) => (
                  <div
                    key={row.id}
                    className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                          <Wallet size={18} className="text-[var(--primary)]" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-[var(--text-muted)]">
                            {t("treasury_name")}
                          </p>
                          <p className="text-sm font-bold text-[var(--text-main)] break-words">
                            {row.name}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">
                        #{row.id}
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            {t("treasury_opening_balance")}
                          </p>
                          <p className="text-sm font-semibold text-[var(--text-main)]">
                            {formatNumber(row.openingBalance)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            {t("treasury_current_balance")}
                          </p>
                          <p className="text-sm font-semibold text-[var(--text-main)]">
                            {formatNumber(row.currentBalance)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleEdit(row.id)}
                          className="btn-minimal-action btn-compact-action"
                          type="button"
                        >
                          <Edit2 size={16} />
                          <span className="text-xs px-1">{t("edit")}</span>
                        </button>

                        <button
                          onClick={() => askDelete(row)}
                          className="btn-minimal-action btn-compact-action text-red-600"
                          type="button"
                        >
                          <Trash2 size={16} />
                          <span className="text-xs px-1">{t("delete")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

        </CardContent>
      </Card>

      <TreasuryModal
        treasuryId={selectedTreasuryId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTreasuryId(undefined);
        }}
      />

      <DeleteTreasuryDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.name}
        itemLabel={t("treasury")}
        loading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}