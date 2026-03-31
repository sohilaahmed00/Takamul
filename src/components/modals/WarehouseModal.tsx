import React, { useEffect, useState } from "react";
import { Loader2, Warehouse } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
// import { useCreateWarehouse, useUpdateWarehouse, useGetWarehouseById } from "../hooks/useWarehouses";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useCreateWarehouse } from "@/features/Warehouses/hooks/useCreateWarehouse";
import { useUpdateWarehouse } from "@/features/Warehouses/hooks/useUpdateWarehouse";
import { useGetWarehouseById } from "@/features/Warehouses/hooks/useGetWarehouseById";

export default function WarehouseModal({ isOpen, onClose, warehouseId }: any) {
    const { direction, t } = useLanguage();
    const { notifySuccess, notifyError } = useToast();
    const isEdit = !!warehouseId;
    const {data: branches } = useGetAllBranches();
    const { data: warehouse, isLoading } = useGetWarehouseById(warehouseId);
    const { mutateAsync: createWh, isPending: isCreating } = useCreateWarehouse();
    const { mutateAsync: updateWh, isPending: isUpdating } = useUpdateWarehouse();

    const [formData, setFormData] = useState({ warehouseName: "", warehouseCode: "", address: "", managerId: 1, branchId: 2 });

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
            setFormData({ warehouseName: "", warehouseCode: "WH-" + Math.floor(Math.random() * 1000), address: "", managerId: 1, branchId: 2 });
        }
    }, [isOpen, warehouse, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateWh({ id: warehouseId, data: formData });
                notifySuccess("تم التعديل بنجاح");
            } else {
                await createWh(formData);
                notifySuccess("تمت الإضافة بنجاح");
            }
            onClose();
        } catch (err: any) { notifyError("حدث خطأ ما"); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent dir={direction} className="sm:max-w-[600px]">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-[var(--primary)]">
                        <Warehouse size={20} />
                        {isEdit ? "تعديل مخزن" : "إضافة مخزن جديد"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <Field>
                        <FieldLabel>اسم المخزن</FieldLabel>
                        <Input value={formData.warehouseName} onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })} required />
                    </Field>
                    <Field>
                        <FieldLabel>كود المخزن</FieldLabel>
                        <Input value={formData.warehouseCode} readOnly className="bg-gray-50" />
                    </Field>
                    <Field>
                        <FieldLabel>العنوان</FieldLabel>
                        <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </Field>

                    {/* اختيار الفرع */}
                    <Field>
                        <FieldLabel>الفرع <span className="text-red-500">*</span></FieldLabel>
                        <select
                            value={formData.branchId}
                            onChange={(e) => setFormData({ ...formData, branchId: Number(e.target.value) })}
                            className="w-full h-10 border rounded-md px-3 outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        >
                            <option value="">{t("select_branch") || "اختر الفرع"}</option>
                            {branches?.map((branch: any) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* اختيار المدير */}
                    <Field>
                        <FieldLabel>مدير المخزن</FieldLabel>
                        <select
                            className="w-full h-10 border border-gray-200 rounded-md px-3 outline-none focus:border-[var(--primary)]"
                            value={formData.managerId}
                            onChange={(e) => setFormData({ ...formData, managerId: Number(e.target.value) })}
                        >
                            <option value="">اختر المدير</option>
                            {/* هنا بنعرض المستخدمين أو المديرين */}
                            <option value={1}>Omar Monir</option>
                            <option value={2}>Ahmed Ali</option>
                        </select>
                    </Field>
                </form>
                <DialogFooter className="border-t pt-3">
                    <Button variant="outline" onClick={onClose}>إلغاء</Button>
                    <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) && <Loader2 className="animate-spin me-2" size={18} />}
                        حفظ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}