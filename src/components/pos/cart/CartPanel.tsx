import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Pause, Plus, X, ChevronsUpDown, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import type { Customer } from "@/features/customers/types/customers.types";
import { calcTotals, itemTotal } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import { useGetAllAdditions } from "@/features/Additions/hooks/useGetAllAdditions";
import type { Addition } from "@/features/Additions/types/additions.types";

const TABS = ["add", "discount", "coupon", "note"] as const;
const TAB_LABELS: Record<string, string> = {
  add: "Add",
  discount: "Discount",
  coupon: "Coupon Code",
  note: "Note",
};

// ── Extras combobox for a single cart item ────────────────────────────────────
function ExtrasCombobox({ selectedIds, onToggle, additions }: { selectedIds: number[]; onToggle: (id: number, name: string) => void; additions: Addition[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:border-primary/40 bg-white focus:outline-none">
          <span>{selectedIds.length > 0 ? `${selectedIds.length} إضافة مختارة` : "اختر الإضافات..."}</span>
          <ChevronsUpDown size={12} className="text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="ابحث..." className="text-xs h-8" />
          <CommandList>
            <CommandEmpty className="text-xs text-center py-3 text-gray-400">لا توجد نتائج</CommandEmpty>
            <CommandGroup>
              {additions.map((a) => {
                const isSelected = selectedIds.includes(a.id);
                return (
                  <CommandItem key={a.id} value={a.additionNameAr} onSelect={() => onToggle(a.id, a.additionNameAr)} className="text-xs flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary border-primary" : "border-gray-300"}`}>{isSelected && <Check size={10} className="text-white" />}</div>
                    {a.additionNameAr}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ── Main CartPanel ────────────────────────────────────────────────────────────
export default function CartPanel() {
  const { cart, setCart, discount, setDiscount, setScreen, handleHold } = usePos();

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("add");
  const [discType, setDiscType] = useState<"pct" | "flat">("pct");
  const [discInput, setDiscInput] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: customers, isLoading: loadingCustomers } = useGetAllCustomers({ page: 1, limit: 100 });
  const { data: additions } = useGetAllAdditions();
  const { sub, tax, pay } = calcTotals(cart, discount);

  const removeItem = (idx: number) => setCart((p) => p.filter((_, i) => i !== idx));

  const changeQty = (idx: number, d: number) => setCart((p) => p.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)));

  // ── per-item discount ──────────────────────────────────────────────────────
  const setItemDisc = (idx: number, type: "pct" | "flat", raw: string) => {
    const value = parseFloat(raw);
    setCart((p) => p.map((item, i) => (i === idx ? { ...item, itemDiscount: !isNaN(value) && value > 0 ? { type, value } : null } : item)));
  };

  // ── per-item extras (toggle by id) ────────────────────────────────────────
  const toggleExtra = (itemIdx: number, additionId: number, additionName: string) => {
    setCart((p) =>
      p.map((item, i) => {
        if (i !== itemIdx) return item;
        const extras = item.extras ?? [];
        const exists = extras.find((e) => e.id === additionId);
        return {
          ...item,
          extras: exists ? extras.filter((e) => e.id !== additionId) : [...extras, { id: additionId, name: additionName, price: 0 }],
        };
      }),
    );
  };

  const removeExtra = (itemIdx: number, additionId: number) => {
    setCart((p) => p.map((item, i) => (i === itemIdx ? { ...item, extras: (item.extras ?? []).filter((e) => e.id !== additionId) } : item)));
  };

  // ── order-level discount ───────────────────────────────────────────────────
  const applyDiscount = () => {
    const val = parseFloat(discInput) || 0;
    setDiscount(discType === "pct" ? Math.round((sub * val) / 100) : val);
    setActiveTab("add");
    setDiscInput("");
  };

  return (
    <>
      <div className="bg-white flex flex-col" style={{ width: 450 }}>
        {/* Head – Customer selector */}
        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
          {!selectedCustomer ? (
            <Select
              onValueChange={(val) => {
                const customer = customers?.items?.find((c) => String(c.id) === val);
                if (customer) setSelectedCustomer(customer);
              }}
            >
              <SelectTrigger className="flex-1 text-xs h-8">
                <SelectValue placeholder="اختر العميل..." />
              </SelectTrigger>
              <SelectContent>
                {loadingCustomers ? (
                  <SelectItem value="loading" disabled>
                    جاري التحميل...
                  </SelectItem>
                ) : (
                  customers?.items?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.customerName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2 flex-1 px-2.5 py-1.5 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">{selectedCustomer.customerName.slice(0, 2).toUpperCase()}</div>
              <span className="text-xs font-bold text-primary flex-1 truncate">{selectedCustomer.customerName}</span>
              <button onClick={() => setSelectedCustomer(null)} className="text-primary/60 hover:text-primary text-base leading-none">
                ×
              </button>
            </div>
          )}
          <Button size="icon-sm" variant="outline" onClick={() => setOpenDialog(true)}>
            <Plus size={14} />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1">
          {cart.length === 0 ? (
            <div className="p-5 text-center text-gray-400 text-xs">Cart is empty</div>
          ) : (
            <Accordion type="single" collapsible>
              {cart.map((item, idx) => {
                const total = itemTotal(item);
                const hasDisc = !!item.itemDiscount && item.itemDiscount.value > 0;
                const origTotal = item.price * item.qty;
                const selectedExtraIds = (item.extras ?? []).map((e) => e.id!).filter(Boolean);

                return (
                  <AccordionItem key={idx} value={String(idx)} className={`rounded-lg border-none ${idx % 2 === 0 ? "bg-white" : "bg-[#f6f6f6]"}`}>
                    {/* ── Row header ── */}
                    <AccordionTrigger className="flex items-center gap-1.5 py-2 px-2 hover:no-underline flex-wrap">
                      <span className="text-xs text-gray-500 min-w-3 font-medium">{idx + 1}</span>
                      <div className="flex-1 min-w-0 flex-wrap">
                        <div className="text-xs font-bold text-gray-800 truncate">{item.name}</div>
                        {(item.extras ?? []).length > 0 && <div className="text-[10px] text-gray-400 truncate flex-wrap">+ {item.extras!.map((e) => e.name).join("، ")}</div>}
                        {hasDisc && <div className="text-[10px] text-primary font-semibold">{item.itemDiscount!.type === "pct" ? `${item.itemDiscount!.value}% off` : `-$${item.itemDiscount!.value.toFixed(2)}`}</div>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-bold text-gray-800">${total.toFixed(2)}</div>
                        {hasDisc && <div className="text-xs text-gray-300 line-through">${origTotal.toFixed(2)}</div>}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(idx);
                        }}
                        className="text-white bg-[#a1a1a1] rounded-full size-4 flex items-center justify-center hover:bg-red-400 text-[14px] pe-[0.5px] pb-[1.5px] shrink-0 transition-colors"
                      >
                        ×
                      </button>
                    </AccordionTrigger>

                    {/* ── Expanded content ── */}
                    <AccordionContent>
                      <div className={`px-3 pb-3 pt-1 flex flex-col gap-3 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        {/* Qty + Item discount */}
                        <div className="flex gap-2 items-end">
                          {/* Qty */}
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-1.5">Quantity</div>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <button onClick={() => changeQty(idx, -1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                                −
                              </button>
                              <span className="flex-1 py-1.5 text-xs font-semibold text-center border-x border-gray-200">{item.qty}</span>
                              <button onClick={() => changeQty(idx, 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                                +
                              </button>
                            </div>
                          </div>

                          {/* Item discount */}
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-1.5">Item discount</div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  const nextType = (item.itemDiscount?.type ?? "pct") === "pct" ? "flat" : "pct";
                                  setItemDisc(idx, nextType, String(item.itemDiscount?.value ?? ""));
                                }}
                                className="w-8 h-8 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:border-primary/40 shrink-0"
                              >
                                {(item.itemDiscount?.type ?? "pct") === "pct" ? "%" : "$"}
                              </button>
                              <input className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none text-right font-semibold focus:border-primary/40 bg-white" value={item.itemDiscount?.value ?? ""} placeholder="0" type="number" min="0" onChange={(e) => setItemDisc(idx, item.itemDiscount?.type ?? "pct", e.target.value)} />
                              {hasDisc && (
                                <button onClick={() => setCart((p) => p.map((it, i) => (i === idx ? { ...it, itemDiscount: null } : it)))} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-100 shrink-0">
                                  <X size={10} className="text-gray-500" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Extras combobox ── */}
                        <div>
                          <div className="text-xs text-gray-400 mb-1.5">الإضافات</div>
                          <ExtrasCombobox selectedIds={selectedExtraIds} onToggle={(id, name) => toggleExtra(idx, id, name)} additions={additions ?? []} />
                          {/* selected extras tags */}
                          {/* {(item.extras ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.extras!.map((ex) => (
                                <div key={ex.id} className="flex items-center gap-1 px-2 py-0.5 bg-primary/5 border border-primary/20 rounded-full text-[10px] text-primary font-semibold">
                                  <span>{ex.name}</span>
                                  <button onClick={() => removeExtra(idx, ex.id!)} className="text-primary/40 hover:text-red-400 leading-none">
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 flex-shrink-0">
          <div className="flex px-3 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs py-2 px-1.5 border-b-2 whitespace-nowrap transition-colors duration-150
                  ${activeTab === tab ? "border-primary text-primary font-bold" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          {activeTab === "add" && (
            <div className="px-3 pt-2.5 pb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${sub.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Tax</span>
                <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1.5 items-center">
                <span className={discount > 0 ? "text-primary font-semibold" : "text-gray-500"}>Discount</span>
                <div className="flex items-center gap-1">
                  <span className={`font-semibold ${discount > 0 ? "text-gray-800" : "text-gray-400"}`}>-${discount.toFixed(2)}</span>
                  {discount > 0 && (
                    <button onClick={() => setDiscount(0)} className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-gray-300 leading-none">
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-800 mt-2 pt-1 border-t border-gray-100 mb-3">
                <span>Payable Amount</span>
                <span>${pay.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button size={"2xl"} onClick={handleHold} className="flex-1" variant="outline">
                  Hold Cart <Pause />
                </Button>
                <Button size={"2xl"} onClick={() => setScreen("cashier")} className="flex-1">
                  Proceed <CircleArrowRight />
                </Button>
              </div>
            </div>
          )}

          {activeTab === "discount" && (
            <div className="p-3">
              <div className="text-sm font-bold text-gray-800 mb-3">Order Discount</div>
              <div className="flex gap-2 mb-3 items-center">
                <button onClick={() => setDiscType("flat")} className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold border-2 transition-all flex-shrink-0 ${discType === "flat" ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-400"}`}>
                  $
                </button>
                <button onClick={() => setDiscType("pct")} className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold border-2 transition-all flex-shrink-0 ${discType === "pct" ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-400"}`}>
                  %
                </button>
                <input value={discInput} onChange={(e) => setDiscInput(e.target.value)} className="flex-1 h-12 px-3 border border-gray-200 rounded-xl text-sm outline-none text-right font-semibold focus:border-primary/40 bg-white" placeholder="0" type="number" min="0" />
              </div>
              <div className="flex gap-2">
                <Button size={"2xl"} className="flex-1" onClick={() => setActiveTab("add")} variant="outline">
                  Cancel
                </Button>
                <Button size={"2xl"} className="flex-1" onClick={applyDiscount}>
                  Add
                </Button>
              </div>
            </div>
          )}

          {activeTab === "coupon" && (
            <div className="p-3">
              <Input className="mb-2" placeholder="Enter coupon code..." />
              <div className="flex gap-2">
                <Button size={"2xl"} className="flex-1" onClick={() => setActiveTab("add")} variant="outline">
                  Cancel
                </Button>
                <Button size={"2xl"} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          )}

          {activeTab === "note" && (
            <div className="p-3">
              <textarea className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-xs outline-none mb-2 resize-none focus:border-primary/40" rows={2} placeholder="Add order note..." />
              <div className="flex gap-2">
                <Button size={"2xl"} className="flex-1" variant="outline">
                  Clear
                </Button>
                <Button size={"2xl"} className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddParnterModal isOpen={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
}
