import React, { useState, useMemo } from "react";
import { PlusCircle, Save, Trash2, FileText, CreditCard, Box, Plus, Eye, X, ArrowLeft } from "lucide-react";
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
const CreateQuote: React.FC = () => {
  const { t, direction } = useLanguage();
  const form = useForm<SalesInvoiceType>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      quotationDate: new Date().toISOString().split("T")[0],
      customerId: 0,
      notes: "",

      items: [
        {
          productId: 0,
          unitPrice: 0,
          quantity: 1,
          discountType: "fixed",
          discountValue: 0,
        },
      ],
    },
  });

  const { data: customers } = useGetAllCustomers();
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({});
  const { mutateAsync: createQuotations, isPending: isLoading } = useCreateQuotation();
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

  const handleAddItem = () => {
    appendItem({
      productId: 0,
      quantity: 1,
      unitId: 0,
      unitPrice: 0,
      taxPercentage: 0,
      discountType: "fixed",
      discountValue: 0,
    });
  };

  // const remaining = finalTotal - totalPaid;

  // const handleRemovePayment = (id: string) => {
  //   if (payments.length > 1) {
  //     setPayments(payments.filter((payment) => payment.id !== id));
  //   }
  // };

  // const handlePaymentChange = (id: string, field: keyof Payment, value: string | number) => {
  //   setPayments(payments.map((payment) => (payment.id === id ? { ...payment, [field]: value } : payment)));
  // };

  const handleSubmit = async (data: SalesInvoiceType) => {
    const payload: CreateQuotation = {
      customerId: data.customerId,
      quotationDate: data.quotationDate,
      validUntil: data.validUntil,
      discountAmount: 0,
      notes: data.notes || "",
      globalDiscountPercentage: data?.quotationDiscountType === "percentage" ? (data.quotationDiscountValue ?? 0) : 0,
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
    console.log(payload);

    const res = await createQuotations(payload);
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>{"إضافة عرض سعر"}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Button variant={"outline"} asChild>
            <Link to={"/sales/all"}>
              {" "}
              الرجوع لقائمة عروض الأسعار
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
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>العميل *</FieldLabel>
                      <ComboboxField field={field} items={customers} valueKey="id" labelKey="customerName" placeholder="اختر العميل" />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />
              <Controller
                control={form.control}
                name={"discountAmount"}
                render={({ field, fieldState }) => (
                  <Field className="relative" data-invalid={fieldState.invalid}>
                    <FieldLabel>قيمة الخصم*</FieldLabel>
                    <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name={"shippingCost"}
                render={({ field, fieldState }) => (
                  <Field className="relative" data-invalid={fieldState.invalid}>
                    <FieldLabel>قيمة التوصيل*</FieldLabel>
                    <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
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
              <section className="mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 mb-4">قائمة الأصناف</h2>

                <div className="w-full overflow-x-auto pb-4">
                  <div className="">
                    <div className="hidden md:grid md:grid-cols-[2.5fr_1fr_1.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_40px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                      <div>اسم الصنف</div>
                      <div className="">الكمية</div>
                      <div className="">الوحدة</div>
                      <div className="">السعر</div>
                      <div>نوع الخصم</div>
                      <div className="">الخصم</div>
                      <div className="text-center">قبل الضريبة</div>
                      <div className="text-center">الضريبة</div>
                      <div className="text-center">بعد الضريبة</div>
                      <div className="text-center">الإجمالي</div>
                      <div></div>
                    </div>

                    <div className="space-y-3 mt-3">
                      {itemFields.map((item, index) => {
                        const qty = form.watch(`items.${index}.quantity`) || 0;
                        const price = form.watch(`items.${index}.unitPrice`) || 0;
                        const discType = form.watch(`items.${index}.discountType`) || "fixed";
                        const discValue = form.watch(`items.${index}.discountValue`) || 0;
                        const productId = form.watch(`items.${index}.productId`);
                        const product = products?.items?.find((p) => p.id === Number(productId));
                        console.log(product);
                        const taxRate = (product?.taxAmount || 0) / 100;

                        let beforeDiscount = qty * price;
                        let discountAmount = discType === "fixed" ? discValue : beforeDiscount * (discValue / 100);
                        let beforeTax = beforeDiscount - discountAmount;
                        let taxAmount = beforeTax * taxRate;
                        let afterTax = beforeTax + taxAmount;
                        let itemTotal = afterTax;

                        return (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_40px] gap-4 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group transition-colors hover:bg-zinc-50/80">
                            <Controller
                              control={form.control}
                              name={`items.${index}.productId`}
                              render={({ field, fieldState }) => {
                                return (
                                  <Field data-invalid={fieldState.invalid} className="relative">
                                    <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الصنف</FieldLabel>
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
                                    {fieldState.invalid && (
                                      <div className="absolute top-full mt-1 right-0 z-10 w-full">
                                        <FieldError errors={[fieldState.error]} />
                                      </div>
                                    )}
                                  </Field>
                                );
                              }}
                            />

                            {/* الكمية */}
                            <div>
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الكمية</FieldLabel>
                              <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <Input type="number" min={1} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />
                            </div>

                            {/* الوحدة */}
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
                                        <SelectItem key={c?.id} value={String(c?.id)}>
                                          {c?.name}
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

                            {/* السعر */}
                            <div>
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">السعر</FieldLabel>
                              <Controller
                                control={form.control}
                                name={`items.${index}.unitPrice`}
                                render={({ field, fieldState }) => (
                                  <Field className="relative" data-invalid={fieldState.invalid}>
                                    <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                    <div className="absolute top-full mt-1 right-0 z-10 w-full">
                                      <FieldError errors={[fieldState.error]} />
                                    </div>
                                  </Field>
                                )}
                              />
                            </div>

                            {/* نوع الخصم */}
                            <div>
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">نوع الخصم</FieldLabel>
                              <Controller
                                control={form.control}
                                name={`items.${index}.discountType`}
                                render={({ field }) => (
                                  <Select value={field.value || "fixed"} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="النوع" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="fixed">قيمة</SelectItem>
                                      <SelectItem value="percentage">نسبة %</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            {/* قيمة الخصم */}
                            <div>
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الخصم</FieldLabel>
                              <Controller control={form.control} name={`items.${index}.discountValue`} render={({ field }) => <Input type="number" min={0} value={field.value || 0} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />} />
                            </div>

                            {/* قبل الضريبة */}
                            <div className="flex items-center md:justify-center font-medium text-zinc-700 mt-2 md:mt-0 px-2 h-9">
                              <FieldLabel className="md:hidden text-xs text-zinc-500 ml-auto">قبل الضريبة:</FieldLabel>
                              {Math.max(0, beforeTax).toLocaleString()}
                            </div>

                            {/* الضريبة */}
                            <div className="flex items-center md:justify-center font-medium text-amber-600 mt-2 md:mt-0 px-2 h-9">
                              <FieldLabel className="md:hidden text-xs text-zinc-500 ml-auto">الضريبة:</FieldLabel>
                              {Math.max(0, taxAmount).toLocaleString()}
                            </div>

                            {/* بعد الضريبة */}
                            <div className="flex items-center md:justify-center font-medium text-green-700 mt-2 md:mt-0 px-2 h-9">
                              <FieldLabel className="md:hidden text-xs text-zinc-500 ml-auto">بعد الضريبة:</FieldLabel>
                              {Math.max(0, afterTax).toLocaleString()}
                            </div>

                            {/* الإجمالي */}
                            <div className="flex items-center md:justify-center font-semibold text-zinc-900 mt-2 md:mt-0 px-2 h-9">
                              <FieldLabel className="md:hidden text-xs text-zinc-500 ml-auto">الإجمالي:</FieldLabel>
                              {Math.max(0, itemTotal).toLocaleString()}
                            </div>

                            {/* حذف */}
                            <div className="flex justify-end md:justify-center absolute top-4 left-4 md:static">
                              <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 md:opacity-0 md:group-hover:opacity-100">
                                <Trash2 size={18} strokeWidth={1.5} />
                              </button>
                            </div>
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

          <div className="bg-white p-5 sm:p-6 rounded-sm border border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button type="button" variant={"destructive"} className="h-12 px-4" onClick={() => {}}>
              إلغاء والعودة
            </Button>

            <Button type="submit" disabled={isLoading} className="h-12 px-4">
              {isLoading ? "جاري الحفظ..." : "حفظ وإصدار عرض السعر"}
            </Button>
          </div>
        </form>{" "}
      </CardContent>
    </Card>
  );
};

export default CreateQuote;

//  <button
//     type="button"
//     onClick={handleAddPayment}
//     className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors w-max"
//   >
//     <Plus size={16} strokeWidth={2} /> إضافة دفعة أخرى
//   </button>
