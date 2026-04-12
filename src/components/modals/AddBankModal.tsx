import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "@/components/modals/ResponsiveModal";
import type { Bank } from "@/types";

import { Input } from "@/components/ui/input";

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bank: Omit<Bank, "id" | "currentBalance">) => void;
}

export default function AddBankModal({ isOpen, onClose, onSave }: AddBankModalProps) {
  const { t, direction } = useLanguage();
  const [formData, setFormData] = useState<Omit<Bank, "id" | "currentBalance">>({
    code: "",
    name: "",
    openingBalance: 0,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      code: "",
      name: "",
      openingBalance: 0,
      notes: "",
    });
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t("add_bank")} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)] text-center">{t("please_enter_bank_info")}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">{t("bank_code")} *</label>
            <Input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}  required />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("bank_name")} *</label>
            <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}  required />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("bank_opening_balance")}</label>
            <Input type="number" value={formData.openingBalance} onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}  />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("notes")}</label>
            <Input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}  />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border)]">
          <button type="submit" className="btn-primary !px-12">
            {t("add_bank")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
