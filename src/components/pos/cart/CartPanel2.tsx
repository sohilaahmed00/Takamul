import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calcItemTax, calcTotals, CartItem, itemBasePrice, itemBasePriceRaw } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, Clock, FileText, Mail, MessageCircle, Plus, Printer, Save, Search, SlidersHorizontal, Tag, Trash2, User, Vault, X, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Product } from "@/features/products/types/products.types";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Numpad } from "../cashier/CashierPanel";
import formatDate from "@/lib/formatDate";
import { useGetAllSales } from "@/features/sales/hooks/useGetAllSales";
import { SalesOrder } from "@/features/sales/types/sales.types";
import { useGetAllQuotations } from "@/features/quotation/hooks/useGetAllQuotations";
import { Quotation } from "@/features/quotation/types/quotations.types";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { Treasury } from "@/features/treasurys/types/treasurys.types";

function ProductSearch({ onSelect }: { onSelect: (product: Product) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000 });

  const filtered = useMemo(() => {
    if (!search.trim()) return products?.items ?? [];
    const q = search.trim().toLowerCase();
    return (products?.items ?? []).filter((p) => p.productNameAr?.toLowerCase().includes(q) || p.productNameEn?.toLowerCase().includes(q) || p.barcode?.toLowerCase().includes(q));
  }, [search, products?.items]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center gap-1 text-gray-300 hover:text-gray-500 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[11px]">اسم الصنف أو الباركود</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start" side="bottom">
        <div className="flex flex-col gap-2">
          <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الباركود..." className="w-full h-8 text-xs border border-gray-200 rounded px-2 outline-none focus:border-blue-400" />
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-center py-3 text-gray-400">لا توجد نتائج</p>
            ) : (
              filtered.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelect(product);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50 text-right transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-xs truncate">{product.productNameAr}</div>
                    {product.barcode && <div className="text-[10px] text-gray-400">{product.barcode}</div>}
                  </div>
                  <span className="text-xs font-bold text-[#000052] shrink-0 mr-2">{product.sellingPrice} ر.س</span>
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type SaveAction = "pdf" | "whatsapp" | "email" | "save_only" | "save_print";

const VAULTS = ["الخزنة الرئيسية", "خزنة الفرع", "خزنة المدير"];
const METHODS = ["نقدي", "بطاقة", "تحويل بنكي"];

interface Split {
  id: string;
  vaultId: number;
  raw: string;
}

interface InvoicesDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (invoice: SalesOrder) => void;
}

export type InvoiceType = "الفواتير" | "الفواتير المعلقة";

interface InvoicesDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (invoice: SalesOrder) => void;
}

const TYPE_TABS: { key: InvoiceType; label: string }[] = [
  { key: "الفواتير", label: "الفواتير" },
  { key: "الفواتير المعلقة", label: "الفواتير المعلقة" },
];

const TYPE_MAP: Record<InvoiceType, SalesOrder["orderStatus"]> = {
  الفواتير: "Confirmed",
  "الفواتير المعلقة": "UnConfirmed",
};

const STATUS_BADGE: Record<SalesOrder["orderStatus"], { label: string; cls: string }> = {
  InProgress: { label: "معلقة", cls: "bg-amber-100 text-amber-700" },
  Confirmed: { label: "مكتملة", cls: "bg-green-100 text-green-700" },
  Canceled: { label: "ملغية", cls: "bg-gray-100 text-gray-600" },
  UnConfirmed: { label: "غير مدفوعة", cls: "bg-red-100 text-red-600" },
};

function FmtDate({ d }: { d: Date | null }) {
  if (!d) return <span className="text-gray-300">لا يوجد</span>;

  const dateStr = d.toLocaleDateString("ar-EG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeStr = d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <span>
      {dateStr}، {timeStr}
    </span>
  );
}

interface InvoicesDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (invoice: SalesOrder) => void;
}

export function InvoicesDialog({ open, onOpenChange, onSelect }: InvoicesDialogProps) {
  const [activeType, setActiveType] = useState<InvoiceType>("الفواتير");
  const [search, setSearch] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const { data: quotations } = useGetAllQuotations();
  const { data: invoices } = useGetAllSales({
    page: 1,
    limit: 10,
    OrderType: "POS",
  });

  const filtered = useMemo(() => {
    return (invoices?.items || []).filter((inv) => {
      const matchType = inv.orderStatus === TYPE_MAP[activeType];
      const q = search.trim().toLowerCase();
      const matchSearch = !q || inv.orderNumber?.toLowerCase().includes(q) || inv.customerName?.toLowerCase().includes(q) || inv.orderStatus?.toLowerCase().includes(q);

      return matchType && matchSearch;
    });
  }, [invoices, search, activeType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 overflow-hidden gap-0 flex flex-col"
        style={{
          maxWidth: advanced ? "min(92vw, 1100px)" : 560,
          width: "95vw",
          maxHeight: "88vh",
          direction: "rtl",
          transition: "max-width 0.2s ease",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" style={{ background: "#000052" }}>
          <div className="flex items-center gap-2">
            <FileText size={15} />
            <DialogTitle className="text-[14px] font-medium text-white">الفواتير</DialogTitle>
          </div>
          <button onClick={() => onOpenChange(false)} className="w-7 h-7 rounded flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* تبويبات النوع */}
        <div className="flex items-center gap-1.5 px-4 py-3 flex-wrap shrink-0 border-b border-gray-100 bg-white">
          {TYPE_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveType(tab.key)} className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all ${activeType === tab.key ? "bg-[#000052] text-white border-[#000052]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* شريط البحث */}
        <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 border-b border-gray-100 bg-white">
          {/* input */}
          <div className="flex-1 relative">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث ب# / كود الفاتورة / العميل / المورد / المبلغ / النوع / الرقم الضريبي / تاريخ الفتح / تاريخ الدفع / ملاحظات" className="w-full h-8 text-[11px] border border-gray-200 rounded-lg pr-3 pl-3 outline-none focus:border-blue-400 bg-gray-50 placeholder:text-gray-300" />
          </div>
          {/* search btn */}
          <button className="h-8 w-8 flex items-center justify-center bg-[#000052] rounded-lg text-white hover:bg-blue-900 transition-colors">
            <Search size={13} />
          </button>

          {/* عرض متقدم */}
          <button onClick={() => setAdvanced((v) => !v)} className={`flex items-center gap-1.5 h-8 px-3 text-[11px] border rounded-lg transition-colors shrink-0 ${advanced ? "bg-[#000052] text-white border-[#000052]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
            <SlidersHorizontal size={12} />
            عرض متقدم
          </button>
        </div>

        {/* عدد النتائج */}
        <div className="px-4 py-1.5 bg-white border-b border-gray-100 shrink-0">
          <span className="text-[11px] text-gray-400">{filtered.length} إجمالي نتائج</span>
        </div>

        {/* ===== المحتوى ===== */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <FileText size={32} className="opacity-30" />
              <p className="text-sm">لا توجد فواتير</p>
            </div>
          ) : advanced ? (
            /* ===== جدول متقدم ===== */
            <table className="w-full text-[11px] border-collapse" style={{ minWidth: 860 }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-white border-b-2 border-gray-200 text-gray-500 font-medium">
                  <th className="px-3 py-2.5 text-center w-8">#</th>
                  <th className="px-3 py-2.5 text-right">كود الفاتورة</th>
                  <th className="px-3 py-2.5 text-right">النوع</th>
                  <th className="px-3 py-2.5 text-right">المبلغ</th>
                  <th className="px-3 py-2.5 text-right">العميل / المورد</th>
                  <th className="px-3 py-2.5 text-right">الرقم الضريبي</th>
                  <th className="px-3 py-2.5 text-right">تاريخ الفتح</th>
                  <th className="px-3 py-2.5 text-right">تاريخ الدفع</th>
                  <th className="px-3 py-2.5 text-right">ملاحظات</th>
                  <th className="px-3 py-2.5 text-center">باركود</th>
                  <th className="px-3 py-2.5 text-center">طباعة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const badge = STATUS_BADGE[inv.orderStatus];
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => {
                        onSelect?.(inv);
                        onOpenChange(false);
                      }}
                      className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/70"}`}
                    >
                      <td className="px-3 py-2.5 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#000052]">{inv.orderNumber}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap"> {badge.label && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>}</td>
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{inv.grandTotal.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-600">{inv.customerName}</td>
                      <td className="px-3 py-2.5 text-gray-400">{inv.taxAmount}</td>
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{/* <FmtDate d={inv.orderDate} /> */}</td>
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{/* <FmtDate d={inv.paidAt} /> */}</td>
                      <td className="px-3 py-2.5 text-gray-400">{inv.notes}</td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={(e) => e.stopPropagation()} className="text-[10px] text-gray-500 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 hover:bg-gray-50 transition-colors whitespace-nowrap">
                          A4 / Roll
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-[10px] text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap">
                          <Printer size={11} />
                          إذن استلام
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* ===== وضع البطاقات ===== */
            <div className="flex flex-col divide-y divide-gray-100">
              {filtered.map((inv) => {
                const badge = STATUS_BADGE[inv.orderStatus];
                return (
                  <button
                    key={inv.id}
                    onClick={() => {
                      onSelect?.(inv);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-blue-50 transition-colors text-right"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badge.cls || "bg-sky-100 text-sky-600"}`}>
                      <FileText size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#000052] text-[12px] truncate">{inv.orderNumber}</span>
                        {badge.label && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <User size={10} />
                          {inv.customerName}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Tag size={10} />
                          {inv.orderStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="text-[12px] font-bold text-gray-800">{inv.grandTotal.toFixed(2)} ر.س</span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock size={9} />
                        {formatDate(inv?.orderDate)}
                        {/* {inv.openedAt.toLocaleDateString("ar-EG", { month: "short", day: "numeric" })} */}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* تذييل */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">{filtered.length} فاتورة</span>
          <button onClick={() => onOpenChange(false)} className="text-[11px] text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
            إغلاق
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  total: number;
  onSave?: (opts: { vault: Treasury; method: string; action: SaveAction }) => void;
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

export function PaymentDialog({ open, onOpenChange, total, onSave }: PaymentDialogProps) {
  const { data: treasurys } = useGetAllTreasurys();
  const { setPaidAmount, setSelectedVaultId, handleConfirmPayment } = usePos();
  const { t } = useLanguage();

  const [vaultId, setVaultId] = useState<number | null>(null);
  const activeVault = vaultId ?? treasurys?.[0]?.id ?? null;

  const [npRaw, setNpRaw] = useState(() => String(Math.round(total * 100)));
  const [isSplit, setIsSplit] = useState(false);
  const [splits, setSplits] = useState<Split[]>([]);
  const [activeId, _setActiveId] = useState("s1");
  const [justActivated, setJustActivated] = useState(false);

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

  useEffect(() => {
    if (!isSplit) {
      setNpRaw(String(Math.round(total * 100)));
    }
  }, [total, isSplit]);

  const rawToFloat = (r: string) => parseInt(r || "0") / 100;
  const fmtFloat = (n: number) => n.toFixed(2);

  const pushKey = (k: string) => {
    if (k === "cancel") return;

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
          { id: "s1", vaultId: treasurys?.[0]?.id ?? 0, raw: String(Math.round(total * 100)) },
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

  const handleAction = (action: SaveAction) => {
    const selectedVault = treasurys?.find((v) => v.id === vaultId);
    // onSave({ vault: selectedVault, action });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md p-0 gap-0 overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "#000052" }}>
          <DialogTitle className="text-[14px] font-medium text-white">إتمام عملية الدفع</DialogTitle>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/50">{t("payable_amount")}</span>
              <span className="text-[18px] font-black text-green-400">{total.toFixed(2)}</span>
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

          {/* ── Split cards ── */}
          {isSplit && (
            <div className="flex flex-col gap-3">
              {splits.map((sp, idx) => {
                const isActive = activeId === sp.id;
                const cardActive = idx === 0 ? "border-green-500 bg-green-50/60" : "border-blue-400 bg-blue-50/60";
                const pillActive = idx === 0 ? "bg-green-500 text-white" : "bg-blue-400 text-white";
                const amtActive = idx === 0 ? "text-green-700" : "text-blue-700";

                return (
                  <div
                    key={sp.id}
                    onClick={() => setActiveId(sp.id)}
                    className={`rounded-xl border-2 cursor-pointer transition-all
                      ${isActive ? cardActive + " shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${isActive ? pillActive : "bg-gray-100 text-gray-400"}`}
                      >
                        {isActive ? t("active") : t("tap")}
                      </span>
                      <div
                        className={`text-xl font-black tracking-tight
                        ${isActive ? amtActive : "text-gray-500"}`}
                      >
                        ${rawToFloat(sp.raw).toFixed(2)}
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      <VaultChips value={sp.vaultId} onChange={(vid) => setSplits((p) => p.map((s) => (s.id === sp.id ? { ...s, vaultId: vid } : s)))} treasurys={treasurys ?? []} />
                    </div>
                  </div>
                );
              })}

              {/* ── Split summary ── */}
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

          {/* ── Single paid/change ── */}
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

          <hr className="border-gray-100" />

          {/* ── Actions ── */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { action: "pdf", label: "طباعة PDF", Icon: FileText },
              { action: "whatsapp", label: "إرسال واتساب", Icon: MessageCircle },
              { action: "email", label: "إرسال إيميل", Icon: Mail },
              { action: "save_only", label: "حفظ فقط", Icon: Save },
            ].map(({ action, label, Icon }) => (
              <Button key={action} variant="outline" size="sm" onClick={() => handleAction(action as SaveAction)} className="h-10 text-[12px] gap-1.5">
                <Icon size={13} />
                {label}
              </Button>
            ))}

            <Button onClick={() => handleConfirmPayment("Cash", total.toFixed(2))} size="sm" className="col-span-2 h-10 text-[12px] gap-1.5 bg-[#000052] hover:bg-blue-900 text-white">
              <Printer size={13} />
              حفظ وطباعة فاتورة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function QuotationDialog({ open, onOpenChange }: QuotationDialogProps) {
  const [search, setSearch] = useState("");
  const { data: quotations } = useGetAllQuotations();
  const { setCart } = usePos();

  const found = search.trim() ? quotations?.find((q) => q.quotationNumber === search.trim()) : null;

  const handleLoad = () => {
    if (!found) return;
    setCart(
      found.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        price: item.unitPrice,
        qty: item.quantity,
        note: "",
        op: null,
        taxamount: item.taxPercentage,
        taxCalculation: item.taxPercentage > 0 ? 3 : 1,
        itemDiscount: item.discountPercentage > 0 ? { type: "pct" as const, value: item.discountPercentage } : item.discountAmount > 0 ? { type: "flat" as const, value: item.discountAmount } : null,
      })),
    );
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md p-0  gap-0" dir="rtl">
        <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "#000052" }}>
          <DialogTitle className="text-[14px] font-medium text-white">تحميل عرض سعر</DialogTitle>
          <div className="flex items-center gap-2">
            {found && <span className="bg-white/15 rounded px-2.5 py-1 text-[13px]">الإجمالي: {found.grandTotal.toFixed(2)} ر.س</span>}
            <button onClick={() => onOpenChange(false)} className="w-7 h-7 rounded flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
        {/* <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" style={{ background: "#000052" }}>
          <div className="flex items-center gap-2">
            <FileText size={15} />
            <DialogTitle className="text-[14px] font-medium text-white">الفواتير</DialogTitle>
          </div>
          <button onClick={() => onOpenChange(false)} className="w-7 h-7 rounded flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors">
            <X size={14} />
          </button>
        </div> */}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">رقم عرض السعر</label>
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input className="pr-8 text-[12px] focus:border-[#000052]!" placeholder="اكتب رقم عرض السعر..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {search.trim() && (
            <>
              {found ? (
                <>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2.5 text-[12px]">
                    <div className="flex gap-1">
                      <span className="text-gray-500">العميل:</span>
                      <span className="font-semibold text-gray-800">{found.customerName}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-gray-500">التاريخ:</span>
                      <span className="font-semibold text-gray-800">{formatDate(found.quotationDate)}</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div
                      className="grid text-white text-[10px] font-bold text-center"
                      style={{
                        background: "#000052",
                        gridTemplateColumns: "1fr 60px 80px 80px",
                      }}
                    >
                      <div className="px-2 py-1.5 text-right">الصنف</div>
                      <div className="py-1.5">الكمية</div>
                      <div className="py-1.5">السعر</div>
                      <div className="py-1.5">الإجمالي</div>
                    </div>

                    <div className="max-h-44 overflow-y-auto divide-y divide-gray-100">
                      {found.items.map((item, i) => (
                        <div
                          key={i}
                          className={`grid text-[11px] text-center items-center ${i % 2 === 0 ? "bg-white" : "bg-[#f6f9fc]"}`}
                          style={{
                            gridTemplateColumns: "1fr 60px 80px 80px",
                          }}
                        >
                          <div className="px-2 py-1.5 text-right text-gray-800 font-medium truncate">{item.productName}</div>
                          <div className="py-1.5 text-gray-600">{item.quantity}</div>
                          <div className="py-1.5 text-gray-600">{item.unitPrice.toFixed(2)}</div>
                          <div className="py-1.5 font-semibold text-gray-800">{item.lineTotal.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 flex justify-between px-3 py-2 text-[11px]">
                      <div className="flex gap-3 text-gray-500">
                        {found.taxAmount > 0 && <span>ضريبة: {found.taxAmount.toFixed(2)}</span>}
                        {found.discountAmount > 0 && <span>خصم: {found.discountAmount.toFixed(2)}</span>}
                      </div>
                      <span className="font-bold text-gray-800">{found.grandTotal.toFixed(2)} ر.س</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-[12px] text-gray-400 py-6 border border-dashed border-gray-200 rounded-lg">لا يوجد عرض سعر بهذا الرقم</div>
              )}
            </>
          )}

          <hr className="border-gray-100" />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="xl"
              onClick={() => {
                onOpenChange(false);
                setSearch("");
              }}
              className="flex-1   border-[#000052] hover:bg-[#000052]/10 text-[#000052]!  "
            >
              إلغاء
            </Button>
            <Button size="xl" disabled={!found} onClick={handleLoad} className="flex-1  text-[12px] bg-[#000052] hover:bg-blue-900 text-white">
              <CheckCircle2 size={13} />
              تحميل العناصر
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CartPanel() {
  const { t } = useLanguage();
  const { cart, setCart, discount, setDiscount, setScreen, handleHold, setSelectedCustomer, selectedCustomer, orderType, handleCreateDineInOrder, dineInMode, handleAddItemsToExistingOrder } = usePos();
  const [quotationOpen, setQuotationOpen] = useState(false);
  const { sub, subAfterDiscount, tax: taxAfterDiscount, total, originalTax } = useMemo(() => calcTotals(cart, discount), [cart, discount]);
  const subRaw = useMemo(() => cart.reduce((s, item) => s + itemBasePriceRaw(item), 0), [cart]);
  const [noteIndex, setNoteIndex] = useState<number | null>(null);
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000 });
  const [discPct, setDiscPct] = useState("");
  const [discFlat, setDiscFlat] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);

  const handleApplyDiscount = () => {
    const base = sub + taxAfterDiscount;
    if (discPct) setDiscount((base * parseFloat(discPct)) / 100);
    if (discFlat) setDiscount(parseFloat(discFlat));
  };

  const removeItem = (idx: number) => setCart((p) => p.filter((_, i) => i !== idx));
  const changeQty = (idx: number, d: number) => setCart((p) => p.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)));
  const [searchOpen, setSearchOpen] = useState(false);

  const handleBarcodeScanned = useCallback(
    (barcode: string) => {
      const product = products?.items?.find((p) => p.barcode === barcode);
      if (!product) {
        console.warn("المنتج مش موجود:", barcode);
        return;
      }
      setCart((prev) => {
        const exists = prev.findIndex((i) => i.productId === product.id);
        if (exists !== -1) {
          return prev.map((i, idx) => (idx === exists ? { ...i, qty: i.qty + 1 } : i));
        }
        return [
          ...prev,
          {
            name: product.productNameAr,
            productNameEn: product.productNameEn,
            productNameUr: product.productNameUr,
            price: product.sellingPrice,
            qty: 1,
            note: "",
            op: null,
            taxamount: product.taxAmount,
            productId: product.id,
            taxCalculation: product.taxCalculation,
          },
        ];
      });
    },
    [products],
  );

  useEffect(() => {
    let buffer = "";
    let timer: ReturnType<typeof setTimeout>;
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const timeDiff = now - lastKeyTime;
      lastKeyTime = now;

      const isScanner = timeDiff < 50 || buffer.length > 0;
      if (!isScanner) {
        buffer = "";
        return;
      }

      if (e.key === "Enter") {
        if (buffer.length > 2) handleBarcodeScanned(buffer);
        buffer = "";
        clearTimeout(timer);
        return;
      }

      buffer += e.key;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (buffer.length > 2) handleBarcodeScanned(buffer);
        buffer = "";
      }, 300);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBarcodeScanned]);

  const handlePayment = ({ vault, method, action }: { vault: Treasury; method: string; action: SaveAction }) => {
    switch (action) {
      case "pdf":
        break;
      case "whatsapp":
        break;
      case "email":
        break;
      case "save_only":
        break;
      case "save_print":
        break;
    }
  };

  return (
    <>
      <div className="flex-1  border border-gray-300 overflow-x-auto">
        <table className="min-w-[1400px] w-full border-collapse  whitespace-nowrap">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr className="text-white text-[10px] font-bold text-center" style={{ backgroundColor: "#000052" }}>
              <th className="px-2 py-2 whitespace-nowrap">#</th>
              <th className="whitespace-nowrap">كود الصنف</th>
              <th className="w-[300px] whitespace-nowrap">اسم الصنف</th>
              <th className="whitespace-nowrap">السعر بدون ضريبة</th>
              <th className="whitespace-nowrap">الكمية</th>
              <th className="whitespace-nowrap">قيمة الخصم</th>
              <th className="whitespace-nowrap">الإجمالي قبل الضريبة</th>
              <th className="whitespace-nowrap">ضريبة القيمة المضافة</th>
              <th className="whitespace-nowrap">الإجمالي النهائي</th>
              <th className="whitespace-nowrap">موظف الخدمة</th>
              <th className="whitespace-nowrap">ملاحظات</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="text-[11px] text-center">
            {/* Search Row */}
            <tr className="border-b border-gray-300 text-gray-400">
              <td className="px-2 py-2 whitespace-nowrap">{cart.length + 1}</td>
              <td className="whitespace-nowrap">--</td>

              <td className="w-[300px] whitespace-nowrap">
                <ProductSearch
                  onSelect={(product) => {
                    setCart((prev) => {
                      const exists = prev.findIndex((i) => i.productId === product.id);
                      if (exists !== -1) return prev.map((i, idx) => (idx === exists ? { ...i, qty: i.qty + 1 } : i));

                      return [
                        ...prev,
                        {
                          name: product.productNameAr,
                          productNameEn: product.productNameEn,
                          productNameUr: product.productNameUr,
                          price: product.sellingPrice,
                          qty: 1,
                          note: "",
                          op: null,
                          taxamount: product.taxAmount,
                          productId: product.id,
                          taxCalculation: product.taxCalculation,
                        },
                      ];
                    });
                  }}
                />
              </td>

              <td className="whitespace-nowrap">--</td>
              <td className="whitespace-nowrap">--</td>
              <td className="whitespace-nowrap">--</td>
              <td className="whitespace-nowrap">--</td>
              <td className="whitespace-nowrap">--</td>
              <td className="whitespace-nowrap">--</td>
              <td className="whitespace-nowrap">-</td>
              <td></td>
            </tr>

            {/* Cart Rows */}
            {cart.map((item, idx) => {
              const base = itemBasePrice(item);
              const tax = calcItemTax(item);
              const rowTotal = base + tax;
              const discVal = item.itemDiscount ? (item.itemDiscount.type === "pct" ? (itemBasePrice({ ...item, itemDiscount: null }) * item.itemDiscount.value) / 100 : item.itemDiscount.value) : 0;

              const discPctVal = item.itemDiscount?.type === "pct" ? item.itemDiscount.value : 0;

              return (
                <tr key={idx} className={`border-b ${idx % 2 === 0 ? "" : "bg-[#f6f9fc]"}`}>
                  <td className="whitespace-nowrap">{idx + 1}</td>

                  <td className="whitespace-nowrap">{item.productId ?? "--"}</td>

                  <td className="text-start px-2 w-[300px] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</td>

                  <td className="whitespace-nowrap">{base.toFixed(2)}</td>

                  <td>
                    <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-white w-fit mx-auto">
                      <button onClick={() => changeQty(idx, -1)} className="px-1.5 py-0.5">
                        −
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button onClick={() => changeQty(idx, 1)} className="px-1.5 py-0.5">
                        +
                      </button>
                    </div>
                  </td>

                  <td className="whitespace-nowrap">
                    {/* Custom Split Switch */}
                    <div className="flex items-center gap-1.5 justify-center">
                      {/* Split Toggle */}
                      <div className="flex rounded-md overflow-hidden border border-gray-300 text-[10px] font-bold">
                        <button onClick={() => setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, itemDiscount: { type: "flat", value: it.itemDiscount?.value ?? 0 } } : it)))} className={`px-2 py-1 transition-colors ${(item.itemDiscount?.type ?? "flat") === "flat" ? "bg-[#000052] text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
                          ر.س
                        </button>
                        <button onClick={() => setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, itemDiscount: { type: "pct", value: it.itemDiscount?.value ?? 0 } } : it)))} className={`px-2 py-1 transition-colors border-r border-gray-300 ${item.itemDiscount?.type === "pct" ? "bg-[#000052] text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
                          %
                        </button>
                      </div>

                      {/* Input */}
                      <Input
                        type="number"
                        min={0}
                        max={item.itemDiscount?.type === "pct" ? 100 : undefined}
                        className="w-16 h-7 text-[11px] text-center px-1"
                        placeholder="0"
                        value={item.itemDiscount?.value ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const value = parseFloat(raw);
                          const type = item.itemDiscount?.type ?? "flat";
                          const capped = type === "pct" ? Math.min(value, 100) : value;
                          setCart((prev) =>
                            prev.map((it, i) =>
                              i === idx
                                ? {
                                    ...it,
                                    itemDiscount: raw === "" || isNaN(value) ? null : { type, value: capped },
                                  }
                                : it,
                            ),
                          );
                        }}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap font-semibold">{base.toFixed(2)}</td>
                  <td className="whitespace-nowrap">{tax.toFixed(2)}</td>
                  <td className="whitespace-nowrap font-bold">{rowTotal.toFixed(2)}</td>

                  <td className="whitespace-nowrap">--</td>
                  <td>
                    {noteIndex === idx ? (
                      <Input
                        autoFocus
                        className="h-7 text-[11px]"
                        placeholder="اكتب ملاحظة..."
                        value={item.note ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, note: value } : it)));
                        }}
                        onBlur={() => setNoteIndex(null)}
                      />
                    ) : (
                      <div className="flex items-center justify-center  h-full">
                        {item.note ? (
                          <span onClick={() => setNoteIndex(idx)} className="text-[10px] text-gray-600 truncate max-w-[100px] cursor-pointer hover:text-[#000052]">
                            {item.note}
                          </span>
                        ) : (
                          <Button variant="outline" size="icon-xs" onClick={() => setNoteIndex(idx)} className="border border-gray-200  text-gray-400 hover:text-[#000052] hover:border-[#000052] hover:bg-[#000052]/5 transition">
                            <Plus size={12} />
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <button onClick={() => removeItem(idx)} className="size-8 rounded bg-gray-100 hover:bg-red-100 flex items-center justify-center mx-auto">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11 }} className="w-full border border-gray-300 ">
        <div className="hidden lg:grid" style={{ gridTemplateColumns: "1fr 1fr 260px 100px" }}>
          <div className="border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
              <span className="text-gray-500 font-bold">الإجمالي قبل الخصم</span>
              <span className="font-medium text-gray-800">{subRaw.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300 gap-2 flex-wrap">
              <span className="text-gray-500 font-bold shrink-0">خصم على الفاتورة</span>
              <div className="flex items-end gap-1 mr-auto">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] text-gray-400">نسبة</span>
                  <input type="number" min="0" max="100" value={discPct} onChange={(e) => setDiscPct(e.target.value)} className="w-14 h-6 text-[11px] text-center border border-gray-200 rounded px-1" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] text-gray-400">قيمة</span>
                  <input type="number" min="0" value={discFlat} onChange={(e) => setDiscFlat(e.target.value)} className="w-14 h-6 text-[11px] text-center border border-gray-200 rounded px-1" />
                </div>
                <Button size="sm" className="h-6 bg-[#000052] hover:bg-blue-900 text-white text-[11px] shrink-0 self-end mb-0.5" onClick={handleApplyDiscount}>
                  تطبيق الخصم
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500 font-bold">الإجمالي بعد الخصم</span>
              <span className="font-medium text-gray-800">{subAfterDiscount.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
              <span className="text-gray-500 font-bold">الإجمالي قبل الضريبة</span>
              <span className="font-medium text-gray-800">{subAfterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
              <span className="text-gray-500 font-bold">إجمالي الضريبة</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[10px]">0%</span>
                <span className="font-medium text-gray-800">{taxAfterDiscount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500 font-bold">الإجمالي النهائي</span>
              <span className="font-medium text-blue-700">{total.toFixed(2)}</span>
            </div>
          </div>

          <div
            className="border-l border-gray-200"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
            }}
          >
            <div className="flex items-center justify-center border-b border-l border-gray-300 p-2">
              <button onClick={() => setQuotationOpen(true)} className="bg-violet-700 hover:bg-violet-800 text-white text-xs px-3 py-1 rounded-md h-full w-full">
                عرض أسعار
              </button>
            </div>

            <div className="flex items-center justify-center border-b border-gray-300 p-2">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded-md h-full w-full">تعليق الفاتورة</button>
            </div>

            <div className="flex items-center justify-center border-l border-gray-300 p-2">
              <button onClick={() => setCart([])} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md h-full w-full">
                حذف
              </button>
            </div>

            <div className="flex items-center justify-center p-2">
              <button onClick={() => setInvoicesOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1 rounded-md h-full w-full">
                قائمة الفواتير
              </button>
            </div>
          </div>

          <div className="border-l border-gray-200 flex flex-col items-stretch justify-center p-2 gap-2">
            <button onClick={() => setPaymentOpen(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-base font-semibold transition-colors">
              الدفع
            </button>
          </div>
        </div>

        <div className="flex lg:hidden flex-col">
          <div className="grid grid-cols-4 gap-1 p-2 border-b border-gray-300">
            <button className="bg-violet-700 text-white text-[10px] rounded-md py-1.5">عرض أسعار</button>
            <button className="bg-cyan-600 text-white text-[10px] rounded-md py-1.5">تعليق</button>
            <button onClick={() => setInvoicesOpen(true)} className="bg-teal-600 text-white text-[10px] rounded-md py-1.5">
              قائمة
            </button>
            <button className="bg-red-600 text-white text-[10px] rounded-md py-1.5">حذف</button>
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">الإجمالي</span>
              <span className="font-medium text-gray-800">{sub.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">بعد الخصم</span>
              <span className="font-medium text-gray-800">{subAfterDiscount.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">الضريبة</span>
              <span className="font-medium text-gray-800">{taxAfterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">النهائي</span>
              <span className="font-medium text-blue-700">{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-3 py-2">
            <span className="text-gray-500 shrink-0">خصم:</span>
            <input type="number" placeholder="نسبة%" value={discPct} onChange={(e) => setDiscPct(e.target.value)} className="w-16 h-7 text-[11px] text-center border border-gray-300 rounded px-1" />
            <input type="number" placeholder="قيمة" value={discFlat} onChange={(e) => setDiscFlat(e.target.value)} className="w-16 h-7 text-[11px] text-center border border-gray-300 rounded px-1" />
            <Button size="sm" className="h-7 rounded bg-[#000052] hover:bg-blue-900 text-white text-[11px] shrink-0 self-end mb-0.5" onClick={handleApplyDiscount}>
              تطبيق الخصم
            </Button>
          </div>

          <div className="p-2 border-t border-gray-100">
            <button onClick={() => setPaymentOpen(true)} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-2 text-sm font-semibold">
              الدفع
            </button>
          </div>
        </div>
      </div>
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={total}
        // onSave={({ vault, action }) => {
        //   if (action === "save_print")
        //   if (action === "save_only")
        //   if (action === "pdf")
        //   if (action === "whatsapp")
        //   if (action === "email")
        // }}
      />{" "}
      <InvoicesDialog
        open={invoicesOpen}
        onOpenChange={setInvoicesOpen}
        onSelect={(invoice) => {
          console.log(invoice);
        }}
      />
      <QuotationDialog open={quotationOpen} onOpenChange={setQuotationOpen} />
    </>
  );
}

// {/* Header */}
// <div className="overflow-x-auto">
//   <div
//     className="text-white text-[10px] font-bold px-2 py-2 min-w-[1100px]"
//     style={{
//       backgroundColor: "#000052",
//       display: "grid",
//       gridTemplateColumns: GRID_COLUMNS_FULL,
//     }}
//   >
//     <span className="whitespace-nowrap">#</span>
//     <span className="whitespace-nowrap">كود الصنف</span>
//     <span className="whitespace-nowrap">اسم الصنف</span>
//     <span className="whitespace-nowrap">السعر بدون ضريبة</span>
//     <span className="whitespace-nowrap">الكمية</span>
//     <span className="whitespace-nowrap">نسبة الخصم%</span>
//     <span className="whitespace-nowrap">قيمة الخصم</span>
//     <span className="whitespace-nowrap">الإجمالي قبل الضريبة</span>
//     <span className="whitespace-nowrap">ضريبة القيمة المضافة</span>
//     <span className="whitespace-nowrap">الإجمالي النهائي</span>
//     <span className="whitespace-nowrap">موظف الخدمة</span>
//     <span></span>
//   </div>

//   {/* Body */}
//   <div className="flex-1 overflow-y-auto bg-white px-2 min-w-[1100px]">
//     {/* Search Row */}
//     <div
//       className="items-center py-2 border-b border-gray-300 text-[11px] text-gray-400"
//       style={{
//         display: "grid",
//         gridTemplateColumns: GRID_COLUMNS_FULL,
//       }}
//     >
//       <span>{cart.length + 1}</span>
//       <span>--</span>
//       <div className="col-span-1">
//         <ProductSearch onSelect={(product) => { /* ... */ }} />
//       </div>
//       <span>--</span>
//       <span>--</span>
//       <span>--</span>
//       <span>--</span>
//       <span>--</span>
//       <span>--</span>
//       <span>--</span>
//       <span>-</span>
//       <span></span>
//     </div>

//     {/* Cart Items */}
//     {cart.map((item, idx) => {
//       // ... نفس الحسابات
//       return (
//         <div
//           key={idx}
//           className={`items-center px-2 py-2 border-b border-gray-100 text-[11px] ${
//             idx % 2 === 0 ? "bg-white" : "bg-[#f6f9fc]"
//           }`}
//           style={{
//             display: "grid",
//             gridTemplateColumns: GRID_COLUMNS_FULL,
//           }}
//         >
//           {/* نفس محتوى الـ lg row */}
//         </div>
//       );
//     })}
//   </div>
// </div>
