import { useGetAllSales } from "@/features/sales/hooks/useGetAllSales";
import { SalesOrder } from "@/features/sales/types/sales.types";
import formatDate from "@/lib/formatDate";
import { Eye, SaudiRiyal } from "lucide-react";
import { useState, useMemo } from "react";
import { usePos } from "@/context/PosContext";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";

import { Input } from "@/components/ui/input";

export default function OrdersPage() {
  const { setSelectedOrderId, selectedOrderId } = usePos();
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: orders } = useGetAllSales({
    page: currentPage,
    limit: entriesPerPage,
    OrderType: "POS",
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const renderHeader = () => (
    <div className="flex items-center">
      <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search Order Id or Customers" className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-primaary focus:bg-white text-gray-700 text-sm rounded-lg py-2 px-3  transition-all outline-none" />
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue]);

  return (
    <div className="p-4 bg-gray-50 h-full">
      <DataTable
        value={orders?.items || []}
        lazy
        paginator
        rows={entriesPerPage}
        first={(currentPage - 1) * entriesPerPage}
        totalRecords={orders?.totalCount || 0}
        onPage={(e: DataTablePageEvent) => {
          if (e.page === undefined) return;
          setCurrentPage(e.page + 1);
          setEntriesPerPage(e.rows);
        }}
        loading={!orders}
        header={header}
        responsiveLayout="scroll"
        dataKey="id"
        className="custom-green-table custom-compact-table"
        selectionMode="single"
        selection={orders?.items?.find((o) => o.id === selectedOrderId)}
        onSelectionChange={(e) => {
          const selected = e.value as SalesOrder;
          setSelectedOrderId(selected?.id);
        }}
      >
        <Column field="orderNumber" header="Order ID" sortable />

        <Column field="orderDate" header="Date" sortable body={(row: SalesOrder) => formatDate(row.orderDate)} />

        <Column
          field="grandTotal"
          header="Total Sales"
          sortable
          body={(row: SalesOrder) => (
            <span className="inline-flex items-center gap-1">
              {row.grandTotal.toFixed(2)}
              <SaudiRiyal size={12} />
            </span>
          )}
        />

        <Column
          header="العمليات"
          body={(row: SalesOrder) => (
            <button onClick={() => setSelectedOrderId(row.id)} className="btn-minimal-action btn-view">
              <Eye size={16} />
            </button>
          )}
        />
      </DataTable>
    </div>
  );
}
