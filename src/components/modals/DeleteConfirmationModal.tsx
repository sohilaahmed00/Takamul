import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "@/components/modals/ResponsiveModal";

interface DeleteConfirmationModalProps {
  key?: React.Key;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, description, itemName }: DeleteConfirmationModalProps) {
  const { t, direction } = useLanguage();

  const defaultTitle = t("confirm_delete_title");
  const defaultDesc = itemName ? t("delete_item_confirm").replace("{{itemName}}", itemName) : t("confirm_delete_desc");

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={title || defaultTitle} maxWidth="max-w-md">
      <div className="p-8 text-center" dir={direction}>
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <AlertTriangle size={40} />
        </div>
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{title || defaultTitle}</h3>
        <p className="text-[var(--text-muted)] mb-8 text-sm leading-relaxed">{description || defaultDesc}</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 btn-secondary">
            {t("cancel")}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 btn-danger"
          >
            {t("confirm_delete_btn")}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
