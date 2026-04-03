import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useCreateQuantityAdjustment } from "@/features/quantity-adjustments/hooks/useCreateQuantityAdjustment";
import { useGetStockInventory } from "@/features/quantity-adjustments/hooks/useGetStockInventory";
import type { CreateQuantityAdjustmentPayload } from "@/features/quantity-adjustments/types/adjustments.types";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ComboboxField from "@/components/ui/ComboboxField";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useGetQuantityAdjustmentDetails } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustmentDetails";
import { useUpdateQuantityAdjustment } from "@/features/quantity-adjustments/hooks/useUpdateQuantityAdjustment";
import z from "zod/v3";

function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      "حدث خطأ أثناء الحفظ"
    );
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ أثناء الحفظ";
}

const QuantityAdjustmentSchema = (t: (key: string) => string) =>
  z.object({
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          stockInventoryId: z.number().min(1, t("validation_choose_product")),
          operationType: z.enum(["Add", "Remove"]),
          quantity: z
            .number({
              required_error: t("validation_enter_quantity"),
              invalid_type_error: t("validation_enter_quantity"),
            })
            .min(1, t("validation_quantity_gt_zero")),
          notes: z.string().optional(),
        })
      )
      .min(1, t("validation_add_at_least_one_item")),
  });

type QuantityAdjustmentType = z.input<ReturnType<typeof QuantityAdjustmentSchema>>;

export default function AddQuantityAdjustment() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id, mode } = useParams();

  const isView = mode === "view";

  const { data: stockInventory } = useGetQuantityAdjustmentDetails(Number(id));
  const { mutateAsync: createQuantityAdjustment } = useCreateQuantityAdjustment();
  const { data: stockInventories } = useGetStockInventory({
    pageNumber: 1,
    pageSize: 10000000,
  });
  const { mutateAsync: updateQuantityAdjustment } = useUpdateQuantityAdjustment();

  const form = useForm<QuantityAdjustmentType>({
    resolver: zodResolver(QuantityAdjustmentSchema(t)),
    defaultValues: {
      notes: "",
      items: [
        {
          stockInventoryId: 0,
          operationType: "Add",
          quantity: undefined as any,
          notes: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (id && stockInventory && stockInventories?.items) {
      form.reset({
        notes: stockInventory.notes ?? "",
        items:
          stockInventory.items?.map((item) => {
            const match = stockInventories.items.find(
              (inv) => inv.productName === item.productName
            );

            return {
              stockInventoryId: Number(match?.id ?? 0),
              operationType: item.operationType,
              quantity: Number(item.quantity ?? 1),
              notes: item.notes ?? "",
            };
          }) ?? [],
      });
    }
  }, [id, stockInventory, stockInventories, form]);

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

  const inventoryMap = React.useMemo(() => {
    const map: Record<number, any> = {};
    stockInventories?.items?.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [stockInventories]);

  const handleAddItem = () => {
    appendItem({
      quantity: 0,
      stockInventoryId: 0,
      notes: "",
      operationType: "Add",
    });
  };

  const handleSubmit = async (data: QuantityAdjustmentType) => {
    const payload: CreateQuantityAdjustmentPayload = {
      notes: data.notes,
      items: data.items.map((item) => ({
        stockInventoryId: Number(item.stockInventoryId),
        operationType: item.operationType,
        quantity: Number(item.quantity),
        notes: item.notes,
      })),
    };

    try {
      if (id) {
        await updateQuantityAdjustment({ id: Number(id), payload });
      } else {
        await createQuantityAdjustment(payload);
      }
      form.reset();
      navigate("/products/quantity-adjustments");
    } catch (error) {
      console.error(extractErrorMessage(error));
    }
  };

  return (
    <Card dir={direction}>
      <CardHeader>
        <CardTitle>{t("add_quantity_adjustment")}</CardTitle>
        <CardAction>
          <Button variant="outline" asChild>
            <Link to="/products/quantity-adjustments">
              {t("back_to_qty_adjustments")}
              <ArrowLeft size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              {t("basic_data")}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <Field>
                <FieldLabel>{t("date")}</FieldLabel>
                <Input
                  value={new Date().toLocaleString("en-GB").replace(",", "")}
                  readOnly
                  className="cursor-not-allowed text-center"
                />
              </Field>

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

          <div className="bg-white p-6 rounded-sm border border-gray-200">
            <div className="col-span-3 border-b border-zinc-200 pb-8 min-w-0">
              <h2 className="text-lg font-bold text-zinc-900 mb-6">
                {t("items_list")}
              </h2>

              <div className="hidden md:grid md:grid-cols-6 gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                <div>{t("product_name")}</div>
                <div>{t("product_code")}</div>
                <div>{t("available_quantity")}</div>
                <div>{t("operation_type")}</div>
                <div>{t("quantity")}</div>
                <div></div>
              </div>

              <div className="space-y-3 mt-3">
                {itemFields.map((item, index) => {
                  const selectedId = form.watch(`items.${index}.stockInventoryId`);
                  const selectedProduct = inventoryMap[selectedId];

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group mb-8"
                    >
                      <Controller
                        control={form.control}
                        name={`items.${index}.stockInventoryId`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid} className="relative">
                            <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">
                              {t("product")}
                            </FieldLabel>

                            <ComboboxField
                              field={field}
                              items={stockInventories?.items}
                              valueKey="id"
                              labelKey="productName"
                              placeholder={t("choose_product")}
                              disabled={isView}
                              onValueChange={(val) => {
                                if (isView) return;
                                const product = inventoryMap[Number(val)];
                                if (product) field.onChange(Number(val));
                              }}
                            />

                            {fieldState.invalid && (
                              <div className="absolute top-full mt-2 right-0 z-10 w-full">
                                <FieldError errors={[fieldState.error]} />
                              </div>
                            )}
                          </Field>
                        )}
                      />

                      <div>
                        <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">
                          {t("product_code")}
                        </FieldLabel>
                        <Input
                          value={selectedProduct?.id ?? ""}
                          readOnly
                          className="text-center bg-gray-50 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">
                          {t("available_quantity")}
                        </FieldLabel>
                        <Input
                          value={selectedProduct?.quantityAvailable ?? ""}
                          readOnly
                          className="text-center bg-gray-50 cursor-not-allowed"
                        />
                      </div>

                      <Controller
                        control={form.control}
                        name={`items.${index}.operationType`}
                        render={({ field, fieldState }) => (
                          <Field className="relative">
                            <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">
                              {t("operation_type")}
                            </FieldLabel>

                            <Select
                              value={field.value}
                              onValueChange={(val) => !isView && field.onChange(val)}
                              disabled={isView}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("choose_operation_type")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Add">{t("add")}</SelectItem>
                                <SelectItem value="Remove">{t("remove")}</SelectItem>
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

                      <div>
                        <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">
                          {t("quantity")}
                        </FieldLabel>

                        <Controller
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="relative">
                              <Input
                                type="number"
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) => {
                                  if (!isView) {
                                    const val = e.target.value;
                                    field.onChange(val === "" ? undefined : Number(val));
                                  }
                                }}
                                readOnly={isView}
                                className={`text-center ${isView ? "bg-gray-50 cursor-not-allowed" : ""
                                  }`}
                              />
                              {fieldState.invalid && (
                                <div className="absolute top-full mt-2 right-0 z-10 w-full">
                                  <FieldError errors={[fieldState.error]} />
                                </div>
                              )}
                            </Field>
                          )}
                        />
                      </div>

                      {!isView && (
                        <div className="flex justify-end md:justify-center absolute top-4 left-4 md:static">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 md:opacity-0 md:group-hover:opacity-100"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isView && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Plus size={16} strokeWidth={2} />
                  {t("add_new_item")}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-sm border border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant="destructive"
              className="h-12 px-4"
              onClick={() => navigate(-1)}
            >
              {t("cancel_and_return")}
            </Button>

            {isView ? (
              <Button type="submit" className="px-4" asChild>
                <Link to={`/products/quantity-adjustments/edit/${id}`}>{t("edit")}</Link>
              </Button>
            ) : (
              <Button type="submit" className="px-4">
                {id ? t("edit_quantity_adjustment") : t("add_quantity_adjustment")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}