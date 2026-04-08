// OrdersPage.tsx
import { useGetAllSales } from "@/features/sales/hooks/useGetAllSales";
import { SalesOrder } from "@/features/sales/types/sales.types";
import formatDate from "@/lib/formatDate";
import { Eye, SaudiRiyal } from "lucide-react";
import { useState } from "react";
import { usePos } from "@/context/PosContext";
import OrderDetailPanel from "../orders/OrderDetailPanel";

const ORDER_TABS = ["Order History", "Order On Hold", "Offline Order"] as const;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<(typeof ORDER_TABS)[number]>("Order History");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // ── Pull setSelectedTable from POS context so the panel can fetch by tableId ─
  // The order list returns a tableId per order; store it on eye-click.
  const { setSelectedTable } = usePos();

  const { data: orders } = useGetAllSales({ page: 1, limit: 10000, OrderType: "POS" });

  const handleViewOrder = (order: SalesOrder) => {
    setSelectedOrderId(order.id);
    // Store the tableId so useGetOrderByTableId inside OrderDetailPanel works
    setSelectedTable(String(1));
    // if (order.tableId != null) {
    // }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* ── Orders list ────────────────────────────────────── */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="relative mb-3">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">🔍</span>
          <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white focus:border-primary/40" placeholder="Search Order Id or Customers." />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-4 px-3 py-2 bg-gray-50 border-b border-gray-100">
            {["Order ID", "Date", "Total Sales", "العمليات"].map((h) => (
              <span key={h} className="text-xs font-bold text-gray-400">
                {h}
              </span>
            ))}
          </div>

          {orders?.items.map((order: SalesOrder, i: number) => (
            <div key={i} className={`grid grid-cols-4 px-3 py-2.5 border-b border-gray-50 cursor-pointer hover:bg-primary/5 transition-colors ${selectedOrderId === order.id ? "bg-primary/10" : ""}`}>
              <span className="text-xs text-gray-600">{order?.orderNumber}</span>
              <span className="text-xs text-gray-600">{formatDate(order?.orderDate)}</span>
              <span className="text-xs text-gray-600 flex items-center gap-x-1">
                {order?.grandTotal.toFixed(2)}
                <SaudiRiyal size={12} />
              </span>
              <button onClick={() => handleViewOrder(order)} className="inline-block w-fit btn-minimal-action btn-view">
                <Eye size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Order detail panel (shown when an order is selected) ── */}
      {selectedOrderId !== null && <OrderDetailPanel />}
    </div>
  );
}
