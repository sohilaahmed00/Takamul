import React, { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table } from "@/features/pos/types/pos.types";
import AddTableModal from "@/components/modals/AddTableModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import { useDeleteTable } from "@/features/tables/hooks/useDeleteTable";
import { useGetAllTables } from "@/features/tables/hooks/useGetAllTables";

export default function TablesList() {
  const { t, direction } = useLanguage();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | undefined>();
  const [tableToDelete, setTableToDelete] = useState<number | undefined>();
  const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();

  const { data: tables, isLoading } = useGetAllTables();

  const filteredTables = useMemo(() => {
    if (!tables) return [];
    if (!globalFilterValue) return tables;
    return tables.filter((table) => table.tableName.toLowerCase().includes(globalFilterValue.toLowerCase()));
  }, [tables, globalFilterValue]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  const statusBody = (table: Table) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${table.status === "Free" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{table.status === "Free" ? "متاحة" : "مشغولة"}</span>;

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="pr-11" />
      </div>
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);

  return (
    <div className="p-4 space-y-4" dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle>{t("tables")}</CardTitle>
          <CardDescription>{t("customize_report_below")}</CardDescription>
          <CardAction>
            <Button size="xl" variant="default" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              {t("add_table")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable value={filteredTables} loading={isLoading} header={header} paginator rows={10} responsiveLayout="stack" className="custom-green-table custom-compact-table" dataKey="id" stripedRows={false} emptyMessage={t("no_data") || "لا توجد بيانات"}>
            <Column field="id" header={t("id")} sortable style={{ width: "10%" }} />
            <Column field="tableName" header={"اسم الطاولة"} sortable style={{ width: "40%" }} />
            <Column header={t("status")} style={{ width: "25%" }} body={statusBody} />
            <Column
              header={t("actions")}
              style={{ width: "25%" }}
              body={(table: Table) => (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTable(table.id);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      setTableToDelete(table.id);
                      setIsDeleteModalOpen(true);
                    }} 
                    className="btn-minimal-action"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

      <AddTableModal
        table={tables?.find((t) => t.id === selectedTable)}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedTable(undefined);
        }}
      />

      <DeleteTreasuryDialog
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTableToDelete(undefined);
        }}
        onConfirm={() => {
          if (tableToDelete) {
            deleteTable(tableToDelete, {
              onSuccess: () => {
                setIsDeleteModalOpen(false);
                setTableToDelete(undefined);
              }
            });
          }
        }}
        itemName={tables?.find((t) => t.id === tableToDelete)?.tableName}
        itemLabel={t("table") || "الطاولة"}
        loading={isDeleting}
      />
    </div>
  );
}
