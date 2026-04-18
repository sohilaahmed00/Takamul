import { Clock, Eye, FileText, LogOut, SaudiRiyal, Search, Tag, User, X } from "lucide-react";
import { NAV_ITEMS } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { Screen } from "@/constants/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SalesOrder } from "@/features/sales/types/sales.types";
import { useMemo, useState } from "react";
import formatDate from "@/lib/formatDate";
import { useGetAllSales } from "@/features/sales/hooks/useGetAllSales";

interface OrdersDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (order: SalesOrder) => void;
}

// ── Status badge map — adjust keys to match your orderStatus values ────────────

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  completed: { label: "مكتملة", cls: "bg-green-100 text-green-700" },
  pending: { label: "معلقة", cls: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "ملغاة", cls: "bg-red-100 text-red-600" },
  refunded: { label: "مردودة", cls: "bg-gray-100 text-gray-600" },
};

const fallbackBadge = { label: "", cls: "bg-sky-100 text-sky-600" };

// ── Component ─────────────────────────────────────────────────────────────────

export function OrdersDialog({ open, onOpenChange, onSelect }: OrdersDialogProps) {
  const { setSelectedOrderId } = usePos();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(20);

  const { data: orders } = useGetAllSales({
    page: currentPage,
    limit: entriesPerPage,
    OrderType: "POS",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (orders?.items ?? []).filter((o) => {
      if (!q) return true;
      return o.orderNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q) || o.orderStatus?.toLowerCase().includes(q);
    });
  }, [orders, search]);

  const handleSelect = (order: SalesOrder) => {
    setSelectedOrderId(order.id);
    onSelect?.(order);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 overflow-hidden gap-0 flex flex-col"
        style={{
          maxWidth: 580,
          width: "95vw",
          maxHeight: "88vh",
          direction: "rtl",
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" style={{ background: "#000052" }}>
          <div className="flex items-center gap-2">
            <FileText size={15} />
            <DialogTitle className="text-[14px] font-medium text-white">الطلبات</DialogTitle>
          </div>
          <button onClick={() => onOpenChange(false)} className="w-7 h-7 rounded flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* ── Search ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 border-b border-gray-100 bg-white">
          <div className="flex-1 relative">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث برقم الطلب / العميل / الحالة" className="w-full h-8 text-[11px] border border-gray-200 rounded-lg pr-3 pl-3 outline-none focus:border-blue-400 bg-gray-50 placeholder:text-gray-300" />
          </div>
          <button className="h-8 w-8 flex items-center justify-center bg-[#000052] rounded-lg text-white hover:bg-blue-900 transition-colors">
            <Search size={13} />
          </button>
        </div>

        {/* ── Count ── */}
        <div className="px-4 py-1.5 bg-white border-b border-gray-100 shrink-0">
          <span className="text-[11px] text-gray-400">{filtered.length} طلب</span>
        </div>

        {/* ── List ── */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <FileText size={32} className="opacity-30" />
              <p className="text-sm">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {filtered.map((order) => {
                const badge = STATUS_BADGE[order.orderStatus] ?? fallbackBadge;
                return (
                  <button key={order.id} onClick={() => handleSelect(order)} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-blue-50 transition-colors text-right w-full">
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badge.cls || "bg-sky-100 text-sky-600"}`}>
                      <FileText size={14} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#000052] text-[12px] truncate">{order.orderNumber}</span>
                        {badge.label && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <User size={10} />
                          {order.customerName ?? "—"}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Tag size={10} />
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    {/* Total + Date */}
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="flex items-center gap-1 text-[12px] font-bold text-gray-800">
                        {order.grandTotal.toFixed(2)}
                        <SaudiRiyal size={11} />
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock size={9} />
                        {formatDate(order.orderDate)}
                      </span>
                    </div>

                    {/* Eye btn */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrderId(order.id);
                        onOpenChange(false);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-400 hover:text-blue-500 text-gray-400 transition-colors shrink-0"
                    >
                      <Eye size={13} />
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {(orders?.totalCount ?? 0) > entriesPerPage && (
          <div className="px-4 py-2 border-t border-gray-100 bg-white shrink-0 flex items-center justify-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="text-[11px] px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              السابق
            </button>
            <span className="text-[11px] text-gray-500">صفحة {currentPage}</span>
            <button disabled={currentPage * entriesPerPage >= (orders?.totalCount ?? 0)} onClick={() => setCurrentPage((p) => p + 1)} className="text-[11px] px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              التالي
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">{filtered.length} طلب</span>
          <button onClick={() => onOpenChange(false)} className="text-[11px] text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
            إغلاق
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Sidebar() {
  const { screen, setScreen } = usePos();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-16 bg-[#000052] border-r border-gray-100 flex flex-col items-center py-3 gap-0.5 shrink-0">
        <div className="flex-1" />

        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              if (id === "orders") {
                setOpen(true);
                return;
              }
              setScreen(id as Screen);
            }}
            className={`cursor-pointer py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 ease-in-out
            ${screen === id ? "bg-primary/10 border border-primary/20" : "bg-transparent hover:bg-primary/5 border border-transparent"}`}
            style={{ width: 52 }}
          >
            <Icon size={18} strokeWidth={screen === id ? 2.5 : 1.8} className={`transition-colors duration-200 ${screen === id ? "text-primary" : "text-white"}`} />
            <span className={`transition-colors duration-200 ${screen === id ? "text-primary font-bold" : "text-white"}`} style={{ fontSize: 9 }}>
              {label}
            </span>
          </button>
        ))}

        <div className="flex-1" />
      </div>
      <OrdersDialog open={open} onOpenChange={setOpen} onSelect={(order) => console.log(order)} />
    </>
  );
}
