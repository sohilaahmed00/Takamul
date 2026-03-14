import React, { useState } from "react";
import { Save, Plus, Trash2, Search } from "lucide-react";
import ResponsiveModal from "./ResponsiveModal";
import { useLanguage } from "@/context/LanguageContext";
import { useQuotes } from "@/context/QuotesContext";

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddQuoteModal: React.FC<AddQuoteModalProps> = ({ isOpen, onClose }) => {
  const { t, direction } = useLanguage();
  const { addQuote } = useQuotes();
  const [formData, setFormData] = useState({
    customer: "",
    refNo: "",
    date: new Date().toISOString().split("T")[0],
    status: "pending" as const,
    items: [] as any[],
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuote({
      ...formData,
      quoteNo: `QUO-${Math.floor(Math.random() * 10000)}`,
      total: formData.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      cashier: "Admin",
    });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("add_quote") || "إضافة عرض سعر"}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {t("cancel")}
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-bold shadow-sm">
            <Save size={18} />
            {t("save")}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("customer")}</label>
            <input type="text" required value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("ref_no")}</label>
            <input type="text" value={formData.refNo} onChange={(e) => setFormData({ ...formData, refNo: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("date")}</label>
            <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
          </div>
        </div>

        {/* Items Table Placeholder */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--table-header)] text-white">
              <tr>
                <th className="p-3 text-right font-bold">{t("product")}</th>
                <th className="p-3 text-center font-bold">{t("quantity")}</th>
                <th className="p-3 text-center font-bold">{t("price")}</th>
                <th className="p-3 text-center font-bold">{t("total")}</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                  {t("no_items_added") || "لا توجد أصناف مضافة"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("note")}</label>
          <textarea rows={3} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default AddQuoteModal;
