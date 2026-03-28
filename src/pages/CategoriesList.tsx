import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
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
import { useDeleteCategory } from "@/features/categories/hooks/useDeleteCategory";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterMatchMode } from "primereact/api";

export default function CategoriesList() {
  const { t, direction } = useLanguage();
  // const { customers, deleteCustomer } = useCustomers();
  const { data: categories } = useGetAllCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const { notifyError, notifySuccess } = useToast();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    categoryNameAr: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4  items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder") || "البحث..."} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة الاصناف</CardTitle>
          <CardDescription>إدارة الأصناف المباشرة والمتفرعة والمجهزة والخامات</CardDescription>
          <CardAction>
            <Button variant={"default"} onClick={() => setIsAddModalOpen(true)}>
              إضافة تصنيف{" "}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={categories}
            totalRecords={categories?.length}
            loading={!categories}
            rowsPerPageOptions={[5, 10, 20, 50]}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            globalFilterFields={["categoryNameAr", "description"]}
            filters={filters}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
          >
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
                <div className="space-x-2">
                  <button
                    onClick={async () => {
                      setSelectedCategory(category);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action btn-edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      const res = await deleteCategory(category?.id);
                    }}
                    className="btn-minimal-action btn-delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>
      <CategoryModal
        category={selectedCategory}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCategory(undefined);
        }}
      />
    </>
  );
}
