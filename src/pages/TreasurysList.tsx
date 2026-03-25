import React, { useMemo, useState } from "react";
import { Edit2, Plus, Search, Trash2, Wallet } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useDeleteTreasury } from "@/features/treasurys/hooks/useDeleteTreasury";
import TreasuryModal from "@/components/modals/TreasuryModal";

export default function TreasurysList() {
  const { t, direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { mutateAsync: deleteTreasury } = useDeleteTreasury();

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState<number | undefined>();

  const filteredTreasurys = useMemo(() => {
    return (
      treasurys
        ?.filter((item) => {
          const term = searchTerm.toLowerCase();
          return (
            item.name?.toLowerCase().includes(term) ||
            String(item.id).includes(term)
          );
        })
        ?.sort((a, b) => b.id - a.id) ?? []
    );
  }, [treasurys, searchTerm]);

  const handleEdit = (id: number) => {
    setSelectedTreasuryId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTreasury(id);
      notifySuccess(typeof res === "string" ? res : t("deleted_successfully"));
    } catch (error: any) {
      notifyError(error?.message || t("something_went_wrong"));
    }
  };

  const formatNumber = (value?: number) => {
    return Number(value ?? 0).toLocaleString("en-US");
  };

  return (
    <div className="p-4 space-y-4" dir={direction}>
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">
          {t("treasuries_page_title")}
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Wallet size={20} className="text-[var(--primary)]" />
            {t("treasuries_page_title")}
          </h1>

          <Button
            onClick={() => {
              setSelectedTreasuryId(undefined);
              setIsModalOpen(true);
            }}
            variant="default"
            size="xl"
          >
            <Plus size={20} />
            {t("add_treasury_btn")}
          </Button>
        </div>

        <p className="text-sm text-[var(--text-muted)] mt-1">
          {t("customize_report_below")}
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 min-h-100">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4 relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("treasury_search_placeholder")}
              className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-primary focus:bg-white text-gray-700 text-sm rounded-xl py-3 pr-11 pl-4 transition-all outline-none"
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <DataTable
                value={filteredTreasurys}
                paginator
                rows={entriesPerPage}
                first={(currentPage - 1) * entriesPerPage}
                onPage={(e) => setCurrentPage(e.page + 1)}
                dataKey="id"
                className="custom-green-table custom-compact-table"
                stripedRows={false}
                emptyMessage={t("no_data")}
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
                  style={{ minWidth: "16rem", width: "35%" }}
                  body={(row) => (
                    <div className="cell-data-stack">
                      <span className="customer-name-main">{row.name}</span>
                    </div>
                  )}
                />

                <Column
                  field="openingBalance"
                  header={t("treasury_opening_balance")}
                  sortable
                  style={{ minWidth: "10rem", whiteSpace: "nowrap" }}
                  body={(row) => formatNumber(row.openingBalance)}
                />

                <Column
                  header={t("actions")}
                  style={{ minWidth: "8rem", whiteSpace: "nowrap" }}
                  body={(row) => (
                    <>
                      <button
                        onClick={() => handleEdit(row.id)}
                        className="btn-minimal-action btn-compact-action"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(row.id)}
                        className="btn-minimal-action btn-compact-action"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                />
              </DataTable>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filteredTreasurys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fafafa] p-8 text-center text-sm text-[var(--text-muted)]">
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
                    className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] border-b border-gray-100">
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

                    <div className="p-4 space-y-3">
                      <div className="rounded-xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[var(--text-muted)] mb-1">
                          {t("treasury_code")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-main)]">
                          {row.id}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[var(--text-muted)] mb-1">
                          {t("treasury_opening_balance")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-main)]">
                          {formatNumber(row.openingBalance)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleEdit(row.id)}
                          className="btn-minimal-action btn-compact-action"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(row.id)}
                          className="btn-minimal-action btn-compact-action"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}

            {filteredTreasurys.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("previous")}
                </button>

                <div className="h-10 min-w-10 px-4 rounded-xl bg-[rgba(49,201,110,0.12)] text-[var(--primary)] flex items-center justify-center text-sm font-bold">
                  {currentPage}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < Math.ceil(filteredTreasurys.length / entriesPerPage)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={
                    currentPage >= Math.ceil(filteredTreasurys.length / entriesPerPage)
                  }
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TreasuryModal
        treasuryId={selectedTreasuryId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTreasuryId(undefined);
        }}
      />
    </div>
  );
}