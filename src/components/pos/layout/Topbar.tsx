import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TABLES_LIST, DELIVERY_COMPANIES } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { OrderType } from "@/constants/data";

export default function Topbar() {
  const {
    networkSpeed,
    orderType, setOrderType,
    selectedTable, setSelectedTable,
    selectedDelivery, setSelectedDelivery,
  } = usePos();

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
      <span className="text-base font-black text-gray-900 whitespace-nowrap mr-2">Restro POS</span>

      {/* Search */}
      <div className="relative flex-1">
        <input
          className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-primary/40 text-gray-500"
          placeholder="Search products....."
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
      </div>

      {/* Refresh */}
      <button className="text-gray-400 hover:text-gray-600 transition-colors">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      {/* Network speed */}
      <div className="flex items-center gap-1">
        <span
          className={`text-xs font-bold ${
            networkSpeed === "slow"
              ? "text-red-500"
              : networkSpeed === "medium"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {networkSpeed === "slow" ? "Slow" : networkSpeed === "medium" ? "Medium" : "Fast"}
        </span>
        <button
          className={
            networkSpeed === "slow"
              ? "text-red-500"
              : networkSpeed === "medium"
              ? "text-yellow-500"
              : "text-green-500"
          }
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeOpacity={networkSpeed === "slow" ? 0.3 : 1} />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeOpacity={networkSpeed === "fast" ? 1 : 0.3} />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeOpacity={networkSpeed !== "slow" ? 1 : 0.3} />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Order type selectors */}
      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={orderType}
          onValueChange={(val: OrderType) => {
            setOrderType(val);
            setSelectedTable(null);
            setSelectedDelivery(null);
          }}
        >
          <SelectTrigger className="h-8 text-xs w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="takeaway">سفري</SelectItem>
            <SelectItem value="dine-in">محلي</SelectItem>
            <SelectItem value="delivery">توصيل</SelectItem>
          </SelectContent>
        </Select>

        {orderType === "dine-in" && (
          <Select value={selectedTable ?? ""} onValueChange={setSelectedTable}>
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue placeholder="اختر الطاولة" />
            </SelectTrigger>
            <SelectContent>
              {TABLES_LIST.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {orderType === "delivery" && (
          <Select value={selectedDelivery ?? ""} onValueChange={setSelectedDelivery}>
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="شركة التوصيل" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_COMPANIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}