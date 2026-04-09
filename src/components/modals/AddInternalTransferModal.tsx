import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useBanks } from "@/context/BanksContext";
import type { InternalTransfer } from "@/types";
import ComboboxField from "@/components/ui/ComboboxField";

interface AddInternalTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transfer: Omit<InternalTransfer, "id" | "date">) => void;
}

export default function AddInternalTransferModal({
  isOpen,
  onClose,
  onSave,
}: AddInternalTransferModalProps) {
  const { t, direction } = useLanguage();
  const { banks } = useBanks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<InternalTransfer, "id" | "date">>({
    type: "",
    from: "",
    to: "",
    amount: 0,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      onSave(formData);
      setFormData({
        type: "",
        from: "",
        to: "",
        amount: 0,
        notes: "",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("add_internal_transfer")}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)]">
          {t("please_enter_transfer_info")}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t("select_transfer_type")} *
            </label>
            <ComboboxField
              value={formData.type}
              onValueChange={(val) => setFormData({ ...formData, type: val })}
              placeholder={t("select_transfer_type")}
              items={[
                { value: "fund_to_bank", label: t("transfer_from_fund") },
                { value: "bank_to_fund", label: t("transfer_to_fund") },
              ]}
              valueKey="value"
              labelKey="label"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t("fund_balance")} : 0
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t("select_bank")} *
            </label>
            <ComboboxField
              value={formData.type === "fund_to_bank" ? formData.to : formData.from}
              onValueChange={(val) => {
                if (formData.type === "fund_to_bank") {
                  setFormData({ ...formData, to: val, from: "Fund" });
                } else {
                  setFormData({ ...formData, from: val, to: "Fund" });
                }
              }}
              items={banks}
              valueKey="name"
              labelKey="name"
              placeholder={t("select_bank")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t("paid_amount")} *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="takamol-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t("notes")}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="takamol-input"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#006437] text-white rounded-lg hover:bg-[#006437]/90 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? t("saving") : t("add_internal_transfer")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}