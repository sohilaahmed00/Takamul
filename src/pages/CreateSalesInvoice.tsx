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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetSalesOrderById } from "@/features/sales/hooks/useGetSalesOrderById";

const SalesInvoiceSchema = (t: (key: string) => string) => z.object({
  orderDate: z.string().min(1, t("date_required")),
  customerId: z.number().min(1, t("customer_required")),
  warehouseId: z.number().min(1, t("warehouse_required")),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().min(1, t("choose_product")),
        unitId: z.number().min(1, t("choose_product_unit")),
        quantity: z.number().min(1, t("quantity_must_be_greater_than_zero")),
        price: z.number().min(0, t("price_must_be_gte_zero")),
        discountType: z.enum(["percentage", "fixed"]).default("fixed"),
        discountValue: z.number().min(0).default(0),
      }),
    )
    .min(1, t("must_add_at_least_one_item")),
  payments: z
    .array(
      z.object({
        amount: z.number().min(1, t("amount_must_be_greater_than_zero")),
        paymentMethod: z.enum(["Cash", "CreditCard", "DebitCard", "BankTransfer", "Check", "MobilePayment", "OnlinePayment", "Other"], {
          message: t("choose_payment_method"),
        }),
      }),
    )
    .min(1, t("must_add_at_least_one_payment")),
  invoiceDiscountType: z.enum(["percentage", "fixed"]).default("fixed"),
  invoiceDiscountValue: z.number().min(0).default(0),
});

type SalesInvoiceType = z.input<ReturnType<typeof SalesInvoiceSchema>>;

const CreateSalesInvoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [discountOpen, setDiscountOpen] = useState<{ [key: number]: boolean }>({});

  function calcVat(beforeTax: number, taxRate: number, taxCalculation: string | number) {
    const calc = Number(taxCalculation);
    if (calc === 1) return 0;
    if (calc === 2) return beforeTax - beforeTax / (1 + taxRate / 100);
    return beforeTax * (taxRate / 100);
  }

  const toggleDiscount = (index: number) => {
    setDiscountOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const form = useForm<SalesInvoiceType>({
    resolver: zodResolver(SalesInvoiceSchema(t)),
    defaultValues: {
      orderDate: new Date().toISOString().split("T")[0],
      customerId: 0,
      warehouseId: 0,
      notes: "",
      items: [
        {
          productId: 0,
          unitId: 0,
          quantity: 1,
          price: undefined,
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

  const { data: customers } = useGetAllCustomers({ page: 1, limit: 100 });
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({});

  const { data: salesOrder, isLoading: isLoadingOrder } = useGetSalesOrderById(isEditMode ? Number(id) : undefined);

  const { mutateAsync: createSalesOrders } = useCreateSalesOrders();
  // const { mutateAsync: updateSalesOrder } = useUpdateSalesOrder();

  useEffect(() => {
    if (!salesOrder || !isEditMode) return;
    if (!customers || !wareHouses || !products?.items || !units?.items) return;
    const customer = customers?.items?.find((c) => c.customerName === salesOrder.customerName);
    const warehouse = wareHouses?.find((w) => w.warehouseName === salesOrder.warehouseName);

    form.reset({
      orderDate: salesOrder.orderDate?.split("T")[0] ?? new Date().toISOString().split("T")[0],
      customerId: customer?.id ?? 0,
      warehouseId: warehouse?.id ?? 0,
      notes: (salesOrder as any).notes ?? "",

      items: salesOrder.items.map((item) => {
        console.log(item);

        return {
          productId: item?.productId,
          unitId: item?.unitId,
          quantity: item.quantity,
          price: item.lineTotal ?? product?.sellingPrice ?? 0,
          discountType: item.discountValue > 0 ? "fixed" : item.discountPercentage > 0 ? "percentage" : "fixed",
          discountValue: item.discountValue > 0 ? item.discountValue : item.discountPercentage,
        };
      }),

      payments: salesOrder.payments.map((p) => ({
        amount: p.amount,
        paymentMethod: p.paymentMethod === "Visa" ? "CreditCard" : (p.paymentMethod as any),
      })),

      invoiceDiscountType: (salesOrder as any).globalDiscountValue > 0 ? "fixed" : "percentage",
      invoiceDiscountValue: (salesOrder as any).globalDiscountValue > 0 ? (salesOrder as any).globalDiscountValue : ((salesOrder as any).globalDiscountPercentage ?? 0),
    });
  }, [salesOrder, customers, wareHouses, products, units]);

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({ control: form.control, name: "items" });

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({ control: form.control, name: "payments" });

  const discountType = useWatch({ control: form.control, name: "invoiceDiscountType" });
  const discountValue = useWatch({ control: form.control, name: "invoiceDiscountValue" });
  const payments = useWatch({ control: form.control, name: "payments" });
  const items = useWatch({ control: form.control, name: "items" });

  const invoiceTotal = useMemo(() => {
    return (
      items?.reduce((total, item) => {
        let itemTotal = (item.quantity || 0) * (item.price || 0);
        if (item.discountType === "fixed") itemTotal -= item.discountValue || 0;
        if (item.discountType === "percentage") itemTotal -= itemTotal * ((item.discountValue || 0) / 100);
        return total + Math.max(0, itemTotal);
      }, 0) || 0
    );
  }, [items]);

  const totalVat = useMemo(() => {
    return (
      items?.reduce((total, item) => {
        const qty = item.quantity || 0;
        const price = item.price || 0;
        const discType = item.discountType || "fixed";
        const discValue = item.discountValue || 0;

        const gross = qty * price;
        const discount = discType === "fixed" ? discValue * qty : gross * (discValue / 100);
        const beforeTax = Math.max(0, gross - discount);

        const productId = item.productId;
        const product = products?.items?.find((p) => p.id === Number(productId));
        const taxRate = product?.taxAmount || 0;
        const taxCalc = product?.taxCalculation ?? 3;
        const vat = calcVat(beforeTax, taxRate, taxCalc);

        return total + vat;
      }, 0) || 0
    );
  }, [items, products]);

  const totalPaid = useMemo(() => {
    return payments?.reduce((total, p) => total + (p.amount || 0), 0) || 0;
  }, [payments]);

  const finalTotal = useMemo(() => {
    let total = invoiceTotal + totalVat;

    if (discountType === "fixed") total -= discountValue || 0;
    if (discountType === "percentage") total -= total * ((discountValue || 0) / 100);

    return Math.max(0, total);
  }, [invoiceTotal, totalVat, discountType, discountValue]);

  const remaining = finalTotal - totalPaid;

  const handleAddItem = () => {
    appendItem({ productId: 0, quantity: 1, unitId: 0, price: 0, discountType: "fixed", discountValue: 0 });
  };

  const handleAddPayment = () => {
    appendPayment({ amount: 0, paymentMethod: "Cash" });
  };

  const handleSubmit = async (data: SalesInvoiceType) => {
    const payload: CreateSalesOrder = {
      customerId: data.customerId,
      orderDate: data.orderDate,
      warehouseId: data.warehouseId,
      notes: data.notes || "",
      description: "",
      globalDiscountPercentage: data.invoiceDiscountType === "percentage" ? (data.invoiceDiscountValue ?? 0) : 0,
      globalDiscountValue: data.invoiceDiscountType === "fixed" ? (data.invoiceDiscountValue ?? 0) : 0,
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

    if (isEditMode) {
      // await updateSalesOrder({ id: Number(id), ...payload });
    } else {
      await createSalesOrders(payload); // ← create
      navigate("/sales/all");
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? `${t("edit_sales_invoice")} #${salesOrder?.orderNumber ?? id}` : t("add_sales_invoice")}</CardTitle>
        <CardAction>
          <Button size={"xl"} variant={"outline"} asChild>
            <Link to={"/sales/all"}>
              {t("back_to_sales_list")}
              <ArrowLeft size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log(errors))} className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-100">
            <h2 className="text-lg font-bold  text-gray-800 mb-6 ">{t("basic_data")}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Controller
                name="orderDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{t("date")} *</FieldLabel>
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
                      <FieldLabel>{t("warehouse")} *</FieldLabel>
                      <ComboboxField field={field} items={wareHouses} valueKey="id" labelKey="warehouseName" placeholder={t("choose_warehouse")} />

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
                      <FieldLabel>{t("customer")} *</FieldLabel>
                      <ComboboxField field={field} items={customers?.items} valueKey="id" labelKey="customerName" placeholder={t("choose_customer")} />

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
                      <FieldLabel>{t("notes")}</FieldLabel>
                      <Textarea {...field} placeholder={t("enter_notes")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-sm border border-gray-100">
            <div className="col-span-3 border-b border-zinc-200 pb-8 min-w-0">
              <h2 className="text-lg font-bold text-zinc-900 mb-6">{t("invoice_details")}</h2>

              <section className="mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 mb-4">{t("items_list")}</h2>
                <div className="w-full overflow-x-auto pb-4">
                  <div>
                    <div className="hidden md:grid md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_0.9fr_60px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                      <div>{t("product_name")}</div>
                      <div>{t("unit")}</div>
                      <div>{t("unit_price")}</div>
                      <div>{t("quantity")}</div>
                      <div>{t("subtotal_before_tax")}</div>
                      <div>{t("vat")}</div>
                      <div>{t("grand_total")}</div>
                      <div></div>
                    </div>

                    <div className="space-y-3 mt-3">
                      {itemFields.map((item, index) => {
                        const qty = Number(form.watch(`items.${index}.quantity`) || 0);
                        const price = Number(form.watch(`items.${index}.price`) || 0);
                        const discType = form.watch(`items.${index}.discountType`) || "fixed";
                        const discValue = Number(form.watch(`items.${index}.discountValue`) || 0);

                        const productId = form.watch(`items.${index}.productId`);
                        const product = products?.items?.find((p) => p.id === Number(productId));
                        const taxRate = product?.taxAmount || 0;
                        const taxCalc = product?.taxCalculation ?? 1;
                        const gross = qty * price;
                        const discount = discType === "fixed" ? discValue * qty : gross * (discValue / 100);
                        const beforeTax = Math.max(0, gross - discount);
                        const vatAmount = calcVat(beforeTax, taxRate, taxCalc);

                        const afterTax = beforeTax + vatAmount;

                        const isDiscOpen = !!discountOpen[index];

                        return (
                          <div key={item.id}>
                            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_0.9fr_60px] gap-3 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group">
                              <Controller
                                control={form.control}
                                name={`items.${index}.productId`}
                                render={({ field }) => (
                                  <ComboboxField
                                    field={field}
                                    items={products?.items}
                                    valueKey="id"
                                    labelKey="productNameAr"
                                    placeholder={t("choose_product")}
                                    onValueChange={(val) => {
                                      const product = products?.items?.find((p) => p.id === Number(val));
                                      if (product) {
                                        form.setValue(`items.${index}.price`, p.sellingPrice);
                                      }
                                    }}
                                  />
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.unitId`}
                                render={({ field }) => (
                                  <Select value={field.value === 0 ? "" : String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder={t("unit")} />
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

                              <Controller control={form.control} name={`items.${index}.price`} render={({ field }) => <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />} />

                              <Controller control={form.control} name={`items.${index}.quantity`} render={({ field }) => <Input type="number" min={1} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />} />

                              <div className="text-center font-medium">{beforeTax.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>

                              <div className="text-center text-orange-600 font-medium">{vatAmount.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>

                              <div className="text-center text-green-600 font-bold">{afterTax.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>

                              <div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => removeItem(index)} disabled={itemFields.length === 1} className="p-2 text-zinc-400 hover:text-red-500">
                                  <Trash2 size={16} />
                                </button>

                                <button type="button" onClick={() => toggleDiscount(index)} className={`p-2 ${isDiscOpen ? "text-emerald-600" : "text-zinc-400"}`}>
                                  <Tag size={14} />
                                </button>
                              </div>
                            </div>

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
                                        <SelectItem value="fixed">{t("fixed_value")}</SelectItem>
                                        <SelectItem value="percentage">{t("percentage")} %</SelectItem>
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
                  <Plus size={16} strokeWidth={2} /> {t("add_new_item")}
                </button>
              </section>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{t("payments")}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                {paymentFields.map((payment, index) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <div className="w-full flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">{t("amount")}</label>
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
                      <label className="text-xs text-gray-500 mb-1 block">{t("payment_method")}</label>
                      <Controller
                        control={form.control}
                        name={`payments.${index}.paymentMethod`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder={t("choose")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">{t("cash")}</SelectItem>
                              <SelectItem value="CreditCard">{t("visa")}</SelectItem>
                              <SelectItem value="transfer">{t("bank_transfer")}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="pt-5 shrink-0">
                      <button type="button" onClick={() => removePayment(index)} disabled={paymentFields.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors border border-transparent hover:border-red-100" title={t("delete_payment")}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <Button type="button" size={"lg"} variant={"secondary"} onClick={handleAddPayment} className=" text-sm font-medium px-4  rounded-lg transition-colors w-max">
                  <Plus size={16} strokeWidth={2} /> {t("add_another_payment")}
                </Button>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100  sticky top-4">
                <h3 className="text-base font-semibold text-gray-800 mb-5">{t("invoice_summary")}</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-zinc-600">
                    <span className="text-sm font-medium">{t("subtotal_before_tax")}</span>
                    <span className="font-semibold text-zinc-900">{invoiceTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-600">
                    <span className="text-sm font-medium">{t("vat")}</span>
                    <span className="font-semibold text-orange-600">{totalVat.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-600 gap-3">
                    <span className="text-sm font-medium whitespace-nowrap">{t("discount")}</span>
                    <div className="flex gap-2 w-full max-w-[170px]">
                      <Controller control={form.control} name="invoiceDiscountValue" render={({ field }) => <Input type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className=" text-center bg-white  flex-1" placeholder={t("value")} />} />
                      <Controller
                        control={form.control}
                        name="invoiceDiscountType"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[80px]  bg-white">
                              <SelectValue placeholder={t("choose_discount_type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">{t("value")}</SelectItem>
                              <SelectItem value="percentage">{t("percentage")}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <hr className="border-zinc-200" />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">{t("grand_total")}</span>
                    <span className="text-xl font-black text-zinc-900">{finalTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 pt-2">
                    <span className="text-sm">{t("total_paid")}</span>
                    <span className="font-semibold text-emerald-600">{totalPaid.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-zinc-100 mt-2">
                    <span className="text-sm font-bold text-zinc-900">{t("remaining_to_pay")}</span>
                    <span className={`font-black text-lg ${remaining > 0 ? "text-red-500" : "text-zinc-400"}`}>{remaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-sm border border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button type="button" variant={"destructive"} className="h-12 px-4">
              {t("cancel_and_return")}
            </Button>
            <Button type="submit" className="h-12 px-4">
              {isEditMode ? t("save_changes") : t("save_and_issue_invoice")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateSalesInvoice;