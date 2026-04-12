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
import { Plus, Search, Edit2, Trash2, ListChecks } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useGetItems } from "@/features/items/hooks/useGetItems";
import useDeleteItem from "@/features/items/hooks/useDeleteItem";
import ItemModal from "@/components/modals/ItemModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import type { Item } from "@/features/items/types/items.types";

import { Input } from "@/components/ui/input";

export default function ItemsList() {
  const { direction, t } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const { data, isLoading } = useGetItems({
    page: 1,
    pageSize: 100,
    searchTerm,
  });

  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem();

  const rows = useMemo(() => data?.items ?? [], [data]);

  const paginatedMobileRows = useMemo(
    () =>
      rows.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      ),
    [rows, currentPage, entriesPerPage]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / entriesPerPage));

  const openAddModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(itemToDelete.id);
      notifySuccess(t("delete_item_success"));
      setItemToDelete(null);
    } catch {
      notifyError(t("delete_item_error"));
    }
  };

  const statusBodyTemplate = (row: Item) => (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${row.isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
        }`}
    >
      {row.isActive ? t("active") : t("inactive")}
    </span>
  );

  const actionBodyTemplate = (row: Item) => (
    <div className="flex items-center gap-2 justify-center">
      <button
        onClick={() => openEditModal(row)}
        className="btn-minimal-action btn-compact-action"
        type="button"
      >
        <Edit2 size={16} />
      </button>

      <button
        onClick={() => setItemToDelete(row)}
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
          placeholder={t("search_item")}
          
        />
      </div>
    </div>
  );

  return (
    <div dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={20} className="text-[var(--primary)]" />
            {t("items")}
          </CardTitle>

          <CardDescription>{t("items_desc")}</CardDescription>

          <CardAction>
            <Button onClick={openAddModal} variant="default">
              <Plus size={18} />
              {t("add_item")}
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
                field="name"
                header={t("item_name")}
                sortable
                style={{ width: "45%" }}
                bodyStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
              />
              <Column
                header={t("status")}
                body={statusBodyTemplate}
                style={{ width: "25%" }}
              />
              <Column
                header={t("actions")}
                body={actionBodyTemplate}
                style={{ width: "20%" }}
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
              paginatedMobileRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-main)] break-words">
                        {row.name || "-"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {statusBodyTemplate(row)}
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
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
                        onClick={() => setItemToDelete(row)}
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

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />

      <DeleteTreasuryDialog
        open={!!itemToDelete}
        itemLabel={t("this_item")}
        loading={isDeleting}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
