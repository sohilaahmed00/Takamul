import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Loader2, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useCreateInternalTreasuryTransfer } from "@/features/internal-treasury-transfers/hooks/useCreateInternalTreasuryTransfer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddInternalTreasuryTransferModal({
  isOpen,
  onClose,
}: Props) {
  const { direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { mutateAsync: createTransfer, isPending } =
    useCreateInternalTreasuryTransfer();

  const [date, setDate] = useState("");
  const [fromTreasuryId, setFromTreasuryId] = useState<number | undefined>();
  const [toTreasuryId, setToTreasuryId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().slice(0, 10));
      setFromTreasuryId(undefined);
      setToTreasuryId(undefined);
      setAmount("");
      setNotes("");
    }
  }, [isOpen]);

  const fromTreasury = useMemo(
    () => treasurys?.find((item) => item.id === fromTreasuryId),
    [treasurys, fromTreasuryId]
  );

  const toTreasury = useMemo(
    () => treasurys?.find((item) => item.id === toTreasuryId),
    [treasurys, toTreasuryId]
  );

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromTreasuryId) {
      notifyError("اختار الخزينة المحول منها");
      return;
    }

    if (!toTreasuryId) {
      notifyError("اختار الخزينة المحول إليها");
      return;
    }

    if (fromTreasuryId === toTreasuryId) {
      notifyError("لا يمكن التحويل لنفس الخزينة");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      notifyError("أدخل مبلغ تحويل صحيح");
      return;
    }

    try {
      await createTransfer({
        fromTreasuryId,
        toTreasuryId,
        amount: Number(amount),
        date,
        notes,
      });

      notifySuccess("تم حفظ التحويل بنجاح");
      onClose();
    } catch (error: any) {
      notifyError(error?.message || "حدث خطأ أثناء حفظ التحويل");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent
        dir={direction}
        className="sm:max-w-[680px] lg:max-w-[700px] p-0 overflow-hidden"
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-xl">
            <ArrowLeftRight size={20} />
            إضافة تحويل داخلي
          </DialogTitle>
          <p className="text-sm text-gray-500">
            قم بتحويل رصيد بين الخزائن الداخلية
          </p>
        </DialogHeader>

        <form
          id="addInternalTransferForm"
          onSubmit={handleSubmit}
          className="max-h-[65vh] overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-5">
            <Field>
              <FieldLabel>تاريخ الحركة</FieldLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={18} className="text-[#2ecc71]" />
                <h3 className="text-base font-bold text-gray-800">من خزينة</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>اختر الخزينة</FieldLabel>
                  <select
                    value={fromTreasuryId ?? ""}
                    onChange={(e) =>
                      setFromTreasuryId(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-[#2ecc71]"
                  >
                    <option value="">اختر الخزينة</option>
                    {(treasurys ?? []).map((treasury) => (
                      <option key={treasury.id} value={treasury.id}>
                        {treasury.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <FieldLabel>الرصيد الحالي</FieldLabel>
                  <Input
                    readOnly
                    value={formatNumber(fromTreasury?.currentBalance)}
                    className="bg-gray-50"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={18} className="text-[#2ecc71]" />
                <h3 className="text-base font-bold text-gray-800">إلى خزينة</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>اختر الخزينة</FieldLabel>
                  <select
                    value={toTreasuryId ?? ""}
                    onChange={(e) =>
                      setToTreasuryId(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-[#2ecc71]"
                  >
                    <option value="">اختر الخزينة</option>
                    {(treasurys ?? []).map((treasury) => (
                      <option key={treasury.id} value={treasury.id}>
                        {treasury.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <FieldLabel>الرصيد الحالي</FieldLabel>
                  <Input
                    readOnly
                    value={formatNumber(toTreasury?.currentBalance)}
                    className="bg-gray-50"
                  />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Field>
                <FieldLabel>مبلغ التحويل</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </Field>

              <Field>
                <FieldLabel>البيان</FieldLabel>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب ملاحظات أو بيان التحويل"
                />
              </Field>
            </div>
          </div>
        </form>

        <DialogFooter className="px-8 py-8 border-t border-gray-100">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>

            <Button
              form="addInternalTransferForm"
              type="submit"
              disabled={isPending}
              className="min-w-[160px]"
            >
              {isPending && <Loader2 size={18} className="animate-spin" />}
              {isPending ? "جارٍ الحفظ..." : "حفظ التحويل"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}