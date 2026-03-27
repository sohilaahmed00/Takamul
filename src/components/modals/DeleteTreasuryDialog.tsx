import { X, AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DeleteDialogProps = {
  open: boolean;
  itemName?: string;
  itemLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteTreasuryDialog({
  open,
  itemName,
  itemLabel = "العنصر",
  loading,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    تأكيد الحذف
                  </h2>
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-100">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-4 text-center">
                <p className="text-sm text-gray-500">
                  هذا الإجراء لا يمكن التراجع عنه
                </p>
              </div>

              {/* Question */}
              <div className="px-5 pb-4">
                <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center text-sm text-gray-700">
                  {itemName
                    ? `هل أنت متأكد أنك تريد حذف ${itemLabel} ${itemName}؟`
                    : `هل أنت متأكد أنك تريد حذف ${itemLabel}؟`}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 px-5 pb-5">
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {loading ? "جارٍ الحذف..." : "تأكيد الحذف"}
                </button>

                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}