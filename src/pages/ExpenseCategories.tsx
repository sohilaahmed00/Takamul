import React, { useState } from "react";
import { Folder, Search, Edit, Trash2, Plus, FileUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useExpenseCategories } from "@/context/ExpenseCategoriesContext";
import AddExpenseCategoryModal from "@/components/modals/AddExpenseCategoryModal";
import ImportExpenseCategoryModal from "@/components/modals/ImportExpenseCategoryModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { cn } from "@/lib/utils";
import MobileDataCard from "@/components/MobileDataCard";
import type { ExpenseCategory } from "@/types";

import { Input } from "@/components/ui/input";

export default function ExpenseCategories() {
  const { t, direction, language } = useLanguage();
  const { categories, deleteCategory } = useExpenseCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEdit = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsAddModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter((category) => category.code.toLowerCase().includes(searchTerm.toLowerCase()) || category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <Folder size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("expense_categories")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("customize_report_below")}</p>
        </div>
      </div>

      <DeleteConfirmationModal isOpen={categoryToDelete !== null} onClose={() => setCategoryToDelete(null)} onConfirm={confirmDelete} itemName={categories.find((c) => c.id === categoryToDelete)?.name} />

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64 order-2 md:order-1">
              <Input type="text" placeholder={t("search_placeholder") || "اكتب ما تريد ان تبحث عنه"} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={cn("w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-primary text-sm", direction === "rtl" ? "pr-10" : "pl-10")} />
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", direction === "rtl" ? "right-3" : "left-3")} size={18} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 order-1 md:order-2">
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-sm">
                <Plus size={18} />
                {t("add_expense_category")}
              </button>
              <button onClick={handleImport} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-bold shadow-sm">
                <FileUp size={18} />
                {t("import_expense_categories")}
              </button>
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className={cn("w-full border-collapse", direction === "rtl" ? "text-right" : "text-left")}>
              <thead>
                <tr className="bg-[var(--table-header)] text-white">
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t("category_code")}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t("category_name")}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10 text-center">{t("actions")}</th>
                  <th className="p-3 w-10 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                      {t("no_data_in_table")}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={`desktop-${category.id}`} className="hover:bg-primary/5 transition-colors border-b border-gray-100 dark:border-gray-700">
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 font-bold text-sm">{category.code}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm">{category.name}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(category)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30" title={t("edit")}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30" title={t("delete")}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Input type="checkbox" className="w-4 h-4 accent-primary" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">{t("no_data_in_table")}</div>
            ) : (
              filteredCategories.map((category) => (
                <MobileDataCard
                  key={`mobile-${category.id}`}
                  title={category.name}
                  subtitle={category.code}
                  fields={[]}
                  actions={
                    <div className="flex flex-wrap justify-end gap-2">
                      <button onClick={() => handleEdit(category)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold">
                        <Edit size={16} />
                        {t("edit")}
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold">
                        <Trash2 size={16} />
                        {t("delete")}
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{t("showing")}</span>
              <span className="font-bold text-gray-900 dark:text-white">1</span>
              <span>{t("to")}</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredCategories.length}</span>
              <span>{t("of")}</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredCategories.length}</span>
              <span>{t("records")}</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">{t("previous")}</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">{t("next")}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      <ImportExpenseCategoryModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
}
