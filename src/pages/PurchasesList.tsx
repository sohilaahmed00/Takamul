import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, FileText, LayoutGrid, ChevronRight, ChevronLeft, Filter, ArrowUpDown, CheckSquare, Square, Plus, Edit2, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PurchaseStatus, PaymentStatus } from "@/types";
import { usePurchases } from "@/context/PurchasesContext";
import MobileDataCard from "@/components/MobileDataCard";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useGetAllPurchases } from "@/features/purchases/hooks/useGetAllSales";
import type { Purchase } from "@/features/purchases/types/purchase.types";
import { useLanguage } from "@/context/LanguageContext";
import formatDate from "@/lib/formatDate";
import Datatable from "@/components/Datatable";

export default function PurchasesList() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // const { purchases, addPurchase, updatePurchase, deletePurchase } = usePurchases();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const { data: purchases } = useGetAllPurchases({ page: currentPage, limit: entriesPerPage, searchTerm: globalFilterValue });
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

    
    <Card>
      <CardHeader>
        <CardTitle>إدارة المشتريات </CardTitle>
        <CardDescription>تسجيل ومتابعة عمليات الشراء وإدارة الموردين لضمان دقة المخزون والتكاليف</CardDescription>{" "}
        <CardAction>
          <Button variant={"default"} asChild>
            <Link to={"/purchases/create"}>إضافة فاتورة مشتريات</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          value={purchases?.items}
          totalRecords={purchases?.totalCount}
          loading={!purchases?.items}
          rowsPerPageOptions={[5, 10, 20, 50]}
          lazy
          paginator
          rows={entriesPerPage}
          first={(currentPage - 1) * entriesPerPage}
          onPage={(e: DataTablePageEvent) => {
            if (e.page === undefined) return;
            setCurrentPage(e.page + 1);
            setEntriesPerPage(e.rows);
          }}
          header={renderHeader}
          responsiveLayout="stack"
          className=""
          dataKey="id"
        >
          <Column header={"التاريخ"} sortable body={(purchase: Purchase) => formatDate(purchase.orderDate)} />
          <Column header={"رقم الفاتورة"} field="purchaseOrderNumber" sortable />
          <Column header={"اسم المورد"} field="supplierName" sortable />
          <Column header={"حالة عملية الشراء"} field="orderStatus" sortable />
          <Column
            header={t("actions")}
            body={(purchase) => (
              <div className="space-x-2">
                <Link to={`/purchases/edit/${purchase?.id}`} onClick={async () => {}} className="btn-minimal-action btn-edit">
                  <Edit2 size={16} />
                </Link>
                <button onClick={async () => {}} className="btn-minimal-action btn-delete">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        </Datatable>
      </CardContent>
    </Card>
  );
}
