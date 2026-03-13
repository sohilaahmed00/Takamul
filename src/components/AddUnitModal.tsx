import React, { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "./ResponsiveModal";

type UnitOfMeasure = {
  id: number;
  name: string;
  description?: string;
};

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: UnitOfMeasure | null;

  // دعم الطريقتين عشان الربط يفضل شغال
  onSubmit?: (name: string) => void;
  onAddUnit?: (unitName: string) => void;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({
  isOpen,
  onClose,
  unit,
  onSubmit,
  onAddUnit,
}) => {
  const { t, direction } = useLanguage();
  const [unitName, setUnitName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUnitName(unit?.name || "");
    }
  }, [unit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = unitName.trim();
    if (!value) return;

    const submitHandler = onSubmit || onAddUnit;
    if (!submitHandler) return;

    submitHandler(value);
    setUnitName("");
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        unit
          ? t("edit_unit") || "تعديل وحدة"
          : t("add_new_unit") || "إضافة وحدة جديدة"
      }
      maxWidth="max-w-md"
    >
      <div dir={direction} className="relative">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="unit-modal-content"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl"
            >
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <button
                  onClick={onClose}
                  type="button"
                  className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400"
                  aria-label={t("close") || "إغلاق"}
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 text-[#2ecc71]">
                  <h2 className="text-lg font-bold">
                    {unit
                      ? t("edit_unit") || "تعديل وحدة"
                      : t("add_new_unit") || "إضافة وحدة جديدة"}
                  </h2>
                  <PlusCircle size={20} />
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto"
              >
                <p className="text-sm text-gray-500 text-center">
                  {t("mandatory_fields") ||
                    "برجاء إدخال البيانات المطلوبة. الحقول التي تحمل * إجبارية."}
                </p>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#2ecc71] text-right">
                    {t("unit_name") || "اسم الوحدة"} *
                  </label>
                  <input
                    type="text"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]/20"
                    placeholder={t("unit_name") || "اسم الوحدة"}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {t("cancel") || "إلغاء"}
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#00a65a] text-white hover:bg-[#008d4c] font-bold"
                  >
                    {unit
                      ? t("save_changes") || "حفظ التعديلات"
                      : t("add_new_unit") || "إضافة وحدة جديدة"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveModal>
  );
};

export default AddUnitModal;