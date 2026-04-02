import { useState } from "react";

const ORDER_TABS = ["Order History", "Order On Hold", "Offline Order"] as const;

const ORDER_DETAIL_ITEMS = [
  { qty: 1, name: "Schezwan Egg Noodles", price: "$25.00" },
  { qty: 2, name: "Spicy Shrimp Soup", price: "$40.00", note: "Medium- Half Grilled", disc: "10% Disc · $10 · $50.00" },
  { qty: 1, name: "Fried Basil", price: "$25.00" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<(typeof ORDER_TABS)[number]>("Order History");

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Orders list */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="flex border-b border-gray-200 mb-3">
          {ORDER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-2 text-xs border-b-2 transition-colors
                ${activeTab === t ? "border-primary text-primary font-bold" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative mb-3">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">🔍</span>
          <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white focus:border-primary/40" placeholder="Search Order Id or Customers." />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-3 px-3 py-2 bg-gray-50 border-b border-gray-100">
            {["Order ID", "Date", "Total Sales"].map((h) => (
              <span key={h} className="text-xs font-bold text-gray-400">
                {h}
              </span>
            ))}
          </div>
          {Array(10)
            .fill("")
            .map((_, i) => (
              <div key={i} className="grid grid-cols-3 px-3 py-2.5 border-b border-gray-50 cursor-pointer hover:bg-primary/5 transition-colors">
                <span className="text-xs text-gray-600">#4587198751</span>
                <span className="text-xs text-gray-600">28 Feb 2024, 12:30</span>
                <span className="text-xs text-gray-600">$345.29</span>
              </div>
            ))}
        </div>
      </div>

      {/* Order detail sidebar */}
      <div className="bg-white border-l border-gray-100 p-4 flex flex-col flex-shrink-0" style={{ width: 272 }}>
        <div className="text-sm font-black text-gray-800 mb-0.5">Order ID #0542145</div>
        <div className="text-xs text-gray-400 mb-0.5">Vincent Lobo</div>
        <div className="text-xs text-gray-400 mb-3">Dine-In · T-34</div>

        <div className="flex-1 overflow-y-auto border-t border-gray-100 pt-2">
          {ORDER_DETAIL_ITEMS.map((item, i) => (
            <div key={i} className="flex justify-between mb-2.5 text-xs">
              <div className="flex-1">
                <span className="text-gray-400 mr-1">{item.qty}</span>
                <span className="text-gray-700">{item.name}</span>
                {item.note && <div className="text-gray-400 mt-0.5">{item.note}</div>}
                {item.disc && <div className="text-primary/70">{item.disc}</div>}
              </div>
              <div className="font-bold text-gray-800 flex-shrink-0">{item.price}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-2.5 mt-2">
          {[
            ["Subtotal", "$200.00"],
            ["Tax", "$45.00"],
            ["Discount", "-$50.00"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{l}</span>
              <span>{v}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-black text-gray-800 my-1.5">
            <span>Grand Total</span>
            <span>$195.00</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Cash</span>
            <span>$195.00</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Balance</span>
            <span>$0.00</span>
          </div>
        </div>

        <button className="w-full mt-3 mb-4 py-2.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">🖨 Print Invoice</button>
      </div>
    </div>
  );
}
