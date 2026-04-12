import React, { useMemo, useState } from "react";
import { Edit2, Plus, Search, Trash2, Warehouse } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
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
import WarehouseModal from "@/components/modals/WarehouseModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import { useDeleteWarehouse } from "@/features/Warehouses/hooks/useDeleteWarehouse";
import { useGetAllWarehouses } from "@/features/Warehouses/hooks/useGetAllWarehouses";

import { Input } from "@/components/ui/input";

export default function WarehousesList() {
  const { t, direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const { data: warehouses, isLoading } = useGetAllWarehouses();
  const { mutateAsync: deleteWh, isPending: isDeleting } = useDeleteWarehouse();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (warehouses ?? []).filter(
      (item: any) =>
        item.warehouseName?.toLowerCase().includes(term) ||
        item.warehouseCode?.toLowerCase().includes(term)
    );
  }, [warehouses, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteWh(deleteTarget.id);
      notifySuccess(t("deleted_successfully") || "تم حذف المخزن بنجاح");
      setDeleteTarget(null);
    } catch {
      notifyError(t("error_occurred") || "حدث خطأ أثناء الحذف");
    }
  };

  const header = (
    <div className="relative w-full md:w-80">
      <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t("search_placeholder") || "ابحث عن مخزن..."}
        className="w-full border border-gray-200 rounded-lg py-2 pr-10 pl-4 outline-none focus:border-[var(--primary)]"
      />
    </div>
  );

  return (
    <div dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse size={20} className="text-[var(--primary)]" />
            {t("warehouses") || "إدارة المخازن"}
          </CardTitle>

          <CardDescription>
            {t("warehouses_table_desc") || "إضافة وتعديل وحذف المخازن وربطها بالفروع"}
          </CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedId(undefined);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              {t("add_warehouse") || "إضافة مخزن"}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DataTable
            value={filteredData}
            loading={isLoading}
            paginator
            rows={10}
            header={header}
            className="custom-green-table"
            responsiveLayout="stack"
          >
            <Column field="warehouseCode" header={t("code")} sortable />
            <Column field="warehouseName" header={t("warehouse_name") || "اسم المخزن"} sortable />
            <Column field="branchName" header={t("branch") || "الفرع"} />
            <Column field="managerName" header={t("manager") || "المدير"} />
            <Column
              header={t("actions") || "الإجراءات"}
              body={(row) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedId(row.id);
                      setIsModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(row)}
                    className="btn-minimal-action"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

      <WarehouseModal
        isOpen={isModalOpen}
        warehouseId={selectedId}
        onClose={() => setIsModalOpen(false)}
      />

      <DeleteTreasuryDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.warehouseName}
        itemLabel={t("warehouses") || "المخزن"}
        loading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}