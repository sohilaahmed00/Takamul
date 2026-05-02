import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Edit, Trash2, PlusCircle, Search, Check, X, RefreshCw, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "@/context/LanguageContext";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import { useCreateUnit } from "@/features/units/hooks/useCreateUnit";
import { useUpdateUnit } from "@/features/units/hooks/useUpdateUnit";
import { useDeleteUnit } from "@/features/units/hooks/useDeleteUnit";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import UnitModal from "@/components/modals/UnitModal";
import type { Unit } from "@/features/units/types/units.types";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";

const Units = () => {
  const { t, direction } = useLanguage();

  const [SelectedUnit, setSelectedUnit] = useState<Unit | undefined>();
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const hasPermission = useAuthStore((state) => state?.hasPermission);
  const hasAnyPermission = useAuthStore((state) => state?.hasAnyPermission);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: units } = useGetAllUnits({
    page: currentPage,
    size: entriesPerPage,
    search: searchTerm,
  });

  const { mutateAsync: createUnitMutation, isPending: isCreating } = useCreateUnit();
  const { mutateAsync: updateUnitMutation, isPending: isUpdating } = useUpdateUnit();
  const { mutateAsync: deleteUnit, isPending: isDeleting } = useDeleteUnit();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
    name: { value: "", matchMode: FilterMatchMode.CONTAINS },
    description: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));

    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4  items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة الوحدات</CardTitle>
          <CardDescription>إضافة وتعديل وحدات القياس وربطها بالأصناف لضمان دقة العمليات</CardDescription>{" "}
          {hasPermission(Permissions?.units?.add) && (
            <CardAction>
              <Button size="xl" variant={"default"} onClick={() => setIsAddModalOpen(true)}>
                إضافة وحدة
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            value={units?.items}
            totalRecords={units?.totalCount}
            loading={!units?.items}
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
            <Column header={t("name")} field="name" sortable />
            <Column header={t("description")} field="description" />
            {hasAnyPermission([Permissions?.units?.edit, Permissions?.units?.delete]) && (
              <Column
                header={t("actions")}
                body={(unit: Unit) => (
                  <div className="space-x-2">
                    {hasPermission(Permissions?.units?.edit) && (
                      <button
                        onClick={async () => {
                          setSelectedUnit(unit);
                          setIsAddModalOpen(true);
                        }}
                        className="btn-minimal-action btn-compact-action"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {hasPermission(Permissions?.units?.delete) && (
                      <button
                        onClick={async () => {
                          const res = await deleteUnit(unit?.id);
                        }}
                        className="btn-minimal-action btn-compact-action"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              />
            )}
          </DataTable>
        </CardContent>
      </Card>
      <UnitModal
        unit={SelectedUnit}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedUnit(undefined);
        }}
      />
    </>
  );
};

export default Units;
