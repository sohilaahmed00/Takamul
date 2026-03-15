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
import AddCustomerModal from "@/components/modals/AddCustomerModal";
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

export default function CustomersList() {
  const { t, direction } = useLanguage();
  // const { customers, deleteCustomer } = useCustomers();
  const { data: customers } = useGetAllCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>();
  const actionButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();
  const { notifyError, notifySuccess } = useToast();
  const { data, refetch } = useGetCustomerById(selectedCustomer ?? undefined);

  useEffect(() => {
    if (activeActionMenu !== null && actionButtonRefs.current[activeActionMenu]) {
      const rect = actionButtonRefs.current[activeActionMenu]!.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [activeActionMenu]);

  // Close menu on scroll or resize
  useEffect(() => {
    const handleScroll = () => setActiveActionMenu(null);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const filteredCustomers = customers
    ?.filter((c) => {
      const term = searchTerm.toLowerCase();

      return c.customerName?.toLowerCase().includes(term) || c.phone?.includes(term) || String(c.customerCode)?.includes(term);
    })
    ?.sort((a, b) => b.id - a.id);

  // const toggleSelectAll = () => {
  //   if (selectedCustomers.length === paginatedCustomers?.length) {
  //     setSelectedCustomers([]);
  //   } else {
  //     setSelectedCustomers(paginatedCustomers?.map((c) => c?.id));
  //   }
  // };

  // const toggleSelectCustomer = (id: number) => {
  //   if (selectedCustomers.includes(id)) {
  //     setSelectedCustomers(selectedCustomers.filter((sid) => sid !== id));
  //   } else {
  //     setSelectedCustomers([...selectedCustomers, id]);
  //   }
  // };

  return (
    <div className="p-4 space-y-4" dir={direction}>
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
            {t("customers")}
          </h1>
          <Button onClick={() => setIsAddModalOpen(true)} variant="default" size={"xl"}>
            <Plus size={20} />
            {t("add_customer")}
          </Button>
          {/* <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus size={20} />
            {t("add_customer")}
          </button> */}
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
      </div>

      <DeleteConfirmationModal
        isOpen={customerToDelete !== null}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          // if (customerToDelete !== null) {
          //   deleteCustomer(customerToDelete);
          //   setCustomerToDelete(null);
          // }
        }}
        itemName={customers?.find((c) => c.id === customerToDelete)?.customerName}
      />

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
            <DataTable responsiveLayout="stack" className="custom-green-table custom-compact-table" value={filteredCustomers} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage(e.page + 1)} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
              {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}

              <Column field="customerCode" header={t("code")} sortable />

              <Column
                header={t("name")}
                sortable
                body={(customer) => (
                  <div className="cell-data-stack">
                    {" "}
                    <span className="customer-name-main">{customer.customerName}</span>
                  </div>
                )}
              />

              <Column field="phone" header={t("phone")} />
              <Column field="taxNumber" header={t("tax_number")} />

              <Column
                header={t("actions")}
                body={(customer) => (
                  <>
                    <button
                      onClick={async () => {
                        setSelectedCustomer(customer?.id);
                        setIsAddModalOpen(true);
                      }}
                      className="btn-minimal-action btn-compact-action"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        const res = await deleteCustomer(customer?.id);
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

      <AddCustomerModal
        customer={data}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCustomer(undefined);
        }}
      />

    </div>
  );
}
