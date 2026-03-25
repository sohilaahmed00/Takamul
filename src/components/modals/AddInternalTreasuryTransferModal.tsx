import React, { useEffect, useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useCreateInternalTreasuryTransfer } from "@/features/internal-treasury-transfers/hooks/useCreateInternalTreasuryTransfer";
import type { CreateInternalTreasuryTransferPayload } from "@/features/internal-treasury-transfers/types/internalTreasuryTransfers.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddInternalTreasuryTransferModal({
  isOpen,
  onClose,
}: Props) {
  const { direction } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { mutateAsync: createTransfer, isPending } =
    useCreateInternalTreasuryTransfer();

  const [date, setDate] = useState("");
  const [fromTreasuryId, setFromTreasuryId] = useState<number | undefined>();
  const [toTreasuryId, setToTreasuryId] = useState<number | undefined>();
  const [amount, setAmount] = useState("0");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().slice(0, 10);
      setDate(today);
      setFromTreasuryId(undefined);
      setToTreasuryId(undefined);
      setAmount("0");
      setNotes("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      notifyError("تاريخ الحركة مطلوب");
      return;
    }

    if (!fromTreasuryId) {
      notifyError("يرجى اختيار الخزينة المحول منها");
      return;
    }

    if (!toTreasuryId) {
      notifyError("يرجى اختيار الخزينة المحول إليها");
      return;
    }

    if (fromTreasuryId === toTreasuryId) {
      notifyError("لا يمكن التحويل لنفس الخزينة");
      return;
    }

    const amountNumber = Number(amount || 0);
    if (!amountNumber || amountNumber <= 0) {
      notifyError("مبلغ التحويل يجب أن يكون أكبر من صفر");
      return;
    }

    const payload: CreateInternalTreasuryTransferPayload = {
      fromTreasuryId,
      toTreasuryId,
      amount: amountNumber,
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
    };

    try {
      const result = await createTransfer(payload);

      notifySuccess(
        typeof result === "string" ? result : "تمت إضافة التحويل بنجاح"
      );

      onClose();
    } catch (error: any) {
      notifyError(error?.message || "حدث خطأ أثناء حفظ التحويل");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-white rounded-[20px] shadow-2xl overflow-hidden"
        dir={direction}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
            <ArrowLeftRight size={18} className="text-[var(--primary)]" />
            إضافة تحويل داخلي
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5 space-y-5">
            <div>
              <label className="text-sm text-[var(--text-muted)] mb-1 block">
                تاريخ الحركة
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[var(--text-muted)] mb-1 block">
                  من خزينة
                </label>
                <select
                  value={fromTreasuryId ?? ""}
                  onChange={(e) =>
                    setFromTreasuryId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-[var(--primary)] bg-white"
                >
                  <option value="">اختر الخزينة</option>
                  {(treasurys ?? []).map((treasury) => (
                    <option key={treasury.id} value={treasury.id}>
                      {treasury.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-[var(--text-muted)] mb-1 block">
                  إلى خزينة
                </label>
                <select
                  value={toTreasuryId ?? ""}
                  onChange={(e) =>
                    setToTreasuryId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-[var(--primary)] bg-white"
                >
                  <option value="">اختر الخزينة</option>
                  {(treasurys ?? []).map((treasury) => (
                    <option key={treasury.id} value={treasury.id}>
                      {treasury.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-[var(--text-muted)] mb-1 block">
                مبلغ التحويل
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--text-muted)] mb-1 block">
                بيان
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="اكتب ملاحظات..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary)] resize-none"
              />
            </div>
          </div>

          <div className="px-5 py-4 border-t flex justify-end">
            <Button type="submit" variant="default" size="lg" disabled={isPending}>
              حفظ التحويل
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}