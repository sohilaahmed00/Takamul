import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Wallet, HandCoins } from "lucide-react";
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
import type { Revenue } from "@/features/revenues/types/revenues.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: Revenue | null;
  onSubmitData: (payload: {
    id?: number;
    name: string;
    amount: number;
    date: string;
    notes: string;
    treasuryId?: number | null;
    itemId?: number | null;
  }) => Promise<void>;
};

export default function AddRevenueModal({
  isOpen,
  onClose,
  mode = "add",
  editData = null,
  onSubmitData,
}: Props) {
  const { direction } = useLanguage();
  const { notifyError, notifySuccess } = useToast();
  const { data: treasurys } = useGetAllTreasurys();

  const isEditMode = mode === "edit";

  const [date, setDate] = useState("");
  const [treasuryId, setTreasuryId] = useState<number | undefined>();
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editData) {
      setDate(
        editData.date
          ? new Date(editData.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setTreasuryId(editData.treasuryId ?? undefined);
      setItemId(editData.itemId ?? undefined);
      setItemName(editData.itemName || editData.name || "");
      setAmount(String(editData.amount ?? ""));
      setNotes(editData.notes ?? "");
      return;
    }

    setDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setItemId(undefined);
    setItemName("");
    setAmount("");
    setNotes("");
  }, [isOpen, isEditMode, editData]);

  const selectedTreasury = useMemo(
    () => treasurys?.find((t: any) => t.id === treasuryId),
    [treasurys, treasuryId]
  );

  const currentBalance = Number(selectedTreasury?.balance ?? 0);
  const amountNumber = Number(amount || 0);
  const balanceAfter = currentBalance + amountNumber;

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      notifyError("التاريخ مطلوب");
      return;
    }

    if (!treasuryId) {
      notifyError("اختر الخزينة");
      return;
    }

    if (!itemName.trim()) {
      notifyError("أدخل اسم البند");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      notifyError("أدخل مبلغ صحيح أكبر من صفر");
      return;
    }

    try {
      await onSubmitData({
        id: editData?.id,
        name: itemName.trim(),
        amount: parsedAmount,
        date: new Date(date).toISOString(),
        notes: notes.trim() || "",
        treasuryId,
        itemId,
      });

      notifySuccess(
        isEditMode ? "تم تعديل الإيراد بنجاح" : "تم إضافة الإيراد بنجاح"
      );
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
            {isEditMode ? "تعديل إيراد" : "إضافة إيراد"}
            <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-lg">
              إيراد
            </span>
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            {isEditMode ? "تعديل بيانات الإيراد" : "تسجيل إيراد جديد"}
          </DialogDescription>
        </DialogHeader>

        <form
          id="revenueForm"
          onSubmit={handleSubmit}
          className="px-5 space-y-3"
        >
          <Field>
            <FieldLabel>التاريخ</FieldLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

            <Field>
              <FieldLabel>الرصيد الحالي</FieldLabel>
              <Input
                readOnly
                value={formatNumber(currentBalance)}
                className="h-9 bg-gray-50 text-center"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>البند</FieldLabel>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="اكتب اسم البند"
              className="h-9"
            />
          </Field>

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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب ملاحظات أو بيان الإيراد"
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
              form="revenueForm"
              type="submit"
              className="min-w-[150px] h-10 px-6"
            >
              <Loader2 size={16} className="hidden animate-spin" />
              {isEditMode ? "حفظ التعديلات" : "حفظ الإيراد"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}