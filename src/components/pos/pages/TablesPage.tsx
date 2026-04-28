import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table } from "@/features/pos/types/pos.types";
import { CreditCard, Plus } from "lucide-react";
import { usePos } from "@/context/PosContext";
import { useGetOrderByTableId } from "@/features/pos/hooks/useGetOrderByTableId";
import { Customer } from "@/features/customers/types/customers.types";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllTables } from "@/features/tables/hooks/useGetAllTables";

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
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl overflow-hidden transition-all border flex flex-col h-[200px]
    ${selected ? "border-primary border-2 cursor-pointer" : "border-border hover:border-primary/30 cursor-pointer"}`}
    >
      <div className="flex-1 flex items-center justify-center p-2 min-h-0">
        <svg viewBox="0 0 260 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ overflow: "visible" }}>
          {/* Table surface */}
          <rect x="65" y="58" width="130" height="90" rx="12" style={{ fill: "var(--bg-card)", stroke: "var(--border)" }} strokeWidth="1.5" />

          <text x="130" y="99" textAnchor="middle" fontSize="13" fontWeight="700" style={{ fill: "var(--text-main)" }}>
            {table.tableName}
          </text>
          {table.currentOrderId && (
            <text x="130" y="115" textAnchor="middle" fontSize="9" style={{ fill: "var(--text-muted)" }}>
              {table.currentOrderId}
            </text>
          )}

          {/* TOP LEFT chair */}
          <circle cx="95" cy="38" r="14" style={{ fill: "var(--bg-card)", stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M83 25 Q95 16 107 25" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M80 21 Q95 10 110 21" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.3" opacity="0.6" />
          <path d="M77 17 Q95  4 113 17" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.1" opacity="0.4" />

          {/* TOP RIGHT chair */}
          <circle cx="165" cy="38" r="14" style={{ fill: "var(--bg-card)", stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M153 25 Q165 16 177 25" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M150 21 Q165 10 180 21" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.3" opacity="0.6" />
          <path d="M147 17 Q165  4 183 17" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.1" opacity="0.4" />

          {/* BOTTOM LEFT chair */}
          <circle cx="95" cy="168" r="14" style={{ fill: "var(--bg-card)", stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M83 181 Q95 190 107 181" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M80 185 Q95 196 110 185" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.3" opacity="0.6" />
          <path d="M77 189 Q95 202 113 189" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.1" opacity="0.4" />

          {/* BOTTOM RIGHT chair */}
          <circle cx="165" cy="168" r="14" style={{ fill: "var(--bg-card)", stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M153 181 Q165 190 177 181" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M150 185 Q165 196 180 185" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.3" opacity="0.6" />
          <path d="M147 189 Q165 202 183 189" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.1" opacity="0.4" />

          {/* LEFT chair */}
          <circle cx="34" cy="103" r="14" style={{ fill: "var(--bg-card)", stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M20 91  Q11 103 20 115" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M16 87  Q 6 103 16 119" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.3" opacity="0.6" />
          <path d="M12 83  Q 1 103 12 123" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.1" opacity="0.4" />

          {/* RIGHT chair */}
          <circle cx="226" cy="103" r="14" style={{ fill: "var(--bg-card)", stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M240 91  Q249 103 240 115" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.5" />
          <path d="M244 87  Q254 103 244 119" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.3" opacity="0.6" />
          <path d="M248 83  Q259 103 248 123" fill="none" style={{ stroke: "var(--text-main)" }} strokeWidth="1.1" opacity="0.4" />
        </svg>
      </div>

      {/* Status bar */}
      <div className={`h-1.5 shrink-0 ${STATUS_COLOR[table.status]}`} />
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
      <div className="bg-background border-b border-border p-3 flex flex-col gap-2.5">
        <Tabs value={filter} onValueChange={(val) => setFilter(val as FilterType)}>
          <TabsList className="bg-transparent gap-2 p-0">
            {(["all", "Free", "Occupied"] as FilterType[]).map((v) => (
              <TabsTrigger key={v} value={v} className="rounded-lg border border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:bg-primary/10 data-[state=active]:shadow-none! text-muted-foreground text-xs capitalize">
                {v === "all" ? t("all_tables") : v === "Free" ? t("table_free") : t("table_occupied")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {/* Table grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 mt-4 flex-1 overflow-y-auto pb-4">{filtered.length === 0 ? <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 flex items-center justify-center text-muted-foreground text-sm py-12">{t("no_tables_found")}</div> : filtered?.map((table) => <TableCard key={table.id} table={table} selected={selectedTable === table.id} onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)} />)}</div>{" "}
      <div className="bg-background border-t border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(
            [
              ["bg-green-500", t("table_free")],
              ["bg-red-500", t("table_occupied")],
            ] as [string, string][]
          ).map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
                  <div className="text-sm font-black text-foreground"> {selectedTable}</div>
                  <div className="text-xs text-muted-foreground">{table?.currentOrderId ? `${t("order_hash")}${table.currentOrderId}` : t("table_free")}</div>
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
                            price: item.unitPrice + item.taxAmount,
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
                        setSelectedCustomer({ id: detailsOrder.id, customerName: detailsOrder.customerName } as Customer);
                        setOrderType("dine-in");
                        setSelectedTable2(selectedTable);
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
                            price: item.unitPrice + item?.taxAmount,
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
                        setSelectedTable2(selectedTable);
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
                      setSelectedTable2(selectedTable);
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
