import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TABLES_LIST, DELIVERY_COMPANIES } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { OrderType } from "@/constants/data";
import { useGetAllFreeTables } from "@/features/pos/hooks/useGetFreeTables";
import { useGetAllTables } from "@/features/pos/hooks/useGetAllTables";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { networkSpeed, orderType, setOrderType, selectedTable, setSelectedTable, selectedDelivery, setSelectedDelivery, search, setSearch } = usePos();
  const { data: freeTables } = useGetAllTables();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border-b border-gray-100 py-3 px-3 md:px-5 gap-3">
      {" "}
      {/* Search */}
      <div className="relative  flex-1 max-w-[900px]">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-5 pr-12 py-3 rounded-lg text-sm outline-none bg-[#f6f6f6] focus:border-primary/40 text-gray-700 placeholder:text-gray-400" placeholder={t("search_products")} />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </button>
        {/* Refresh */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* Network speed */}
        <div className="flex items-center gap-1">
          <span className={`text-xs font-bold ${networkSpeed === "slow" ? "text-red-500" : networkSpeed === "medium" ? "text-yellow-500" : "text-green-500"}`}>{networkSpeed === "slow" ? t("speed_slow") : networkSpeed === "medium" ? t("speed_medium") : t("speed_fast")}</span>
          <button className={networkSpeed === "slow" ? "text-red-500" : networkSpeed === "medium" ? "text-yellow-500" : "text-green-500"}>
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
              <SelectItem value="takeaway">{t("order_takeaway")}</SelectItem>

              <SelectItem value="dine-in">{t("order_dine_in")}</SelectItem>

              <SelectItem value="delivery">{t("order_delivery")}</SelectItem>
            </SelectContent>
          </Select>

          {orderType === "dine-in" && (
            <Select value={selectedTable ?? ""} onValueChange={setSelectedTable}>
              <SelectTrigger className="h-8 text-xs w-28">
                <SelectValue placeholder={t("choose_table")} />
              </SelectTrigger>
              <SelectContent>
                {freeTables?.map((t) => (
                  <SelectItem key={t.id} value={String(t?.id)}>
                    {t?.tableName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {orderType === "delivery" && (
            <Select value={selectedDelivery ?? ""} onValueChange={setSelectedDelivery}>
              <SelectTrigger className="h-8 text-xs w-32">
                <SelectValue placeholder={t("delivery_company")} />
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
    </div>
  );
}
