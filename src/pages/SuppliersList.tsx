import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Users, Search, Edit2, Trash2, Plus, X, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { Button } from "@/components/ui/button";
import { useGetSupplierById } from "@/features/suppliers/hooks/useGetSupplierById";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

// ===================== API =====================

// ===================== COMPONENT =====================
export default function SuppliersList() {
  const { t, direction } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { data: suppliers, refetch, isFetching } = useGetAllSuppliers();
  const { data: supplierData } = useGetSupplierById(selectedSupplier);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
          <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder") || "البحث..."} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    <div className="p-4 space-y-4" dir={direction}>
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">{t("suppliers")}</span>
      </div>

      <Card>
        <CardHeader className="">
          <CardTitle>الموردين</CardTitle>
          <CardDescription>إدارة الموردين</CardDescription>
          <CardAction>
            <Button variant={"default"} onClick={() => setIsModalOpen(true)}>
              إضافة مورد{" "}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={suppliers?.items || []}
            rowsPerPageOptions={[5, 10, 20, 50]}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={suppliers?.totalCount || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!suppliers?.items}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            stripedRows={false}
          >
            <Column field="supplierName" header={t("name")} sortable />
            <Column field="phone" header={t("phone")} />
            <Column field="taxNumber" header={t("tax_number")} />
            <Column
              header={t("actions")}
              body={(supplier) => (
                <div className="space-x-2">
                  <button
                    onClick={async () => {
                      setSelectedSupplier(supplier?.id);
                      setIsModalOpen(true);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      // const res = await deleteCustomer(customer?.id);
                      // console.log(res);
                      // notifySuccess(res);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

      {/* ADD / EDIT MODAL */}
      <AddParnterModal
        partner={supplierData}
        isOpen={isModalOpen}
        type={"supplier"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(undefined);
        }}
      />
    </div>
  );
}
