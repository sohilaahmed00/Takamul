import React, { useState, useRef, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, UserPlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer";
import useToast from "@/hooks/useToast";
import { useGetCustomerById } from "@/features/customers/hooks/useGetCustomerById";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

export default function CustomersList() {
  const { t, direction } = useLanguage();
  // const { customers, deleteCustomer } = useCustomers();
  const { data: customers } = useGetAllCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>();
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();
  const { notifyError, notifySuccess } = useToast();
  const { data } = useGetCustomerById(selectedCustomer ?? undefined);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    customerCode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
    taxNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
      <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4 relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder") || "البحث برقم الهاتف، الكود، أو الاسم..."} className="placeholder:font-semibold w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-primary focus:bg-white text-gray-700 text-sm rounded-xl py-3 pr-11 pl-4 transition-all outline-none" />{" "}
      </div>
    );
  };

  const header = renderHeader();

  const filteredCustomers = customers
    ?.filter((c) => {
      const term = searchTerm.toLowerCase();

      return c.customerName?.toLowerCase().includes(term) || c.phone?.includes(term) || String(c.customerCode)?.includes(term);
    })
    ?.sort((a, b) => b.id - a.id);

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

      {/* Table Container */}
      <div className="bg-white rounded-lg    p-4 min-h-100">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4 relative">
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
          {/* Table - Desktop */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <DataTable filters={filters} filterDisplay="row" responsiveLayout="stack" className="custom-green-table custom-compact-table" value={filteredCustomers} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage(e.page + 1)} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
              {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}

              <Column field="customerCode" header={t("code")} sortable />

              <Column
                header={t("name")}
                sortable
                style={{ minWidth: "15rem", width: "28%" }}
                field="customerName"
                filterPlaceholder={t("search_name")} // إضافة نص مساعد
                body={(customer) => (
                  <div className="cell-data-stack">
                    <span className="customer-name-main">{customer.customerName}</span>
                  </div>
                )}
              />

              <Column style={{ width: "25%" }} filterPlaceholder={t("search_phone")} field="phone" header={t("phone")} />

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

      <AddParnterModal
        partner={data}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCustomer(undefined);
        }}
      />
    </div>
  );
}
