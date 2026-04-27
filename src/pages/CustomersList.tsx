import React, { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus, UserPlus, Phone, Hash, MapPin, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer";
import useToast from "@/hooks/useToast";
import { useGetCustomerById } from "@/features/customers/hooks/useGetCustomerById";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CustomersList() {
  const { t, direction } = useLanguage();

  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { data: customers, isLoading } = useGetAllCustomers({ page: currentPage, limit: entriesPerPage, searchTerm: globalFilterValue });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>();
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const { notifyError } = useToast();
  const { data: customerData } = useGetCustomerById(selectedCustomer ?? undefined);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className=" pr-11 " />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    <div className="p-4 space-y-4" dir={direction}>
      <Card>
        <CardHeader className="">
          <CardTitle> {t("customers")}</CardTitle>
          <CardDescription>{t("customize_report_below")}</CardDescription>
          <CardAction>
            <Button size="xl" variant={"default"} onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              {t("add_customer")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={customers?.items || []}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={customers?.totalCount || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!customers?.items}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            stripedRows={false}
          >
            <Column field="id" header={t("code")} sortable style={{ width: "10%" }} />
            <Column field="customerName" header={t("name")} sortable style={{ width: "30%" }} />
            <Column field="phone" header={t("phone")} style={{ width: "20%" }} />
            <Column
              header={t("actions")}
              style={{ width: "20%" }}
              body={(customer) => (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer.id);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button onClick={async () => await deleteCustomer(customer.id)} className="btn-minimal-action">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

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
