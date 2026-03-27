import React, { useState, useMemo, useEffect } from "react";
import { PlusCircle, Save, Trash2, FileText, CreditCard, Box, Plus, Eye, X, ArrowLeft, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import z from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { Button } from "@/components/ui/button";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSalesOrders } from "@/features/sales/hooks/useCreateSalesOrders";
import { useGetAllWareHouses } from "@/features/wareHouse/hooks/useGetAllWareHouses";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import { useWatch } from "react-hook-form";
import type { CreateSalesOrder } from "@/features/sales/types/sales.types";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";
import { Link, useParams } from "react-router-dom";
import type { CreatePurchaseOrder } from "@/features/purchases/types/purchase.types";
import { useCreatePurchaseOrder } from "@/features/purchases/hooks/useCreatePurchaseOrder";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";
import { useGetPurchaseOrderById } from "@/features/purchases/hooks/useGetPurchaseOrderById";
const PurchasesInvoiceSchema = z.object({
  supplierId: z.number().min(1, "المورد مطلوب"),
  warehouseId: z.number().min(1, "المخزن مطلوب"),
  orderDate: z.string().min(1, "التاريخ مطلوب"),

  items: z
    .array(
      z.object({
        productId: z.number().min(1, "اختر الصنف"),
        unitId: z.number().min(1, "اختر وحدة الصنف"),
        quantity: z.number().min(1, "الكمية لازم تكون أكبر من 0"),
        unitPrice: z.number().min(0, "السعر لازم يكون ≥ 0"),
        discountType: z.enum(["percentage", "fixed"]).default("fixed"),
        discountValue: z.number().min(0).default(0),
        taxType: z.enum(["percentage", "fixed"]).default("fixed"),
        taxAmount: z.number().min(0).default(0),
        subTotal: z.number().min(0).default(0),
      }),
    )
    .min(1, "لازم تضيف صنف واحد على الأقل"),
  notes: z.string().optional(),
  // subTotal: z.number().min(0),
  // taxAmount: z.number().min(0),
  // discountAmount: z.number().min(0),
  // grandTotal: z.number().min(0),
  // paidAmount: z.number().min(0),
});

type PurchaseInvoiceType = z.input<typeof PurchasesInvoiceSchema>;
const CreatePurchaseInvoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const { mutateAsync: createPurchaseOrder } = useCreatePurchaseOrder();
  const [discountOpen, setDiscountOpen] = useState<Record<number, boolean>>({});
  const toggleDiscount = (i: number) => setDiscountOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  const { id } = useParams();
  const { data: purchaseOrder } = useGetPurchaseOrderById(Number(id));

  const form = useForm<PurchaseInvoiceType>({
    resolver: zodResolver(PurchasesInvoiceSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split("T")[0],
      warehouseId: 0,
      notes: "",
      items: [
        {
          productId: 0,
          unitId: 0,
          quantity: 1,
          unitPrice: undefined,
          discountType: "fixed",
          discountValue: 0,
        },
      ],
    },
  });

  const { data: suppliers } = useGetAllSuppliers();
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({});
  const { data: taxes } = useGetAllTaxes();
  const { mutateAsync: createSalesOrders } = useCreateSalesOrders();
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = useWatch({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (!purchaseOrder) return;
    if (!products?.items || !units?.items) return;

    form.reset({
      supplierId: purchaseOrder.supplierId,
      orderDate: purchaseOrder.orderDate?.split("T")[0],
      notes: "",
      items: purchaseOrder.items.map((item) => {
        return {
          productId: item.productId,
          unitId: item.unitId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,

          // discountType: "fixed",
          // discountValue: 0,
          // taxType: "percentage",
          // taxAmount: 0,
          // subTotal: 0,
        };
      }),
    });
  }, [purchaseOrder, products, units]);

  const handleAddItem = () => {
    appendItem({
      productId: 0,
      unitId: 0,
      quantity: 1,
      unitPrice: 0,
      discountType: "fixed",
      discountValue: 0,
    });
  };

  // const handleRemovePayment = (id: string) => {
  //   if (payments.length > 1) {
  //     setPayments(payments.filter((payment) => payment.id !== id));
  //   }
  // };

  // const handlePaymentChange = (id: string, field: keyof Payment, value: string | number) => {
  //   setPayments(payments.map((payment) => (payment.id === id ? { ...payment, [field]: value } : payment)));
  // };

  const handleSubmit = async (data: PurchaseInvoiceType) => {
    const payload: CreatePurchaseOrder = {
      orderDate: data.orderDate,
      warehouseId: data.warehouseId,
      notes: data.notes || "",
      items: data.items.map((item) => ({
        productId: item.productId,
        unitId: item.unitId,
        quantity: item.quantity,
        unitPrice: item?.unitPrice,
        discountPercentage: item.discountType === "percentage" ? (item.discountValue ?? 0) : 0,
        discountValue: item.discountType === "fixed" ? (item.discountValue ?? 0) : 0,
      })),
    };
    console.log(payload);

    const res = await createPurchaseOrder(payload);
  };
  const summary = useMemo(() => {
    let beforeTaxTotal = 0;
    let totalVat = 0;

    items?.forEach((item) => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const discType = item.discountType || "fixed";
      const discValue = item.discountValue || 0;

      const tax = taxes?.find((t) => t.id === Number(item.taxAmount));
      const taxRate = tax?.amount || 0;

      const gross = qty * price;

      const discount = discType === "fixed" ? discValue * qty : gross * (discValue / 100);

      const beforeTax = Math.max(0, gross - discount);

      const vat = beforeTax * (taxRate / 100);

      beforeTaxTotal += beforeTax;
      totalVat += vat;
    });

    const finalTotal = beforeTaxTotal + totalVat;

    return {
      beforeTaxTotal,
      totalVat,
      finalTotal,
    };
  }, [items, taxes]);

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>{"إضافة فاتورة مشتريات"}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Button variant={"outline"} asChild>
            <Link to={"/purchases"}>
              {" "}
              الرجوع لقائمة المشتريات
              <ArrowLeft size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit, (errors) => {
            console.log(errors);
          })}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-sm border border-gray-100">
            <h2 className="text-lg font-bold  text-gray-800 mb-6 ">{"البيانات الأساسية"}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {" "}
              <Controller
                name="orderDate"
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
                name="warehouseId"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>المخزن *</FieldLabel>
                      <ComboboxField field={field} items={wareHouses} valueKey="id" labelKey="warehouseName" placeholder="اختر المخزن" />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />
              <Controller
                name="supplierId"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>المورد *</FieldLabel>
                      <ComboboxField field={field} items={suppliers} valueKey="id" labelKey="supplierName" placeholder="اختر المورد" />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />
              <div className="lg:col-span-3 col-span-1">
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
          <div className="bg-white p-6 rounded-sm border border-gray-100">
            <div className="col-span-3 border-b border-zinc-200 pb-8 min-w-0">
              <h2 className="text-lg font-bold text-zinc-900 mb-6">تفاصيل الفاتورة</h2>

              {/* Section: الأصناف */}
              <section className="mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 mb-4">قائمة الأصناف</h2>
                <div className="w-full overflow-x-auto pb-4">
                  <div>
                    {/* Header */}
                    <div className="hidden md:grid md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_0.8fr_0.9fr_60px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                      <div>اسم الصنف/الكود</div>
                      <div>الوحدة</div>
                      <div>تكلفة الوحدة</div>
                      <div>الكمية</div>
                      <div>الإجمالي قبل الضريبة</div>
                      <div>نسبة الضريبة</div>
                      <div>ضريبة القيمة المضافة</div>
                      <div>الإجمالي النهائي</div>
                      <div></div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mt-3">
                      {itemFields.map((item, index) => {
                        const qty = Number(form.watch(`items.${index}.quantity`) || 0);
                        const price = Number(form.watch(`items.${index}.unitPrice`) || 0);
                        const discType = form.watch(`items.${index}.discountType`) || "fixed";
                        const discValue = Number(form.watch(`items.${index}.discountValue`) || 0);
                        const taxId = form.watch(`items.${index}.taxAmount`);
                        const tax = taxes?.find((t) => t.id === Number(taxId));
                        const taxRate = tax?.amount || 0;
                        const gross = qty * price;
                        const discount = discType === "fixed" ? discValue * qty : gross * (discValue / 100);
                        const beforeTax = Math.max(0, gross - discount);
                        const vatAmount = beforeTax * (taxRate / 100);
                        const afterTax = beforeTax + vatAmount;
                        const isDiscOpen = !!discountOpen[index];

                        return (
                          <div key={item.id}>
                            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_0.8fr_0.9fr_60px] gap-3 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group">
                              {/* الصنف */}
                              <Controller
                                control={form.control}
                                name={`items.${index}.productId`}
                                render={({ field }) => (
                                  <ComboboxField
                                    field={field}
                                    items={products?.items}
                                    valueKey="id"
                                    labelKey="productNameAr"
                                    placeholder="اختر الصنف"
                                    onValueChange={(val) => {
                                      const product = products?.items?.find((p) => p.id === Number(val));
                                      if (product) {
                                        form.setValue(`items.${index}.unitPrice`, product.sellingPrice);
                                      }
                                    }}
                                  />
                                )}
                              />
                              {/* الوحدة */}
                              <Controller
                                control={form.control}
                                name={`items.${index}.unitId`}
                                render={({ field }) => (
                                  <Select value={field.value === 0 ? "" : String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="الوحدة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {units?.items?.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>
                                          {u.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />

                              {/* السعر */}
                              <Controller control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />} />

                              {/* الكمية */}
                              <Controller control={form.control} name={`items.${index}.quantity`} render={({ field }) => <Input type="number" min={1} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />} />

                              {/* قبل الضريبة */}
                              <div className="text-center font-medium">
                                {beforeTax.toLocaleString("en-EG", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>

                              {/* نسبة الضريبة */}
                              <Controller
                                control={form.control}
                                name={`items.${index}.taxAmount`}
                                render={({ field }) => (
                                  <Select value={field.value === 0 ? "" : String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="الضريبة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {taxes?.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                          {t.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />

                              {/* قيمة الضريبة */}
                              <div className="text-center text-orange-600 font-medium">
                                {vatAmount.toLocaleString("en-EG", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>

                              {/* الإجمالي */}
                              <div className="text-center text-green-600 font-bold">
                                {afterTax.toLocaleString("en-EG", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>

                              {/* أزرار */}
                              <div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => removeItem(index)} className="p-2 text-zinc-400 hover:text-red-500">
                                  <Trash2 size={16} />
                                </button>

                                <button type="button" onClick={() => toggleDiscount(index)} className={`p-2 ${isDiscOpen ? "text-emerald-600" : "text-zinc-400"}`}>
                                  <Tag size={14} />
                                </button>
                              </div>
                            </div>

                            {/* الخصم */}
                            {isDiscOpen && (
                              <div className="grid grid-cols-2 gap-3 px-2 py-3 bg-emerald-50 border rounded-lg">
                                <Controller
                                  control={form.control}
                                  name={`items.${index}.discountType`}
                                  render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="fixed">قيمة ثابتة</SelectItem>
                                        <SelectItem value="percentage">نسبة %</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />

                                <Controller control={form.control} name={`items.${index}.discountValue`} render={({ field }) => <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Plus size={16} strokeWidth={2} /> إضافة صنف جديد
                </button>
              </section>
            </div>
          </div>
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
            <h3 className="text-base font-semibold text-gray-800 mb-5">ملخص الفاتورة</h3>

            <div className="space-y-4">
              {/* قبل الضريبة */}
              <div className="flex justify-between items-center text-zinc-600">
                <span className="text-sm font-medium">الإجمالي قبل الضريبة</span>
                <span className="font-semibold text-zinc-900">
                  {summary.beforeTaxTotal.toLocaleString("en-EG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* الضريبة */}
              <div className="flex justify-between items-center text-zinc-600">
                <span className="text-sm font-medium">ضريبة القيمة المضافة</span>
                <span className="font-semibold text-orange-600">
                  {summary.totalVat.toLocaleString("en-EG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <hr className="border-zinc-200" />

              {/* الإجمالي النهائي */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-zinc-900">الإجمالي النهائي</span>
                <span className="text-xl font-black text-green-600">
                  {summary.finalTotal.toLocaleString("en-EG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-sm border border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button type="button" variant={"destructive"} className="h-12 px-4" onClick={() => {}}>
              إلغاء والعودة
            </Button>
            <Button type="submit" className="h-12 px-4">
              حفظ وإصدار الفاتورة
            </Button>
          </div>
        </form>{" "}
      </CardContent>
    </Card>
  );
};

export default CreatePurchaseInvoice;

//  <button
//     type="button"
//     onClick={handleAddPayment}
//     className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors w-max"
//   >
//     <Plus size={16} strokeWidth={2} /> إضافة دفعة أخرى
//   </button>
