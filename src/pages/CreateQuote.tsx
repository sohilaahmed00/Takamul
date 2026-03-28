import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus, ArrowLeft, Tag, ReceiptText, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import z from "zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { Button } from "@/components/ui/button";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllWareHouses } from "@/features/wareHouse/hooks/useGetAllWareHouses";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";
import { Link } from "react-router-dom";
import type { CreateQuotation } from "@/features/quotation/types/quotations.types";
import { useCreateQuotation } from "@/features/quotation/hooks/useCreateQuotation";

const QuoteSchema = z.object({
  customerId: z.number().min(1, "العميل مطلوب"),
  quotationDate: z.string().min(1, "التاريخ مطلوب"),
  validUntil: z.string().min(1, "التاريخ مطلوب"),
  discountAmount: z.number().min(0, "السعر لازم يكون ≥ 0"),
  shippingCost: z.number().min(0, "السعر لازم يكون ≥ 0"),
  notes: z.string().optional(),
  quotationDiscountType: z.enum(["percentage", "fixed"]).default("fixed"),
  quotationDiscountValue: z.number().min(0).default(0),
  items: z
    .array(
      z.object({
        productId: z.number().min(1, "اختر الصنف"),
        quantity: z.number().min(1, "الكمية لازم تكون أكبر من 0"),
        unitId: z.number().min(1, "اختر وحدة الصنف"),
        unitPrice: z.number().min(0, "السعر لازم يكون ≥ 0"),
        taxPercentage: z.number().min(0, "السعر لازم يكون ≥ 0"),
        discountType: z.enum(["percentage", "fixed"]).default("fixed"),
        discountValue: z.number().min(0).default(0),
      }),
    )
    .min(1, "لازم تضيف صنف واحد على الأقل"),
});

type SalesInvoiceType = z.input<typeof QuoteSchema>;

const fmt = (n: number) => new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ─── SRow ─────────────────────────────────────────────────────────────────────
const SRow: React.FC<{ label: string; value: string; bold?: boolean; color?: string }> = ({ label, value, bold, color }) => (
  <div className="flex justify-between items-center gap-2">
    <span className="text-xs text-zinc-400 shrink-0">{label}</span>
    <span className={`text-xs truncate ${bold ? "font-medium text-zinc-900" : color || "text-zinc-700"}`}>{value}</span>
  </div>
);

// ─── Summary Content ──────────────────────────────────────────────────────────
const QuoteSummaryContent: React.FC<{
  control: any;
  customers?: { id: number; customerName: string }[];
  products?: { id: number; productNameAr: string; taxAmount?: number }[];
  units?: { id: number; name: string }[];
}> = ({ control, customers = [], products = [], units = [] }) => {
  const customerId = useWatch({ control, name: "customerId" });
  const quotationDate = useWatch({ control, name: "quotationDate" });
  const validUntil = useWatch({ control, name: "validUntil" });
  const notes = useWatch({ control, name: "notes" });
  const shippingCost = Number(useWatch({ control, name: "shippingCost" })) || 0;
  const discountAmount = Number(useWatch({ control, name: "discountAmount" })) || 0;
  const discType = useWatch({ control, name: "quotationDiscountType" }) || "fixed";
  const discValue = Number(useWatch({ control, name: "quotationDiscountValue" })) || 0;
  const items: any[] = useWatch({ control, name: "items" }) || [];

  const customerName = customers.find((c) => c.id === Number(customerId))?.customerName || "—";

  const formatDate = (d?: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return d;
    }
  };

  const calcedItems = items.map((item) => {
    const product = products.find((p) => p.id === Number(item.productId));
    const unitName = units.find((u) => u.id === Number(item.unitId))?.name || "";
    const name = product?.productNameAr || "";
    const taxRate = (product?.taxAmount || 0) / 100;
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const dType = item.discountType || "fixed";
    const dVal = Number(item.discountValue) || 0;
    const gross = qty * price;
    const disc = dType === "fixed" ? dVal : gross * (dVal / 100);
    const beforeTax = Math.max(0, gross - disc);
    const tax = beforeTax * taxRate;
    return { name, unitName, qty, price, disc, beforeTax, tax, total: beforeTax + tax };
  });

  const subtotal = calcedItems.reduce((s, i) => s + i.beforeTax, 0);
  const totalTax = calcedItems.reduce((s, i) => s + i.tax, 0);
  const globalDisc = discType === "fixed" ? discValue : subtotal * (discValue / 100);
  const grandTotal = Math.max(0, subtotal + totalTax - globalDisc - discountAmount + shippingCost);
  const activeItems = calcedItems.filter((i) => i.name);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">بيانات العرض</p>
        <div className="space-y-2">
          <SRow label="العميل" value={customerName} bold />
          <SRow label="تاريخ الإصدار" value={formatDate(quotationDate)} />
          <SRow label="صالح حتى" value={formatDate(validUntil)} />
        </div>
      </div>
      <div className="border-t border-zinc-100" />
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">الأصناف</p>
          <span className="text-[10px] bg-zinc-100 text-zinc-500 font-medium px-2 py-0.5 rounded-full">{activeItems.length}</span>
        </div>
        {activeItems.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-4">لا توجد أصناف بعد</p>
        ) : (
          <div className="space-y-3">
            {activeItems.map((item, i) => (
              <div key={i} className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 truncate">{item.name}</p>
                  <div className="flex flex-wrap gap-x-2 mt-0.5">
                    <span className="text-xs text-zinc-400">
                      {item.qty} × {fmt(item.price)}
                    </span>
                    {item.unitName && <span className="text-xs text-zinc-400">{item.unitName}</span>}
                    {item.disc > 0 && <span className="text-xs text-emerald-600">خصم {fmt(item.disc)}</span>}
                    {item.tax > 0 && <span className="text-xs text-amber-500">ضريبة {fmt(item.tax)}</span>}
                  </div>
                </div>
                <span className="text-sm font-semibold text-zinc-900 shrink-0">{fmt(item.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-zinc-100" />
      <div>
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">المبالغ</p>
        <div className="space-y-1.5">
          <SRow label="المجموع" value={fmt(subtotal)} />
          {totalTax > 0 && <SRow label="الضريبة" value={`+ ${fmt(totalTax)}`} color="text-amber-500" />}
          {globalDisc + discountAmount > 0 && <SRow label="الخصم" value={`- ${fmt(globalDisc + discountAmount)}`} color="text-emerald-600" />}
          {shippingCost > 0 && <SRow label="التوصيل" value={`+ ${fmt(shippingCost)}`} />}
        </div>
        <div className="border-t border-dashed border-zinc-200 mt-3 pt-3 flex justify-between items-baseline">
          <span className="text-xs text-zinc-500">الإجمالي النهائي</span>
          <span className="text-xl font-bold text-zinc-900">{fmt(grandTotal)}</span>
        </div>
      </div>
      {notes && (
        <>
          <div className="border-t border-zinc-100" />
          <div>
            <p className="text-[10px] text-zinc-400 mb-1.5">ملاحظات</p>
            <p className="text-sm text-zinc-700 leading-relaxed">{notes}</p>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Floating Summary ─────────────────────────────────────────────────────────
const FloatingSummary: React.FC<{
  control: any;
  customers?: { id: number; customerName: string }[];
  products?: { id: number; productNameAr: string; taxAmount?: number }[];
  units?: { id: number; name: string }[];
  grandTotal: number;
  itemCount: number;
}> = ({ control, customers, products, units, grandTotal, itemCount }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40" aria-hidden />}

      {/* Floating pill button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border transition-all duration-200 select-none
          ${open ? "bg-primary text-white border-green-500 shadow-zinc-900/30" : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:shadow-2xl"}`}
      >
        <div className="relative">
          <ReceiptText size={18} strokeWidth={1.8} />
          {itemCount > 0 && (
            <span
              className={`absolute -top-2 -right-2 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center
              ${open ? "bg-white text-zinc-900" : "bg-primary text-white"}`}
            >
              {itemCount}
            </span>
          )}
        </div>
        <div className="text-right leading-tight">
          <p className="text-[10px] font-medium opacity-60">الإجمالي</p>
          <p className="text-sm font-bold">{fmt(grandTotal)}</p>
        </div>
      </button>

      {/* Floating Panel */}
      <div
        ref={panelRef}
        className={`fixed bottom-24 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden
          transition-all duration-300 ease-out origin-bottom-left
          ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-2 pointer-events-none"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/80">
          <div className="flex items-center gap-2">
            <ReceiptText size={15} strokeWidth={1.8} className="text-zinc-500" />
            <span className="text-sm font-semibold text-zinc-800">ملخص عرض السعر</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <QuoteSummaryContent control={control} customers={customers} products={products} units={units} />
        </div>
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateQuote: React.FC = () => {
  const { t, direction } = useLanguage();
  const [discountOpen, setDiscountOpen] = useState<Record<number, boolean>>({});
  const toggleDiscount = (i: number) => setDiscountOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  const form = useForm<SalesInvoiceType>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      quotationDate: new Date().toISOString().split("T")[0],
      customerId: 0,
      notes: "",
      items: [{ productId: 0, unitPrice: 0, quantity: 1, discountType: "fixed", discountValue: 0 }],
    },
  });

  const { data: customers } = useGetAllCustomers();
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({});
  const { mutateAsync: createQuotations, isPending } = useCreateQuotation();

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({ control: form.control, name: "items" });
  const items = useWatch({ control: form.control, name: "items" });
  const shippingCost = Number(useWatch({ control: form.control, name: "shippingCost" })) || 0;
  const discAmt = Number(useWatch({ control: form.control, name: "discountAmount" })) || 0;
  const discType = useWatch({ control: form.control, name: "quotationDiscountType" }) || "fixed";
  const discValue = Number(useWatch({ control: form.control, name: "quotationDiscountValue" })) || 0;

  const calcSummary = () => {
    let subtotal = 0,
      totalTax = 0,
      count = 0;
    (items || []).forEach((item: any) => {
      const product = products?.items?.find((p) => p.id === Number(item.productId));
      if (!product) return;
      count++;
      const taxRate = (product.taxAmount || 0) / 100;
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const dType = item.discountType || "fixed";
      const dVal = Number(item.discountValue) || 0;
      const gross = qty * price;
      const disc = dType === "fixed" ? dVal : gross * (dVal / 100);
      const beforeTax = Math.max(0, gross - disc);
      subtotal += beforeTax;
      totalTax += beforeTax * taxRate;
    });
    const globalDisc = discType === "fixed" ? discValue : subtotal * (discValue / 100);
    return { grandTotal: Math.max(0, subtotal + totalTax - globalDisc - discAmt + shippingCost), count };
  };

  const { grandTotal, count } = calcSummary();

  const handleAddItem = () => appendItem({ productId: 0, quantity: 1, unitId: 0, unitPrice: 0, taxPercentage: 0, discountType: "fixed", discountValue: 0 });

  const handleSubmit = async (data: SalesInvoiceType) => {
    const payload: CreateQuotation = {
      customerId: data.customerId,
      quotationDate: data.quotationDate,
      validUntil: data.validUntil,
      discountAmount: 0,
      notes: data.notes || "",
      globalDiscountPercentage: data.quotationDiscountType === "percentage" ? (data.quotationDiscountValue ?? 0) : 0,
      globalDiscountValue: data.quotationDiscountType === "fixed" ? (data.quotationDiscountValue ?? 0) : 0,
      shippingCost: data.shippingCost,
      items: data.items.map((item) => ({
        productId: item.productId,
        unitId: item.unitId,
        taxPercentage: 0,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercentage: item.discountType === "percentage" ? (item.discountValue ?? 0) : 0,
        discountValue: item.discountType === "fixed" ? (item.discountValue ?? 0) : 0,
      })),
    };
    await createQuotations(payload);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إضافة عرض سعر</CardTitle>
          <CardAction>
            <Button variant="outline" asChild>
              <Link to="/quotes">
                الرجوع لقائمة عروض الأسعار
                <ArrowLeft size={16} />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit, console.log)} className="space-y-6">
            {/* البيانات الأساسية */}
            <div className="bg-white p-6 rounded-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6">البيانات الأساسية</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Controller
                  name="quotationDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>التاريخ *</FieldLabel>
                      <Input type="date" {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="validUntil"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>صالح لـ *</FieldLabel>
                      <Input type="date" {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="customerId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>العميل *</FieldLabel>
                      <ComboboxField field={field} items={customers} valueKey="id" labelKey="customerName" placeholder="اختر العميل" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="discountAmount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>قيمة الخصم *</FieldLabel>
                      <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <div className="lg:col-span-3">
                  <Controller
                    name="notes"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>الملاحظات</FieldLabel>
                        <Textarea {...field} placeholder="ادخل الملاحظات" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* تفاصيل الفاتورة */}
            <div className="bg-white p-6 rounded-sm border border-gray-100">
              <div className="border-b border-zinc-200 pb-8 min-w-0">
                <h2 className="text-lg font-bold text-zinc-900 mb-6">تفاصيل الفاتورة</h2>
                <section className="mb-4">
                  <h2 className="text-sm font-semibold text-zinc-500 mb-4">قائمة الأصناف</h2>
                  <div className="w-full overflow-x-auto pb-4">
                    <div className="hidden md:grid md:grid-cols-[2fr_0.8fr_1fr_1fr_1fr_1.2fr_60px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                      <div>اسم الصنف/الكود</div>
                      <div>الكمية</div>
                      <div>الوحدة</div>
                      <div>السعر قبل الضريبة</div>
                      <div className="text-center">ضريبة القيمة المضافة</div>
                      <div className="text-center">الإجمالي شامل الضريبة</div>
                      <div></div>
                    </div>

                    <div className="space-y-1 mt-3">
                      {itemFields.map((item, index) => {
                        const qty = form.watch(`items.${index}.quantity`) || 0;
                        const price = form.watch(`items.${index}.unitPrice`) || 0;
                        const dType = form.watch(`items.${index}.discountType`) || "fixed";
                        const dVal = form.watch(`items.${index}.discountValue`) || 0;
                        const productId = form.watch(`items.${index}.productId`);
                        const product = products?.items?.find((p) => p.id === Number(productId));
                        const taxRate = (product?.taxAmount || 0) / 100;
                        const gross = qty * price;
                        const disc = dType === "fixed" ? dVal : gross * (dVal / 100);
                        const beforeTax = gross - disc;
                        const taxAmount = beforeTax * taxRate;
                        const afterTax = beforeTax + taxAmount;
                        const isDiscOpen = !!discountOpen[index];

                        return (
                          <div key={item.id}>
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_0.8fr_1fr_1fr_1fr_1.2fr_60px] gap-3 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group">
                              <Controller
                                control={form.control}
                                name={`items.${index}.productId`}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid} className="relative">
                                    <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">اسم الصنف/الكود</FieldLabel>
                                    <ComboboxField
                                      field={field}
                                      items={products?.items}
                                      valueKey="id"
                                      labelKey="productNameAr"
                                      placeholder="اختر الصنف"
                                      onValueChange={(val) => {
                                        const p = products?.items?.find((p) => p.id === Number(val));
                                        if (p) form.setValue(`items.${index}.unitPrice`, p.sellingPrice);
                                      }}
                                    />
                                    {fieldState.invalid && (
                                      <div className="absolute top-full mt-1 right-0 z-10 w-full">
                                        <FieldError errors={[fieldState.error]} />
                                      </div>
                                    )}
                                  </Field>
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الكمية</FieldLabel>
                                    <Input type="number" min={1} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.unitId`}
                                render={({ field, fieldState }) => (
                                  <Field className="relative">
                                    <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الوحدة</FieldLabel>
                                    <Select value={field.value === 0 ? "" : String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="الوحدة" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {units?.items?.map((c) => (
                                          <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                      <div className="absolute top-full mt-1 right-0 z-10 w-full">
                                        <FieldError errors={[fieldState.error]} />
                                      </div>
                                    )}
                                  </Field>
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.unitPrice`}
                                render={({ field, fieldState }) => (
                                  <Field className="relative" data-invalid={fieldState.invalid}>
                                    <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">السعر قبل الضريبة</FieldLabel>
                                    <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                    <div className="absolute top-full mt-1 right-0 z-10 w-full">
                                      <FieldError errors={[fieldState.error]} />
                                    </div>
                                  </Field>
                                )}
                              />

                              <div className="flex items-center md:justify-center font-medium text-amber-600 mt-2 md:mt-0 px-2 h-9">
                                <FieldLabel className="md:hidden text-xs text-zinc-500 ml-auto">ضريبة القيمة المضافة:</FieldLabel>
                                {Math.max(0, taxAmount).toLocaleString()}
                              </div>
                              <div className="flex items-center md:justify-center font-medium text-green-700 mt-2 md:mt-0 px-2 h-9">
                                <FieldLabel className="md:hidden text-xs text-zinc-500 ml-auto">الإجمالي شامل الضريبة:</FieldLabel>
                                {Math.max(0, afterTax).toLocaleString()}
                              </div>

                              <div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => removeItem(index)} className="p-2 text-zinc-400 hover:text-red-500">
                                  <Trash2 size={16} />
                                </button>

                                <button type="button" onClick={() => toggleDiscount(index)} className={`p-2 ${isDiscOpen ? "text-emerald-600" : "text-zinc-400"}`}>
                                  <Tag size={14} />
                                </button>
                              </div>
                            </div>

                            {isDiscOpen && (
                              <div className="grid grid-cols-2 gap-3 px-2 py-3 bg-emerald-50/50 border border-dashed border-emerald-100 rounded-lg mb-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                <Controller
                                  control={form.control}
                                  name={`items.${index}.discountType`}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel className="text-xs text-zinc-500">نوع الخصم</FieldLabel>
                                      <Select value={field.value || "fixed"} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full bg-white">
                                          <SelectValue placeholder="النوع" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="fixed">قيمة </SelectItem>
                                          <SelectItem value="percentage">نسبة %</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </Field>
                                  )}
                                />
                                <Controller
                                  control={form.control}
                                  name={`items.${index}.discountValue`}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel className="text-xs text-zinc-500">قيمة الخصم</FieldLabel>
                                      <Input type="number" min={0} value={field.value || 0} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center bg-white" />
                                    </Field>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    <Plus size={16} strokeWidth={2} /> إضافة صنف جديد
                  </button>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse lg:flex-row justify-between gap-3   py-4 border-t border-gray-100 bg-gray-50/50 mt-8">
              <Button size="lg" variant="destructive" type="button" className="w-full lg:w-auto px-8 h-12">
                إلغاء
              </Button>
              <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <Button variant="outline" size="lg" type="button" className="w-full lg:w-auto px-8 h-12 text-base">
                  حفظ وإضافة آخر
                </Button>
                <Button size="lg" type="submit" disabled={isPending} className="w-full lg:w-auto px-8 h-12 text-base">
                  {isPending ? "جاري الحفظ..." : "حفظ وإصدار عرض السعر"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <FloatingSummary control={form.control} customers={customers} products={products?.items} units={units?.items} grandTotal={grandTotal} itemCount={count} />
    </>
  );
};

export default CreateQuote;
