import React, { useMemo, useState } from "react";
import { Column } from "primereact/column";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Truck, Edit2, Trash2, Printer, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useGetAllSupplierTransactions } from "@/features/supplier-transactions/hooks/useGetAllSupplierTransactions";
import { useDeleteSupplierTransaction } from "@/features/supplier-transactions/hooks/useDeleteSupplierTransaction";
import AddSupplierPaymentModal from "@/components/modals/AddSupplierPaymentModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import type { SupplierTransaction } from "@/features/supplier-transactions/types/supplierTransactions.types";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

import { Input } from "@/components/ui/input";
import { exportCustomPDF, printCustomHTML, getVoucherHTML } from "@/utils/customExportUtils";

export default function SupplierPaymentsList() {
  const { direction, t, language } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<SupplierTransaction | null>(null);
  const [rowToDelete, setRowToDelete] = useState<SupplierTransaction | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: transactions, isLoading } = useGetAllSupplierTransactions();
  const { mutateAsync: deleteTransaction, isPending: isDeleting } = useDeleteSupplierTransaction();

  const rows = useMemo(() => transactions ?? [], [transactions]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (!term) return true;

      return row.supplierName?.toLowerCase().includes(term) || row.treasuryName?.toLowerCase().includes(term) || row.description?.toLowerCase().includes(term) || String(row.amount).includes(term);
    });
  }, [rows, searchTerm]);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB");
  };

  const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString("en-US");

  const openAddModal = () => {
    setSelectedRow(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (row: SupplierTransaction) => {
    setSelectedRow(row);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (row: SupplierTransaction) => {
    setRowToDelete(row);
  };

  const handleDelete = async () => {
    if (!rowToDelete) return;

    try {
      await deleteTransaction(rowToDelete.id);
      notifySuccess(t("delete_supplier_payment_success"));
      setRowToDelete(null);
    } catch (error: any) {
      notifyError(error?.response?.data?.message || error?.message || t("delete_supplier_payment_error"));
    }
  };

  const [printingRow, setPrintingRow] = useState<number | null>(null);

  const handleExportPDF = async (row: SupplierTransaction) => {
    setPrintingRow(row.id);
    try {
      const htmlString = getVoucherHTML("payment", row, t, language);
      await exportCustomPDF(t("payment_bond"), htmlString, "portrait", 794);
    } finally {
      setPrintingRow(null);
    }
  };

  const handlePrint = (row: SupplierTransaction) => {
    const htmlString = getVoucherHTML("payment", row, t, language);
    printCustomHTML(t("payment_bond"), htmlString);
  };

  const actionBodyTemplate = (row: SupplierTransaction) => {
    return (
      <div className="flex items-center gap-2 justify-center">
        <button onClick={() => openEditModal(row)} className="btn-minimal-action btn-compact-action" type="button">
          <Edit2 size={16} />
        </button>

        <button onClick={() => openDeleteModal(row)} className="btn-minimal-action btn-compact-action" type="button">
          <Trash2 size={16} />
        </button>

        <button onClick={() => handlePrint(row)} className="btn-minimal-action btn-compact-action text-blue-600" type="button" title={t("print", "طباعة")}>
          <Printer size={16} />
        </button>

        <button onClick={() => handleExportPDF(row)} className="btn-minimal-action btn-compact-action text-slate-600" type="button" disabled={printingRow === row.id} title={"PDF"}>
          <FileText size={16} />
        </button>
      </div>
    );
  };

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
          placeholder={t("search_supplier_payments")}
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
            <Truck size={20} className="text-[var(--primary)]" />
            {t("supplier_payments")}
          </CardTitle>

          <CardAction>
            <Button size={"xl"} onClick={openAddModal} variant="default">
              <Plus size={18} />
              {t("add_supplier_payment")}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="hidden lg:block rounded-xl border border-gray-100 overflow-hidden">
            <DataTable
              value={filteredRows}
              loading={isLoading || isDeleting}
              paginator
              rows={entriesPerPage}
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
              <Column field="transactionDate" header={t("operation_date")} sortable body={(row) => formatDate(row.transactionDate)} style={{ width: "16%" }} bodyStyle={{ whiteSpace: "nowrap" }} />

              <Column field="supplierName" header={t("supplier_name")} sortable style={{ width: "22%" }} bodyStyle={{ whiteSpace: "normal", wordBreak: "break-word" }} />

              <Column field="treasuryName" header={t("treasury")} sortable style={{ width: "18%" }} bodyStyle={{ whiteSpace: "normal", wordBreak: "break-word" }} />

              <Column field="amount" header={t("amount")} sortable body={(row) => formatNumber(row.amount)} style={{ width: "14%" }} bodyStyle={{ whiteSpace: "nowrap" }} />

              <Column field="description" header={t("statement")} body={(row) => row.description || "-"} style={{ width: "18%" }} bodyStyle={{ whiteSpace: "normal", wordBreak: "break-word" }} />

              <Column header={t("actions")} body={actionBodyTemplate} style={{ width: "12%" }} bodyStyle={{ whiteSpace: "nowrap", textAlign: "center" }} />
            </DataTable>
          </div>
          <div className="mt-4 lg:hidden">{header}</div>
          <div className="grid grid-cols-1 gap-5 lg:hidden mt-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fafafa] p-8 text-center text-sm text-[var(--text-muted)]">{t("loading")}</div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fafafa] p-8 text-center text-sm text-[var(--text-muted)]">{t("no_data")}</div>
            ) : (
              filteredRows.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((row) => (
                <div key={row.id} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center shrink-0">
                        <Truck size={18} className="text-[var(--primary)]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text-muted)]">{t("supplier_name")}</p>
                        <p className="text-sm font-bold text-[var(--text-main)] break-words">{row.supplierName || "-"}</p>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">{formatDate(row.transactionDate)}</div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-[var(--text-muted)] mb-1">{t("treasury")}</p>
                      <p className="text-sm font-semibold text-[var(--text-main)]">{row.treasuryName || "-"}</p>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-[var(--text-muted)] mb-1">{t("amount")}</p>
                      <p className="text-sm font-semibold text-[var(--text-main)]">{formatNumber(row.amount)}</p>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-[var(--text-muted)] mb-1">{t("statement")}</p>
                      <p className="text-sm font-semibold text-[var(--text-main)] break-words">{row.description || "-"}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button onClick={() => openEditModal(row)} className="btn-minimal-action btn-compact-action" type="button">
                        <Edit2 size={16} />
                        <span className="text-xs px-1">{t("edit")}</span>
                      </button>

                      <button onClick={() => openDeleteModal(row)} className="btn-minimal-action btn-compact-action text-red-600" type="button">
                        <Trash2 size={16} />
                        <span className="text-xs px-1">{t("delete")}</span>
                      </button>

                      <button onClick={() => handlePrint(row)} className="btn-minimal-action btn-compact-action text-blue-600" type="button">
                        <Printer size={16} />
                        <span className="text-xs px-1">{t("print", "طباعة")}</span>
                      </button>

                      <button onClick={() => handleExportPDF(row)} className="btn-minimal-action btn-compact-action text-slate-600" type="button" disabled={printingRow === row.id}>
                        <FileText size={16} />
                        <span className="text-xs px-1">PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {filteredRows.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {t("previous")}
                </button>

                <div className="h-10 min-w-10 px-4 rounded-xl bg-[rgba(49,201,110,0.12)] text-[var(--primary)] flex items-center justify-center text-sm font-bold">{currentPage}</div>

                <button type="button" onClick={() => setCurrentPage((prev) => (prev < Math.ceil(filteredRows.length / entriesPerPage) ? prev + 1 : prev))} disabled={currentPage >= Math.ceil(filteredRows.length / entriesPerPage)} className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {t("next")}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddSupplierPaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow(null);
        }}
        mode={modalMode}
        editData={selectedRow}
      />

      <DeleteTreasuryDialog open={!!rowToDelete} itemLabel={t("this_supplier_payment")} loading={isDeleting} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}