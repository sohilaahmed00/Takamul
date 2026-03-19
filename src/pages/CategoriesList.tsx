import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Search, Edit2, Trash2, Plus, FileText, ChevronRight, ChevronLeft, UserPlus, CreditCard, List, Minus, PlusCircle, ChevronDown, Wallet, ArrowDownCircle, ArrowUpCircle, History, Printer, Menu, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomers, type Customer } from "@/context/CustomersContext";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/Pagination";
import { cn } from "@/lib/utils";
import MobileDataCard from "@/components/MobileDataCard";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import AddCustomerModal from "@/components/modals/AddParnterModal";
import EditCustomerModal from "@/components/modals/EditCustomerModal";
import AddDepositModal from "@/components/modals/AddDepositModal";
import AddDiscountModal from "@/components/modals/AddDiscountModal";
import ViewPaymentsModal from "@/components/modals/ViewPaymentsModal";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer";
import useToast from "@/hooks/useToast";
import { useGetCustomerById } from "@/features/customers/hooks/useGetCustomerById";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { useGetAllCategories } from "@/features/categories/hooks/useGetAllCategories";
import type { Category } from "@/features/categories/types/categories.types";
import CategoryModal from "@/components/modals/CategoryModal";
import { useGetCategoryById } from "@/features/categories/hooks/useGetSupplierById";

export default function CategoriesList() {
  const { t, direction } = useLanguage();
  // const { customers, deleteCustomer } = useCustomers();
  const { data: categories } = useGetAllCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();
  const { notifyError, notifySuccess } = useToast();
  // const { data, refetch } = useGetCategoryById(selectedCategory ?? undefined);

  const filteredCategories = categories
    ?.filter((c) => {
      const term = searchTerm.toLowerCase();

      return c.categoryNameAr?.toLowerCase().includes(term) || c.description?.includes(term);
    })
    ?.sort((a, b) => b.id - a.id);

  return (
    <div className="p-4 space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">{t("customers")}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-lg   ">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <UserPlus size={20} className="text-[var(--primary)]" />
            التصنيفات
          </h1>
          <Button onClick={() => setIsAddModalOpen(true)} variant="default" size={"xl"}>
            <Plus size={20} />
            إضافة تضنيف
          </Button>
          {/* <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus size={20} />
            {t("add_customer")}
          </button> */}
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg    p-4 min-h-100">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t("search_placeholder") || "البحث برقم الهاتف، الكود، أو الاسم..."}
                className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-primary focus:bg-white text-gray-700 text-sm rounded-xl py-3 pr-11 pl-4 transition-all outline-none"
              />{" "}
            </div>

            {/* <div className="flex gap-3 shrink-0">
              <button className="flex items-center gap-2 bg-[#f8fafc] hover:bg-gray-100 text-gray-600 border border-transparent text-sm font-medium rounded-xl px-4 py-3 transition-colors">
                <SlidersHorizontal size={16} className="text-gray-400" />
                <span>{t("filters") || "الفلاتر"}</span>
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>

              <button className="flex items-center gap-2 bg-[#f8fafc] hover:bg-gray-100 text-gray-600 border border-transparent text-sm font-medium rounded-xl px-4 py-3 transition-colors">
                <span>{t("recent_customers") || "أحدث العملاء"}</span>
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
            </div> */}
          </div>
          {/* Table - Desktop */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <DataTable responsiveLayout="stack" className="custom-green-table custom-compact-table" value={filteredCategories} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage(e.page + 1)} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
              {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}

              <Column
                header={t("name")}
                sortable
                body={(cat: Category) => (
                  <div className="cell-data-stack">
                    {" "}
                    <span className="customer-name-main">{cat.categoryNameAr}</span>
                  </div>
                )}
              />

              <Column field="description" header={t("description")} />
              <Column
                header={t("actions")}
                body={(category) => (
                  <>
                    <button
                      onClick={async () => {
                        setSelectedCategory(category);
                        setIsAddModalOpen(true);
                      }}
                      className="btn-minimal-action btn-compact-action"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        const res = await deleteCustomer(category?.id);
                        console.log(res);
                        notifySuccess(res);
                      }}
                      className="btn-minimal-action btn-compact-action"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>

      <CategoryModal
        category={selectedCategory}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCategory(undefined);
        }}
      />
    </div>
  );
}
