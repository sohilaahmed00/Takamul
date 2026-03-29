import React, { useEffect, useMemo, useState } from "react";
import { HandCoins, Loader2, Wallet, Pencil } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { useCreateCustomerTransaction } from "@/features/customer-transactions/hooks/useCreateCustomerTransaction";
import { useUpdateCustomerTransaction } from "@/features/customer-transactions/hooks/useUpdateCustomerTransaction";
import type { CustomerTransaction } from "@/features/customer-transactions/types/customerTransactions.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: CustomerTransaction | null;
};

export default function AddCustomerCollectionModal({
  isOpen,
  onClose,
  mode = "add",
  editData = null,
}: Props) {
  const { direction } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { data: customers } = useGetAllCustomers();

  const { mutateAsync: createTransaction, isPending: isCreating } =
    useCreateCustomerTransaction();

  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateCustomerTransaction();

  const isEditMode = mode === "edit";
  const isPending = isCreating || isUpdating;

  const [transactionDate, setTransactionDate] = useState("");
  const [treasuryId, setTreasuryId] = useState<number | undefined>();
  const [customerId, setCustomerId] = useState<number | undefined>();
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
      setCustomerId(editData.customerId);
      setAmount(String(editData.amount ?? ""));
      setDescription(editData.description ?? "");
      return;
    }

    setTransactionDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setCustomerId(undefined);
    setAmount("");
    setDescription("");
  }, [isOpen, isEditMode, editData]);

  const selectedCustomer = useMemo(
    () => customers?.find((c: any) => c.id === customerId),
    [customers, customerId]
  );

  const currentBalance = Number(selectedCustomer?.balance ?? 0);
  const amountNumber = Number(amount || 0);
  const balanceAfter = currentBalance - amountNumber;

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US");

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

    if (!customerId) {
      notifyError("اختر العميل");
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
          treasuryId,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

<<<<<<< HEAD
        notifySuccess("تم تعديل سند القبض بنجاح");
=======
        notifySuccess("تم تعديل التحصيل بنجاح");
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
      } else {
        await createTransaction({
          customerId,
          treasuryId,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

<<<<<<< HEAD
        notifySuccess("تم إضافة سند القبض بنجاح");
=======
        notifySuccess("تم إضافة التحصيل بنجاح");
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
      }

      onClose();
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
          onClose();
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
            {isEditMode ? <Pencil size={18} /> : <HandCoins size={18} />}
<<<<<<< HEAD
            {isEditMode ? "تعديل سند قبض" : "إضافة سند قبض"}
            {/* <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-lg">
              سند قبض
            </span> */}
          </DialogTitle>

          {/* <DialogDescription className="text-sm text-gray-500">
            {isEditMode
              ? "تعديل بيانات سند القبض"
              : "تسجيل سند القبض من العملاء"}
          </DialogDescription> */}
=======
            {isEditMode ? "تعديل تحصيل وارد" : "إضافة تحصيل وارد"}
            <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-lg">
              تحصيل وارد
            </span>
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            {isEditMode
              ? "تعديل بيانات التحصيل الوارد"
              : "تسجيل تحصيل وارد من العملاء"}
          </DialogDescription>
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
        </DialogHeader>

        <form
          id="customerCollectionForm"
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
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field>
                <FieldLabel>اسم العميل</FieldLabel>
                <select
                  value={customerId ?? ""}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={isEditMode}
                  className="w-full h-9 rounded-xl border border-gray-200 px-3 bg-white outline-none focus:border-[#2ecc71] disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">اختر العميل</option>
                  {(customers ?? []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.customerName}
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
              placeholder="اكتب ملاحظات أو بيان سند القبض"
=======
              placeholder="اكتب ملاحظات أو بيان التحصيل"
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
              onClick={onClose}
              className="h-10 px-6"
            >
              إلغاء
            </Button>

            <Button
              form="customerCollectionForm"
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
                : "حفظ سند القبض"}
=======
                : "حفظ التحصيل"}
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}