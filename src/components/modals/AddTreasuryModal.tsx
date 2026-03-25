import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "@/components/modals/ResponsiveModal";
import type { Treasury } from "@/types";

interface AddTreasuryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (treasury: Omit<Treasury, "id" | "currentBalance">) => void;
}

export default function AddTreasuryModal({ isOpen, onClose, onSave }: AddTreasuryModalProps) {
    const { t, direction } = useLanguage();
    const [formData, setFormData] = useState<Omit<Treasury, "id" | "currentBalance">>({
        name: "",
        openingBalance: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setFormData({
            name: "",
            openingBalance: 0,
        });
        onClose();
    };

    return (
        <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t("treasury_modal_title_add")} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
                <p className="text-sm text-[var(--text-muted)] text-center">{t("treasury_form_info")}</p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="takamol-label">{t("treasury_name_label")} *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="takamol-input" required />
                    </div>

                    <div className="space-y-2">
                        <label className="takamol-label">{t("treasury_opening_balance")}</label>
                        <input type="number" value={formData.openingBalance} onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })} className="takamol-input text-center" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                    <button type="submit" className="btn-primary !px-12">
                        {t("add_treasury_btn")}
                    </button>
                </div>
            </form>
        </ResponsiveModal>
    );
}
