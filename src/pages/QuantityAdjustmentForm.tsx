import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  mode?: "create";
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function QuantityAdjustmentForm({
  onCancel,
}: Props) {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm" dir={direction}>
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold">{t("add_quantity_adjustment")}</h2>
        <p className="text-sm text-slate-500">
          {t("qty_adjustment_unified_note")}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/products/quantity-adjustments/create")}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
          >
            {t("open_add_page")}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border px-4 py-2"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}