import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, PlusCircle, Tag, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { z } from "zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { Button } from "@/components/ui/button";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSalesOrders } from "@/features/sales/hooks/useCreateSalesOrders";
import { useGetAllWareHouses } from "@/features/wareHouse/hooks/useGetAllWareHouses";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import type { CreateSalesOrder } from "@/features/sales/types/sales.types";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetSalesOrderById } from "@/features/sales/hooks/useGetSalesOrderById";
import AddParnterModal from "@/components/modals/AddParnterModal";
import formatDate from "@/lib/formatDate";
import { CreateSalesReturns } from "@/features/salesReturns/types/salesReturns.types";
import { useCreateSalesReturns } from "@/features/salesReturns/hooks/useCreateSalesReturns";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { calcVat } from "@/utils/calcVat";

const ReturnInvoiceSchema = (t: (key: string) => string) =>
  z.object({
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

    invoiceDiscountType: z.enum(["percentage", "fixed"]).default("fixed"),
    invoiceDiscountValue: z.number().min(0).default(0),
  });

type SalesInvoiceType = z.input<ReturnType<typeof ReturnInvoiceSchema>>;

const CreateReturnSalesInvoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: detailsSalesOrder } = useGetSalesOrderById(Number(id) ?? undefined);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState<Record<number, boolean>>({});

  const schema = useMemo(() => ReturnInvoiceSchema(t), [t]);

  const toggleDiscount = (index: number) => {
    setDiscountOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const form = useForm<SalesInvoiceType>({
    resolver: zodResolver(schema),
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

      invoiceDiscountType: "fixed",
      invoiceDiscountValue: 0,
    },
  });

  const { data: customersResponse } = useGetAllCustomers({
    page: 1,
    limit: 100,
  });
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000000 });
  const { data: wareHouses } = useGetAllWareHouses();
  const { data: units } = useGetAllUnits({});
  const { data: treasurys } = useGetAllTreasurys();
  // const { data: salesOrder } = useGetSalesOrderById(isEditMode ? Number(id) : undefined);
  const { mutateAsync: CreateSalesReturns } = useCreateSalesReturns();

  const customers = customersResponse?.items ?? [];

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const invoiceDiscountType = useWatch({
    control: form.control,
    name: "invoiceDiscountType",
  });
  const invoiceDiscountValue = useWatch({
    control: form.control,
    name: "invoiceDiscountValue",
  });

  const items = useWatch({
    control: form.control,
    name: "items",
  });

  const { beforeTaxTotal, totalVat } = useMemo(() => {
    let beforeTaxTotal = 0;
    let totalVat = 0;

    items?.forEach((item) => {
      const product = products?.items?.find((p) => p.id === Number(item.productId));
      const qty = item.quantity || 0;
      const price = item.price || 0;
      const discType = item.discountType || "fixed";
      const discValue = item.discountValue || 0;
      const taxRate = product?.taxAmount || 0;
      const taxCalc = product?.taxCalculation ?? 1;
      const gross = qty * price;
      const discount = discType === "fixed" ? discValue * qty : gross * (discValue / 100);
      const afterDisc = Math.max(0, gross - discount);
      const vatAmount = calcVat(afterDisc, taxRate, taxCalc);
      const beforeTax = afterDisc - vatAmount;

      beforeTaxTotal += beforeTax;
      totalVat += vatAmount;
    });

    return { beforeTaxTotal, totalVat };
  }, [items, products]);

  const finalTotal = useMemo(() => {
    let total = beforeTaxTotal + totalVat;

    if (invoiceDiscountType === "fixed") {
      total -= invoiceDiscountValue || 0;
    } else {
      total -= total * ((invoiceDiscountValue || 0) / 100);
    }

    return Math.max(0, total);
  }, [beforeTaxTotal, totalVat, invoiceDiscountType, invoiceDiscountValue]);

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

  const handleSubmit = async (data: SalesInvoiceType) => {
    const payload: CreateSalesReturns = {
      salesOrderId: detailsSalesOrder?.id,
      returnDate: data.orderDate,
      warehouseId: data.warehouseId,
      reason: data.notes || "",
      refundMethod: "CashFromTreasury",
      treasuryId: 1,
      items: detailsSalesOrder?.items.map((item) => ({
        originalItemId: item.id,
        productId: item.productId,
        unitId: item.unitId,
        quantity: item.quantity,
      })),
    };

    await CreateSalesReturns(payload);
    form.reset();
    // navigate("/sales/all");
  };

  useEffect(() => {
    form.reset({
      customerId: detailsSalesOrder?.customerId,
      notes: detailsSalesOrder?.notes,
      orderDate: detailsSalesOrder?.orderDate ? new Date(detailsSalesOrder.orderDate).toISOString().split("T")[0] : "",
      items: detailsSalesOrder?.items.map((item) => ({
        price: item?.unitPrice,
        productId: item?.productId,
        unitId: item?.unitId,
        discountType: item?.discountValue ? "fixed" : "percentage",
        discountValue: item?.discountValue ? item?.discountValue : item?.discountPercentage,
        quantity: item?.quantity,
      })),
      // payments: detailsSalesOrder?.payments.map((payment) => ({
      //   amount: payment?.amount,
      //   paymentMethod: payment?.paymentMethod,
      // })),
    });
  }, [detailsSalesOrder, form]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>فاتورة مرتجعات</CardTitle>
          <CardAction>
            <Button size="xl" variant="outline" asChild>
              <Link to="/sales/all">
                العودة لفواتير المبيعات
                <ArrowLeft size={16} />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log(errors))} className="space-y-6">
            <div className="bg-white dark:bg-transparent p-6 rounded-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">{t("basic_data")}</h2>
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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("warehouse")} *</FieldLabel>
                      <ComboboxField field={field} items={wareHouses} valueKey="id" labelKey="warehouseName" placeholder={t("choose_warehouse")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Controller
                      name="customerId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>{t("customer")} *</FieldLabel>
                          <ComboboxField field={field} items={customers} valueKey="id" labelKey="customerName" placeholder={t("choose_customer")} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="mt-6">
                    <Button type="button" onClick={() => setIsAddCustomerModalOpen(true)} variant="outline" size="icon" className="h-10">
                      <Plus />
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-3">
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
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">{t("invoice_details")}</h2>
              <h3 className="text-sm font-semibold text-zinc-500 mb-4">{t("items_list")}</h3>

              <div className="w-full overflow-x-auto pb-4">
                <div className="hidden md:grid md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_0.9fr_60px] gap-4 px-2 pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
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
                    const afterTax = Math.max(0, gross - discount);
                    const vatAmount = calcVat(afterTax, taxRate, taxCalc);
                    const beforeTax = afterTax - vatAmount;
                    const isDiscOpen = !!discountOpen[index];

                    return (
                      <div key={item.id}>
                        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.9fr_1fr_0.7fr_1fr_0.9fr_0.9fr_60px] gap-3 p-4 md:p-2 bg-zinc-50 dark:bg-zinc-900/20 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 dark:border-zinc-800 items-center">
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
                                    const selectedProduct = products?.items?.find((p) => p.id === Number(val));
                                    if (selectedProduct) form.setValue(`items.${index}.price`, selectedProduct.sellingPrice ?? 0);
                                  }}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />

                          <Controller
                            control={form.control}
                            name={`items.${index}.unitId`}
                            render={({ field, fieldState }) => (
                              <Field>
                                <ComboboxField field={field} items={units?.items} valueKey="id" labelKey="name" placeholder={t("unit")} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />

                          <Controller
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field, fieldState }) => (
                              <Field>
                                <Input type="number" value={field.value === 0 || field.value === undefined ? "" : field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" /> {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />

                          <Controller
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field, fieldState }) => (
                              <Field>
                                <Input type="number" min={1} value={field.value ?? 1} onChange={(e) => field.onChange(Number(e.target.value))} className="text-center" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />

                          <div className="text-center font-medium text-foreground tabular-nums">{beforeTax.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>
                          <div className="text-center text-amber-600 font-medium tabular-nums">{vatAmount.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>
                          <div className="text-center text-primary font-bold tabular-nums">{afterTax.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</div>

                          <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={() => removeItem(index)} disabled={itemFields.length === 1} className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors">
                              <Trash2 size={16} />
                            </button>
                            <button type="button" onClick={() => toggleDiscount(index)} className={`p-2 transition-colors ${isDiscOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                              <Tag size={14} />
                            </button>
                          </div>
                        </div>

                        {isDiscOpen && (
                          <div className="grid grid-cols-2 gap-3 px-2 py-3 bg-primary/5 border border-primary/20 rounded-lg mt-1">
                            <Controller
                              control={form.control}
                              name={`items.${index}.discountType`}
                              render={({ field }) => (
                                <ComboboxField
                                  field={field}
                                  items={[
                                    { value: "fixed", label: t("fixed_value") },
                                    { value: "percentage", label: t("percentage") + " %" },
                                  ]}
                                  valueKey="value"
                                  labelKey="label"
                                  className="w-full"
                                />
                              )}
                            />
                            <Controller control={form.control} name={`items.${index}.discountValue`} render={({ field }) => <Input type="number" value={field.value ?? 0} onChange={(e) => field.onChange(Number(e.target.value))} />} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-transparent p-6 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-end">
                <div className="w-full max-w-sm bg-muted/30 border border-border rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-foreground mb-4">{t("invoice_summary")}</h3>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t("subtotal_before_tax")}</span>
                    <span className="font-semibold text-foreground tabular-nums">{beforeTaxTotal.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t("vat")}</span>
                    <span className="font-semibold text-amber-600 tabular-nums">{totalVat.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm gap-3">
                    <span className="text-muted-foreground whitespace-nowrap">{t("discount")}</span>
                    <div className="flex gap-1.5">
                      <Controller control={form.control} name="invoiceDiscountValue" render={({ field }) => <Input type="number" min={0} value={field.value ?? 0} onChange={(e) => field.onChange(Number(e.target.value))} className="w-20 text-center text-xs bg-background" placeholder="0" />} />
                      <Controller
                        control={form.control}
                        name="invoiceDiscountType"
                        render={({ field }) => (
                          <ComboboxField
                            field={field}
                            items={[
                              { value: "fixed", label: t("value") },
                              { value: "percentage", label: "%" },
                            ]}
                            valueKey="value"
                            labelKey="label"
                            className="w-20 h-8 text-xs"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">{t("grand_total")}</span>
                    <span className="text-2xl font-black text-primary tabular-nums">{finalTotal.toLocaleString("en-EG", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-transparent p-5 sm:p-6 rounded-sm border border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <Button type="button" variant="destructive" className="h-12 px-6" onClick={() => navigate("/sales/all")}>
                {t("cancel_and_return")}
              </Button>
              <Button type="submit" className="h-12 px-6">
                {t("save_and_issue_invoice")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AddParnterModal isOpen={isAddCustomerModalOpen} onClose={() => setIsAddCustomerModalOpen(false)} />
      <AddParnterModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => {
          setIsAddCustomerModalOpen(false);
        }}
      />
    </>
  );
};

export default CreateReturnSalesInvoice;
