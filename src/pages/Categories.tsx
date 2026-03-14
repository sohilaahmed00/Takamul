import React, { useState } from "react";
import { PlusCircle, Search, ChevronDown, Trash2, Edit, Printer, Image as ImageIcon } from "lucide-react";
import Pagination from "@/components/Pagination";
import AddCategoryModal from "@/components/modals/AddCategoryModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { useLanguage } from "@/context/LanguageContext";
import { useCategories, type Category } from "@/context/CategoriesContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MobileDataCard from "@/components/MobileDataCard";

const Categories = () => {
  const { t, direction, language } = useLanguage();
  const { categories, deleteCategory } = useCategories();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowAddModal(true);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || cat.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete !== null) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">{t("basic_categories")}</span>
      </div>

      {/* Page Header Section */}
      <div className="bg-[var(--bg-card)] p-4 rounded-t-2xl border border-[var(--border)] border-b-0 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            {t("basic_categories")}
            <PlusCircle size={20} className="text-[var(--primary)]" />
          </h1>
          <button onClick={handleAdd} className="btn-primary">
            <PlusCircle size={20} />
            {t("add_category")}
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
      </div>

      <DeleteConfirmationModal isOpen={categoryToDelete !== null} onClose={() => setCategoryToDelete(null)} onConfirm={confirmDelete} itemName={categories.find((c) => c.id === categoryToDelete)?.name} />

      {/* Table Container */}
      <div className="bg-[var(--bg-card)] rounded-b-2xl shadow-sm border border-[var(--border)] p-4 min-h-[400px]">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
              <span>{t("show")}</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-[var(--border)] bg-[var(--input-bg)] rounded-lg px-3 py-1.5 outline-none focus:border-[var(--primary)] transition-all"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <input type="text" placeholder={t("search_placeholder") || "اكتب ما تريد ان تبحث عنه"} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={cn("w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--primary)] transition-all", direction === "rtl" ? "pr-10" : "pl-10")} />
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)]", direction === "rtl" ? "right-3" : "left-3")} size={18} />
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="takamol-table">
              <thead>
                <tr>
                  <th>{t("image")}</th>
                  <th>{t("category_code")}</th>
                  <th>{t("category_name")}</th>
                  <th>Slug</th>
                  <th>{t("main_category")}</th>
                  <th className="w-24">{t("actions")}</th>
                  <th className="w-10">
                    <input type="checkbox" className="rounded w-4 h-4 accent-white" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] italic">
                      {t("no_data_in_table")}
                    </td>
                  </tr>
                ) : (
                  paginatedCategories?.map((category) => (
                    <tr key={`desktop-${category.id}`}>
                      <td>{category.image ? <img src={category.image} alt={category.name} className="w-8 h-8 object-cover mx-auto rounded" referrerPolicy="no-referrer" /> : <ImageIcon size={20} className="mx-auto text-gray-300" />}</td>
                      <td className="font-mono text-xs">{category.code}</td>
                      <td className="font-bold text-[var(--text-main)]">{category.name}</td>
                      <td>{category.slug}</td>
                      <td>{category.mainCategory || "-"}</td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(category)} className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 dark:hover:bg-[var(--primary)]/20 rounded-lg transition-colors border border-[var(--primary)]/20 dark:border-[var(--primary)]/30" title={t("edit")}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 dark:hover:bg-[var(--primary)]/20 rounded-lg transition-colors border border-[var(--primary)]/20 dark:border-[var(--primary)]/30" title={t("delete")}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="text-center">
                        <input type="checkbox" className="w-4 h-4 accent-[var(--primary)]" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {paginatedCategories?.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] italic bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">{t("no_data_in_table")}</div>
            ) : (
              paginatedCategories?.map((category) => (
                <MobileDataCard
                  key={`mobile-${category.id}`}
                  title={category.name}
                  subtitle={category.code}
                  fields={[
                    { label: "Slug", value: category.slug },
                    { label: t("main_category"), value: category.mainCategory || "-" },
                  ]}
                  actions={
                    <div className="flex flex-wrap justify-end gap-2">
                      <button onClick={() => handleEdit(category)} className="btn-secondary !px-3 !py-1.5 !text-xs">
                        <Edit size={14} />
                        {t("edit")}
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="btn-danger !px-3 !py-1.5 !text-xs">
                        <Trash2 size={14} />
                        {t("delete")}
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>

          {/* Pagination Section */}
          <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredCategories.length / itemsPerPage)} totalItems={filteredCategories.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        </div>
      </div>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />
    </div>
  );
};

export default Categories;
