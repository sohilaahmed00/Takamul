import React, { useState, useMemo, useEffect } from "react";
import { PlusCircle, Save, Trash2, FileText, CreditCard, Box, Plus, Eye, X, ArrowLeft, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { Button } from "@/components/ui/button";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllWareHouses } from "@/features/wareHouse/hooks/useGetAllWareHouses";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import { useWatch } from "react-hook-form";
import type { CreateSalesOrder } from "@/features/sales/types/sales.types";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { CreatePurchaseOrder } from "@/features/purchases/types/purchase.types";
import { useCreatePurchaseOrder } from "@/features/purchases/hooks/useCreatePurchaseOrder";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";
import { useGetPurchaseOrderById } from "@/features/purchases/hooks/useGetPurchaseOrderById";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import z from "zod/v3";
import { Spinner } from "@/components/ui/spinner";
const PurchasesInvoiceSchema = z.object({
  supplierId: z.number().min(1, "المورد مطلوب"),
  warehouseId: z.number().min(1, "المخزن مطلوب"),
  orderDate: z.string().min(1, "التاريخ مطلوب"),

  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().min(1, "اختر الصنف"),
        unitId: z.number().min(1, "اختر وحدة الصنف"),
        quantity: z.number({ required_error: "الكمية مطلوبة" }).min(1, "الكمية لازم تكون أكبر من 0"),
        unitPrice: z.number({ required_error: "تكلفة الوحدة مطلوبة" }).min(0, "السعر لازم يكون ≥ 0"),
        discountType: z.enum(["percentage", "fixed"]).default("fixed"),
        discountValue: z.number().min(0).default(0),
        taxType: z.enum(["percentage", "fixed"]).default("fixed"),
        taxId: z.number().min(1, "يرجى اختيار الضريبة"),
      }),
    )
    .min(1, "لازم تضيف صنف واحد على الأقل"),
  payments: z
    .array(
      z.object({
        amount: z.number({ required_error: "المبلغ مطلوب" }).min(1, "المبلغ لازم يكون أكبر من 0"),
        treasuryId: z.number().min(1, "اختر الخزنة"),
      }),
    )
    .min(1, "لازم تضيف دفعة واحدة على الأقل"),
  // subTotal: z.number().min(0),
  // taxAmount: z.number().min(0),
  // discountAmount: z.number().min(0),
  // grandTotal: z.number().min(0),
  // paidAmount: z.number().min(0),
});

type PurchaseInvoiceType = z.input<typeof PurchasesInvoiceSchema>;
const CreatePurchaseInvoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { mutateAsync: createPurchaseOrder, isPending } = useCreatePurchaseOrder();
  const [discountOpen, setDiscountOpen] = useState<Record<number, boolean>>({});
  const toggleDiscount = (i: number) => setDiscountOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  const { id } = useParams();
  const { data: purchaseOrder } = useGetPurchaseOrderById(Number(id));
  const { data: treasurys } = useGetAllTreasurys();
  const [submitType, setSubmitType] = useState<"save" | "saveAndNew">("save");

  const form = useForm<PurchaseInvoiceType>({
    resolver: zodResolver(PurchasesInvoiceSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split("T")[0],
      warehouseId: 0,
      supplierId: 0,
      notes: "",
      items: [
        {
          productId: 0,
          unitId: 0,
          quantity: undefined,
          unitPrice: undefined as unknown as number,
          discountType: "fixed",
          discountValue: 0,
          taxId: 0,
        },
      ],
      payments: [
        {
          amount: undefined,
          treasuryId: 0,
        },
      ],
    },
  });

  const { data: suppliers } = useGetAllSuppliers();
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({});
  const { data: taxes } = useGetAllTaxes();
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({ control: form.control, name: "payments" });

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
      taxId: 0,
    });
  };

  const handleSubmit = async (data: PurchaseInvoiceType) => {
    const payload: CreatePurchaseOrder = {
      orderDate: data.orderDate,
      warehouseId: data.warehouseId,
      supplierId: Number(data?.supplierId),
      notes: data.notes || "",
      items: data.items.map((item) => ({
        productId: item.productId,
        unitId: Number(item.unitId),
        quantity: item.quantity,
        unitPrice: item?.unitPrice,
        discountPercentage: item.discountType === "percentage" ? (item.discountValue ?? 0) : 0,
        discountValue: item.discountType === "fixed" ? (item.discountValue ?? 0) : 0,
        taxId: item?.taxId,
      })),
      payments: data.payments.map((payment) => ({
        amount: payment.amount,
        treasuryId: payment?.treasuryId,
        notes: "",
      })),
    };

    await createPurchaseOrder(payload);
    if (submitType === "saveAndNew") {
      form.reset({
        orderDate: new Date().toISOString().split("T")[0],
        warehouseId: 0,
        supplierId: 0,
        notes: "",
        items: [{ productId: 0, unitId: 0, quantity: undefined, unitPrice: undefined, discountType: "fixed", discountValue: 0, taxId: 0 }],
        payments: [{ amount: undefined, treasuryId: 0 }],
      });
    } else {
      navigate("/purchases");
    }
  };
  const summary = useMemo(() => {
    let beforeTaxTotal = 0;
    let totalVat = 0;

    items?.forEach((item) => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const discType = item.discountType || "fixed";
      const discValue = item.discountValue || 0;

      const tax = taxes?.find((t) => t.id === Number(item.taxId));
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

  const handleAddPayment = () => {
    appendPayment({ amount: 0, treasuryId: 0 });
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>{"إضافة فاتورة مشتريات"}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Button size={"xl"} variant={"outline"} asChild>
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
                      <ComboboxField field={field} items={suppliers?.items} valueKey="id" labelKey="supplierName" placeholder="اختر المورد" onValueChange={(val) => val} />

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
                <div className="w-full overflow-x-auto ">
                  {/* Header */}
                  <div className="hidden md:grid md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_1fr_0.9fr_60px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
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

                      const taxId = form.watch(`items.${index}.taxId`);
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
                          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_1fr_0.9fr_60px] gap-3 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-start group">
                            {/* الصنف */}
                            <Controller
                              control={form.control}
                              name={`items.${index}.productId`}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <ComboboxField
                                    field={field}
                                    items={products?.items}
                                    valueKey="id"
                                    labelKey="productNameAr"
                                    placeholder="اختر الصنف"
                                    onValueChange={(val) => {
                                      const product = products?.items?.find((p) => p.id === Number(val));
                                      if (product) {
                                        console.log(product);
                                        form.setValue(`items.${index}.unitPrice`, product.sellingPrice);
                                      }
                                    }}
                                  />
                                  {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                            {/* الوحدة */}
                            <Controller
                              control={form.control}
                              name={`items.${index}.unitId`}
                              render={({ field, fieldState }) => (
                                <Field>
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
                                  {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                            {/* السعر */}
                            <Controller
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} className="text-center" />
                                  {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                            {/* الكمية */}
                            <Controller
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /> {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                            {/* قبل الضريبة */}
                            <div className="self-start pt-2 text-center font-medium">{beforeTax.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div> {/* نسبة الضريبة */}
                            <Controller
                              control={form.control}
                              name={`items.${index}.taxId`}
                              render={({ field, fieldState }) => (
                                <Field>
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
                                  {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                            {/* قيمة الضريبة */}
                            <div className="self-start pt-2 text-center text-orange-600 font-medium">{vatAmount.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>
                            {/* الإجمالي */}
                            <div className="self-start pt-2 text-center text-green-600 font-bold">{afterTax.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>
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

                    {(form.formState.errors.items?.root?.message || form.formState.errors.items?.message) && <p className="text-red-500 text-sm text-center py-2">{form.formState.errors.items?.root?.message || form.formState.errors.items?.message}</p>}
                  </div>
                </div>
                {/* <button type="button" onClick={} className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Plus size={16} strokeWidth={2} />
                </button> */}
                <Button type="button" size={"lg"} variant={"secondary"} onClick={handleAddItem} >
                  <Plus size={16} strokeWidth={2} /> إضافة صنف جديد
                </Button>
              </section>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {paymentFields.map((payment, index) => (
                <div key={payment.id} className="flex flex-col sm:flex-row gap-3 items-start bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  <div className="w-full flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">المبلغ</label>
                    <Controller
                      control={form.control}
                      name={`payments.${index}.amount`}
                      render={({ field, fieldState }) => (
                        <Field className="relative" data-invalid={fieldState.invalid}>
                          <Input type="number" placeholder="0.00" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} className="bg-white" /> {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="w-full flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">طريقة الدفع</label>
                    <Controller
                      control={form.control}
                      name={`payments.${index}.treasuryId`}
                      render={({ field, fieldState }) => (
                        <Field>
                          <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="اختر..." />
                            </SelectTrigger>
                            <SelectContent>
                              {treasurys?.map((treasury) => (
                                <SelectItem key={treasury?.id} value={String(treasury?.id)}>
                                  {treasury?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
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

              <Button type="button" size={"lg"} variant={"secondary"} onClick={handleAddPayment} >
                <Plus size={16} strokeWidth={2} /> إضافة دفعة أخرى
              </Button>
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
          </div>

          <div className="flex flex-col-reverse lg:flex-row justify-between py-4 border px-3 gap-3 rounded border-gray-100">
            <Button size={"2xl"} type="button" variant={"destructive"} className="w-full lg:w-auto">
              إلغاء والعودة
            </Button>

            <div className="flex flex-col-reverse lg:flex-row items-center gap-3 w-full lg:w-auto">
              <Button size={"2xl"} variant="outline" type="submit" className="w-full lg:w-auto">
                حفظ وإصدار فاتورة أخرى
              </Button>
              <Button size={"2xl"} type="submit" disabled={isPending} className="w-full lg:w-auto">
                {isPending ? (
                  <>
                    حفظ وإصدار الفاتورة <Spinner data-icon="inline-start" />
                  </>
                ) : (
                  "حفظ وإصدار الفاتورة"
                )}
              </Button>
            </div>
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
