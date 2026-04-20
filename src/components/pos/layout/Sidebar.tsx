import { Clock, Eye, FileText, LogOut, Printer, SaudiRiyal, Search, Tag, User, X } from "lucide-react";
import { calcItemTax, calcTotals, itemBasePrice, NAV_ITEMS } from "@/constants/data";
import { INSTITUTION_ADDRESS, INSTITUTION_NAME, INSTITUTION_NOTES, INSTITUTION_PHONE, INSTITUTION_TAX_NO, LOGO_URL, usePos } from "@/context/PosContext";
import type { CartItem, Screen } from "@/constants/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
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

const STATUS_MAP: Record<OrderStatusType, string | null> = {
  الكل: null,
  مكتملة: "Confirmed",
  معلقة: "UnConfirmed",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function OrdersDialog({ open, onOpenChange }: OrdersDialogProps) {
  const { setSelectedOrderId, selectedCustomer } = usePos();
  const [activeStatus, setActiveStatus] = useState<OrderStatusType>("الكل");
  const { t } = useLanguage();

  const STATUS_TABS: { key: OrderStatusType; label: string }[] = useMemo(
    () => [
      { key: "الكل", label: t("all") },
      { key: "مكتملة", label: t("invoices") },
      { key: "معلقة", label: t("pending_invoices") },
    ],
    [t],
  );

  const [search, setSearch] = useState("");
  const { data: orders } = useGetAllSales({
    page: 1,
    limit: 10,
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

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [activeStatus, search]);

  const handleSelect = (order: SalesOrder) => {
    setSelectedOrderId(order.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-0 overflow-hidden gap-0 flex flex-col" style={{ maxWidth: 580, width: "95vw", maxHeight: "88vh" }}>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 text-white shrink-0 bg-sidebar">
          <div className="flex items-center gap-2">
            <FileText size={15} />
            <DialogTitle className="text-[14px] font-medium text-white">{t("orders")}</DialogTitle>
          </div>
          <button onClick={() => onOpenChange(false)} className="w-7 h-7 rounded flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* ── Status Tabs ── */}
        <div className="flex items-center gap-1.5 px-4 py-3 flex-wrap shrink-0 border-b border-border bg-card">
          {STATUS_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveStatus(tab.key)} className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all ${activeStatus === tab.key ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 border-b border-border bg-card">
          <div className="flex-1 relative">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_orders_placeholder")} className="w-full h-8 text-[11px] border border-border rounded-lg pr-3 pl-3 outline-none focus:border-primary bg-input text-foreground placeholder:text-muted-foreground" />
          </div>
          <button className="h-8 w-8 flex items-center justify-center bg-primary hover:bg-primary/80 rounded-lg text-primary-foreground transition-colors">
            <Search size={13} />
          </button>
        </div>

        {/* ── Count ── */}
        <div className="px-4 py-1.5 bg-card border-b border-border shrink-0">
          <span className="text-[11px] text-muted-foreground">
            {filtered.length} {t("order")}
          </span>
        </div>

        {/* ── List ── */}
        <div className="flex-1 overflow-auto bg-background">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <FileText size={32} className="opacity-30" />
              <p className="text-sm">{t("no_orders_found")}</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {filtered.map((order: SalesOrder) => {
                const badgeCls = order.orderStatus?.toLowerCase() === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : order.orderStatus?.toLowerCase() === "unconfirmed" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" : order.orderStatus?.toLowerCase() === "cancelled" ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" : fallbackBadge.cls;

                const translatedStatus = order.orderStatus?.toLowerCase() === "confirmed" ? t("status_completed") : order.orderStatus?.toLowerCase() === "unconfirmed" ? t("status_pending") : order.orderStatus?.toLowerCase() === "cancelled" ? t("status_cancelled") : order.orderStatus;

                return (
                  <button key={order.id} onClick={() => handleSelect(order)} className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted transition-colors text-right w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badgeCls || "bg-sky-100 text-sky-600"}`}>
                      <FileText size={14} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-primary text-[12px] truncate">{order.orderNumber}</span>
                        {translatedStatus && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeCls}`}>{translatedStatus}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <User size={10} />
                          {order.customerName ?? "—"}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Tag size={10} />
                          {translatedStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="flex items-center gap-1 text-[12px] font-bold text-foreground">
                        {order.grandTotal.toFixed(2)}
                        <SaudiRiyal size={11} />
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock size={9} />
                        {formatDate(order.orderDate)}
                      </span>
                    </div>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
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
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors shrink-0"
                    >
                      {order?.orderStatus == "Confirmed" ? <Printer size={13} /> : <Eye size={13} />}
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-2.5 border-t border-border bg-card shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {filtered.length} {t("order")}
          </span>
          <button onClick={() => onOpenChange(false)} className="text-[11px] text-muted-foreground hover:text-foreground px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors">
            {t("close")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Sidebar() {
  const { screen, setScreen } = usePos();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <div
        className="w-16 bg-sidebar border-e border-border flex flex-col items-center py-3 gap-0.5 shrink-0
  [.light_&]:bg-[#000052]
  [.dark_&]:bg-[#000052]
"
      >
        {" "}
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
              {t(label.toLowerCase())}
            </span>
          </button>
        ))}
        <div className="flex-1" />
      </div>
      <OrdersDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
