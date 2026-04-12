import React, { useMemo, useState } from "react";
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
import { Plus, Search, Edit2, Trash2, DollarSign } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useGetAllExpenses } from "@/features/expenses/hooks/useGetAllExpenses";
import { useCreateExpense } from "@/features/expenses/hooks/useCreateExpense";
import { useUpdateExpense } from "@/features/expenses/hooks/useUpdateExpense";
import { useDeleteExpense } from "@/features/expenses/hooks/useDeleteExpense";
import AddExpenseModal from "@/components/modals/AddExpenseModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import type { Expense } from "@/features/expenses/types/expenses.types";

import { Input } from "@/components/ui/input";

export default function Expenses() {
  const { direction, t } = useLanguage();
  const { notifyError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<Expense | null>(null);
  const [rowToDelete, setRowToDelete] = useState<Expense | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: expensesData, isLoading } = useGetAllExpenses({
    page: currentPage,
    pageSize: entriesPerPage,
    searchTerm,
  });

  const { mutateAsync: createExpense } = useCreateExpense();
  const { mutateAsync: updateExpense } = useUpdateExpense();
  const { mutateAsync: deleteExpense, isPending: isDeleting } =
    useDeleteExpense();

  const rows = useMemo(() => expensesData?.items ?? [], [expensesData]);
  const totalItems = expensesData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB");
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US");

  const openAddModal = () => {
    setSelectedRow(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (row: Expense) => {
    setSelectedRow(row);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!rowToDelete) return;

    try {
      await deleteExpense(rowToDelete.id);
      setRowToDelete(null);
    } catch (error: any) {
      notifyError(error?.message || t("delete_expense_error"));
    }
  };

  const handleSubmitData = async (payload: {
    id?: number;
    name: string;
    amount: number;
    date: string;
    notes: string;
    treasuryId?: number | null;
    itemId?: number | null;
  }) => {
    const body = {
      name: payload.name,
      amount: payload.amount,
      date: payload.date,
      notes: payload.notes,
      treasuryId: payload.treasuryId ?? 0,
      itemId: payload.itemId ?? 0,
    };

    if (modalMode === "edit" && payload.id) {
      await updateExpense({
        id: payload.id,
        ...body,
      });
    } else {
      await createExpense(body);
    }
  };

  const actionBodyTemplate = (row: Expense) => (
    <div className="flex items-center gap-2 justify-center">
      <button
        onClick={() => openEditModal(row)}
        className="btn-minimal-action btn-compact-action"
        type="button"
      >
        <Edit2 size={16} />
      </button>

      <button
        onClick={() => setRowToDelete(row)}
        className="btn-minimal-action btn-compact-action text-red-600"
        type="button"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

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
          placeholder={t("search_expenses")}
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
            <DollarSign size={20} className="text-[var(--primary)]" />
            {t("expenses")}
          </CardTitle>

          <CardDescription>{t("expenses_desc")}</CardDescription>

          <CardAction>
            <Button onClick={openAddModal} variant="default">
              <Plus size={18} />
              {t("add_expense")}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="hidden lg:block rounded-xl border border-gray-100 overflow-hidden">
            <DataTable
              value={rows}
              loading={isLoading || isDeleting}
              paginator
              rows={entriesPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              first={(currentPage - 1) * entriesPerPage}
              totalRecords={totalItems}
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
                field="date"
                header={t("operation_date")}
                sortable
                body={(row) => formatDate(row.date)}
                style={{ width: "14%" }}
                bodyStyle={{ whiteSpace: "nowrap" }}
              />
              <Column
                field="name"
                header={t("movement_name")}
                sortable
                style={{ width: "20%" }}
                bodyStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
              />
              <Column
                field="treasuryName"
                header={t("treasury")}
                sortable
                body={(row) => row.treasuryName || "-"}
                style={{ width: "16%" }}
              />
              <Column
                field="itemName"
                header={t("item")}
                body={(row) => row.itemName || row.name || "-"}
                style={{ width: "16%" }}
              />
              <Column
                field="amount"
                header={t("amount")}
                sortable
                body={(row) => formatNumber(row.amount)}
                style={{ width: "12%" }}
                bodyStyle={{ whiteSpace: "nowrap" }}
              />
              <Column
                field="notes"
                header={t("statement")}
                body={(row) => row.notes || "-"}
                style={{ width: "12%" }}
              />
              <Column
                header={t("actions")}
                body={actionBodyTemplate}
                style={{ width: "10%" }}
                bodyStyle={{ whiteSpace: "nowrap", textAlign: "center" }}
              />
            </DataTable>
          </div>

          <div className="mt-4 lg:hidden">{header}</div>

          <div className="grid grid-cols-1 gap-5 lg:hidden mt-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">
                {t("loading")}
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/20 p-8 text-center text-sm text-[var(--text-muted)]">
                {t("no_data")}
              </div>
            ) : (
              rows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-main)] break-words">
                        {row.name || "-"}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {formatDate(row.date)}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                      {formatNumber(row.amount)}
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                        <p className="text-xs text-[var(--text-muted)] mb-1">
                          {t("treasury")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                          {row.treasuryName || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                        <p className="text-xs text-[var(--text-muted)] mb-1">
                          {t("item")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                          {row.itemName || row.name || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        {t("statement")}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-main)] break-words">
                        {row.notes || "-"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => openEditModal(row)}
                        className="btn-minimal-action btn-compact-action"
                        type="button"
                      >
                        <Edit2 size={16} />
                        <span className="text-xs px-1">{t("edit")}</span>
                      </button>

                      <button
                        onClick={() => setRowToDelete(row)}
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

          {rows.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-4 lg:hidden">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-[var(--text-main)] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={currentPage >= totalPages}
                className="h-10 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-[var(--text-main)] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("next")}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow(null);
        }}
        mode={modalMode}
        editData={selectedRow}
        onSubmitData={handleSubmitData}
      />

      <DeleteTreasuryDialog
        open={!!rowToDelete}
        itemLabel={t("this_expense")}
        loading={isDeleting}
        onClose={() => setRowToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}