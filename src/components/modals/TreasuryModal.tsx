import React, { useEffect, useMemo, useState } from "react";
import { X, Wallet } from "lucide-react";
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
  const { t, direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const isEdit = !!treasuryId;

  const { data: treasury } = useGetTreasuryById(treasuryId);
  const { mutateAsync: createTreasury, isPending: isCreating } = useCreateTreasury();
  const { mutateAsync: updateTreasury, isPending: isUpdating } = useUpdateTreasury();

  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("0");

  useEffect(() => {
    if (isEdit && treasury) {
      setName(treasury.name ?? "");
      setOpeningBalance(String(treasury.openingBalance ?? 0));
    } else if (!isEdit) {
      setName("");
      setOpeningBalance("0");
    }
  }, [isEdit, treasury, isOpen]);

  const isSubmitting = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      notifyError(t("treasury_name_required"));
      return;
    }

    try {
      if (isEdit) {
        await updateTreasury({
          id: treasuryId!,
          name: name.trim(),
          openingBalance: Number(openingBalance || 0),
        });
        notifySuccess(t("treasury_updated_success"));
      } else {
        await createTreasury({
          name: name.trim(),
          openingBalance: Number(openingBalance || 0),
        });
        notifySuccess(t("treasury_added_success"));
      }

      onClose();
    } catch (error: any) {
      notifyError(error?.message || t("something_went_wrong"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div
        className="w-full max-w-3xl bg-white rounded-[28px] overflow-hidden shadow-2xl"
        dir={direction}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            <X size={30} />
          </button>

          <h2 className="text-[20px] font-bold text-[var(--text-main)] flex items-center gap-2">
            <Wallet size={22} className="text-[var(--primary)]" />
            {isEdit ? t("treasury_modal_title_edit") : t("treasury_modal_title_add")}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-10 py-8 space-y-6">
            <p className="text-center text-[15px] text-[var(--text-muted)]">
              {t("treasury_required_fields")}
            </p>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-[var(--text-main)]">
                {t("treasury_name_label")} *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("treasury_name_placeholder")}
                className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-[var(--primary)] transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-[var(--text-main)]">
                {t("treasury_opening_balance")}
              </label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-[var(--primary)] transition"
              />
            </div>
          </div>

          <div className="px-8 py-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[200px] h-14 rounded-2xl bg-[#31C96E] text-white text-2xl font-bold hover:opacity-90 transition disabled:opacity-60"
            >
              {isSubmitting ? t("saving") : isEdit ? t("edit_treasury_save_btn") : t("add_treasury_btn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}