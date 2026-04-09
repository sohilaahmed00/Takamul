// OrderDetailPanel.tsx
import { usePos } from "@/context/PosContext";
import { useGetOrderByTableId } from "@/features/pos/hooks/useGetOrderByTableId";
import { calcTotals, itemBasePrice } from "@/constants/data";
import { Printer } from "lucide-react";
import { printInvoice } from "./printInvoice";
import { useGetSalesOrderById } from "@/features/sales/hooks/useGetSalesOrderById";

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
  const { selectedOrderId, cart } = usePos();
  const { data: order } = useGetSalesOrderById(Number(selectedOrderId));
  console.log(order);
  const { sub, tax, total } = calcTotals(cart, 0);

  // ── Build print payload and open print window ─────────────────────────────
  const handlePrint = () => {
    if (!order) return;

    const invoiceData = {
      logoUrl: LOGO_URL,
      invoiceNumber: order.orderNumber ?? "—",
      institutionName: INSTITUTION_NAME,
      institutionTaxNumber: INSTITUTION_TAX_NO,
      // Format date: if orderDate is ISO string, format it nicely
      invoiceDate: order.orderDate ? new Date(order.orderDate).toLocaleDateString("ar-SA") : new Date().toLocaleDateString("ar-SA"),
      institutionAddress: INSTITUTION_ADDRESS,
      institutionPhone: INSTITUTION_PHONE,

      customerName: order.customerName ?? undefined,
      customerPhone: undefined, // add if your API returns it

      items: (order.items ?? []).map((item) => {
        const priceBeforeTax = item.priceBeforeTax ?? 0;
        const qty = item.quantity ?? 1;
        const taxAmt = item.taxAmount ?? 0; // per-unit tax if available
        return {
          productName: item.productName,
          quantity: qty,
          unitPrice: priceBeforeTax,
          taxAmount: parseFloat((taxAmt * qty).toFixed(2)),
          total: item?.lineTotal,
        };
      }),

      subTotal: order.subTotal ?? 0,
      discountAmount: order.discountAmount ?? 0,
      taxAmount: order.taxAmount ?? 0,
      grandTotal: order.grandTotal ?? 0,

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
