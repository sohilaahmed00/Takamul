import { ChevronLeft, CreditCard } from "lucide-react";
import { usePos } from "@/context/PosContext";
import { calcTotals, itemTotal } from "@/constants/data";

export default function CashierPage() {
  const { setScreen, cart, discount, selectedCustomer, orderType, selectedTable, handleConfirmPayment, paidAmount } = usePos();
  const { sub, tax, total } = calcTotals(cart, discount);
  const balance = parseFloat((paidAmount - total).toFixed(2));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 flex flex-col gap-4">
        {/* Back */}
        <button onClick={() => setScreen("home")} className="flex items-center gap-1 text-green-500 text-sm font-semibold w-fit">
          <ChevronLeft size={15} strokeWidth={2.5} /> Back
        </button>

        {/* Order header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-black text-gray-900 leading-tight">Order ID #O542145</div>
            <div className="text-xs text-gray-400 mt-0.5">{selectedCustomer?.customerName ?? "Walk-in Customer"}</div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{orderType === "dine-in" && selectedTable ? `Dine-In • ${selectedTable}` : orderType === "delivery" ? "Delivery" : "Takeaway"}</div>
        </div>

        {/* Items list */}
        <div className="flex flex-col">
          {cart.map((item, i) => {
            const total = itemTotal(item);
            const hasDisc = !!item.itemDiscount && item.itemDiscount.value > 0;
            return (
              <div key={i} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex gap-3">
                  <span className="text-sm text-gray-400 w-4 pt-0.5">{item.qty}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                    {/* extras */}
                    {(item.extras ?? []).length > 0 && <div className="text-[11px] text-gray-400 mt-0.5">+ {item.extras!.map((e) => e.name).join("، ")}</div>}
                    {/* note + discount */}
                    {(item.note || hasDisc) && (
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {item.note}
                        {item.note && hasDisc && " · "}
                        {hasDisc && <span className="text-primary font-semibold">{item.itemDiscount!.type === "pct" ? `${item.itemDiscount!.value}% off` : `-$${item.itemDiscount!.value.toFixed(2)}`}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800">${total.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-1.5 pt-1">
          {[
            { label: "Subtotal", value: `$${sub.toFixed(2)}`, bold: false },
            { label: "Tax", value: `$${tax.toFixed(2)}`, bold: false },
            { label: "Discount", value: `-$${discount.toFixed(2)}`, bold: false },
            { label: "Grand Total", value: `$${total.toFixed(2)}`, bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label} className={`flex justify-between ${bold ? "mt-2 pt-2 border-t border-gray-200" : ""}`}>
              <span className={bold ? "text-base font-black text-gray-900" : "text-sm text-gray-500"}>{label}</span>
              <span className={bold ? "text-base font-black text-gray-900" : "text-sm text-gray-500"}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky bottom ── */}
      <div className="px-5 pb-5 pt-2 flex flex-col gap-3 bg-gray-50">
        <div className="flex flex-col gap-1 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Credit</span>
            <span>${paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-gray-600">Balance</span>
            <span className={balance >= 0 ? "text-green-600" : "text-red-500"}>
              {balance >= 0 ? "+" : ""}
              {balance.toFixed(2)}
            </span>
          </div>
        </div>

        <button onClick={() => handleConfirmPayment("Cash", total.toFixed(2))} className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
          <CreditCard size={16} strokeWidth={2} />
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
