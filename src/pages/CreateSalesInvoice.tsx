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
const SalesInvoiceSchema = z
  .object({
    orderDate: z.string().min(1, "التاريخ مطلوب"),
    customerId: z.number().min(1, "العميل مطلوب"),
    warehouseId: z.number().min(1, "المخزن مطلوب"),
    orderStatus: z.enum(["Confirmed", "UnConfirmed"]),
    notes: z.string().optional(),

    items: z
      .array(
        z.object({
          productId: z.number().min(1, "اختر الصنف"),
          unitId: z.number().min(1, "اختر وحدة الصنف"),
          quantity: z.number().min(1, "الكمية لازم تكون أكبر من 0"),
          price: z.number().min(0, "السعر لازم يكون ≥ 0"),
          discountType: z.enum(["percentage", "fixed"]).default("fixed"),
          discountValue: z.number().min(0).default(0),
        }),
      )
      .min(1, "لازم تضيف صنف واحد على الأقل"),
    payments: z
      .array(
        z.object({
          amount: z.number().min(1, "المبلغ لازم يكون أكبر من 0"),
          paymentMethod: z.enum(["Cash", "CreditCard", "DebitCard", "BankTransfer", "Check", "MobilePayment", "OnlinePayment", "Other"], {
            message: "اختر طريقة الدفع",
          }),
        }),
      )
      .min(1, "لازم تضيف دفعة واحدة على الأقل"),
    invoiceDiscountType: z.enum(["percentage", "fixed"]).default("fixed"),
    invoiceDiscountValue: z.number().min(0).default(0),
  })

  .refine((data) => data.orderStatus !== undefined, {
    message: "حالة الفاتورة مطلوبة",
    path: ["orderStatus"],
  });
type SalesInvoiceType = z.input<typeof SalesInvoiceSchema>;
const CreateSalesInvoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const form = useForm<SalesInvoiceType>({
    resolver: zodResolver(SalesInvoiceSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split("T")[0],
      customerId: 0,
      warehouseId: 0,
      orderStatus: "Confirmed",
      notes: "",

      items: [
        {
          productId: 0,
          unitId: 0,
          quantity: 1,
          price: 0,
          discountType: "fixed",
          discountValue: 0,
        },
      ],
      payments: [
        {
          amount: 0,
          paymentMethod: "Cash",
        },
      ],
      invoiceDiscountType: "fixed",
      invoiceDiscountValue: 0,
    },
  });

  const { data: customers } = useGetAllCustomers();
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({ page: 1, size: 100 });
  const { mutateAsync: createSalesOrders } = useCreateSalesOrders();
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  const discountType = useWatch({
    control: form.control,
    name: "invoiceDiscountType",
  });

  const discountValue = useWatch({
    control: form.control,
    name: "invoiceDiscountValue",
  });
  const payments = useWatch({
    control: form.control,
    name: "payments",
  });
  const items = useWatch({
    control: form.control,
    name: "items",
  });

  const invoiceTotal = useMemo(() => {
    return (
      items?.reduce((total, item) => {
        let itemTotal = (item.quantity || 0) * (item.price || 0);

        if (item.discountType === "fixed") {
          itemTotal -= item.discountValue || 0;
        }

        if (item.discountType === "percentage") {
          itemTotal -= itemTotal * ((item.discountValue || 0) / 100);
        }

        return total + Math.max(0, itemTotal);
      }, 0) || 0
    );
  }, [items]);

  const totalPaid = useMemo(() => {
    return payments?.reduce((total, p) => total + (p.amount || 0), 0) || 0;
  }, [payments]);
  const finalTotal = useMemo(() => {
    let total = invoiceTotal;

    if (discountType === "fixed") {
      total -= discountValue || 0;
    }

    if (discountType === "percentage") {
      total -= total * ((discountValue || 0) / 100);
    }

    return Math.max(0, total);
  }, [invoiceTotal, discountType, discountValue]);

  const remaining = finalTotal - totalPaid;

  const handleAddItem = () => {
    appendItem({
      productId: 0,
      unitId: 0,
      quantity: 1,
      price: 0,
      discountType: "fixed",
      discountValue: 0,
    });
  };

  const handleAddPayment = () => {
    appendPayment({ amount: 0, paymentMethod: "Cash" });
  };

  // const handleRemovePayment = (id: string) => {
  //   if (payments.length > 1) {
  //     setPayments(payments.filter((payment) => payment.id !== id));
  //   }
  // };

  // const handlePaymentChange = (id: string, field: keyof Payment, value: string | number) => {
  //   setPayments(payments.map((payment) => (payment.id === id ? { ...payment, [field]: value } : payment)));
  // };

  const handleSubmit = async (data: SalesInvoiceType) => {
    const payload: CreateSalesOrder = {
      customerId: data.customerId,
      orderDate: data.orderDate,
      warehouseId: data.warehouseId,
      notes: data.notes || "",
      description: "",

      globalDiscountPercentage: data.invoiceDiscountType === "percentage" ? (data.invoiceDiscountValue ?? 0) : 0,

      globalDiscountValue: data.invoiceDiscountType === "fixed" ? (data.invoiceDiscountValue ?? 0) : 0,
      orderStatus: data.orderStatus ?? "UnConfirmed",
      items: data.items.map((item) => ({
        productId: item.productId,
        unitId: item.unitId,
        quantity: item.quantity,

        discountPercentage: item.discountType === "percentage" ? (item.discountValue ?? 0) : 0,

        discountValue: item.discountType === "fixed" ? (item.discountValue ?? 0) : 0,
      })),
      payments: data.payments.map((p) => ({
        amount: p?.amount,
        paymentMethod: p?.paymentMethod,
        notes: "",
      })),
    };
    console.log(payload);

    const res = await createSalesOrders(payload);
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>{"إضافة فاتورة مبيعات"}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Button variant={"outline"} asChild>
            <Link to={"/sales/all"}>
              {" "}
              الرجوع لقائمة المبيعات
              <ArrowLeft size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {})} className="space-y-6">
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
                name="orderStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>حالة الفاتورة*</FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر حالة الفاتورة" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Confirmed">مؤكدة</SelectItem>
                          <SelectItem value="UnConfirmed">غير مؤكدة</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

              {/* Section: الأصناف */}
              <section className="mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 mb-4">قائمة الأصناف</h2>

                {/* مساحة السكرول هتبدأ من هنا وتأثر على الجدول بس */}
                <div className="w-full overflow-x-auto pb-4">
                  {/* حاوية الجدول الثابتة عشان تمنع التداخل */}
                  <div className="">
                    {/* Header (desktop فقط) - توزيع المساحات بنظام الفراكشن */}
                    <div className="hidden md:grid md:grid-cols-[2.5fr_1fr_1.5fr_1.5fr_1.5fr_1fr_1fr_40px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                      <div>اسم الصنف</div>
                      <div className="">الكمية</div>
                      <div className="">الوحدة</div>
                      <div className="">السعر</div>
                      <div>نوع الخصم</div>
                      <div className="">الخصم</div>
                      <div className="text-center">الإجمالي</div>
                      <div></div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mt-3">
                      {itemFields.map((item, index) => {
                        const qty = form.watch(`items.${index}.quantity`) || 0;
                        const price = form.watch(`items.${index}.price`) || 0;
                        const discType = form.watch(`items.${index}.discountType`) || "fixed";
                        const discValue = form.watch(`items.${index}.discountValue`) || 0;

                        let itemTotal = qty * price;
                        if (discType === "fixed") itemTotal -= discValue;
                        if (discType === "percentage") itemTotal -= itemTotal * (discValue / 100);

                        return (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1.5fr_1.5fr_1.5fr_1fr_1fr_40px] gap-4 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group transition-colors hover:bg-zinc-50/80">
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
                                          form.setValue(`items.${index}.price`, product.sellingPrice);
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
                                    <SelectTrigger className="w-full ">
                                      <SelectValue placeholder="الوحدة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {units?.data?.map((c) => (
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
                                  )}{" "}
                                </Field>
                              )}
                            />

                            {/* السعر */}
                            <div>
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">السعر</FieldLabel>
                              <Controller
                                control={form.control}
                                name={`items.${index}.price`}
                                render={({ field, fieldState }) => (
                                  <Field className="relative" data-invalid={fieldState.invalid}>
                                    <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                    <div className="absolute top-full mt-1 right-0 z-10 w-full">
                                      <FieldError errors={[fieldState.error]} />
                                    </div>{" "}
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
                              <Controller control={form.control} name={`items.${index}.discountValue`} render={({ field }) => <Input type="number" min={0} value={field.value || 0} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center " />} />
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
          <div className="bg-white p-6 rounded-xl border border-gray-100 col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-6">المدفوعات</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                {paymentFields.map((payment, index) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <div className="w-full flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">المبلغ</label>
                      <Controller
                        control={form.control}
                        name={`payments.${index}.amount`}
                        render={({ field, fieldState }) => (
                          <Field className="relative" data-invalid={fieldState.invalid}>
                            <Input type="number" placeholder="0.00" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="bg-white" />
                            <div className="absolute top-full mt-1 right-0 z-10 w-full">
                              <FieldError errors={[fieldState.error]} />
                            </div>{" "}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="w-full flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">طريقة الدفع</label>
                      <Controller
                        control={form.control}
                        name={`payments.${index}.paymentMethod`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="اختر..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">كاش</SelectItem>
                              <SelectItem value="CreditCard">فيزا</SelectItem>
                              <SelectItem value="transfer">تحويل</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="pt-5 shrink-0">
                      <button type="button" onClick={() => removePayment(index)} disabled={paymentFields.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors border border-transparent hover:border-red-100" title="حذف الدفعة">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <Button type="button" size={"lg"} variant={"secondary"} onClick={handleAddPayment} className=" text-sm font-medium px-4  rounded-lg transition-colors w-max">
                  <Plus size={16} strokeWidth={2} /> إضافة دفعة أخرى
                </Button>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100  sticky top-4">
                <h3 className="text-base font-semibold text-gray-800 mb-5">ملخص الفاتورة</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-zinc-600">
                    <span className="text-sm font-medium">المجموع الفرعي</span>
                    <span className="font-semibold text-zinc-900">{invoiceTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-600 gap-3">
                    <span className="text-sm font-medium whitespace-nowrap">الخصم</span>
                    <div className="flex gap-2 w-full max-w-[170px]">
                      <Controller control={form.control} name="invoiceDiscountValue" render={({ field }) => <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className=" text-center bg-white  flex-1" placeholder="القيمة" />} />
                      <Controller
                        control={form.control}
                        name="invoiceDiscountType"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[80px]  bg-white">
                              <SelectValue placeholder="اختر نوع الخصم" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">قيمة</SelectItem>
                              <SelectItem value="percentage">نسبة</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <hr className="border-zinc-200" />

                  {/* الإجمالي النهائي */}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">الإجمالي النهائي</span>
                    <span className="text-xl font-black text-zinc-900">{finalTotal.toLocaleString()}</span>
                  </div>

                  {/* تم سداده */}
                  <div className="flex justify-between items-center text-zinc-500 pt-2">
                    <span className="text-sm">إجمالي المدفوع</span>
                    <span className="font-semibold text-emerald-600">{totalPaid.toLocaleString()}</span>
                  </div>

                  {/* المتبقي */}
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-zinc-100 mt-2">
                    <span className="text-sm font-bold text-zinc-900">المتبقي للدفع</span>
                    <span className={`font-black text-lg ${remaining > 0 ? "text-red-500" : "text-zinc-400"}`}>{remaining.toLocaleString()}</span>
                  </div>
                </div>
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

export default CreateSalesInvoice;

//  <button
//     type="button"
//     onClick={handleAddPayment}
//     className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors w-max"
//   >
//     <Plus size={16} strokeWidth={2} /> إضافة دفعة أخرى
//   </button>
