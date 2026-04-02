"use client";
import { ChevronLeft, CreditCard } from "lucide-react";
import { usePos } from "@/context/PosContext";

export default function CashierPage() {
  const { setScreen } = usePos();

  const payable = 195;
  const credit  = 200;
  const balance = credit - payable; // -5

  const items = [
    { qty: 1, name: "Schezwan Egg Noodles", note: null,                                    price: 25   },
    { qty: 2, name: "Spicy Shrimp Soup",    note: "Medium · Half Grilled",  disc: "$55.00", price: 40  },
    { qty: 1, name: "Fried Basil",          note: null,                                    price: 25   },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 flex flex-col gap-4">

        {/* Back */}
        <button
          onClick={() => setScreen("home")}
          className="flex items-center gap-1 text-green-500 text-sm font-semibold w-fit"
        >
          <ChevronLeft size={15} strokeWidth={2.5} /> Back
        </button>

        {/* Order header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-black text-gray-900 leading-tight">Order ID #O542145</div>
            <div className="text-xs text-gray-400 mt-0.5">Vincent Lobo</div>
          </div>
          <div className="text-xs text-gray-400 mt-1">Dine-In • T-34</div>
        </div>

        {/* Items list */}
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex gap-3">
                {/* qty */}
                <span className="text-sm text-gray-400 w-4 pt-0.5">{item.qty}</span>
                {/* name + note */}
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                  {item.note && (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {item.note}
                      {item.disc && (
                        <> &nbsp;·&nbsp; <span>10% Disc • {item.disc}</span></>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* price */}
              <span className="text-sm font-semibold text-gray-800">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-1.5 pt-1">
          {[
            { label: "Subtotal",   value: "$200.00", bold: false, red: false  },
            { label: "Tax",        value: "$45.00",  bold: false, red: false  },
            { label: "Discount",   value: "-$50.00", bold: false, red: false  },
            { label: "Grand Total",value: "$195.00", bold: true,  red: false  },
          ].map(({ label, value, bold }) => (
            <div key={label} className={`flex justify-between ${bold ? "mt-2 pt-2 border-t border-gray-200" : ""}`}>
              <span className={bold ? "text-base font-black text-gray-900" : "text-sm text-gray-500"}>
                {label}
              </span>
              <span className={bold ? "text-base font-black text-gray-900" : "text-sm text-gray-500"}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky bottom section ── */}
      <div className="px-5 pb-5 pt-2 flex flex-col gap-3 bg-gray-50">
        {/* Credit / Balance */}
        <div className="flex flex-col gap-1 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Credit</span>
            <span>${credit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-gray-600">Balance</span>
            <span className={balance >= 0 ? "text-green-600" : "text-gray-700"}>
              {balance >= 0 ? "+" : ""}{balance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => setScreen("success")}
          className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          <CreditCard size={16} strokeWidth={2} />
          Confirm Payment
        </button>
      </div>
    </div>
  );
}