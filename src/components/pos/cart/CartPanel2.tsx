import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calcItemTax, calcTotals, itemBasePrice } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Mail, MessageCircle, Printer, Save, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Product } from "@/features/products/types/products.types";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Numpad } from "../cashier/CashierPanel";

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
interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  total: number;
  onSave: (opts: { vault: string; method: string; action: SaveAction }) => void;
}

export type SaveAction = "pdf" | "whatsapp" | "email" | "save_only" | "save_print";

const VAULTS = ["الخزنة الرئيسية", "خزنة الفرع", "خزنة المدير"];
const METHODS = ["نقدي", "بطاقة", "تحويل بنكي"];
interface Split {
  id: string;
  vaultId: number;
  raw: string;
}

export function PaymentDialog({ open, onOpenChange, total, onSave }: PaymentDialogProps) {
  const [vault, setVault] = useState(VAULTS[0]);
  const [method, setMethod] = useState(METHODS[0]);
  const [input, setInput] = useState("");
  const [npRaw, setNpRaw] = useState(() => String(Math.round(total * 100)));
  const [isSplit, setIsSplit] = useState(false);
  const [splits, setSplits] = useState<Split[]>([]);
  const rawToFloat = (r: string) => parseInt(r || "0") / 100;
  const fmtFloat = (n: number) => "$" + n.toFixed(2);
  const fmtRaw = (r: string) => fmtFloat(rawToFloat(r));
  const [activeId, _setActiveId] = useState("s1");
  const [justActivated, setJustActivated] = useState(false);
  const { setPaidAmount } = usePos();
  const { t } = useLanguage();

  const pushKey = (k: string) => {
    if (k === "cancel") {
      // onCancel?.();
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
          const activeAmt = rawToFloat(activePaid.raw);
          const remaining = total - activeAmt;
          const remainRaw = remaining > 0 ? String(Math.round(remaining * 100)) : "0";
          return updated.map((s) => (s.id === otherIds[0] ? { ...s, raw: remainRaw } : s));
        }

        return updated;
      });

      if (justActivated) setJustActivated(false);
    }
  };

  const handleAction = (action: SaveAction) => {
    onSave({ vault, method, action });
    onOpenChange(false);
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
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0" dir="rtl">
        <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "#000052" }}>
          <DialogTitle className="text-[14px] font-medium text-white">إتمام عملية الدفع</DialogTitle>
          <span className="bg-white/15 rounded px-2.5 py-1 text-[13px]">الإجمالي: {total.toFixed(2)} ر.س</span>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-500">الخزنة</label>
            <Select value={vault} onValueChange={setVault}>
              <SelectTrigger className="w-full  text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VAULTS.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Numpad onKey={pushKey} />
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2.5 text-[12px]">
            <div className="flex gap-1">
              <span className="text-gray-500">المدفوع:</span>
              <span className="font-semibold text-gray-800">{fmtFloat(singlePaid)} ر.س</span>
            </div>
            <div className="flex gap-1">
              {/* <span className="text-gray-500">الباقي:</span> */}
              <span className={` font-semibold ${change >= 0 ? "text-green-500" : "text-red-400"}`}>{change >= 0 ? t("change") : t("remaining")}</span>
              <span className={`font-black ${change >= 0 ? "text-green-600" : "text-red-500"}`}>{fmtFloat(Math.abs(change))}</span>
              {/* <span className="font-semibold text-green-700">{change.toFixed(2)} ر.س</span> */}
            </div>
            {/* <div
              className={`rounded-xl px-3 py-2.5 flex flex-col border
                    ${change >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
            >
              <span className={`text-[10px] font-semibold ${change >= 0 ? "text-green-500" : "text-red-400"}`}>{change >= 0 ? t("change") : t("remaining")}</span>
              <span className={`text-base font-black ${change >= 0 ? "text-green-600" : "text-red-500"}`}>{fmtFloat(Math.abs(change))}</span>
            </div> */}
          </div>

          <hr className="border-gray-100" />

          <div className="flex flex-col gap-2">
            <span className="text-[11px] text-gray-400">بعد الحفظ:</span>
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
              <Button onClick={() => handleAction("save_print")} size="sm" className="col-span-2 h-10 text-[12px] gap-1.5 bg-[#000052] hover:bg-blue-900 text-white">
                <Printer size={13} />
                حفظ وطباعة فاتورة
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default function CartPanel() {
  const { t } = useLanguage();
  const { cart, setCart, discount, setDiscount, setScreen, handleHold, setSelectedCustomer, selectedCustomer, orderType, handleCreateDineInOrder, dineInMode, handleAddItemsToExistingOrder } = usePos();

  const { sub, subAfterDiscount, tax: taxAfterDiscount, total, originalTax } = useMemo(() => calcTotals(cart, discount), [cart, discount]);
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000 });
  const [discPct, setDiscPct] = useState("");
  const [discFlat, setDiscFlat] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleApplyDiscount = () => {
    const base = sub + taxAfterDiscount;
    if (discPct) setDiscount((base * parseFloat(discPct)) / 100);
    if (discFlat) setDiscount(parseFloat(discFlat));
  };

  const removeItem = (idx: number) => setCart((p) => p.filter((_, i) => i !== idx));
  const changeQty = (idx: number, d: number) => setCart((p) => p.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)));
  const [searchOpen, setSearchOpen] = useState(false);

  const GRID_COLUMNS_FULL = "30px 80px 1fr 100px 120px 100px 100px 130px 120px 130px 90px 60px";
  const GRID_COLUMNS_SM = "30px 1fr 100px 80px 60px";

  const handleBarcodeScanned = useCallback(
    (barcode: string) => {
      const product = products?.items?.find((p) => p.barcode === barcode || p.barcode === barcode);
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

  const handlePayment = ({ vault, method, action }: { vault: string; method: string; action: SaveAction }) => {
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="hidden lg:grid text-white text-[10px] font-bold px-2 py-2" style={{ backgroundColor: "#000052", gridTemplateColumns: GRID_COLUMNS_FULL }}>
          <span>#</span>
          <span>كود الصنف</span>
          <span>اسم الصنف</span>
          <span>السعر بدون ضريبة</span>
          <span>الكمية</span>
          <span>نسبة الخصم%</span>
          <span>قيمة الخصم</span>
          <span>الإجمالي قبل الضريبة</span>
          <span>ضريبة القيمة المضافة</span>
          <span>الإجمالي النهائي</span>
          <span>موظف الخدمة</span>
          <span></span>
        </div>

        {/* Header - شاشات صغيرة */}
        <div className="grid lg:hidden text-white text-[10px] font-bold px-2 py-2" style={{ backgroundColor: "#000052", gridTemplateColumns: GRID_COLUMNS_SM }}>
          <span>#</span>
          <span>الصنف</span>
          <span>السعر</span>
          <span>الكمية</span>
          <span></span>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-2">
          {/* صف البحث - شاشات كبيرة */}
          <div className="hidden lg:grid items-center py-2 border-b border-gray-100 text-[11px] text-gray-400" style={{ gridTemplateColumns: GRID_COLUMNS_FULL }}>
            <span>{cart.length + 1}</span>
            <span>--</span>
            <div className="col-span-1">
              <ProductSearch
                onSelect={(product) => {
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
                }}
              />
            </div>
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>-</span>
            <span></span>
          </div>

          <div className="grid lg:hidden items-center py-2 border-b border-gray-100 text-[11px] text-gray-400" style={{ gridTemplateColumns: GRID_COLUMNS_SM }}>
            <span>{cart.length + 1}</span>
            <div className="col-span-1">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center gap-1 text-gray-300 hover:text-gray-500 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className="text-[11px]">اسم الصنف</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3" align="start" side="bottom">
                  <Command>
                    <CommandInput placeholder="ابحث عن صنف..." className="text-xs h-8" />
                    <CommandList>
                      <CommandEmpty className="text-xs text-center py-3 text-gray-400">لا توجد نتائج</CommandEmpty>
                      <CommandGroup>
                        {products?.items?.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.productNameAr}
                            onSelect={() => {
                              setCart((prev) => {
                                const exists = prev.findIndex((i) => i.productId === product.id);
                                if (exists !== -1) return prev.map((i, idx) => (idx === exists ? { ...i, qty: i.qty + 1 } : i));
                                return [...prev, { name: product.productNameAr, productNameEn: product.productNameEn, productNameUr: product.productNameUr, price: product.sellingPrice, qty: 1, note: "", op: null, taxamount: product.taxAmount, productId: product.id, taxCalculation: product.taxCalculation }];
                              });
                              setSearchOpen(false);
                            }}
                            className="text-xs flex items-center gap-2 cursor-pointer"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{product.productNameAr}</div>
                              <div className="text-[10px] text-gray-400">{product.sellingPrice} ر.س</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <span>--</span>
            <span>--</span>
            <span></span>
          </div>

          {cart.map((item, idx) => {
            const base = itemBasePrice(item);
            const tax = calcItemTax(item);
            const rowTotal = base + tax;
            const discVal = item.itemDiscount ? (item.itemDiscount.type === "pct" ? (itemBasePrice({ ...item, itemDiscount: null }) * item.itemDiscount.value) / 100 : item.itemDiscount.value) : 0;
            const discPctVal = item.itemDiscount?.type === "pct" ? item.itemDiscount.value : 0;

            const QtyControl = (
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button onClick={() => changeQty(idx, -1)} className="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                  −
                </button>
                <span className="flex-1 text-xs font-semibold text-center border-x border-gray-200 py-0.5 min-w-[24px]">{item.qty}</span>
                <button onClick={() => changeQty(idx, 1)} className="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                  +
                </button>
              </div>
            );

            const DeleteBtn = (
              <div className="flex items-center justify-center">
                <button onClick={() => removeItem(idx)} className="size-8 rounded bg-gray-100 hover:bg-red-100 flex items-center justify-center">
                  <Trash2 size={13} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
            );

            return (
              <>
                {/* شاشات كبيرة */}
                <div key={`lg-${idx}`} className={`hidden lg:grid items-center px-2 py-2 border-b border-gray-100 text-[11px] ${idx % 2 === 0 ? "bg-white" : "bg-[#f6f9fc]"}`} style={{ gridTemplateColumns: GRID_COLUMNS_FULL }}>
                  <span className="text-center text-gray-400">{idx + 1}</span>
                  <span className="text-gray-500 truncate">{item.productId ?? "--"}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 truncate">{item.name}</div>
                    {(item.extras ?? []).length > 0 && <div className="text-[10px] text-gray-400 truncate">+ {item.extras!.map((e) => e.name).join("، ")}</div>}
                  </div>
                  <span className="text-gray-500">--</span>
                  <div className="me-2">{QtyControl}</div>
                  <span className="text-gray-500">{discPctVal > 0 ? `${discPctVal}%` : "--"}</span>
                  <span className="text-gray-500">{discVal > 0 ? discVal.toFixed(2) : "--"}</span>
                  <span className="font-semibold text-gray-700">{base.toFixed(2)}</span>
                  <span className="text-gray-500">{tax.toFixed(2)}</span>
                  <span className="font-bold text-gray-800">{rowTotal.toFixed(2)}</span>
                  <span className="font-semibold text-gray-500">--</span>
                  {DeleteBtn}
                </div>

                {/* شاشات صغيرة */}
                <div key={`sm-${idx}`} className={`grid lg:hidden items-center px-2 py-2 border-b border-gray-100 text-[11px] ${idx % 2 === 0 ? "bg-white" : "bg-[#f6f9fc]"}`} style={{ gridTemplateColumns: GRID_COLUMNS_SM }}>
                  <span className="text-center text-gray-400">{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-400">{rowTotal.toFixed(2)} ر.س</div>
                  </div>
                  <span className="text-gray-700 font-semibold">{base.toFixed(2)}</span>
                  {QtyControl}
                  {DeleteBtn}
                </div>
              </>
            );
          })}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 bg-white text-[11px]">
        {/* شاشات كبيرة: grid أفقي */}
        <div className="hidden lg:grid" style={{ gridTemplateColumns: "auto 1fr 1fr 1fr" }}>
          {/* الأزرار */}
          <div className="border-l border-gray-200 flex flex-col justify-between gap-1 p-2 min-w-[110px]">
            <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white text-[11px] rounded-md transition-all duration-200 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]">
              عرض أسعار
            </Button>
            <Button size="sm" className="w-full bg-teal-500 hover:bg-teal-600 text-white text-[11px] rounded-md transition-all duration-200 hover:shadow-[0_0_0_3px_rgba(20,184,166,0.2)]">
              تعليق الفاتورة
            </Button>

            <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white text-[11px] rounded-md transition-all duration-200 hover:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]">
              حذف
            </Button>
            <Button size="sm" onClick={() => setPaymentOpen(true)} className="w-full bg-green-700 hover:bg-green-800 text-white text-[11px] rounded-md">
              الدفع
            </Button>
          </div>

          {/* الإجماليات الأساسية */}
          <div className="border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-gray-500">الإجمالي قبل النهائي</span>
              <span className="font-bold text-gray-800">{sub.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-gray-500">خصم على الأصناف</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">0%</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 gap-2">
              <div className="text-right shrink-0">
                <div className="text-gray-500">خصم إضافي</div>
                <div className="text-gray-400 text-[10px]">بند أقصى %10</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[10px] text-gray-400">نسبة</span>
                  <Input value={discPct} onChange={(e) => setDiscPct(e.target.value)} type="number" min="0" max="100" className="w-16 h-7 text-[11px] text-center px-1 border-gray-200" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[10px] text-gray-400">قيمة</span>
                  <Input value={discFlat} onChange={(e) => setDiscFlat(e.target.value)} placeholder="0" type="number" min="0" className="w-16 h-7 text-[11px] text-center px-1 border-gray-200" />
                </div>
                <Button size="sm" className="bg-[#000052] hover:bg-blue-900 text-white text-[11px] shrink-0 self-end mb-0.5" onClick={handleApplyDiscount}>
                  تطبيق الخصم
                </Button>
              </div>
            </div>
          </div>

          {/* الإجمالي بعد الخصم */}
          <div className="border-l border-gray-200">
            <div className="border-b border-gray-200 flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">الإجمالي بعد الخصم</span>
              <span className="font-bold text-gray-800">{subAfterDiscount.toFixed(2)}</span>
            </div>
          </div>

          {/* الضريبة والنهائي */}
          <div className="border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-gray-500">الإجمالي قبل النهائي</span>
              <span className="font-bold text-gray-800">{subAfterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-gray-500">إجمالي الضريبة</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">0%</span>
                <span className="font-bold text-gray-800">{taxAfterDiscount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-gray-500">الإجمالي النهائي</span>
              <span className="font-bold text-gray-800">{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* شاشات صغيرة: مكدّس عمودي */}
        <div className="flex lg:hidden flex-col gap-0">
          {/* الأزرار: صف أفقي */}
          <div className="grid grid-cols-4 gap-1 p-2 border-b border-gray-100">
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-[10px] rounded-md">
              عرض أسعار
            </Button>
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-[10px] rounded-md">
              تعليق الفاتورة
            </Button>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] rounded-md">
              فتح الفاتورة
            </Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-[10px] rounded-md">
              حذف
            </Button>
          </div>

          {/* الإجماليات: عمودين */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">الإجمالي</span>
              <span className="font-bold text-gray-800">{sub.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">بعد الخصم</span>
              <span className="font-bold text-gray-800">{subAfterDiscount.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">الضريبة</span>
              <span className="font-bold text-gray-800">{taxAfterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-500">الإجمالي النهائي</span>
              <span className="font-bold text-[#000052]">{total.toFixed(2)}</span>
            </div>
          </div>

          {/* خصم إضافي */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2">
            <span className="text-gray-500 shrink-0">خصم إضافي:</span>
            <div className="flex items-center gap-2 flex-1">
              <Input value={discPct} onChange={(e) => setDiscPct(e.target.value)} placeholder="نسبة%" type="number" min="0" max="100" className="w-20 h-7 text-[11px] text-center px-1 border-gray-200" />
              <Input value={discFlat} onChange={(e) => setDiscFlat(e.target.value)} placeholder="قيمة" type="number" min="0" className="w-20 h-7 text-[11px] text-center px-1 border-gray-200" />
              <Button size="sm" className="bg-[#000052] hover:bg-blue-900 text-white text-[11px]" onClick={handleApplyDiscount}>
                تطبيق
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PaymentDialog open={paymentOpen} onOpenChange={setPaymentOpen} total={total} onSave={handlePayment} />
    </>
  );
}
