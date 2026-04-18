import { Clock, Eye, FileText, LogOut, Printer, SaudiRiyal, Search, Tag, User, X } from "lucide-react";
import { calcItemTax, calcTotals, itemBasePrice, NAV_ITEMS } from "@/constants/data";
import { INSTITUTION_ADDRESS, INSTITUTION_NAME, INSTITUTION_NOTES, INSTITUTION_PHONE, INSTITUTION_TAX_NO, LOGO_URL, usePos } from "@/context/PosContext";
import type { CartItem, Screen } from "@/constants/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SalesOrder } from "@/features/sales/types/sales.types";
import { useEffect, useMemo, useState } from "react";
import formatDate from "@/lib/formatDate";
import { useGetAllSales } from "@/features/sales/hooks/useGetAllSales";
import { InvoiceData, printInvoice } from "../orders/printInvoice";

interface OrdersDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (order: SalesOrder) => void;
}
// ── Status / Tab config ────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  completed: { label: "مكتملة", cls: "bg-green-100 text-green-700" },
  pending: { label: "معلقة", cls: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "ملغاة", cls: "bg-red-100 text-red-600" },
  refunded: { label: "مردودة", cls: "bg-gray-100 text-gray-600" },
};

const fallbackBadge = { label: "", cls: "bg-sky-100 text-sky-600" };

type OrderStatusType = "الكل" | "مكتملة" | "معلقة";

const STATUS_TABS: { key: OrderStatusType; label: string }[] = [
  { key: "الكل", label: "الكل" },
  { key: "مكتملة", label: "الفواتير" },
  { key: "معلقة", label: "الفواتير المعلقة" },
];

const STATUS_MAP: Record<OrderStatusType, string | null> = {
  الكل: null,
  مكتملة: "Confirmed",
  معلقة: "UnConfirmed",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function OrdersDialog({ open, onOpenChange, onSelect }: OrdersDialogProps) {
  const { setSelectedOrderId, setCart, selectedCustomer } = usePos();

  const [activeStatus, setActiveStatus] = useState<OrderStatusType>("الكل");
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
      const matchStatus = STATUS_MAP[activeStatus] === null || o.orderStatus === STATUS_MAP[activeStatus];

      const matchSearch = !q || o.orderNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q) || o.orderStatus?.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [orders, search, activeStatus]);

  // reset page when tab/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, search]);

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

        {/* ── Status Tabs ── */}
        <div className="flex items-center gap-1.5 px-4 py-3 flex-wrap shrink-0 border-b border-gray-100 bg-white">
          {STATUS_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveStatus(tab.key)} className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all ${activeStatus === tab.key ? "bg-[#000052] text-white border-[#000052]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
              {tab.label}
            </button>
          ))}
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
              {filtered.map((order: SalesOrder) => {
                const badge = STATUS_BADGE[order.orderStatus] ?? fallbackBadge;
                return (
                  <button key={order.id} onClick={() => handleSelect(order)} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-blue-50 transition-colors text-right w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badge.cls || "bg-sky-100 text-sky-600"}`}>
                      <FileText size={14} />
                    </div>

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

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setSelectedOrderId(order.id);
                        onOpenChange(false);
                        const invoiceData: InvoiceData = {
                          logoUrl: LOGO_URL,
                          invoiceNumber: `—`,
                          institutionName: INSTITUTION_NAME,
                          institutionTaxNumber: INSTITUTION_TAX_NO,
                          invoiceDate: formatDate(new Date()),
                          institutionAddress: INSTITUTION_ADDRESS,
                          institutionPhone: INSTITUTION_PHONE,
                          customerName: selectedCustomer?.customerName ?? undefined,
                          customerPhone: undefined,

                          items: order?.items.map((item) => {
                            const tt: CartItem = {
                              price: item?.unitPrice,
                              qty: item?.quantity,
                              taxamount: item?.taxAmount,
                              taxCalculation: item?.taxCalculation,
                              productId: item?.id,
                              op: null,
                            };
                            const base = itemBasePrice(tt);
                            const tax = calcItemTax(tt);
                            return {
                              productName: tt.name,
                              quantity: tt.qty,
                              unitPrice: Number(base.toFixed(2)),
                              taxAmount: Number(tax.toFixed(2)),
                              total: Number((base + tax).toFixed(2)),
                            };
                          }),

                          subTotal: Number(order?.subTotal.toFixed(2)),
                          discountAmount: Number(order?.discountAmount.toFixed(2)),
                          taxAmount: order?.taxAmount,
                          grandTotal: order?.grandTotal,
                          notes: INSTITUTION_NOTES,
                        };
                        await printInvoice(invoiceData);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-400 hover:text-blue-500 text-gray-400 transition-colors shrink-0"
                    >
                      <Printer size={13} />
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
