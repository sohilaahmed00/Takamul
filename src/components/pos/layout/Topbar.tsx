import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TABLES_LIST, DELIVERY_COMPANIES } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { OrderType } from "@/constants/data";
import { useGetAllFreeTables } from "@/features/pos/hooks/useGetFreeTables";
import { useGetAllTables } from "@/features/pos/hooks/useGetAllTables";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";

export default function Topbar() {
  const { networkSpeed, orderType, setOrderType, selectedTable, setSelectedTable, selectedDelivery, setSelectedDelivery, search, setSearch } = usePos();
  const { data: freeTables } = useGetAllTables();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
<div className="bg-white border-b border-gray-300 px-3 md:px-5 py-3">
  <div className="relative w-full">
    
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-5 pr-12 py-3 rounded-lg text-sm outline-none bg-[#f6f6f6] focus:border-primary/40 text-gray-700 placeholder:text-gray-400"
      placeholder={t("search_products")}
    />

    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </span>

  </div>
</div>
  );
}
