import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "./ResponsiveModal";
import type { CustomerGroup } from "@/context/CustomerGroupsContext";

interface CustomerGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Omit<CustomerGroup, "id">) => void;
  initialData?: CustomerGroup | null;
}

const CustomerGroupsModal: React.FC<CustomerGroupsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { t, direction } = useLanguage();
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [sellAtCost, setSellAtCost] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPercentage(initialData.percentage);
      setSellAtCost(initialData.sellAtCost);
    } else {
      setName("");
      setPercentage(0);
      setSellAtCost(false);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, percentage, sellAtCost });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t("edit_customer_group") : t("add_customer_group")}
      maxWidth="max-w-[500px]"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)] text-center">
          {t("please_enter_info_below")}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">
              {t("group_name")} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="takamol-input"
              placeholder={t("group_name_placeholder")}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)]">
            <input
              type="checkbox"
              id="sellAtCost"
              checked={sellAtCost}
              onChange={(e) => setSellAtCost(e.target.checked)}
              className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
            <label
              htmlFor="sellAtCost"
              className="text-sm font-bold text-[var(--text-main)] cursor-pointer select-none"
            >
              {t("sell_at_cost")}
            </label>
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t("group_percentage_no_sign")} *
            </label>
            <input
              type="number"
              required
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="takamol-input text-center"
              placeholder="0"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <button type="submit" className="btn-primary w-full">
            <Check size={20} />
            {initialData ? t("update_customer_group") : t("add_customer_group")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default CustomerGroupsModal;