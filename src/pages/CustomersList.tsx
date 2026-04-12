import React, { useState } from "react";
import { Search, Edit2, Trash2, Plus, UserPlus, Phone, Hash, MapPin, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer";
import useToast from "@/hooks/useToast";
import { useGetCustomerById } from "@/features/customers/hooks/useGetCustomerById";
import AddParnterModal from "@/components/modals/AddParnterModal";

import { Input } from "@/components/ui/input";

export default function CustomersList() {
  const { t, direction } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isLoading } = useGetAllCustomers({ page: currentPage, limit: entriesPerPage });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>();
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const { notifyError } = useToast();
  const { data: customerData } = useGetCustomerById(selectedCustomer ?? undefined);

  const customers = response?.items || [];

  const filteredCustomers = Array.isArray(customers)
    ? customers
        .filter((c) => {
          const term = searchTerm.toLowerCase();
          return c.customerName?.toLowerCase().includes(term) || c.phone?.includes(term) || String(c.customerCode || "").includes(term);
        })
        .sort((a, b) => (b.id || 0) - (a.id || 0))
    : [];

  return (
    <div className="p-4 space-y-4" dir={direction}>
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span> / <span className="text-[var(--text-main)] font-medium">{t("customers")}</span>
      </div>

      <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <UserPlus size={20} className="text-[var(--primary)]" />
            {t("customers")}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} variant="default" size="xl">
          <Plus size={20} />
          {t("add_customer")}
        </Button>
      </div>

      <div className="bg-white rounded-lg p-4 min-h-100 shadow-sm">
        <div className="space-y-4">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("search_placeholder")} className="w-full bg-[#f8fafc] dark:bg-slate-900 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm rounded-xl py-3 pr-11 pl-4 transition-all outline-none" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {isLoading ? (
              <div className="text-center p-10 text-gray-400">{t("loading")}...</div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <UserPlus size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{customer.customerName}</h3>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Hash size={12} /> {customer.customerCode}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer.id);
                          setIsAddModalOpen(true);
                        }}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteCustomer(customer.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      <span>{customer.phone || t("no_phone")}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <MapPin size={16} className="text-gray-400" />
                      <span>
                        {customer.city} - {customer.address}
                      </span>
                    </div>
                    {customer.taxNumber && (
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <CreditCard size={16} className="text-gray-400" />
                        <span>{customer.taxNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {filteredCustomers.length === 0 && !isLoading && <div className="text-center py-10 text-gray-400">{t("no_customers_found")}</div>}
          </div>

          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100">
            <DataTable value={filteredCustomers} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage((e.page ?? 0) + 1)} dataKey="id" loading={isLoading} className="custom-green-table" emptyMessage={t("no_customers_found")}>
              <Column field="customerCode" header={t("code")} sortable style={{ width: "10%" }} />
              <Column field="customerName" header={t("name")} sortable style={{ width: "30%" }} />
              <Column field="phone" header={t("phone")} style={{ width: "20%" }} />
              <Column field="city" header={t("city")} style={{ width: "20%" }} />
              <Column
                header={t("actions")}
                style={{ width: "20%" }}
                body={(customer) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer.id);
                        setIsAddModalOpen(true);
                      }}
                      className="btn-minimal-action"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(t("confirm_delete"))) {
                          try {
                            await deleteCustomer(customer.id);
                          } catch (error: any) {
                            notifyError(error?.message || t("delete_customer_error"));
                          }
                        }
                      }}
                      className="btn-minimal-action"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>

      <AddParnterModal
        partner={customerData}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCustomer(undefined);
        }}
      />
    </div>
  );
}
