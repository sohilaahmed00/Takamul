import React, { useState, useMemo, useEffect } from "react";
import { Trash2, Plus, ArrowLeft, Tag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CreateSalesOrder } from "@/features/sales/types/sales.types";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { CreatePurchaseOrder } from "@/features/purchases/types/purchase.types";
import { useCreatePurchaseOrder } from "@/features/purchases/hooks/useCreatePurchaseOrder";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { useGetAllWareHouses } from "@/features/wareHouse/hooks/useGetAllWareHouses";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";
import { useGetPurchaseOrderById } from "@/features/purchases/hooks/useGetPurchaseOrderById";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import z from "zod/v3";

const createPurchasesInvoiceSchema = (t: (key: string) => string) =>
  z.object({
    supplierId: z.number().min(1, t("supplier_required")),
    warehouseId: z.number().min(1, t("warehouse_required")),
    orderDate: z.string().min(1, t("date_required")),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.number().min(1, t("choose_product")),
          unitId: z.coerce.number().min(1, t("choose_product_unit")),
          quantity: z.number().min(1, t("quantity_must_be_greater_than_zero")),
          unitPrice: z.number({ required_error: t("unit_cost_required") }).min(0, t("price_must_be_greater_or_equal_zero")),
          discountType: z.enum(["percentage", "fixed"]).default("fixed"),
          discountValue: z.number().min(0).default(0),
          taxType: z.enum(["percentage", "fixed"]).default("fixed"),
          taxId: z.number().min(1, t("please_select_tax")),
        }),
      )
      .min(1, t("must_add_at_least_one_item")),
    payments: z
      .array(
        z.object({
          amount: z.number().min(1, t("amount_must_be_greater_than_zero")),
          treasuryId: z.number().min(1, t("choose_treasury")),
        }),
      )
      .min(1, t("must_add_at_least_one_payment")),
  });

type PurchaseInvoiceType = z.infer<ReturnType<typeof createPurchasesInvoiceSchema>>;

const CreatePurchaseInvoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  const purchasesInvoiceSchema = useMemo(() => createPurchasesInvoiceSchema(t), [t]);

  const { mutateAsync: createPurchaseOrder } = useCreatePurchaseOrder();
  const [discountOpen, setDiscountOpen] = useState<Record<number, boolean>>({});
  const toggleDiscount = (i: number) => setDiscountOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  const { id } = useParams();
  const { data: purchaseOrder } = useGetPurchaseOrderById(Number(id));
  const { data: treasurys } = useGetAllTreasurys();
  const [submitType, setSubmitType] = useState<"save" | "saveAndNew">("save");

  const form = useForm<PurchaseInvoiceType>({
    resolver: zodResolver(purchasesInvoiceSchema),
    shouldFocusError: true,

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
          taxType: "fixed",
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

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control: form.control,
    name: "payments",
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
      warehouseId: purchaseOrder.warehouseId ?? 0,
      orderDate: purchaseOrder.orderDate?.split("T")[0],
      notes: purchaseOrder.notes ?? "",
      items: purchaseOrder.items.map((item) => ({
        productId: item.productId,
        unitId: item.unitId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountType: "fixed",
        discountValue: 0,
        taxType: "fixed",
        taxId: 0,
      })),
      payments:
        purchaseOrder.payments?.length > 0
          ? purchaseOrder.payments.map((payment) => ({
              amount: payment.amount,
              treasuryId: payment.treasuryId,
            }))
          : [{ amount: 0, treasuryId: 0 }],
    });
  }, [purchaseOrder, products, units, form]);

  const handleAddItem = () => {
    appendItem({
      productId: 0,
      unitId: 0,
      quantity: 1,
      unitPrice: 0,
      discountType: "fixed",
      discountValue: 0,
      taxType: "fixed",
      taxId: 0,
    });
  };

  const handleSubmit = async (data: PurchaseInvoiceType) => {
    const payload: CreatePurchaseOrder = {
      orderDate: data.orderDate,
      warehouseId: data.warehouseId,
      supplierId: Number(data.supplierId),
      notes: data.notes || "",
      items: data.items.map((item) => ({
        productId: item.productId,
        unitId: Number(item.unitId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercentage: item.discountType === "percentage" ? (item.discountValue ?? 0) : 0,
        discountValue: item.discountType === "fixed" ? (item.discountValue ?? 0) : 0,
        taxId: item.taxId,
      })),
      payments: data.payments.map((payment) => ({
        amount: payment.amount,
        treasuryId: payment.treasuryId,
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

      const tax = taxes?.find((taxItem) => taxItem.id === Number(item.taxId));
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
    <Card dir={direction}>
      <CardHeader>
        <CardTitle>{t("add_purchase_invoice")}</CardTitle>
        <CardAction>
          <Button size="xl" variant="outline" asChild>
            <Link to="/purchases">
              {t("back_to_purchases")}
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
          <div className=" p-6 rounded-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">{t("basic_data")}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Controller
                name="orderDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      {t("date")} <span className="text-red-500">*</span>
                    </FieldLabel>
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
                      <FieldLabel>
                        {t("warehouse")} <span className="text-red-500">*</span>
                      </FieldLabel>
                      <ComboboxField field={field} items={wareHouses} valueKey="id" labelKey="warehouseName" placeholder={t("choose_warehouse")} />
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
                      <FieldLabel>
                        {t("supplier")} <span className="text-red-500">*</span>
                      </FieldLabel>
                      <ComboboxField field={field} items={suppliers?.items} valueKey="id" labelKey="supplierName" placeholder={t("choose_supplier")} onValueChange={(val) => Number(val)} />
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

          <div className="bg-white dark:bg-transparent p-6 rounded-sm border border-gray-100 dark:border-gray-800">
            <div className="col-span-3 border-b border-zinc-200 dark:border-gray-800 pb-8 min-w-0">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">{t("invoice_details")}</h2>

              <section className="mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 mb-4">{t("items_list")}</h2>

                <div className="w-full overflow-x-auto pb-4">
                  <div>
                    <div className="hidden md:grid md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_1fr_0.9fr_60px] gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                      <div>{t("product_name_code")}</div>
                      <div>{t("unit")}</div>
                      <div>{t("unit_cost")}</div>
                      <div>{t("quantity")}</div>
                      <div>{t("total_before_tax")}</div>
                      <div>{t("tax_rate")}</div>
                      <div>{t("vat")}</div>
                      <div>{t("final_total")}</div>
                      <div></div>
                    </div>

                    <div className="space-y-3 mt-3">
                      {itemFields.map((item, index) => {
                        const qty = Number(form.watch(`items.${index}.quantity`) || 0);
                        const price = Number(form.watch(`items.${index}.unitPrice`) || 0);
                        const discType = form.watch(`items.${index}.discountType`) || "fixed";
                        const discValue = Number(form.watch(`items.${index}.discountValue`) || 0);

                        const taxId = form.watch(`items.${index}.taxId`);
                        const tax = taxes?.find((taxItem) => taxItem.id === Number(taxId));
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
                                      placeholder={t("choose_product")}
                                      onValueChange={(val) => {
                                        const product = products?.items?.find((p) => p.id === Number(val));
                                        if (product) {
                                          form.setValue(`items.${index}.unitPrice`, product.sellingPrice);
                                        }
                                      }}
                                    />
                                    {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.unitId`}
                                render={({ field, fieldState }) => (
                                  <Field>
                                    <ComboboxField field={field} items={units?.items} valueKey="id" labelKey="name" placeholder={t("unit")} />
                                    {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.unitPrice`}
                                render={({ field, fieldState }) => (
                                  <Field>
                                    <Input type="number" value={field.value === undefined ? "" : field.value} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} className="text-center" />
                                    {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />

                              <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field, fieldState }) => (
                                  <Field>
                                    <Input type="number" min={1} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                    {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />

                              <div className="self-start pt-2 text-center font-medium">
                                {beforeTax.toLocaleString("en-EG", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>

                              <Controller
                                control={form.control}
                                name={`items.${index}.taxId`}
                                render={({ field, fieldState }) => (
                                  <Field>
                                    <ComboboxField field={field} items={taxes} valueKey="id" labelKey="name" placeholder={t("tax")} />
                                    {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />

                              <div className="self-start pt-2 text-center text-orange-600 font-medium">
                                {vatAmount.toLocaleString("en-EG", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>

                              <div className="self-start pt-2 text-center text-green-600 font-bold">
                                {afterTax.toLocaleString("en-EG", {
                                  minimumFractionDigits: 2,
                                })}
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
                              <div className="grid grid-cols-2 gap-3 px-2 py-3 bg-emerald-50 border rounded-lg">
                                <Controller
                                  control={form.control}
                                  name={`items.${index}.discountType`}
                                  render={({ field }) => (
                                    <ComboboxField
                                      field={field}
                                      items={[
                                        { value: "fixed", label: t("fixed_value") },
                                        { value: "percentage", label: t("percentage") },
                                      ]}
                                      valueKey="value"
                                      labelKey="label"
                                      className="w-full"
                                    />
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
                </div>

                <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Plus size={16} strokeWidth={2} />
                  {t("add_new_item")}
                </button>
              </section>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {paymentFields.map((payment, index) => (
                <div key={payment.id} className="flex flex-col sm:flex-row gap-3 items-start bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div className="w-full flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t("amount")}</label>
                    <Controller
                      control={form.control}
                      name={`payments.${index}.amount`}
                      render={({ field, fieldState }) => (
                        <Field className="relative" data-invalid={fieldState.invalid}>
                          <Input type="number" placeholder="0.00" value={field.value === 0 ? "" : field.value} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="bg-white" />
                          {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="w-full flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t("payment_method")}</label>
                    <Controller
                      control={form.control}
                      name={`payments.${index}.treasuryId`}
                      render={({ field, fieldState }) => (
                        <Field>
                          <ComboboxField field={field} items={treasurys} valueKey="id" labelKey="name" placeholder={t("choose")} />
                          {fieldState?.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="pt-5 shrink-0">
                    <button type="button" onClick={() => removePayment(index)} disabled={paymentFields.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors border border-transparent hover:border-red-100" title={t("delete")}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <Button type="button" size="lg" variant="secondary" onClick={handleAddPayment} className="text-sm font-medium px-4 rounded-lg transition-colors w-max">
                <Plus size={16} strokeWidth={2} />
                {t("add_payment")}
              </Button>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-5">{t("invoice_summary")}</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                  <span className="text-sm font-medium">{t("total_before_tax")}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {summary.beforeTaxTotal.toLocaleString("en-EG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                  <span className="text-sm font-medium">{t("vat")}</span>
                  <span className="font-semibold text-orange-600">
                    {summary.totalVat.toLocaleString("en-EG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <hr className="border-zinc-200 dark:border-zinc-800" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-900 dark:text-white">{t("final_total")}</span>
                  <span className="text-xl font-black text-green-600">
                    {summary.finalTotal.toLocaleString("en-EG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className=" p-5 sm:p-6 rounded-sm border border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button type="button" variant="destructive" className="h-12 px-4" onClick={() => {}}>
              {t("cancel_and_return")}
            </Button>

            <Button type="submit" className="h-12 px-4">
              {t("save_and_issue_invoice")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePurchaseInvoice;
