import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllTables } from "@/features/pos/hooks/useGetAllTables";
import { Table } from "@/features/pos/types/pos.types";
import { CreditCard, Plus } from "lucide-react";
import { usePos } from "@/context/PosContext";
import { useGetOrderByTableId } from "@/features/pos/hooks/useGetOrderByTableId";
import { Customer } from "@/features/customers/types/customers.types";
import { useLanguage } from "@/context/LanguageContext";

type TableStatus = "Free" | "Occupied";
type FilterType = "all" | "Free" | "Occupied";

const STATUS_COLOR: Record<TableStatus, string> = {
  Free: "bg-green-500",
  Occupied: "bg-red-500",
  // disabled: "bg-gray-300",
};

interface TableCardProps {
  table: Table;
  selected: boolean;
  onClick: () => void;
}

export function TableCard({ table, selected, onClick }: TableCardProps) {
  // const isDisabled = table.status === "disabled";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl overflow-hidden transition-all border h-fit
        ${selected ? "border-primary border-2 cursor-pointer" : "border-gray-100 hover:border-primary/30 cursor-pointer"}`}
    >
      <div className="p-3 flex items-center justify-center">
        <svg viewBox="0 0 260 210" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]" style={{ overflow: "visible" }}>
          {/* Table surface */}
          <rect x="65" y="58" width="130" height="90" rx="12" fill="white" stroke="#9ca3af" strokeWidth="1.5" />

          <text x="130" y="99" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">
            {table.tableName}
          </text>
          {table.currentOrderId && (
            <text x="130" y="115" textAnchor="middle" fontSize="9" fill="#9ca3af">
              {table.currentOrderId}
            </text>
          )}

          {/* TOP LEFT chair */}
          <circle cx="95" cy="38" r="14" fill="white" stroke="#374151" strokeWidth="1.5" />
          <path d="M83 25 Q95 16 107 25" fill="none" stroke="#374151" strokeWidth="1.5" />
          <path d="M80 21 Q95 10 110 21" fill="none" stroke="#374151" strokeWidth="1.3" opacity="0.6" />
          <path d="M77 17 Q95  4 113 17" fill="none" stroke="#374151" strokeWidth="1.1" opacity="0.4" />

          {/* TOP RIGHT chair */}
          <circle cx="165" cy="38" r="14" fill="white" stroke="#374151" strokeWidth="1.5" />
          <path d="M153 25 Q165 16 177 25" fill="none" stroke="#374151" strokeWidth="1.5" />
          <path d="M150 21 Q165 10 180 21" fill="none" stroke="#374151" strokeWidth="1.3" opacity="0.6" />
          <path d="M147 17 Q165  4 183 17" fill="none" stroke="#374151" strokeWidth="1.1" opacity="0.4" />

          {/* BOTTOM LEFT chair */}
          <circle cx="95" cy="168" r="14" fill="white" stroke="#374151" strokeWidth="1.5" />
          <path d="M83 181 Q95 190 107 181" fill="none" stroke="#374151" strokeWidth="1.5" />
          <path d="M80 185 Q95 196 110 185" fill="none" stroke="#374151" strokeWidth="1.3" opacity="0.6" />
          <path d="M77 189 Q95 202 113 189" fill="none" stroke="#374151" strokeWidth="1.1" opacity="0.4" />

          {/* BOTTOM RIGHT chair */}
          <circle cx="165" cy="168" r="14" fill="white" stroke="#374151" strokeWidth="1.5" />
          <path d="M153 181 Q165 190 177 181" fill="none" stroke="#374151" strokeWidth="1.5" />
          <path d="M150 185 Q165 196 180 185" fill="none" stroke="#374151" strokeWidth="1.3" opacity="0.6" />
          <path d="M147 189 Q165 202 183 189" fill="none" stroke="#374151" strokeWidth="1.1" opacity="0.4" />

          {/* LEFT chair */}
          <circle cx="34" cy="103" r="14" fill="white" stroke="#374151" strokeWidth="1.5" />
          <path d="M20 91  Q11 103 20 115" fill="none" stroke="#374151" strokeWidth="1.5" />
          <path d="M16 87  Q 6 103 16 119" fill="none" stroke="#374151" strokeWidth="1.3" opacity="0.6" />
          <path d="M12 83  Q 1 103 12 123" fill="none" stroke="#374151" strokeWidth="1.1" opacity="0.4" />

          {/* RIGHT chair */}
          <circle cx="226" cy="103" r="14" fill="white" stroke="#374151" strokeWidth="1.5" />
          <path d="M240 91  Q249 103 240 115" fill="none" stroke="#374151" strokeWidth="1.5" />
          <path d="M244 87  Q254 103 244 119" fill="none" stroke="#374151" strokeWidth="1.3" opacity="0.6" />
          <path d="M248 83  Q259 103 248 123" fill="none" stroke="#374151" strokeWidth="1.1" opacity="0.4" />
        </svg>
      </div>

      {/* Status bar */}
      <div className={`h-1.5 ${STATUS_COLOR[table.status]}`} />
    </div>
  );
}

export default function TablesPage() {
  const { t } = useLanguage();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const { data: tables } = useGetAllTables();
  const { setScreen, setSelectedTable: setSelectedTable2, setOrderType, setCart, setSelectedCustomer, setSelectedOrderId, setDineInMode } = usePos();
  const { data: detailsOrder } = useGetOrderByTableId(selectedTable);
  const filtered = useMemo(
    () =>
      tables?.filter((t) => {
        if (filter === "all") return true;
        return t.status === filter;
      }) ?? [],
    [tables, filter],
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 p-3 flex flex-col gap-2.5">
        <Tabs value={filter} onValueChange={(val) => setFilter(val as FilterType)}>
          <TabsList className="bg-transparent gap-2 p-0">
            {(["all", "Free", "Occupied"] as FilterType[]).map((v) => (
              <TabsTrigger key={v} value={v} className="rounded-lg border border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none! text-gray-500 text-xs capitalize">
                {v === "all" ? t("all_tables") : v === "Free" ? t("table_free") : t("table_occupied")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center text-[10px] font-bold">
              i
            </div>
          </div>
          <button className="text-xs font-bold text-primary">{t("show_all_tables")}</button>
        </div> */}
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-5 gap-3 mt-4 flex-1 overflow-y-auto">{filtered.length === 0 ? <div className="col-span-5 flex items-center justify-center text-gray-400 text-sm py-12">{t("no_tables_found")}</div> : filtered?.map((t) => <TableCard key={t.id} table={t} selected={selectedTable === t.id} onClick={() => setSelectedTable(selectedTable === t.id ? null : t.id)} />)}</div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(
            [
              ["bg-green-500", t("table_free")],
              ["bg-red-500", t("table_occupied")],
            ] as [string, string][]
          ).map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className={`size-3 rounded-full ${c}`} />
              {l}
            </div>
          ))}
        </div>

        {selectedTable &&
          (() => {
            const table = tables.find((t) => t.id === selectedTable);
            const isOccupied = table?.status === "Occupied";

            return (
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm font-black text-gray-800"> {selectedTable}</div>
                  <div className="text-xs text-gray-400">{table?.currentOrderId ? `${t("order_hash")}${table.currentOrderId}` : t("table_free")}</div>
                </div>

                {isOccupied ? (
                  <>
                    <Button
                      size="xl"
                      variant="outline"
                      onClick={() => {
                        setCart(
                          detailsOrder.items.map((item) => ({
                            productId: item.productId,
                            name: item.productName,
                            price: item.unitPrice,
                            qty: item.quantity,
                            note: "",
                            taxamount: item.taxAmount,
                            taxCalculation: item?.taxCalculation,
                            op: null,
                            itemDiscount: item.discountValue > 0 ? { type: "flat" as const, value: item.discountValue } : null,
                            extras: [],
                          })),
                        );
                        setDineInMode("add-items");
                        // setSelectedOrderId(detailsOrder.id);
                        setSelectedCustomer({ id: detailsOrder.id, customerName: detailsOrder.customerName } as Customer);
                        setOrderType("dine-in");
                        setSelectedTable2(String(selectedTable));
                        setScreen("home");
                      }}
                    >
                      <Plus size={14} /> {t("add_products")}
                    </Button>
                    <Button
                      size="xl"
                      onClick={() => {
                        console.log("first");
                        console.log(detailsOrder);
                        setCart(
                          detailsOrder.items.map((item) => ({
                            productId: item.productId,
                            name: item.productName,
                            price: item.unitPrice,
                            qty: item.quantity,
                            note: "",
                            taxamount: item.taxAmount,
                            taxCalculation: item?.taxCalculation,
                            op: null,
                            itemDiscount: item.discountValue > 0 ? { type: "flat" as const, value: item.discountValue } : null,
                            extras: [],
                          })),
                        );
                        setDineInMode("checkout");
                        // setSelectedOrderId(detailsOrder.id);
                        setSelectedCustomer({ id: detailsOrder.id, customerName: detailsOrder.customerName } as Customer);
                        setOrderType("dine-in");
                        setSelectedTable2(String(selectedTable));
                        setScreen("home");
                      }}
                    >
                      <CreditCard size={14} /> {t("proceed_to_payment")}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="xl"
                    onClick={() => {
                      setCart([]);
                      setDineInMode("new-order");
                      setSelectedOrderId(null);
                      setOrderType("dine-in");
                      setSelectedTable2(String(selectedTable));
                      setScreen("home");
                    }}
                  >
                    {t("select_and_place_order")}
                  </Button>
                )}
              </div>
            );
          })()}
      </div>
    </div>
  );
}
