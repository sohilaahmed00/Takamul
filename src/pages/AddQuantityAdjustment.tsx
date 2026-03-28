import React, { useMemo, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Search, Save, RotateCcw, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useCreateQuantityAdjustment } from "@/features/quantity-adjustments/hooks/useCreateQuantityAdjustment";
import { useGetStockInventory } from "@/features/quantity-adjustments/hooks/useGetStockInventory";
import type { CreateQuantityAdjustmentPayload, QuantityAdjustmentOperationType, QuantityAdjustmentRow } from "@/features/quantity-adjustments/types/adjustments.types";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ComboboxField from "@/components/ui/ComboboxField";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import type { StockInventoryOption } from "@/features/quantity-adjustments/types/stock.types";
import { useGetQuantityAdjustmentDetails } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustmentDetails";
import { useUpdateQuantityAdjustment } from "@/features/quantity-adjustments/hooks/useUpdateQuantityAdjustment";

// ─── Toast ────────────────────────────────────────────────────────────────────

// ─── Helpers ───────────────────────────────────────────────────────────────────
function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.title || "حدث خطأ أثناء الحفظ";
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ أثناء الحفظ";
}

const QuantityAdjustmentSchema = z.object({
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        stockInventoryId: z.number().min(1, "اختر الصنف"),
        operationType: z.enum(["Add", "Remove"]),
        quantity: z.number().min(1, "الكمية لازم تكون أكبر من 0"),
        notes: z.string().optional(),
      }),
    )
    .min(1, "لازم تضيف صنف واحد على الأقل"),
});

type QuantityAdjustmentType = z.input<typeof QuantityAdjustmentSchema>;
// ─── Component ────────────────────────────────────────────────────────────────
export default function AddQuantityAdjustment() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id, mode } = useParams();
  const { data: stockInventory } = useGetQuantityAdjustmentDetails(Number(id));
  const { mutateAsync: createQuantityAdjustment } = useCreateQuantityAdjustment();
  const { data: stockInventories } = useGetStockInventory({ pageNumber: 1, pageSize: 10000000 });
  const { mutateAsync: updateQuantityAdjustment } = useUpdateQuantityAdjustment();
  const isView = mode === "view";
  const form = useForm<QuantityAdjustmentType>({
    resolver: zodResolver(QuantityAdjustmentSchema),
    defaultValues: {
      notes: "",
      items: [
        {
          stockInventoryId: 0,
          operationType: "Add",
          quantity: 1,
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
            const match = stockInventories.items.find((inv) => inv.productName === item.productName);

            return {
              stockInventoryId: Number(match?.id ?? 0),
              operationType: item.operationType,
              quantity: Number(item.quantity ?? 1),
              notes: item.notes ?? "",
            };
          }) ?? [],
      });
    }
  }, [id, stockInventory, stockInventories]);
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventoryResponse, isLoading: inventoryLoading } = useGetStockInventory({ pageNumber: 1, pageSize: 100, search: searchTerm });
  const items = useWatch({
    control: form.control,
    name: "items",
  });
  const inventoryMap = useMemo(() => {
    const map: Record<number, StockInventoryOption> = {};

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

  // const handleComplete = async () => {
  //   if (formData.items.length === 0) {
  //     showToast("يرجى إضافة أصناف أولاً", "warning");
  //     return;
  //   }

  //   setSubmitError("");

  //   try {
  //     await createMutation.mutateAsync({
  //       notes: formData.note || undefined,
  //       items: formData.items.map((item) => ({
  //         stockInventoryId: item.stockInventoryId,
  //         operationType: item.operationType,
  //         quantity: item.quantityChanged,
  //       })),
  //     });

  //     showToast("تم حفظ البيانات بنجاح!", "success");
  //     setTimeout(() => navigate("/products/quantity-adjustments"), 1500);
  //   } catch (error) {
  //     setSubmitError(extractErrorMessage(error));
  //   }
  // };
  const handleSubmit = async (data: QuantityAdjustmentType) => {
    const payload: CreateQuantityAdjustmentPayload = {
      notes: data.notes,
      items: data.items.map((item) => ({
        stockInventoryId: Number(item.stockInventoryId),
        operationType: item?.operationType,
        quantity: Number(item.quantity),
        notes: item.notes,
      })),
    };
    if (id) {
      await updateQuantityAdjustment({ id: Number(id), payload });
    } else {
      await createQuantityAdjustment(payload);
    }
    form.reset();
  };
  return (
    <Card>
      <CardHeader className="">
        <CardTitle>اضافة تعديل كميات</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Button variant={"outline"} asChild>
            <Link to={"/products/quantity-adjustments"}>
              {" "}
              الرجوع لقائمة تعديلات الكمية
              <ArrowLeft size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200">
            <h2 className="text-lg font-bold  text-gray-800 mb-6 ">{"البيانات الأساسية"}</h2>
            <div className="grid grid-cols-1  gap-6">
              {" "}
              <Field>
                <FieldLabel>التاريخ</FieldLabel>

                <Input value={new Date().toLocaleString("en-GB").replace(",", "")} readOnly className=" cursor-not-allowed text-center" />
              </Field>
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
          <div className="bg-white p-6 rounded-sm border border-gray-200">
            <div className="col-span-3 border-b border-zinc-200 pb-8 min-w-0">
              <h2 className="text-lg font-bold text-zinc-900 mb-6">قائمة الأصناف</h2>

              <div className="">
                <div className="hidden md:grid md:grid-cols-6 gap-4 px-2 pb-3 border-b border-zinc-200 text-xs font-medium text-zinc-400 uppercase tracking-widest items-center">
                  <div>اسم الصنف</div>
                  <div className="">كود الصنف</div>
                  <div className="">الكمية المتاحة</div>
                  <div className="">نوع العملية</div>
                  <div className="">الكمية</div>
                  <div></div>
                </div>
                {/* Items */}
                <div className="space-y-3 mt-3">
                  {itemFields.map((item, index) => {
                    const selectedId = form.watch(`items.${index}.stockInventoryId`);
                    const selectedProduct = inventoryMap[selectedId];

                    return (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 md:p-2 bg-zinc-50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-100 items-center group">
                        {/* الصنف */}
                        <Controller
                          control={form.control}
                          name={`items.${index}.stockInventoryId`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="relative">
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الصنف</FieldLabel>

                              <ComboboxField
                                field={field}
                                items={stockInventories?.items}
                                valueKey="id"
                                labelKey="productName"
                                placeholder="اختر الصنف"
                                disabled={isView}
                                onValueChange={(val) => {
                                  if (isView) return; // 👈 حماية زيادة

                                  const product = inventoryMap[Number(val)];
                                  if (product) {
                                    field.onChange(Number(val));
                                    form.setValue(`items.${index}.quantity`, 1);
                                  }
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

                        {/* كود الصنف */}
                        <div>
                          <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">كود الصنف</FieldLabel>

                          <Input value={selectedProduct?.id ?? ""} readOnly className="text-center bg-gray-50 cursor-not-allowed" />
                        </div>

                        {/* الكمية المتاحة */}
                        <div>
                          <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الكمية المتاحة</FieldLabel>

                          <Input value={selectedProduct?.quantityAvailable ?? ""} readOnly className="text-center bg-gray-50 cursor-not-allowed" />
                        </div>

                        {/* نوع العملية */}
                        <Controller
                          control={form.control}
                          name={`items.${index}.operationType`}
                          render={({ field, fieldState }) => (
                            <Field className="relative">
                              <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">نوع العملية</FieldLabel>

                              <Select
                                value={field.value}
                                onValueChange={(val) => !isView && field.onChange(val)}
                                disabled={isView} // 👈
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="نوع العملية" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Add">إضافة</SelectItem>
                                  <SelectItem value="Remove">طرح</SelectItem>
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

                        {/* الكمية */}
                        <div>
                          <FieldLabel className="md:hidden text-xs mb-1.5 text-zinc-500">الكمية</FieldLabel>

                          <Controller
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <Input
                                  type="number"
                                  min={1}
                                  max={selectedProduct?.quantityAvailable || undefined}
                                  value={field.value}
                                  onChange={(e) => !isView && field.onChange(Number(e.target.value))}
                                  readOnly={isView} // 👈
                                  className={`text-center ${isView ? "bg-gray-50 cursor-not-allowed" : ""}`}
                                />

                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        {/* حذف */}
                        {!isView && (
                          <div className="flex justify-end md:justify-center absolute top-4 left-4 md:static">
                            <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 md:opacity-0 md:group-hover:opacity-100">
                              <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isView && (
                <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Plus size={16} strokeWidth={2} /> إضافة صنف جديد
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-sm border border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant={"destructive"}
              className="h-12 px-4"
              onClick={() => {
                navigate(-1);
              }}
            >
              إلغاء والعودة
            </Button>
            {isView ? (
              <Button type="submit" className=" px-4" asChild>
                <Link to={`/products/quantity-adjustments/edit/${id}`}>تعديل</Link>
              </Button>
            ) : (
              <Button type="submit" className=" px-4">
                {id ? "تعديل الكمية" : " إضافة تعديل الكمية"}
              </Button>
            )}
          </div>
        </form>{" "}
      </CardContent>
    </Card>
  );
}
