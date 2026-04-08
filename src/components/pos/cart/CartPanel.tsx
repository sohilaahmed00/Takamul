import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Pause, Plus, X, ChevronsUpDown, Check, SlidersHorizontal, Trash2, Percent, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import type { Customer } from "@/features/customers/types/customers.types";
import { calcItemTax, calcTotals, CartItem, itemBasePrice, itemTotal } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import { useGetAllAdditions } from "@/features/Additions/hooks/useGetAllAdditions";
import type { Addition } from "@/features/Additions/types/additions.types";
import { useGetGiftCards } from "@/features/gift-cards/hooks/useGetGiftCards";
import { GiftCard } from "@/features/gift-cards/types/giftCard.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useToast from "@/hooks/useToast";
import { useGetAllFreeTables } from "@/features/pos/hooks/useGetFreeTables";
import { useGetAllTables } from "@/features/pos/hooks/useGetAllTables";
import { Table } from "@/features/pos/types/pos.types";
import ComboboxField from "@/components/ui/ComboboxField";

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
      <PopoverContent className="w-52 p-3" align="end" side="top">
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

function CouponTab() {
  const { discount, setDiscount, sub, tax, setSelectedGiftCardId } = (() => {
    const ctx = usePos();
    const { sub, tax } = calcTotals(ctx.cart, ctx.discount);
    return { ...ctx, sub, tax };
  })();

  const { data: giftCards } = useGetGiftCards();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid" | "used">("idle");
  const [appliedCard, setAppliedCard] = useState<GiftCard | null>(null);

  const handleApply = () => {
    const card = giftCards?.items?.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());

    if (!card) return setStatus("invalid");
    if (!card.isActive || card.isDeleted) return setStatus("used");

    const total = sub + tax;
    const deduct = Math.min(card.remainingAmount, total);

    setDiscount(deduct);
    setAppliedCard(card);
    setSelectedGiftCardId(card?.id);
    setStatus("valid");
  };

  const handleClear = () => {
    setCode("");
    setStatus("idle");
    setAppliedCard(null);
    setDiscount(0);
  };

  return (
    <>
      <Input
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setStatus("idle");
        }}
        placeholder="Enter coupon code..."
        className={`w-full mb-2 ${status === "invalid" || status === "used" ? "border-red-300" : status === "valid" ? "border-green-400" : ""}`}
      />

      {/* Status feedback */}
      {status === "invalid" && <div className="text-xs text-red-500 font-semibold mb-2"> الكود غير صحيح</div>}
      {status === "used" && <div className="text-xs text-red-500 font-semibold mb-2">الكارت غير نشط أو محذوف</div>}
      {status === "valid" && appliedCard && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 mb-2 flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-green-700">{appliedCard.code}</div>
            <div className="text-[10px] text-green-600 mt-0.5">{appliedCard.customerName}</div>
            {appliedCard.expiryDate && <div className="text-[10px] text-gray-400">Expires: {new Date(appliedCard.expiryDate).toLocaleDateString()}</div>}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Remaining Balance</div>
            <div className="text-sm font-black text-green-700">${appliedCard.remainingAmount.toFixed(2)}</div>
            <button onClick={handleClear} className="text-[10px] text-red-400 hover:text-red-600 mt-1">
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button size={"2xl"} className="flex-1" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button size={"2xl"} className="flex-1" onClick={handleApply} disabled={!code.trim()}>
          Apply
        </Button>
      </div>
    </>
  );
}
// ── Discount Popover ─────────────────────────────────────────────────────────
function DiscountPopover({ item, idx, onDiscChange, onDiscTypeToggle, onDiscClear }: { item: CartItem; idx: number; onDiscChange: (idx: number, type: "pct" | "flat", raw: string) => void; onDiscTypeToggle: (idx: number) => void; onDiscClear: (idx: number) => void }) {
  const [raw, setRaw] = useState(String(item.itemDiscount?.value ?? ""));

  useEffect(() => {
    setRaw(String(item.itemDiscount?.value ?? ""));
  }, [item.itemDiscount?.value]);

  const hasDisc = !!item.itemDiscount && item.itemDiscount.value > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors
          ${hasDisc ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-400 hover:border-primary/40"}`}
        >
          <Percent size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="end" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="text-xs text-gray-400 font-semibold mb-2">Item Discount</div>
        <div className="flex items-center gap-1">
          <button onClick={() => onDiscTypeToggle(idx)} className="w-8 h-8 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:border-primary/40 shrink-0">
            {(item.itemDiscount?.type ?? "pct") === "pct" ? "%" : "$"}
          </button>
          <input
            className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none text-right font-semibold focus:border-primary/40 bg-white"
            value={raw}
            placeholder="0"
            type="number"
            min="0"
            onChange={(e) => {
              setRaw(e.target.value);
              onDiscChange(idx, item.itemDiscount?.type ?? "pct", e.target.value);
            }}
          />
          {hasDisc && (
            <button
              onClick={() => {
                onDiscClear(idx);
                setRaw("");
              }}
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-100 shrink-0"
            >
              <X size={10} className="text-gray-500" />
            </button>
          )}
        </div>
        {hasDisc && <div className="text-[10px] text-primary font-semibold mt-1.5">{item.itemDiscount!.type === "pct" ? `${item.itemDiscount!.value}% off` : `-$${item.itemDiscount!.value.toFixed(2)}`}</div>}
      </PopoverContent>
    </Popover>
  );
}

// ── Extras Popover ───────────────────────────────────────────────────────────
function ExtrasPopover({ item, idx, additions, onToggleExtra }: { item: CartItem; idx: number; additions: Addition[]; onToggleExtra: (idx: number, id: number, name: string) => void }) {
  const hasExtras = (item.extras ?? []).length > 0;
  const selectedExtraIds = (item.extras ?? []).map((e) => e.id!).filter(Boolean);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors
          ${hasExtras ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-400 hover:border-primary/40"}`}
        >
          <Plus size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="text-xs text-gray-400 font-semibold mb-2">الإضافات</div>
        <ExtrasCombobox selectedIds={selectedExtraIds} onToggle={(id, name) => onToggleExtra(idx, id, name)} additions={additions} />
        {hasExtras && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.extras!.map((ex) => (
              <div key={ex.id} className="px-2 py-0.5 bg-primary/5 border border-primary/20 rounded-full text-[10px] text-primary font-semibold">
                {ex.name}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Main CartPanel ────────────────────────────────────────────────────────────
export default function CartPanel() {
  const { cart, setCart, discount, setDiscount, setScreen, handleHold, setSelectedCustomer, selectedCustomer, orderType, handleCreateDineInOrder, selectedTable } = usePos();
  const { data } = useGetGiftCards();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("add");
  const [discType, setDiscType] = useState<"pct" | "flat">("pct");
  const [discInput, setDiscInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { data: tables } = useGetAllTables();

  const { data: customers, isLoading: loadingCustomers } = useGetAllCustomers({ page: 1, limit: 100 });
  const { data: additions } = useGetAllAdditions();
  const { sub, tax: taxAfterDiscount, total } = calcTotals(cart, discount);
  const { tax: originalTax } = calcTotals(cart, 0);
  const { notifyError, notifySuccess } = useToast();

  const removeItem = (idx: number) => setCart((p) => p.filter((_, i) => i !== idx));

  const changeQty = (idx: number, d: number) => setCart((p) => p.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)));

  // ── per-item discount ──────────────────────────────────────────────────────
  const setItemDisc = (idx: number, type: "pct" | "flat", raw: string) => {
    const value = parseFloat(raw);
    const capped = type === "pct" ? Math.min(value, 100) : value;
    setCart((p) =>
      p.map((item, i) =>
        i === idx
          ? {
              ...item,
              itemDiscount: raw === "" || isNaN(value) ? null : { type, value: capped },
            }
          : item,
      ),
    );
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
    const base = sub + taxAfterDiscount;
    setDiscount(discType === "pct" ? (base * val) / 100 : val);
    setActiveTab("add");
  };

  const GRID = "grid grid-cols-[20px_minmax(0,1fr)_85px_55px_45px_50px_85px] gap-2 px-2";
  return (
    <>
      <div className="bg-white flex flex-col" style={{ width: 550 }}>
        {/* Head – Customer selector */}
        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
          {!selectedCustomer ? (
            <div className="w-full">
              <ComboboxField
                value={selectedCustomer ? String(selectedCustomer.id) : ""}
                onChange={(val) => {
                  const customer = customers?.items?.find((c) => String(c.id) === String(val));
                  if (customer) setSelectedCustomer(customer);
                }}
                items={customers?.items}
                valueKey="id"
                labelKey="customerName"
                placeholder="اختر العميل..."
              />
            </div>
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
          {cart?.length === 0 ? (
            <div className="p-5 text-center text-gray-400 text-xs">Cart is empty</div>
          ) : (
            <>
              {/* Table header */}
              <div className={`${GRID} py-1.5 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase`}>
                <span>#</span>
                <span>الصنف</span>
                <span className="text-center">الكمية</span>
                <span className="px-2 border-r border-gray-100 text-right flex items-center justify-end gap-1">
                  السعر
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={10} className="text-gray-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      السعر قبل الضريبة
                    </TooltipContent>
                  </Tooltip>
                </span>{" "}
                <span className="text-right">الضريبة</span>
                <span className="text-right">الإجمالي</span>
                <span className="text-center">عمليات</span>
              </div>

              {cart?.map((item, idx) => {
                const total = itemTotal(item);
                const hasDisc = !!item.itemDiscount && item.itemDiscount.value > 0;
                const origTotal = item.price * item.qty;

                return (
                  <div key={idx} className={`${GRID} py-2 items-center border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-[#f6f6f6]"}`}>
                    {/* # */}
                    <span className="text-xs text-gray-400 font-medium">{idx + 1}</span>
                    {/* الاسم */}
                    <div className="min-w-0 overflow-hidden">
                      <div className="text-xs font-bold text-gray-800 truncate">{item.name}</div>
                      {(item.extras ?? []).length > 0 && <div className="text-[10px] text-gray-400 truncate">+ {item.extras!.map((e) => e.name).join("، ")}</div>}
                      {hasDisc && <div className="text-[10px] text-primary font-semibold">{item.itemDiscount!.type === "pct" ? `${item.itemDiscount!.value}% off` : `-$${item.itemDiscount!.value.toFixed(2)}`}</div>}
                    </div>
                    {/* الكمية */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button onClick={() => changeQty(idx, -1)} className="px-1.5 py-1 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                        −
                      </button>
                      <span className="flex-1 py-1 text-xs font-semibold text-center border-x border-gray-200">{item.qty}</span>
                      <button onClick={() => changeQty(idx, 1)} className="px-1.5 py-1 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                        +
                      </button>
                    </div>
                    {/* السعر قبل الضريبة */}
                    <div className="text-right">
                      {hasDisc && <div className="text-[10px] text-gray-300 line-through">${origTotal.toFixed(2)}</div>}
                      <div className="text-xs font-semibold text-gray-700">${itemBasePrice(item).toFixed(2)}</div>
                    </div>
                    {/* ض.ق.م */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">${calcItemTax(item).toFixed(2)}</div>{" "}
                    </div>
                    {/* الإجمالي */}
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-800">${(itemBasePrice(item) + calcItemTax(item)).toFixed(2)}</div>{" "}
                    </div>
                    {/* عمليات */}
                    <div className="flex items-center justify-center gap-1">
                      <DiscountPopover
                        item={item}
                        idx={idx}
                        onDiscChange={setItemDisc}
                        onDiscTypeToggle={(i) => {
                          const nextType = (item.itemDiscount?.type ?? "pct") === "pct" ? "flat" : "pct";
                          setItemDisc(i, nextType, String(item.itemDiscount?.value ?? ""));
                        }}
                        onDiscClear={(i) => setCart((p) => p.map((it, j) => (j === i ? { ...it, itemDiscount: null } : it)))}
                      />
                      <ExtrasPopover item={item} idx={idx} additions={additions ?? []} onToggleExtra={toggleExtra} />
                      <div role="button" onClick={() => removeItem(idx)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer">
                        <Trash2 size={13} className="text-gray-400 hover:text-red-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
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
                <div className="flex items-center gap-1.5">
                  {discount > 0 && <span className="text-gray-300 line-through text-[10px]">${sub?.toFixed(2)}</span>}
                  <span className="font-semibold text-gray-800">${Math.max(0, sub - discount).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Tax</span>
                <div className="flex items-center gap-1.5">
                  {discount > 0 && <span className="text-gray-300 line-through text-[10px]">${originalTax.toFixed(2)}</span>}
                  <span className="font-semibold text-gray-800">${taxAfterDiscount.toFixed(2)}</span>
                </div>
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
                <div className="flex items-center gap-1.5">
                  {discount > 0 && <span className="text-gray-300 line-through text-xs font-normal">${(sub + originalTax).toFixed(2)}</span>}
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size={"2xl"} onClick={handleHold} className="flex-1" variant="outline">
                  Hold Cart <Pause />
                </Button>
                <Button
                  size={"2xl"}
                  onClick={() => {
                    if (orderType === "dine-in") {
                      const table = tables?.find((table: Table) => table.id == Number(selectedTable));
                      if (table?.status === "Occupied") {
                        setScreen("cashier");
                      } else {
                        handleCreateDineInOrder();
                      }
                    } else {
                      setScreen("cashier");
                    }
                  }}
                  className="flex-1"
                >
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
              <CouponTab />
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
