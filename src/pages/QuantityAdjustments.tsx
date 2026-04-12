import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, FileText, ArrowRight, ArrowLeft, Edit2, Trash2, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useGetQuantityAdjustments } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustments";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { QuantityAdjustment } from "@/features/quantity-adjustments/types/adjustments.types";
import { FilterMatchMode } from "primereact/api";
import formatDate from "@/lib/formatDate";
import { Input } from "@/components/ui/input";

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuantityAdjustments() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { data: adjustments } = useGetQuantityAdjustments({
    pageNumber: currentPage,
    pageSize: entriesPerPage,
    searchTerm: globalFilterValue,
  });

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
          <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className=" pr-11 pl-4" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);

  return (
    <Card>
      <CardHeader className="max-md:flex max-md:flex-col">
        <CardTitle>{t("quantity_adjustments")}</CardTitle>
        <CardDescription>{t("quantity_adjustments_desc")}</CardDescription>
        <CardAction className="max-md:flex max-md:justify-end max-md:mt-2">
          {" "}
          <Button size="xl" variant={"default"} asChild>
            <Link to={"/products/quantity-adjustments/create"}>{t("add_quantity_adjustment")}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          value={adjustments?.items || []}
          rowsPerPageOptions={[5, 10, 20, 50]}
          lazy
          paginator
          rows={entriesPerPage}
          first={(currentPage - 1) * entriesPerPage}
          totalRecords={adjustments?.totalCount || 0}
          onPage={(e: DataTablePageEvent) => {
            if (e.page === undefined) return;
            setCurrentPage(e.page + 1);
            setEntriesPerPage(e.rows);
          }}
          loading={!adjustments?.items}
          header={header}
          responsiveLayout="stack"
          className="custom-green-table custom-compact-table"
          dataKey="id"
          stripedRows={false}
        >
          <Column header={t("date")} sortable field="operationDate" body={(item: QuantityAdjustment) => formatDate(String(item?.operationDate))} />
          <Column header={t("entered_by")} sortable field={"performedBy"} />
          <Column header={t("note")} sortable field={"مذكرة"} />
          <Column
            header={t("actions")}
            body={(product: QuantityAdjustment) => (
              <div className="space-x-2">
                <Link to={`/products/quantity-adjustments/edit/${product?.id}`} className="btn-minimal-action btn-edit">
                  <Edit2 size={16} />
                </Link>
                <Link to={`/products/quantity-adjustments/view/${product?.id}`} onClick={async () => {}} className="btn-minimal-action btn-view">
                  <Eye size={16} />
                </Link>
              </div>
            )}
          />
        </DataTable>
      </CardContent>
    </Card>
  );
}
