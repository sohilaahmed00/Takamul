import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Pause, Plus, X, ChevronsUpDown, Check, Trash2, Percent, Info, SaudiRiyal, Vault, FileText, MessageCircle, Mail, Save, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import AddParnterModal from "@/components/modals/AddParnterModal";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { calcItemTax, calcTotals, CartItem, DELIVERY_COMPANIES, itemBasePrice, itemTotal, OrderType } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import { useGetAllAdditions } from "@/features/Additions/hooks/useGetAllAdditions";
import type { Addition } from "@/features/Additions/types/additions.types";
import { useGetGiftCards } from "@/features/gift-cards/hooks/useGetGiftCards";
import { GiftCard } from "@/features/gift-cards/types/giftCard.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useToast from "@/hooks/useToast";
import { useGetAllTables } from "@/features/pos/hooks/useGetAllTables";
import ComboboxField from "@/components/ui/ComboboxField";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Numpad } from "../cashier/CashierPanel";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { Treasury } from "@/features/treasurys/types/treasurys.types";

const TABS = ["add", "discount", "coupon", "note"] as const;

// ── Extras combobox for a single cart item ────────────────────────────────────
function ExtrasCombobox({ selectedIds, onToggle, additions }: { selectedIds: number[]; onToggle: (id: number, name: string) => void; additions: Addition[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:border-primary/40 bg-white focus:outline-none">
          <span>{selectedIds.length > 0 ? `${selectedIds.length} ${t("selected_additions")}` : t("choose_additions")}</span>
          <ChevronsUpDown size={12} className="text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="end" side="top">
        <Command>
          <CommandInput placeholder={t("search") || "ابحث..."} className="text-xs h-8" />
          <CommandList>
            <CommandEmpty className="text-xs text-center py-3 text-gray-400">{t("no_results") || "لا توجد نتائج"}</CommandEmpty>
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
  const { cart, discount, setDiscount, setSelectedGiftCardId } = usePos();
  const { sub, tax } = useMemo(() => calcTotals(cart, discount), [cart, discount]);
  const { t } = useLanguage();

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
    setSelectedGiftCardId(card.id);
    setStatus("valid");
  };

  const handleClear = () => {
    setCode("");
    setStatus("idle");
    setAppliedCard(null);
    setDiscount(0);
    setSelectedGiftCardId(null);
  };

  return (
    <>
      <Input
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setStatus("idle");
        }}
        placeholder={t("enter_coupon_code")}
        className={`w-full mb-2 ${status === "invalid" || status === "used" ? "border-red-300" : status === "valid" ? "border-green-400" : ""}`}
      />

      {status === "invalid" && <div className="text-xs text-red-500 font-semibold mb-2">{t("invalid_code")}</div>}
      {status === "used" && <div className="text-xs text-red-500 font-semibold mb-2">{t("inactive_or_deleted_card")}</div>}
      {status === "valid" && appliedCard && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 mb-2 flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-green-700">{appliedCard.code}</div>
            <div className="text-[10px] text-green-600 mt-0.5">{appliedCard.customerName}</div>
            {appliedCard.expiryDate && (
              <div className="text-[10px] text-gray-400">
                {t("expires_on")} {new Date(appliedCard.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">{t("remaining_balance")}</div>
            <div className="text-sm font-black text-green-700">${appliedCard.remainingAmount.toFixed(2)}</div>
            <button onClick={handleClear} className="text-[10px] text-red-400 hover:text-red-600 mt-1">
              {t("remove")}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button size="2xl" className="flex-1" variant="destructive" onClick={handleClear}>
          {t("clear")}
        </Button>
        <Button size="2xl" className="flex-1" onClick={handleApply} disabled={!code.trim()}>
          {t("apply")}
        </Button>
      </div>
    </>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-6 h-6 rounded-full border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center text-base leading-none">
      ×
    </button>
  );
}

interface ItemNumPadDialogProps {
  item: CartItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  additions: Addition[];
  onQtyChange: (qty: number) => void;
  onDiscountChange: (discount: { type: "pct" | "flat"; value: number } | null) => void;
  onSaveExtras: (selectedIds: number[]) => void;
}

type Tab = "qty" | "disc" | "extras";

// ── Main Component ─────────────────────────────────────────────────────────────

export function ItemNumPadDialog({ item, open, onOpenChange, additions, onQtyChange, onDiscountChange, onSaveExtras }: ItemNumPadDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("qty");
  const [inputBuffer, setInputBuffer] = useState("0");
  const [discType, setDiscType] = useState<"pct" | "flat">("pct");
  const [isFirstInput, setIsFirstInput] = useState(true);

  const currentValue = parseFloat(inputBuffer) || 0;
  const selectedExtraIds = (item?.extras ?? []).map((e) => e.id!).filter(Boolean);
  const hasExtras = selectedExtraIds.length > 0;
  const [localExtras, setLocalExtras] = useState<number[]>([]);

  useEffect(() => {
    if (item && open) {
      setLocalExtras(item.extras?.map((e) => e.id!) ?? []);
    }
  }, [item, open]);

  const handleToggleExtra = (id: number, name: string) => {
    setLocalExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  useEffect(() => {
    if (item && open) {
      setActiveTab("qty");
      setInputBuffer(String(item.qty));
      setDiscType(item.itemDiscount?.type ?? "pct");
      setIsFirstInput(true);
    }
  }, [item?.name, open]);

  const handleKey = useCallback(
    (key: string) => {
      if (key === "cancel") {
        onOpenChange(false);
        return;
      }
      setInputBuffer((prev) => {
        if (isFirstInput && key !== "⌫" && key !== "del") {
          setIsFirstInput(false);
          if (key === "00") return "0";
          if (key === ".") return "0.";
          return key;
        }
        if (key === "⌫" || key === "del") return prev.length > 1 ? prev.slice(0, -1) : "0";
        if (key === "00") return prev === "0" ? "0" : prev + "00";
        if (key === ".") return prev.includes(".") ? prev : prev + ".";
        return prev === "0" ? key : prev + key;
      });
    },
    [onOpenChange, isFirstInput],
  );

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "qty") setInputBuffer(String(item?.qty ?? 1));
    else if (tab === "disc") setInputBuffer(String(item?.itemDiscount?.value ?? 0));
    setIsFirstInput(true);
  };

  const clearInput = () => {
    setInputBuffer("0");
    setIsFirstInput(true);
  };

  const handleDone = () => {
    if (activeTab === "qty") {
      onQtyChange(Math.max(1, Math.floor(currentValue)));
    } else if (activeTab === "disc") {
      onDiscountChange(currentValue === 0 ? null : { type: discType, value: currentValue });
    }
    onOpenChange(false);
  };

  const applyShortcut = (val: number) => {
    setDiscType("pct");
    setInputBuffer(String(val));
    setIsFirstInput(false);
  };

  if (!item) return null;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "qty", label: "الكمية" },
    { key: "disc", label: "الخصم" },
    { key: "extras", label: "الإضافات", badge: hasExtras ? selectedExtraIds.length : undefined },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0 max-w-sm w-full">
        {/* ── Header ── */}
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-right text-sm font-semibold text-foreground/80 truncate">{item.name}</DialogTitle>
        </DialogHeader>

        {/* ── Tabs ── */}
        <div className="flex mt-3 border-b border-border">
          {tabs.map(({ key, label, badge }) => {
            const isActive = activeTab === key;
            return (
              <button key={key} onClick={() => switchTab(key)} className={cn("flex-1 py-3 text-[13px] font-semibold transition-all duration-150 border-b-2 -mb-px relative", isActive ? "border-primary text-foreground bg-muted/50" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30")}>
                {label}
                {badge !== undefined && <span className="absolute -top-1 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold leading-none">{badge}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Content Area ── */}
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          {/* Qty */}
          {activeTab === "qty" && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">الكمية</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">{inputBuffer}</span>
                <span className="text-xs text-muted-foreground">قطعة</span>
                <ClearButton onClick={clearInput} />
              </div>
            </div>
          )}

          {activeTab === "disc" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <button onClick={() => setDiscType((t) => (t === "pct" ? "flat" : "pct"))} className="flex items-center gap-2 bg-background border border-border rounded-full px-3 py-1.5 hover:bg-muted/50 transition-colors">
                  <span className={cn("text-xs font-medium transition-colors", discType === "flat" ? "text-foreground" : "text-muted-foreground")}>ر.س</span>
                  <div className="relative w-8 h-4 bg-muted rounded-full">
                    <div className={cn("absolute top-0.5 w-3 h-3 bg-primary rounded-full transition-all duration-200", discType === "pct" ? "right-0.5" : "left-0.5")} />
                  </div>
                  <span className={cn("text-xs font-medium transition-colors", discType === "pct" ? "text-foreground" : "text-muted-foreground")}>%</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">{inputBuffer}</span>
                  <span className="text-xs text-muted-foreground">{discType === "pct" ? "%" : "ر.س"}</span>
                  <ClearButton onClick={clearInput} />
                </div>
              </div>
            </div>
          )}

          {/* Extras — grid cards */}
          {activeTab === "extras" && <ExtrasGrid additions={additions} selectedIds={localExtras} onToggle={handleToggleExtra} />}
        </div>

        {/* ── Numpad (qty & disc only) ── */}
        {activeTab !== "extras" && (
          <div className="px-3 pt-3 pb-2 bg-background">
            <Numpad onKey={handleKey} />
          </div>
        )}

        {/* ── Footer ── */}
        <div className="grid grid-cols-2 gap-2 px-3 pb-4 pt-2">
          <Button size="2xl" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            size="2xl"
            className="flex-1"
            onClick={
              activeTab === "extras"
                ? () => {
                    onSaveExtras(localExtras);
                    onOpenChange(false);
                  }
                : handleDone
            }
          >
            {activeTab === "extras" ? "حفظ" : "تم "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Extras Grid ───────────────────────────────────────────────────────────────

function ExtrasGrid({ additions, selectedIds, onToggle }: { additions: Addition[]; selectedIds: number[]; onToggle: (id: number, name: string) => void }) {
  if (!additions.length) {
    return <p className="text-xs text-muted-foreground text-center py-4">لا توجد إضافات متاحة</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {additions.map((addition) => {
        const isSelected = selectedIds.includes(addition.id!);
        return (
          <button key={addition.id} onClick={() => onToggle(addition.id!, addition.additionNameAr)} className={cn("py-3 px-2 rounded-xl border text-[12px] font-semibold transition-all duration-150 active:scale-95 leading-tight", isSelected ? "bg-primary/10 border-primary/40 text-primary" : "bg-background border-border text-foreground hover:bg-muted/60")}>
            {addition.additionNameAr}
          </button>
        );
      })}
    </div>
  );
}

function VaultChips({ value, onChange, treasurys }: { value: number; onChange: (id: number) => void; treasurys: Treasury[] }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" } as React.CSSProperties} onClick={(e) => e.stopPropagation()}>
      {treasurys.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 transition-all flex-shrink-0
              ${active ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <Vault size={10} className={active ? "text-green-600" : "text-gray-400"} />
            <span className={`text-xs font-bold whitespace-nowrap ${active ? "text-green-700" : "text-gray-500"}`}>{v.name}</span>
          </button>
        );
      })}
    </div>
  );
}
interface Split {
  id: string;
  vaultId: number;
  raw: string;
}
export function CashierDialog({ open, onOpenChange, onCancel }: { open: boolean; onOpenChange: (v: boolean) => void; onCancel?: () => void }) {
  const { t } = useLanguage();
  const { data: treasurys } = useGetAllTreasurys();
  const { selectedCustomer, setSelectedCustomer, cart, discount, setPaidAmount, setSelectedVaultId, handleConfirmPayment } = usePos();
  const { total } = calcTotals(cart, discount);

  const [vaultId, setVaultId] = useState<number | null>(null);
  const activeVault = vaultId ?? treasurys?.[0]?.id ?? null;

  const [npRaw, setNpRaw] = useState(() => String(Math.round(total * 100)));
  const [isSplit, setIsSplit] = useState(false);
  const [splits, setSplits] = useState<Split[]>([]);
  const [activeId, _setActiveId] = useState("s1");
  const [justActivated, setJustActivated] = useState(false);
  useEffect(() => {
    if (!isSplit) {
      setNpRaw(String(Math.round(total * 100)));
    }
  }, [total, isSplit]);
  const setActiveId = (id: string) => {
    _setActiveId(id);
    setJustActivated(true);
  };

  useEffect(() => {
    if (treasurys?.length && vaultId === null) {
      setVaultId(treasurys[0].id);
      setSelectedVaultId(treasurys[0].id);
    }
  }, [treasurys]);

  const rawToFloat = (r: string) => parseInt(r || "0") / 100;
  const fmtFloat = (n: number) => n.toFixed(2);

  const pushKey = (k: string) => {
    if (k === "cancel") {
      onCancel?.();
      return;
    }

    const transform = (prev: string) => {
      if (k === "del") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (k === "00") return prev === "0" ? "0" : prev + "00";
      if (k === ".") return prev.includes(".") ? prev : prev + ".";
      return prev === "0" ? k : prev + k;
    };

    if (!isSplit) {
      setNpRaw((p) => transform(p));
    } else {
      setSplits((prev) => {
        const shouldClear = justActivated && k !== "del" && k !== ".";
        const updated = prev.map((s) => {
          if (s.id !== activeId) return s;
          const base = shouldClear ? "0" : s.raw;
          return { ...s, raw: transform(base) };
        });
        const otherIds = prev.map((s) => s.id).filter((id) => id !== activeId);
        if (otherIds.length === 1) {
          const activePaid = updated.find((s) => s.id === activeId)!;
          const remaining = total - rawToFloat(activePaid.raw);
          const remainRaw = remaining > 0 ? String(Math.round(remaining * 100)) : "0";
          return updated.map((s) => (s.id === otherIds[0] ? { ...s, raw: remainRaw } : s));
        }
        return updated;
      });
      if (justActivated) setJustActivated(false);
    }
  };

  const toggleSplit = () => {
    setIsSplit((v) => {
      if (!v) {
        setSplits([
          { id: "s1", vaultId: treasurys?.[0]?.id ?? 0, raw: "0" },
          { id: "s2", vaultId: treasurys?.[0]?.id ?? 0, raw: "0" },
        ]);
        setActiveId("s1");
      }
      return !v;
    });
  };

  const singlePaid = rawToFloat(npRaw);
  const splitPaid = splits.reduce((sum, s) => sum + rawToFloat(s.raw), 0);
  const paid = isSplit ? splitPaid : singlePaid;
  const change = parseFloat((paid - total).toFixed(2));

  useEffect(() => {
    setPaidAmount(paid);
  }, [paid]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md p-0 gap-0 overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "#000052" }}>
          <div className="flex flex-col">
            <DialogTitle className="text-[14px] font-medium text-white">إتمام عملية الدفع</DialogTitle>
            {selectedCustomer && <span className="text-[11px] text-white/60 mt-0.5">{selectedCustomer.customerName}</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/50">{t("payable_amount")}</span>
              <span className="text-[18px] font-black text-green-400">${total.toFixed(2)}</span>
            </div>
            <button onClick={() => onOpenChange(false)} className="w-7 h-7 rounded flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-gray-500">{isSplit ? t("split_between_vaults") : t("destination_vault")}</label>
              <button
                onClick={toggleSplit}
                className={`text-[11px] px-3 py-1 rounded-full font-semibold border transition-colors
                  ${isSplit ? "border-green-500 text-green-600 bg-green-50" : "border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600"}`}
              >
                {isSplit ? t("split_on") : t("split_payment")}
              </button>
            </div>

            {/* Single vault chips */}
            {!isSplit && (
              <VaultChips
                value={activeVault ?? 0}
                onChange={(id) => {
                  setVaultId(id);
                  setSelectedVaultId(id);
                }}
                treasurys={treasurys ?? []}
              />
            )}
          </div>

          {isSplit && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {splits.map((sp) => {
                  const isActive = activeId === sp.id;
                  return (
                    <div
                      key={sp.id}
                      onClick={() => setActiveId(sp.id)}
                      className={`rounded-xl border-2 p-3 cursor-pointer transition-all
                        ${isActive ? "border-green-500 bg-green-50/60 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      {/* Active pill */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                          ${isActive ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                          {isActive ? t("active") : t("tap")}
                        </span>
                      </div>

                      {/* Vault chips */}
                      <VaultChips value={sp.vaultId} onChange={(vid) => setSplits((p) => p.map((s) => (s.id === sp.id ? { ...s, vaultId: vid } : s)))} treasurys={treasurys ?? []} />

                      {/* Amount bubble */}
                      <div
                        className={`mt-2.5 rounded-lg px-2 py-2.5 text-center font-black text-lg tracking-tight
                        ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        ${rawToFloat(sp.raw).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Split summary */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-semibold">{t("total_entered")}</span>
                  <span className="text-lg font-black text-gray-800">${fmtFloat(splitPaid)}</span>
                </div>
                <div
                  className={`rounded-xl border px-4 py-3 flex flex-col gap-0.5
                  ${change >= 0 ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}
                >
                  <span className={`text-[10px] font-semibold ${change >= 0 ? "text-green-500" : "text-red-400"}`}>{change >= 0 ? t("change") : t("remaining")}</span>
                  <span className={`text-lg font-black ${change >= 0 ? "text-green-600" : "text-red-500"}`}>${fmtFloat(Math.abs(change))}</span>
                </div>
              </div>
            </div>
          )}
          {/* ── Numpad ── */}
          <Numpad onKey={pushKey} />

          {!isSplit && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 font-semibold">{t("tendered")}</span>
                <span className="text-xl font-black text-gray-800">${fmtFloat(singlePaid)}</span>
              </div>
              <div
                className={`rounded-xl border px-4 py-3 flex flex-col gap-0.5
                ${change >= 0 ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}
              >
                <span className={`text-[10px] font-semibold ${change >= 0 ? "text-green-500" : "text-red-400"}`}>{change >= 0 ? t("change") : t("remaining")}</span>
                <span className={`text-xl font-black ${change >= 0 ? "text-green-600" : "text-red-500"}`}>${fmtFloat(Math.abs(change))}</span>
              </div>
            </div>
          )}

          {/* ── Split cards ── */}

          <hr className="border-gray-100" />

          {/* ── Actions ── */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { action: "pdf", label: "طباعة PDF", Icon: FileText },
              { action: "whatsapp", label: "إرسال واتساب", Icon: MessageCircle },
              { action: "email", label: "إرسال إيميل", Icon: Mail },
              { action: "save_only", label: "حفظ فقط", Icon: Save },
            ].map(({ action, label, Icon }) => (
              <Button key={action} variant="outline" size="sm" className="h-10 text-[12px] gap-1.5">
                <Icon size={13} />
                {label}
              </Button>
            ))}

            <Button
              onClick={() => {
                handleConfirmPayment("Cash", total.toFixed(2));
                onOpenChange(false);
              }}
              size="sm"
              className="col-span-2 h-10 text-[12px] gap-1.5 bg-[#000052] hover:bg-blue-900 text-white"
            >
              <Printer size={13} />
              حفظ وطباعة فاتورة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main CartPanel ────────────────────────────────────────────────────────────
export default function CartPanel() {
  const { t } = useLanguage();
  const { cart, setCart, setSelectedTable, selectedTable, selectedDelivery, setSelectedDelivery, setOrderType, discount, networkSpeed, setDiscount, setScreen, handleHold, setSelectedCustomer, selectedCustomer, orderType, handleCreateDineInOrder, dineInMode, handleAddItemsToExistingOrder } = usePos();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("add");
  const [discType, setDiscType] = useState<"pct" | "flat">("pct");
  const [discInput, setDiscInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [itemNumPadDialog, setItemNumPadDialog] = useState(false);
  const { data: customers, isLoading: loadingCustomers } = useGetAllCustomers({ page: 1, limit: 100 });
  const { data: additions } = useGetAllAdditions();
  const { sub, subAfterDiscount, tax: taxAfterDiscount, total, originalTax, itemDiscountsTotal } = useMemo(() => calcTotals(cart, discount), [cart, discount]);
  const { notifyError, notifySuccess } = useToast();
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const removeItem = (idx: number) => setCart((p) => p.filter((_, i) => i !== idx));
  const [cashierOpen, setCashierOpen] = useState(false);
  useEffect(() => {
    if (customers) {
      setSelectedCustomer(customers?.items[0]);
    }
  }, [customers]);
  const changeQty = (idx: number, d: number) => setCart((p) => p.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, d) } : item)));

  // ── per-item discount ──────────────────────────────────────────────────────
  const setItemDisc = (idx: number, type: "pct" | "flat", raw: string) => {
    if (hasOrderDiscount) {
      notifyError(t("cannot_mix_discounts") || "لا يمكن الجمع بين خصم الأصناف وخصم الفاتورة");
      return;
    }

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
  const saveExtras = (idx: number, selectedIds: number[]) => {
    setCart((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const newExtras = (additions ?? []).filter((a) => selectedIds.includes(a.id!)).map((a) => ({ id: a.id!, name: a.additionNameAr, price: 0 }));
        return { ...item, extras: newExtras };
      }),
    );
  };

  const applyDiscount = () => {
    if (hasItemDiscount) {
      notifyError(t("cannot_mix_discounts") || "لا يمكن الجمع بين خصم الأصناف وخصم الفاتورة");
      return;
    }

    const val = parseFloat(discInput) || 0;
    const base = sub + taxAfterDiscount;
    setDiscount(discType === "pct" ? (base * val) / 100 : val);
    setActiveTab("add");
  };

  const hasItemDiscount = useMemo(() => cart.some((item) => item.itemDiscount && item.itemDiscount.value > 0), [cart]);
  const hasOrderDiscount = discount > 0;
  const navigate = useNavigate();
  const { data: freeTables } = useGetAllTables();

  const GRID = "grid grid-cols-[20px_minmax(0,1fr)_85px_55px_45px_50px_85px] gap-2 px-2";
  return (
    <>
      <div className="flex flex-col border-r border-gray-300" style={{ width: 550, flexShrink: 0 }}>
        <div className="px-3  border-b border-gray-300 flex items-center justify-between  py-3 shrink-0">
          <div className="flex items-center gap-4 ">
            {/* Home */}
            <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </button>

            {/* Network */}
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
          </div>
          {/* Order Type */}
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
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.tableName}
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
        </div>{" "}
        <div className="px-3 py-[14.75px]  border-b border-gray-300 flex items-center gap-2">
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
                placeholder={t("choose_customer")}
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
            <div className="p-5 text-center text-gray-400 text-xs">{t("cart_is_empty")}</div>
          ) : (
            <>
              {/* Table header */}
              <div className={`${GRID} py-1.5 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase`}>
                <span>#</span>
                <span>{t("item")}</span>
                <span className="text-center">{t("quantity_label")}</span>
                <span className="px-2 border-r border-gray-100 text-right flex items-center justify-end gap-1">
                  {t("price")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={10} className="text-gray-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {t("price_before_tax")}
                    </TooltipContent>
                  </Tooltip>
                </span>{" "}
                <span className="text-right">{t("tax_column")}</span>
                <span className="text-right">{t("total_amount")}</span>
                <span className="text-center">{t("actions")}</span>
              </div>

              {cart?.map((item, idx) => {
                const total = itemTotal(item);
                const hasDisc = !!item.itemDiscount && item.itemDiscount.value > 0;
                const itemWithoutDisc = { ...item, itemDiscount: null };
                const origBasePrice = itemBasePrice(itemWithoutDisc);
                return (
                  <div
                    onClick={() => {
                      setSelectedCartItem(item);
                      setItemNumPadDialog(true);
                    }}
                    key={idx}
                    className={`${GRID} py-2 items-center border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-[#f6f6f6]"}`}
                  >
                    {/* # */}
                    <span className="text-xs text-gray-400 font-medium">{idx + 1}</span>
                    {/* الاسم */}
                    <div className="min-w-0 overflow-hidden">
                      <div className="text-xs font-bold text-gray-800 ">{item?.name}</div>
                      {(item.extras ?? []).length > 0 && <div className="text-[10px] text-gray-400">+ {item.extras!.map((e) => e.name).join("، ")}</div>}
                      {hasDisc && <div className="text-[10px] text-primary font-semibold">{item.itemDiscount!.type === "pct" ? `${item.itemDiscount!.value}% ${t("off")}` : `-${item.itemDiscount!.value.toFixed(2)}`}</div>}
                    </div>
                    <span className="text-xs text-gray-400 font-medium text-center">{item?.qty}</span>

                    {/* السعر قبل الضريبة */}
                    <div className="text-right">
                      {hasDisc && <div className="text-[10px] text-gray-300 line-through">{origBasePrice.toFixed(2)}</div>}
                      <div className="text-xs font-semibold text-gray-700 flex items-center flex-row">{itemBasePrice(item).toFixed(2)}</div>
                    </div>
                    {/* ض.ق.م */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{calcItemTax(item).toFixed(2)}</div>{" "}
                    </div>
                    {/* الإجمالي */}
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-800">{(itemBasePrice(item) + calcItemTax(item)).toFixed(2)}</div>{" "}
                    </div>
                    {/* عمليات */}
                    <div className="flex items-center justify-center gap-1">
                      {/* <DiscountPopover
                        item={item}
                        idx={idx}
                        disabled={hasOrderDiscount}
                        onDiscChange={setItemDisc}
                        onDiscTypeToggle={(i) => {
                          const nextType = (item.itemDiscount?.type ?? "pct") === "pct" ? "flat" : "pct";
                          setItemDisc(i, nextType, String(item.itemDiscount?.value ?? ""));
                        }}
                        onDiscClear={(i) => setCart((p) => p.map((it, j) => (j === i ? { ...it, itemDiscount: null } : it)))}
                      /> */}
                      {/* <ExtrasPopover item={item} idx={idx} additions={additions ?? []} onToggleExtra={toggleExtra} /> */}
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(idx);
                        }}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                      >
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
        <div className="border-t border-gray-300 flex-shrink-0">
          <div className="flex px-3 border-b border-gray-300">
            {TABS.map((tab) => {
              const label = tab === "add" ? t("add_permission") || "Add" : tab === "discount" ? t("discount") || "Discount" : tab === "coupon" ? t("coupon_code") || "Coupon Code" : t("note") || "Note";

              const isDisabled = tab === "discount" && hasItemDiscount;

              return (
                <button
                  key={tab}
                  onClick={() => !isDisabled && setActiveTab(tab)}
                  disabled={isDisabled}
                  className={`text-xs py-2 px-1.5 border-b-2 whitespace-nowrap transition-colors duration-150
          ${activeTab === tab ? "border-primary text-primary font-bold" : "border-transparent text-gray-400 hover:text-gray-600"}
          ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {activeTab === "add" && (
            <div className="px-3 pt-2.5 pb-3">
              <div className="flex justify-between text-xs mb-1.5 items-center">
                <span className={discount > 0 || itemDiscountsTotal > 0 ? "text-primary font-semibold" : "text-gray-500"}>{t("discount_label")}</span>
                <div className="flex items-center gap-1">
                  <span className={`font-semibold ${discount > 0 || itemDiscountsTotal > 0 ? "text-gray-800" : "text-gray-400"}`}>-{discount > 0 ? `${discount.toFixed(2)}` : `${itemDiscountsTotal.toFixed(2)}`}</span>
                  {discount > 0 && (
                    <button onClick={() => setDiscount(0)} className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-gray-300 leading-none">
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{t("subtotal")}</span>
                <div className="flex items-center gap-1.5">
                  {discount > 0 && <span className="text-gray-300 line-through text-[10px]">{sub?.toFixed(2)}</span>}
                  <span className="font-semibold text-gray-800">{subAfterDiscount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{t("tax_label")}</span>
                <div className="flex items-center gap-1.5">
                  {discount > 0 && <span className="text-gray-300 line-through text-[10px]">{originalTax.toFixed(2)}</span>}
                  <span className="font-semibold text-gray-800">{taxAfterDiscount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-black text-gray-800 mt-2 pt-1 border-t border-gray-300 mb-3">
                <span>{t("payable_amount")}</span>
                <div className="flex items-center gap-1.5">
                  {discount > 0 && <span className="text-gray-300 line-through text-xs font-normal">{(sub + originalTax).toFixed(2)}</span>}
                  <span>{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size={"2xl"} onClick={handleHold} className="flex-1" variant="outline">
                  {t("hold_cart")} <Pause />
                </Button>
                <Button
                  size={"2xl"}
                  onClick={async () => {
                    if (cart.length === 0) {
                      notifyError(t("add_items_to_invoice"));
                      return;
                    }

                    if (orderType === "dine-in") {
                      if (dineInMode === "add-items") {
                        await handleAddItemsToExistingOrder();
                      } else if (dineInMode === "checkout") {
                        setCashierOpen(true);
                      } else {
                        await handleCreateDineInOrder();
                      }
                    } else {
                      setCashierOpen(true);
                    }
                  }}
                  className="flex-1"
                >
                  دفع <CircleArrowRight />
                </Button>
              </div>
            </div>
          )}

          {activeTab === "discount" && (
            <div className="p-3">
              <div className="text-sm font-bold text-gray-800 mb-3">{t("order_discount")}</div>
              <div className="flex gap-2 mb-3 items-center">
                <button onClick={() => setDiscType("flat")} className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold border-2 transition-all flex-shrink-0 ${discType === "flat" ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-400"}`}>
                  $
                </button>
                <button onClick={() => setDiscType("pct")} className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold border-2 transition-all flex-shrink-0 ${discType === "pct" ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-400"}`}>
                  %
                </button>
                <Input value={discInput} onChange={(e) => setDiscInput(e.target.value)} className="flex-1 h-12 px-3 border border-gray-200 rounded-xl text-sm outline-none text-right font-semibold focus:border-primary/40 bg-white" placeholder="0" type="number" min="0" />
              </div>
              <div className="flex gap-2">
                <Button size={"2xl"} className="flex-1" onClick={() => setActiveTab("add")} variant="destructive">
                  {t("cancel")}
                </Button>
                <Button size={"2xl"} className="flex-1" onClick={applyDiscount}>
                  {t("add_permission") || "Add"}
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
              <textarea className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-xs outline-none mb-2 resize-none focus:border-primary/40" rows={2} placeholder={t("add_order_note")} />
              <div className="flex gap-2">
                <Button size={"2xl"} className="flex-1" variant="destructive">
                  {t("clear")}
                </Button>
                <Button size={"2xl"} className="flex-1">
                  {t("save")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CashierDialog open={cashierOpen} onOpenChange={setCashierOpen} onCancel={() => setCashierOpen(false)} />
      <AddParnterModal isOpen={openDialog} onClose={() => setOpenDialog(false)} />

      <ItemNumPadDialog
        item={selectedCartItem}
        open={!!selectedCartItem}
        onOpenChange={(open) => !open && setSelectedCartItem(null)}
        additions={additions}
        onQtyChange={(qty) => {
          const idx = cart.indexOf(selectedCartItem!);
          changeQty(idx, qty);
        }}
        onDiscountChange={(disc) => {
          const idx = cart.indexOf(selectedCartItem!);
          setItemDisc(idx, disc?.type ?? "pct", disc === null ? "" : String(disc.value));
        }}
        onSaveExtras={(selectedIds) => {
          const idx = cart.indexOf(selectedCartItem!);
          saveExtras(idx, selectedIds);
        }}
      />
    </>
  );
}
