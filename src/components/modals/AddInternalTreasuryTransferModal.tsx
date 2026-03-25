import React, { useMemo, useState } from "react";
import { ArrowLeftRight, CalendarDays, Loader2, Wallet, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useCreateInternalTreasuryTransfer } from "@/features/internal-treasury-transfers/hooks/useCreateInternalTreasuryTransfer";
import useToast from "@/hooks/useToast";

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

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [fromTreasuryId, setFromTreasuryId] = useState<number | undefined>();
  const [toTreasuryId, setToTreasuryId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

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

  const resetForm = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setFromTreasuryId(undefined);
    setToTreasuryId(undefined);
    setAmount("");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
      handleClose();
    } catch (error: any) {
      notifyError(error?.message || "حدث خطأ أثناء حفظ التحويل");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div
        dir={direction}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">          <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center">
            <ArrowLeftRight size={22} className="text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)]">
              إضافة تحويل داخلي
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              قم بتحويل رصيد بين الخزائن الداخلية
            </p>
          </div>
        </div>

          <button
            type="button"
            onClick={handleClose}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--text-main)]">
                تاريخ الحركة
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 md:h-11 rounded-2xl border border-gray-200 bg-white px-4 md:px-5 outline-none focus:border-[var(--primary)] transition"
                />
                {/* <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                /> */}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-gray-100 p-4 space-y-4 bg-[#fcfcfc]">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-[var(--primary)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    من خزينة
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-main)]">
                      اختر الخزينة
                    </label>
                    <select
                      value={fromTreasuryId ?? ""}
                      onChange={(e) =>
                        setFromTreasuryId(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 outline-none focus:border-[var(--primary)] transition"
                    >
                      <option value="">اختر الخزينة</option>
                      {(treasurys ?? []).map((treasury) => (
                        <option key={treasury.id} value={treasury.id}>
                          {treasury.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-main)]">
                      الرصيد الحالي
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formatNumber(fromTreasury?.currentBalance)}
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-[#f8fafc] px-4 text-gray-600 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 space-y-4 bg-[#fcfcfc]">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-[var(--primary)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    إلى خزينة
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-main)]">
                      اختر الخزينة
                    </label>
                    <select
                      value={toTreasuryId ?? ""}
                      onChange={(e) =>
                        setToTreasuryId(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 outline-none focus:border-[var(--primary)] transition"
                    >
                      <option value="">اختر الخزينة</option>
                      {(treasurys ?? []).map((treasury) => (
                        <option key={treasury.id} value={treasury.id}>
                          {treasury.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-main)]">
                      الرصيد الحالي
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formatNumber(toTreasury?.currentBalance)}
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-[#f8fafc] px-4 text-gray-600 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-main)]">
                  مبلغ التحويل
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-12 md:h-11 rounded-2xl border border-gray-200 bg-white px-4 md:px-5 outline-none focus:border-[var(--primary)] transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-main)]">
                  البيان
                </label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب ملاحظات أو بيان التحويل"
                  className="w-full h-12 md:h-11 rounded-2xl border border-gray-200 bg-white px-4 md:px-5 outline-none focus:border-[var(--primary)] transition"
                />
              </div>
            </div>
          </div>

          <div className="px-6 md:px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="h-11 md:h-12 px-5 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="min-w-[160px] h-11 md:h-12 px-5 rounded-2xl bg-[#31C96E] text-white text-sm md:text-base font-bold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 size={18} className="animate-spin" />}
              {isPending ? "جارٍ الحفظ..." : "حفظ التحويل"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}