import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "@/components/modals/ResponsiveModal";
import type { Treasury } from "@/types";

interface EditTreasuryModalProps {
    isOpen: boolean;
    onClose: () => void;
    treasury: Treasury | null;
    onSave: (id: number, treasury: Partial<Treasury>) => void;
}

export default function EditTreasuryModal({ isOpen, onClose, treasury, onSave }: EditTreasuryModalProps) {
    const { t, direction } = useLanguage();
    const [formData, setFormData] = useState<Partial<Treasury>>({
        name: "",
        openingBalance: 0,
    });

    useEffect(() => {
        if (treasury) {
            setFormData({
                name: treasury.name,
                openingBalance: treasury.openingBalance,
            });
        }
    }, [treasury]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (treasury) {
            onSave(treasury.id, formData);
        }
        onClose();
    };

    return (
        <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t("treasury_modal_title_edit")} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
                <p className="text-sm text-[var(--text-muted)] text-center">{t("treasury_form_info")}</p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="takamol-label">{t("treasury_name_label")}</label>
                        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="takamol-input" required />
                    </div>

                    <div className="space-y-2">
                        <label className="takamol-label">{t("treasury_opening_balance")}</label>
                        <input type="number" value={formData.openingBalance || 0} onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })} className="takamol-input text-center" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                    <button type="submit" className="btn-primary !px-12">
                        {t("edit_treasury_save_btn")}
                    </button>
                </div>
            </form>
        </ResponsiveModal>
    );
}
