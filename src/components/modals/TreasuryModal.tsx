import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Wallet, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useCreateTreasury } from "@/features/treasurys/hooks/useCreateTreasury";
import { useGetTreasuryById } from "@/features/treasurys/hooks/useGetTreasuryById";
import { useUpdateTreasury } from "@/features/treasurys/hooks/useUpdateTreasury";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  treasuryId?: number;
};

export default function TreasuryModal({ isOpen, onClose, treasuryId }: Props) {
  const { direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const isEdit = !!treasuryId;

  const { data: treasury, isLoading: isTreasuryLoading } = useGetTreasuryById(treasuryId);
  const { mutateAsync: createTreasury, isPending: isCreating } = useCreateTreasury();
  const { mutateAsync: updateTreasury, isPending: isUpdating } = useUpdateTreasury();

  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("0");

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && treasury) {
      setName(treasury.name ?? "");
      setOpeningBalance(String(treasury.openingBalance ?? 0));
    } else {
      setName("");
      setOpeningBalance("0");
    }
  }, [isOpen, isEdit, treasury]);

  const isSubmitting = useMemo(
    () => isCreating || isUpdating,
    [isCreating, isUpdating]
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      notifyError("اسم الخزينة مطلوب");
      return;
    }

    try {
      if (isEdit) {
        await updateTreasury({
          id: treasuryId!,
          name: name.trim(),
          openingBalance: Number(openingBalance || 0),
        });
        notifySuccess("تم تعديل الخزينة بنجاح");
      } else {
        await createTreasury({
          name: name.trim(),
          openingBalance: Number(openingBalance || 0),
        });
        notifySuccess("تمت إضافة الخزينة بنجاح");
      }

      onClose();
    } catch (error: any) {
      notifyError(error?.message || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-white rounded-[28px] overflow-hidden shadow-2xl"
        dir={direction}
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[rgba(49,201,110,0.12)] flex items-center justify-center">
              <Wallet size={22} className="text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)]">
                {isEdit ? "تعديل خزينة" : "إضافة خزينة"}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {isEdit
                  ? "يمكنك تعديل اسم الخزينة والرصيد الافتتاحي"
                  : "أدخل بيانات الخزينة الجديدة"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 md:px-8 py-6 md:py-8 space-y-5">
            {isEdit && isTreasuryLoading ? (
              <div className="py-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--primary)]" size={26} />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--text-main)]">
                    اسم الخزينة <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسم الخزينة"
                    className="w-full h-12 md:h-14 rounded-2xl border border-gray-200 bg-white px-4 md:px-5 outline-none focus:border-[var(--primary)] transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--text-main)]">
                    الرصيد الافتتاحي
                  </label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="0"
                    className="w-full h-12 md:h-14 rounded-2xl border border-gray-200 bg-white px-4 md:px-5 outline-none focus:border-[var(--primary)] transition"
                  />
                </div>
              </>
            )}
          </div>

          <div className="px-6 md:px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 md:h-12 px-5 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting || (isEdit && isTreasuryLoading)}
              className="min-w-[160px] h-11 md:h-12 px-5 rounded-2xl bg-[#31C96E] text-white text-sm md:text-base font-bold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting
                ? "جارٍ الحفظ..."
                : isEdit
                ? "حفظ التعديلات"
                : "إضافة خزينة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}