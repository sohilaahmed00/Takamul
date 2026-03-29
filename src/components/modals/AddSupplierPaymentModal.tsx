import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Truck, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { useCreateSupplierTransaction } from "@/features/supplier-transactions/hooks/useCreateSupplierTransaction";
import { useUpdateSupplierTransaction } from "@/features/supplier-transactions/hooks/useUpdateSupplierTransaction";
import type { SupplierTransaction } from "@/features/supplier-transactions/types/supplierTransactions.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: SupplierTransaction | null;
};

const DEFAULT_TRANSACTION_TYPE = "PurchaseInvoice";

export default function AddSupplierPaymentModal({
  isOpen,
  onClose,
  mode = "add",
  editData = null,
}: Props) {
  const { direction } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { data: suppliers } = useGetAllSuppliers();

  const { mutateAsync: createTransaction, isPending: isCreating } =
    useCreateSupplierTransaction();

  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateSupplierTransaction();

  const isEditMode = mode === "edit";
  const isPending = isCreating || isUpdating;

  const [transactionDate, setTransactionDate] = useState("");
  const [treasuryId, setTreasuryId] = useState<number | undefined>();
  const [supplierId, setSupplierId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editData) {
      setTransactionDate(
        editData.transactionDate
          ? new Date(editData.transactionDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setTreasuryId(editData.treasuryId);
      setSupplierId(editData.supplierId);
      setAmount(String(editData.amount ?? ""));
      setDescription(editData.description ?? "");
      return;
    }

    setTransactionDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setSupplierId(undefined);
    setAmount("");
    setDescription("");
  }, [isOpen, isEditMode, editData]);

  const selectedSupplier = useMemo(
    () => suppliers?.find((s: any) => s.id === supplierId),
    [suppliers, supplierId]
  );

  const currentBalance = Number(selectedSupplier?.balance ?? 0);
  const amountNumber = Number(amount || 0);
  const balanceAfter = currentBalance - amountNumber;

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US");

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionDate) {
      notifyError("التاريخ مطلوب");
      return;
    }

    if (!treasuryId) {
      notifyError("اختر الخزينة");
      return;
    }

    if (!supplierId) {
      notifyError("اختر المورد");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      notifyError("أدخل مبلغ صحيح أكبر من صفر");
      return;
    }

    try {
      if (isEditMode && editData) {
        await updateTransaction({
          id: editData.id,
          supplierId,
          treasuryId,
          transactionType: editData.transactionType || DEFAULT_TRANSACTION_TYPE,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

<<<<<<< HEAD
        notifySuccess("تم تعديل سند الصرف بنجاح");
=======
        notifySuccess("تم تعديل السداد بنجاح");
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
      } else {
        await createTransaction({
          supplierId,
          treasuryId,
          transactionType: DEFAULT_TRANSACTION_TYPE,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

<<<<<<< HEAD
        notifySuccess("تم إضافة سند الصرف بنجاح");
=======
        notifySuccess("تم إضافة السداد بنجاح");
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
      }

      handleClose();
    } catch (error: any) {
      notifyError(
        error?.response?.data?.message ||
          error?.message ||
          "حدث خطأ أثناء الحفظ"
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          (document.activeElement as HTMLElement)?.blur();
          handleClose();
        }
      }}
    >
      <DialogContent
        dir={direction}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-[720px] p-0 overflow-hidden rounded-2xl"
      >
        <DialogHeader className="px-5 py-2 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-lg font-semibold flex-wrap">
            {isEditMode ? <Pencil size={18} /> : <Truck size={18} />}
<<<<<<< HEAD
            {isEditMode ? "تعديل سند صرف" : "إضافة سند صرف"}
            {/* <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-lg">
              سند صرف
            </span> */}
          </DialogTitle>

          {/* <DialogDescription className="text-sm text-gray-500">
            {isEditMode
              ? "تعديل بيانات سند الصرف "
              : "تسجيل سند صرف للموردين"}
          </DialogDescription> */}
=======
            {isEditMode ? "تعديل سداد صادر" : "إضافة سداد صادر"}
            <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-lg">
              سداد صادر
            </span>
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            {isEditMode
              ? "تعديل بيانات السداد الصادر"
              : "تسجيل سداد صادر للموردين"}
          </DialogDescription>
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
        </DialogHeader>

        <form
          id="supplierPaymentForm"
          onSubmit={handleSubmit}
          className="px-5 space-y-3"
        >
          <Field>
            <FieldLabel>التاريخ</FieldLabel>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="h-9"
            />
          </Field>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">الخزينة</h3>
            </div>

            <Field>
              <select
                value={treasuryId ?? ""}
                onChange={(e) =>
                  setTreasuryId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full h-9 rounded-xl border border-gray-200 px-3 bg-white outline-none focus:border-[#2ecc71]"
              >
                <option value="">اختر الخزينة</option>
                {(treasurys ?? []).map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">اسم الحساب</h3>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field>
                <FieldLabel>اسم المورد</FieldLabel>
                <select
                  value={supplierId ?? ""}
                  onChange={(e) =>
                    setSupplierId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={isEditMode}
                  className="w-full h-9 rounded-xl border border-gray-200 px-3 bg-white outline-none focus:border-[#2ecc71] disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">اختر المورد</option>
                  {(suppliers ?? []).map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel>الرصيد الحالي</FieldLabel>
                <Input
                  readOnly
                  value={formatNumber(currentBalance)}
                  className="h-9 bg-gray-50 text-center"
                />
              </Field>
            </div>
          </div>

          <Field>
            <FieldLabel>المبلغ</FieldLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </Field>

          <Field>
            <FieldLabel>الرصيد بعد</FieldLabel>
            <Input
              readOnly
              value={formatNumber(balanceAfter)}
              className="h-9 bg-gray-50 text-center text-[#2ecc71] font-semibold"
            />
          </Field>

          <Field>
            <FieldLabel>البيان</FieldLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
              placeholder="اكتب ملاحظات أو بيان سند الصرف"
=======
              placeholder="اكتب ملاحظات أو بيان السداد"
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
              className="h-9"
            />
          </Field>
        </form>

        <DialogFooter className="px-5 py-7 border-t border-gray-100">
          <div className="flex justify-end gap-3 w-full px-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 px-6"
            >
              إلغاء
            </Button>

            <Button
              form="supplierPaymentForm"
              type="submit"
              disabled={isPending}
              className="min-w-[150px] h-10 px-6"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending
                ? isEditMode
                  ? "جارٍ التعديل..."
                  : "جارٍ الحفظ..."
                : isEditMode
                ? "حفظ التعديلات"
<<<<<<< HEAD
                : "حفظ سند الصرف"}
=======
                : "حفظ السداد"}
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}