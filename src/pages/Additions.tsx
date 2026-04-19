import { Search, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useGetAllAdditions } from "@/features/Additions/hooks/useGetAllAdditions";
import type { Addition } from "@/features/Additions/types/additions.types";
import AdditionModal from "@/components/modals/AdditionModal";
import { useDeleteAddition } from "@/features/Additions/hooks/useDeleteAddition";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export default function Additions() {
  const { t, direction, language } = useLanguage();
  const { data: additions } = useGetAllAdditions();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddition, setSelectedAddition] = useState<Addition | undefined>();
  const { mutateAsync: deleteAddition } = useDeleteAddition();
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };

  const filteredAdditions = useMemo(() => {
    const term = globalFilterValue.trim().toLowerCase();
    const rows = additions ?? [];
    if (!term) return rows;

    return rows.filter(
      (addition: Addition) =>
        String(addition.additionNameAr || "")
          .toLowerCase()
          .includes(term) ||
        String(addition.additionNameEn || "")
          .toLowerCase()
          .includes(term) ||
        String(addition.additionNameUr || "")
          .toLowerCase()
          .includes(term),
    );
  }, [additions, globalFilterValue]);

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
    <div dir={direction}>
      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{t("manage_additions_title") || "إدارة الإضافات"}</CardTitle>
          <CardDescription>{t("manage_additions_desc") || "إدارة الإضافات الخاصة بالأصناف مثل الخيارات الإضافية والتعديلات التي يمكن تطبيقها على المنتجات داخل النظام."}</CardDescription>
          <CardAction className="max-md:flex max-md:justify-end max-md:mt-2">
            <Button size="xl" variant="default" onClick={() => setIsAddModalOpen(true)}>
              {t("add_new_addition") || "إضافة جديدة"}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DataTable
            value={filteredAdditions}
            totalRecords={filteredAdditions?.length}
            loading={!additions}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            emptyMessage={t("no_data")}
          >
            <Column
              header={t("name")}
              sortable
              body={(addition: Addition) => (
                <div className="cell-data-stack">
                  <span className="customer-name-main">{language === "en" ? addition.additionNameEn || addition.additionNameAr : language === "ur" ? addition.additionNameUr || addition.additionNameAr : addition.additionNameAr}</span>
                </div>
              )}
            />

            <Column
              header={t("actions")}
              body={(addition) => (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAddition(addition);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={async () => {
                      await deleteAddition(addition?.id);
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

      <AdditionModal
        addition={selectedAddition}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedAddition(undefined);
        }}
      />
    </div>
  );
}
