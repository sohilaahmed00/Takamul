import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "@/components/modals/ResponsiveModal";
import type { Bank } from "@/types";

import { Input } from "@/components/ui/input";

interface EditBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: Bank | null;
  onSave: (id: string, bank: Partial<Bank>) => void;
}

export default function EditBankModal({ isOpen, onClose, bank, onSave }: EditBankModalProps) {
  const { t, direction } = useLanguage();
  const [formData, setFormData] = useState<Partial<Bank>>({
    code: "",
    name: "",
    openingBalance: 0,
    notes: "",
  });

  useEffect(() => {
    if (bank) {
      setFormData({
        code: bank.code,
        name: bank.name,
        openingBalance: bank.openingBalance,
        notes: bank.notes || "",
      });
    }
  }, [bank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bank) {
      onSave(bank.id, formData);
    }
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t("edit_bank")} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)] text-center">{t("please_enter_bank_info")}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">{t("bank_code")}</label>
            <Input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}  required />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("bank_name")}</label>
            <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}  required />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("bank_opening_balance")}</label>
            <Input type="number" value={formData.openingBalance} onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}  required />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("notes")}</label>
            <Input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}  />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border)]">
          <button type="submit" className="btn-primary !px-12">
            {t("edit_bank")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
