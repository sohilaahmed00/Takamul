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
import { Plus, Search, Edit2, Trash2, WalletCards } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { useGetAllExpenses } from "@/features/expenses/hooks/useGetAllExpenses";
import { useCreateExpense } from "@/features/expenses/hooks/useCreateExpense";
import { useUpdateExpense } from "@/features/expenses/hooks/useUpdateExpense";
import { useDeleteExpense } from "@/features/expenses/hooks/useDeleteExpense";
import AddExpenseModal from "@/components/modals/AddExpenseModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import type { Expense } from "@/features/expenses/types/expenses.types";

export default function Expenses() {
    const { direction } = useLanguage();
    const { notifyError } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedRow, setSelectedRow] = useState<Expense | null>(null);
    const [rowToDelete, setRowToDelete] = useState<Expense | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: expenses, isLoading } = useGetAllExpenses();
    const { mutateAsync: createExpense } = useCreateExpense();
    const { mutateAsync: updateExpense } = useUpdateExpense();
    const { mutateAsync: deleteExpense, isPending: isDeleting } = useDeleteExpense();

    const rows = useMemo(() => expenses ?? [], [expenses]);

    const filteredRows = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return rows.filter((row) => {
            if (!term) return true;

            return (
                row.name?.toLowerCase().includes(term) ||
                row.treasuryName?.toLowerCase().includes(term) ||
                row.itemName?.toLowerCase().includes(term) ||
                row.notes?.toLowerCase().includes(term) ||
                String(row.amount).includes(term)
            );
        });
    }, [rows, searchTerm]);

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
            notifyError(error?.response?.data?.message || error?.message || "حدث خطأ أثناء حذف المصروف");
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
                className="btn-minimal-action btn-compact-action"
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
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="ابحث باسم الحركة أو الخزينة أو البند أو البيان أو المبلغ..."
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
                        <WalletCards size={20} className="text-[var(--primary)]" />
                        المصروفات
                    </CardTitle>

                    <CardDescription>
                        تسجيل وعرض حركات المصروفات
                    </CardDescription>

                    <CardAction>
                        <Button onClick={openAddModal} variant="default">
                            <Plus size={18} />
                            إضافة مصروف
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
                            emptyMessage="لا توجد بيانات"
                            responsiveLayout="stack"
                        >
                            <Column
                                field="date"
                                header="تاريخ العملية"
                                sortable
                                body={(row) => formatDate(row.date)}
                                style={{ width: "14%" }}
                                bodyStyle={{ whiteSpace: "nowrap" }}
                            />
                            <Column
                                field="name"
                                header="اسم الحركة"
                                sortable
                                style={{ width: "20%" }}
                                bodyStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
                            />
                            <Column
                                field="treasuryName"
                                header="الخزينة"
                                sortable
                                body={(row) => row.treasuryName || "-"}
                                style={{ width: "16%" }}
                            />
                            <Column
                                field="itemName"
                                header="البند"
                                body={(row) => row.itemName || row.name || "-"}
                                style={{ width: "16%" }}
                            />
                            <Column
                                field="amount"
                                header="المبلغ"
                                sortable
                                body={(row) => formatNumber(row.amount)}
                                style={{ width: "12%" }}
                                bodyStyle={{ whiteSpace: "nowrap" }}
                            />
                            <Column
                                field="notes"
                                header="البيان"
                                body={(row) => row.notes || "-"}
                                style={{ width: "12%" }}
                            />
                            <Column
                                header="الإجراءات"
                                body={actionBodyTemplate}
                                style={{ width: "10%" }}
                                bodyStyle={{ whiteSpace: "nowrap", textAlign: "center" }}
                            />
                        </DataTable>
                    </div>

                    <div className="mt-4 lg:hidden">{header}</div>

                    <div className="grid grid-cols-1 gap-4 lg:hidden mt-4">
                        {isLoading ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fafafa] p-8 text-center text-sm text-[var(--text-muted)]">
                                جاري التحميل...
                            </div>
                        ) : filteredRows.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fafafa] p-8 text-center text-sm text-[var(--text-muted)]">
                                لا توجد بيانات
                            </div>
                        ) : (
                            filteredRows
                                .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                                .map((row) => (
                                    <div
                                        key={row.id}
                                        className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] border-b border-gray-100">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-[var(--text-main)] break-words">
                                                    {row.name || "-"}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                                    {formatDate(row.date)}
                                                </p>
                                            </div>

                                            <div className="shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-[rgba(49,201,110,0.12)] text-[var(--primary)]">
                                                {formatNumber(row.amount)}
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <div className="rounded-xl bg-[#f8fafc] p-3">
                                                <p className="text-xs text-[var(--text-muted)] mb-1">الخزينة</p>
                                                <p className="text-sm font-semibold text-[var(--text-main)]">
                                                    {row.treasuryName || "-"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-[#f8fafc] p-3">
                                                <p className="text-xs text-[var(--text-muted)] mb-1">البند</p>
                                                <p className="text-sm font-semibold text-[var(--text-main)]">
                                                    {row.itemName || row.name || "-"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-[#f8fafc] p-3">
                                                <p className="text-xs text-[var(--text-muted)] mb-1">البيان</p>
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
                                                </button>

                                                <button
                                                    onClick={() => setRowToDelete(row)}
                                                    className="btn-minimal-action btn-compact-action"
                                                    type="button"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
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
                onSubmitData={async (payload) => {
                    if (modalMode === "edit" && payload.id) {
                        await updateExpense({
                            id: payload.id,
                            name: payload.name,
                            amount: payload.amount,
                            date: payload.date,
                            notes: payload.notes,
                            treasuryId: payload.treasuryId,
                            itemId: payload.itemId,
                        });
                    } else {
                        await createExpense({
                            name: payload.name,
                            amount: payload.amount,
                            date: payload.date,
                            notes: payload.notes,
                            treasuryId: payload.treasuryId,
                            itemId: payload.itemId,
                        });
                    }
                }}
            />
            <DeleteTreasuryDialog
                open={!!rowToDelete}
                itemLabel="هذا المصروف"
                loading={isDeleting}
                onClose={() => setRowToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}