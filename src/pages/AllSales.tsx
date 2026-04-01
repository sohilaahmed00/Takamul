import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Search, Edit2, Trash2, ArrowRight, ArrowLeft, Download, Printer, Menu, LayoutGrid, ShoppingCart, ArrowUp, ArrowDown, PlusCircle, DollarSign, FileSpreadsheet, Mail, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ResponsiveModal } from "@/components/modals/ResponsiveModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { useGetAllSales } from "../features/sales/hooks/useGetAllSales";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FilterMatchMode } from "primereact/api";
import type { SalesOrder } from "@/features/sales/types/sales.types";

export default function AllSales() {
  type Payment = SalesOrder["payments"][number];
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: salesOrders } = useGetAllSales(currentPage, entriesPerPage);
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
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1 font-medium px-2">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>
          {t("home")}
        </span>
        <span>/</span>
        <span className="text-gray-800">{t("sales")}</span>
      </div>

      <Card>
        <CardHeader className="">
          <CardTitle>المبيعات</CardTitle>
          <CardDescription>يمكنك إدارة ، إضافة ، تعديل فواتير البيع الخاصة بك</CardDescription>
          <CardAction>
            <Button variant={"default"} asChild>
              <Link to={"/sales/create"}>إضافة فاتورة مبيعات</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={salesOrders?.items || []}
            rowsPerPageOptions={[5, 10, 20, 50]}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={salesOrders?.totalCount || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!salesOrders?.items}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            stripedRows={false}
          >
            <Column header={"رقم الفاتورة"} sortable field="orderNumber" />
            <Column header="التاريخ" sortable field="orderDate" body={(row) => new Date(row.orderDate).toLocaleDateString("ar-EG")} />
            <Column header={"اسم العميل"} sortable field="customerName" />
            <Column header={"الكاشير"} sortable field="createdBy" />
            <Column header={"حالة الفاتورة"} sortable field="orderStatus" />
            <Column header={"المجموع الكلي"} sortable field="grandTotal" />
            <Column header={"المدفوع"} sortable field="payments" body={(rowData) => rowData.payments?.reduce((sum: number, p: Payment) => sum + p.amount, 0) ?? 0} />
            {/* <Column header={"المبلغ المتبقي"} sortable field="" /> */}
            <Column
              header={t("actions")}
              body={(row) => (
                <div className="flex gap-2">
                  <Link to={`/sales/edit/${row?.id}`} className="btn-minimal-action btn-compact-action">
                    <Edit2 size={16} />
                  </Link>
                  <button onClick={() => {}} className="btn-minimal-action btn-compact-action text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
       
      </Card>
    </div>
  );
}
