import React, { useEffect, useState } from "react";
import { Loader2, Warehouse } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useCreateWarehouse } from "@/features/Warehouses/hooks/useCreateWarehouse";
import { useUpdateWarehouse } from "@/features/Warehouses/hooks/useUpdateWarehouse";
import { useGetWarehouseById } from "@/features/Warehouses/hooks/useGetWarehouseById";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  warehouseId?: number;
};

export default function WarehouseModal({
  isOpen,
  onClose,
  warehouseId,
}: Props) {
  const { direction, t } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const isEdit = !!warehouseId;

  const { data: branches } = useGetAllBranches();
  const { data: warehouse } = useGetWarehouseById(warehouseId);
  const { mutateAsync: createWh, isPending: isCreating } = useCreateWarehouse();
  const { mutateAsync: updateWh, isPending: isUpdating } = useUpdateWarehouse();

  const [formData, setFormData] = useState({
    warehouseName: "",
    warehouseCode: "",
    address: "",
    managerId: 1,
    branchId: 2,
  });

  useEffect(() => {
    if (isEdit && warehouse) {
      setFormData({
        warehouseName: warehouse.warehouseName,
        warehouseCode: warehouse.warehouseCode,
        address: warehouse.address,
        managerId: warehouse.managerId,
        branchId: warehouse.branchId,
      });
    } else {
      setFormData({
        warehouseName: "",
        warehouseCode: "WH-" + Math.floor(Math.random() * 1000),
        address: "",
        managerId: 1,
        branchId: 2,
      });
    }
  }, [isOpen, warehouse, isEdit]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      if (isEdit) {
        await updateWh({ id: warehouseId, data: formData });
        notifySuccess(t("record_updated_successfully") || "تم التعديل بنجاح");
      } else {
        await createWh(formData);
        notifySuccess(t("record_created_successfully") || "تمت الإضافة بنجاح");
      }

      onClose();
    } catch {
      notifyError(t("error_occurred") || "حدث خطأ ما");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[600px]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-[var(--primary)]">
            <Warehouse size={20} />
            {isEdit
              ? t("edit_warehouse") || "تعديل مخزن"
              : t("add_warehouse") || "إضافة مخزن جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <Field>
            <FieldLabel>{t("warehouse_name") || "اسم المخزن"}</FieldLabel>
            <Input
              value={formData.warehouseName}
              onChange={(e) =>
                setFormData({ ...formData, warehouseName: e.target.value })
              }
              required
            />
          </Field>

          <Field>
            <FieldLabel>{t("warehouse_code") || "كود المخزن"}</FieldLabel>
            <Input
              value={formData.warehouseCode}
              readOnly
              className="bg-gray-50"
            />
          </Field>

          <Field>
            <FieldLabel>{t("address") || "العنوان"}</FieldLabel>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel>
              {t("branch") || "الفرع"} <span className="text-red-500">*</span>
            </FieldLabel>

            <select
              value={formData.branchId}
              onChange={(e) =>
                setFormData({ ...formData, branchId: Number(e.target.value) })
              }
              className="w-full h-10 border rounded-md px-3 outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="">
                {t("select_branch") || "اختر الفرع"}
              </option>

              {branches?.map((branch: any) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel>{t("manager") || "مدير المخزن"}</FieldLabel>

            <select
              className="w-full h-10 border border-gray-200 rounded-md px-3 outline-none focus:border-[var(--primary)]"
              value={formData.managerId}
              onChange={(e) =>
                setFormData({ ...formData, managerId: Number(e.target.value) })
              }
            >
              <option value="">
                {t("select_manager") || "اختر المدير"}
              </option>

              <option value={1}>Omar Monir</option>
              <option value={2}>Ahmed Ali</option>
            </select>
          </Field>
        </form>

        <DialogFooter className="border-t pt-3">
          <Button variant="outline" onClick={onClose}>
            {t("cancel") || "إلغاء"}
          </Button>

          <Button onClick={() => handleSubmit()} disabled={isCreating || isUpdating}>
            {(isCreating || isUpdating) && (
              <Loader2 className="animate-spin me-2" size={18} />
            )}
            {t("save") || "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}