import React, { useState } from "react";
import { Save } from "lucide-react";
import ResponsiveModal from "./ResponsiveModal";
import { useLanguage } from "@/context/LanguageContext";
import { useUsers } from "@/context/UsersContext";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { t, direction } = useLanguage();
  const { addUser } = useUsers();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    usernameEmail: "",
    phone: "",
    group: "Admin",
    status: "active" as const,
    company: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("add_user") || "إضافة مستخدم"}
      maxWidth="max-w-2xl"
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("first_name")}</label>
            <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("last_name")}</label>
            <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("email")}</label>
          <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("username_email")}</label>
          <input type="text" required value={formData.usernameEmail} onChange={(e) => setFormData({ ...formData, usernameEmail: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("phone")}</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("group")}</label>
            <select value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm">
              <option value="Admin">Admin</option>
              <option value="Cashier">Cashier</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("company")}</label>
          <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 text-sm" />
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default AddUserModal;
