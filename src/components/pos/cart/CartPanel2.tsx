import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calcItemTax, calcTotals, itemBasePrice } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2 } from "lucide-react";

export default function CartFooter() {
  const { t } = useLanguage();
  const { cart, setCart, discount, setDiscount, setScreen, handleHold, setSelectedCustomer, selectedCustomer, orderType, handleCreateDineInOrder, dineInMode, handleAddItemsToExistingOrder } = usePos();

  const { sub, subAfterDiscount, tax: taxAfterDiscount, total, originalTax } = useMemo(() => calcTotals(cart, discount), [cart, discount]);

  // حالة الخصم الإضافي
  const [discPct, setDiscPct] = useState("");
  const [discFlat, setDiscFlat] = useState("");

  const handleApplyDiscount = () => {
    const base = sub + taxAfterDiscount;
    if (discPct) setDiscount((base * parseFloat(discPct)) / 100);
    if (discFlat) setDiscount(parseFloat(discFlat));
  };
  const removeItem = (idx: number) => setCart((p) => p.filter((_, i) => i !== idx));

  const changeQty = (idx: number, d: number) => setCart((p) => p.map((item, i) => (i === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)));

  return (
    <>
      {/* Table header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className="grid text-white text-[10px] font-bold px-2 py-2"
          style={{
            backgroundColor: "#000052",
            gridTemplateColumns: "30px 80px 1fr 1fr 90px 100px 100px 150px 150px 150px 100px",
          }}
        >
          <span className="flex items-center justify-start">#</span>
          <span className="flex items-center justify-start">كود الصنف</span>
          <span className="flex items-center justify-start">اسم الصنف</span>
          <span className="flex items-center justify-start">السعر بدون ضريبة</span>
          <span className="flex items-center justify-start">الكمية</span>
          <span className="flex items-center justify-start">نسبة الخصم%</span>
          <span className="flex items-center justify-start">قيمة الخصم</span>
          <span className="flex items-center justify-start">الإجمالي قبل الضريبة</span>
          <span className="flex items-center justify-start">ضريبة القيمة المضافة</span>
          <span className="flex items-center justify-start">الإجمالي النهائي</span>
          <span className="flex items-center justify-start">موظف الخدمة</span>
        </div>
        <div className="flex-1 overflow-y-auto bg-white">
          {cart.length === 0 ? (
            // صف فارغ افتراضي زي الصورة
            <div
              className="grid items-center px-2 py-2 border-b border-gray-100 text-[11px] text-gray-400"
              style={{
                gridTemplateColumns: "30px 80px 1fr 1fr 90px 100px 100px 150px 150px 150px 100px",
              }}
            >
              <span className="">1</span>
              <span className="">--</span>
              <div className="flex items-cente gap-1 text-gray-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                اسم الصنف
              </div>
              <span className="">--</span>
              <span className="">--</span>
              <span className="">--</span>
              <span className="">--</span>
              <span className="">--</span>
              <span className="">--</span>
              <span className="">--</span>
              <span className="">-</span>
            </div>
          ) : (
            cart.map((item, idx) => {
              const base = itemBasePrice(item);
              const tax = calcItemTax(item);
              const rowTotal = base + tax;
              const discVal = item.itemDiscount ? (item.itemDiscount.type === "pct" ? (itemBasePrice({ ...item, itemDiscount: null }) * item.itemDiscount.value) / 100 : item.itemDiscount.value) : 0;
              const discPct = item.itemDiscount?.type === "pct" ? item.itemDiscount.value : 0;

              return (
                <div
                  key={idx}
                  className={`grid items-center px-2 py-2 border-b border-gray-100 text-[11px] ${idx % 2 === 0 ? "bg-white" : "bg-[#f6f9fc]"}`}
                  style={{
                    gridTemplateColumns: "30px 1fr 1.5fr 1fr 80px 80px 80px 100px 100px 100px 60px",
                  }}
                >
                  {/* # */}
                  <span className="text-center text-gray-400">{idx + 1}</span>

                  {/* كود الصنف */}
                  <span className="text-gray-500 truncate">{item.productId ?? "--"}</span>

                  {/* اسم الصنف */}
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 truncate">{item.name}</div>
                    {(item.extras ?? []).length > 0 && <div className="text-[10px] text-gray-400 truncate">+ {item.extras!.map((e) => e.name).join("، ")}</div>}
                  </div>

                  {/* الأسعار متعدد */}
                  <span className="text-center text-gray-500">--</span>

                  {/* الكمية */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white mx-1">
                    <button onClick={() => changeQty(idx, -1)} className="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                      −
                    </button>
                    <span className="flex-1 text-xs font-semibold text-center border-x border-gray-200 py-0.5">{item.qty}</span>
                    <button onClick={() => changeQty(idx, 1)} className="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">
                      +
                    </button>
                  </div>

                  {/* نسبة الخصم% */}
                  <span className="text-center text-gray-500">{discPct > 0 ? `${discPct}%` : "--"}</span>

                  {/* قيمة الخصم */}
                  <span className="text-center text-gray-500">{discVal > 0 ? discVal.toFixed(2) : "--"}</span>

                  {/* الإجمالي قبل الضريبة */}
                  <span className="text-center font-semibold text-gray-700">{base.toFixed(2)}</span>

                  {/* ضريبة القيمة المضافة */}
                  <span className="text-center text-gray-500">{tax.toFixed(2)}</span>

                  {/* الإجمالي النهائي */}
                  <span className="text-center font-bold text-gray-800">{rowTotal.toFixed(2)}</span>

                  {/* موظف الخدمة + حذف */}
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => removeItem(idx)} className="w-5 h-5 rounded bg-gray-100 hover:bg-red-100 flex items-center justify-center">
                      <Trash2 size={11} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="w-full border-t border-gray-200 bg-white text-[11px]" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {/* ══ القسم الأيمن: الإجماليات الأساسية ══ */}
        <div className="border-l border-gray-200 flex flex-col">
          {/* صف 1: الإجمالي قبل النهائي */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[11px]">الإجمالي قبل النهائي</span>
            <span className="font-bold text-gray-800">0</span>
          </div>

          {/* صف 2: خصم على الأصناف */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[11px]">خصم على الأصناف</span>
            <div className="flex items-center gap-18">
              <span className="text-gray-400 text-[11px]">0%</span>
              <span className="font-bold text-gray-800">0</span>
            </div>
          </div>

          {/* صف 3: خصم إضافي */}
          <div className="flex items-center justify-between px-3 py-2 gap-2">
            {/* يمين: النص */}
            <div className="text-right shrink-0">
              <div className="text-gray-500 text-[11px]">خصم إضافي</div>
              <div className="text-gray-400 text-[10px]">بند أقصى %10</div>
            </div>

            {/* وسط: حقل نسبة + حقل قيمة */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1 justify-center">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[10px] text-gray-400">نسبة</span>
                  <Input value={discPct} onChange={(e) => setDiscPct(e.target.value)} placeholder="" type="number" min="0" max="100" className="w-20 h-7 text-[11px] text-center px-1 border-gray-200" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[10px] text-gray-400">قيمة</span>
                  <Input value={discFlat} onChange={(e) => setDiscFlat(e.target.value)} placeholder="0" type="number" min="0" className="w-20 h-7 text-[11px] text-center px-1 border-gray-200" />
                </div>
              </div>
              {/* يسار: زر تطبيق الخصم */}
              <Button size="sm" className="bg-[#1a6fb5] hover:bg-[#1560a0] text-white text-[11px] font-bold h-10 px-5 rounded-md whitespace-nowrap shrink-0" onClick={handleApplyDiscount}>
                تطبيق الخصم
              </Button>
            </div>
          </div>
        </div>

        {/* ══ القسم الأوسط: الإجمالي بعد الخصم ══ */}
        <div className="border-l  border-gray-200  flex-1 h-full">
          <div className="border-b border-gray-200 flex items-center justify-between px-3 py-2">
            <span className="text-gray-500 text-[11px]">الإجمالي بعد الخصم</span>
            <span className="font-bold text-gray-800">0</span>
          </div>
        </div>

        {/* ══ القسم الأيسر: الأزرار + حقول الخصم ══ */}
        <div className="border-l border-gray-200 flex flex-col">
          {/* صف 1: الإجمالي قبل النهائي */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[11px]">الإجمالي قبل النهائي</span>
            <span className="font-bold text-gray-800">0</span>
          </div>

          {/* صف 2: خصم على الأصناف */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[11px]">إجمالي الضريبة</span>
            <div className="flex items-center gap-18">
              <span className="text-gray-400 text-[11px]">0%</span>
              <span className="font-bold text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-[11px]">الإجمالي النهائي</span>
            <span className="font-bold text-gray-800">0</span>
          </div>
        </div>
      </div>
    </>
  );
}
