import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  mode?: "create";
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function QuantityAdjustmentForm({
  onCancel,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm" dir="rtl">
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold">نموذج تعديل الكمية</h2>
        <p className="text-sm text-slate-500">
          تم توحيد الإنشاء والتعديل داخل الصفحات الجديدة الخاصة بـ Quantity Adjustments.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/products/quantity-adjustments/create")}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
          >
            فتح صفحة الإضافة
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border px-4 py-2"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}