// OrderDetailPanel.tsx
import { usePos } from "@/context/PosContext";
import { useGetOrderByTableId } from "@/features/pos/hooks/useGetOrderByTableId";
import { calcItemTax, calcTotals, CartItem, itemBasePrice } from "@/constants/data";
import { Printer } from "lucide-react";
import { printInvoice } from "./printInvoice";
import { useGetSalesOrderById } from "@/features/sales/hooks/useGetSalesOrderById";
import formatDate from "@/lib/formatDate";

// ── Configurable institution data ────────────────────────────────────────────
// Replace these constants with values from your settings/store context if available
const INSTITUTION_NAME = "اسم المؤسسة";
const INSTITUTION_TAX_NO = "310XXXXXXXXX";
const INSTITUTION_ADDRESS = "عنوان المؤسسة";
const INSTITUTION_PHONE = "05XXXXXXXX";
const INSTITUTION_NOTES = "";
// Optional: pass a logo URL or leave undefined to show "اللوجو" text
const LOGO_URL: string | undefined = undefined;

export default function OrderDetailPanel() {
  const { selectedOrderId } = usePos();
  const { data: order } = useGetSalesOrderById(Number(selectedOrderId));
  console.log(order);

  // ── Build print payload and open print window ─────────────────────────────
  const handlePrint = () => {
    if (!order) return;
    const cart: CartItem[] = (order.items ?? []).map((item) => {
      const pct = Number(item?.discountPercentage ?? 0);
      const flat = Number(item?.discountValue ?? 0);
      const itemDiscount: CartItem["itemDiscount"] = pct > 0 ? { type: "pct", value: pct } : flat > 0 ? { type: "flat", value: flat } : null;
      return {
        productId: item.productId ?? 0,
        name: item.productName,
        price: item.priceBeforeTax ?? 0,
        qty: item.quantity ?? 1,
        taxamount: item.taxAmount ?? 0,
        taxCalculation: item.taxCalculation ?? 1,
        itemDiscount,
        note: "",
        op: null,
      };
    });

    const totals = calcTotals(cart, order.discountAmount ?? 0);

    console.log(totals?.sub)
    console.log(totals?.subAfterDiscount)

    const invoiceData = {
      logoUrl: LOGO_URL,
      invoiceNumber: order.orderNumber ?? "—",
      institutionName: INSTITUTION_NAME,
      institutionTaxNumber: INSTITUTION_TAX_NO,

      invoiceDate: order.orderDate ? formatDate(order.orderDate) : new Date().toLocaleDateString("ar-SA"),

      institutionAddress: INSTITUTION_ADDRESS,
      institutionPhone: INSTITUTION_PHONE,

      customerName: order.customerName ?? undefined,
      customerPhone: undefined,

      items: cart.map((item) => {
        const base = itemBasePrice(item);
        const tax = calcItemTax(item);
        return {
          productName: item.name,
          quantity: item.qty,
          unitPrice: Number(base.toFixed(2)),
          taxAmount: Number(tax.toFixed(2)),
          total: Number((base + tax).toFixed(2)),
          itemDiscount: item.itemDiscount,
        };
      }),

      subTotal: Number(totals.sub.toFixed(2)),
      discountAmount: Number((totals.sub - totals.subAfterDiscount).toFixed(2)),
      taxAmount: totals.originalTax,
      grandTotal: Number((totals.sub + totals.originalTax).toFixed(2)),

      notes: INSTITUTION_NOTES,
    };

    printInvoice(invoiceData);
  };
  const computedSubTotal = order?.items?.reduce((sum, item) => {
    const cartItem = {
      productId: item.productId,
      name: item.productName,
      note: "",
      price: item.unitPrice,
      qty: item.quantity,
      taxamount: item.taxPercentage,
      taxCalculation: item.taxCalculation,
      itemDiscount: item.discountPercentage > 0 ? { type: "pct" as const, value: item.discountPercentage } : item.discountValue > 0 ? { type: "flat" as const, value: item.discountValue } : undefined,
    };
    return sum + itemBasePrice(cartItem);
  }, 0);
  return (
    <div className="bg-white border-l border-gray-100 p-4 flex flex-col flex-shrink-0" style={{ width: 400 }}>
      {/* Header */}
      <div className="text-sm font-black text-gray-800 mb-0.5">Order ID #{order?.orderNumber}</div>
      <div className="text-xs text-gray-400 mb-0.5">{order?.customerName}</div>
      <div className="text-xs text-gray-400 mb-3">Dine-In · T-{selectedOrderId}</div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto border-t border-gray-100 pt-2">
        {order?.items?.map((item, i) => (
          <div key={i} className="flex justify-between mb-2.5 text-xs">
            <div className="flex-1">
              <span className="text-gray-400 mr-1">{item.quantity}</span>
              <span className="text-gray-700">{item.productName}</span>
              {item.discountValue > 0 && <div className="text-primary/70">Disc · ${item.discountValue.toFixed(2)}</div>}
            </div>
            <div className="font-bold text-gray-800 flex-shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-100 pt-2.5 mt-2">
        {[["Subtotal", `$${computedSubTotal?.toFixed(2)}`], ["Tax", `$${order?.taxAmount?.toFixed(2)}`], ...(order?.discountAmount > 0 ? [["Discount", `-$${order?.discountAmount.toFixed(2)}`]] : [])].map(([l, v]) => (
          <div key={l} className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{l}</span>
            <span>{v}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-black text-gray-800 my-1.5">
          <span>Grand Total</span>
          <span>${order?.grandTotal?.toFixed(2)}</span>
        </div>
        {order?.payments?.map((p, i) => (
          <div key={i} className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{p?.paymentMethod ?? "Cash"}</span>
            <span>${p?.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Print button */}
      <button onClick={handlePrint} className="w-full mt-3 mb-4 py-2.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
        <Printer size={13} /> Print Invoice
      </button>
    </div>
  );
}
