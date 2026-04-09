import React, { useEffect, useState } from "react";
import { Loader2, Warehouse as WarehouseIcon } from "lucide-react";
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
import ComboboxField from "@/components/ui/ComboboxField";
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
                await updateWh({
                    id: warehouseId,
                    warehouseName: formData.warehouseName,
                    address: formData.address,
                    city: "Cairo",
                    state: "Egypt",
                    capacity: 0,
                } as any);
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
                        <WarehouseIcon size={20} />
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

                        <ComboboxField
                            value={formData.branchId}
                            onValueChange={(val) =>
                                setFormData({ ...formData, branchId: Number(val) })
                            }
                            items={branches}
                            valueKey="id"
                            labelKey="name"
                            placeholder={t("select_branch") || "اختر الفرع"}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>{t("manager") || "مدير المخزن"}</FieldLabel>

                        <ComboboxField
                            value={formData.managerId}
                            onValueChange={(val) =>
                                setFormData({ ...formData, managerId: Number(val) })
                            }
                            items={[
                                { id: 1, name: "Omar Monir" },
                                { id: 2, name: "Ahmed Ali" },
                            ]}
                            valueKey="id"
                            labelKey="name"
                            placeholder={t("select_manager") || "اختر المدير"}
                        />
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