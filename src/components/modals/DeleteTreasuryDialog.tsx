import React from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  open: boolean;
  treasuryName?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteTreasuryDialog({
  open,
  treasuryName,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const { direction } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div
        dir={direction}
        className="w-full max-w-md rounded-[28px] bg-white shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                تأكيد الحذف
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-4">
            <p className="text-sm text-[var(--text-muted)] leading-7">
              هل أنت متأكد أنك تريد حذف الخزينة
              <span className="font-bold text-[var(--text-main)]"> {treasuryName || ""} </span>
              ؟
            </p>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-5 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-11 px-5 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {loading ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </button>
        </div>
      </div>
    </div>
  );
}