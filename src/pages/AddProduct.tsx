// src/pages/AddProduct.tsx
import React, { useState, useMemo, useEffect } from "react";
import { PlusCircle, Upload, Barcode, X, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload, FileUploadDropzone, FileUploadTrigger, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemDelete } from "@/components/ui/file-upload";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";

import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";
import { useCreateProductDirect } from "@/features/products/hooks/useCreateProductDirect";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";
import { useGetAllSubCategoriesWidthParentId } from "@/features/categories/hooks/useGetAllSubCategoriesWidthParentId";
import { useGetAllProductsDirect } from "@/features/products/hooks/useGetAllProductsDirect";
import type { ProductDirect } from "@/features/products/types/products.types";
import { useCreateProductBranched } from "@/features/products/hooks/useCreateProductBranched";
import { useCreateProductPrepared } from "@/features/products/hooks/useCreateProductPrepared";
import { useGetAllProductsRawMatrial } from "@/features/products/hooks/useGetAllProductsRawMatrial";
import { useGetAllUnits } from "@/features/untis/hooks/useGetAllUnits";
import { useCreateProductRawMaterial } from "@/features/products/hooks/useCreateProductRawMaterial";

export const createProductSchema = z.object({
  Barcode: z.string().min(1, "الباركود مطلوب"),
  ProductNameAr: z.string().min(1, "اسم المنتج بالعربي مطلوب"),
  ProductNameEn: z.string().min(1, "اسم المنتج بالإنجليزي مطلوب"),
  ProductNameUr: z.string().optional().or(z.literal("")),
  Description: z.string().optional().or(z.literal("")),
  CategoryId: z.number().min(1, "التصنيف مطلوب").optional(),
  CostPrice: z.number().min(0, "سعر التكلفة يجب أن يكون أكبر من أو يساوي صفر"),
  SellingPrice: z.number().min(0, "سعر البيع يجب أن يكون أكبر من أو يساوي صفر"),
  MinStockLevel: z.number().min(0, "الحد الأدنى للمخزون غير صحيح"),
  TaxId: z.number().min(1, "الضريبة مطلوبة"),
  TaxCalculation: z.string().min(1, "طريقة حساب الضريبة مطلوبة"),
  Image: z.union([z.instanceof(File), z.string()]).optional(),
});

export const createBranchedProductSchema = createProductSchema.extend({
  ChildrenIds: z.array(z.number()).min(1, "يجب اختيار صنف أم مباشر واحد على الأقل"),
});
export const createPreparedProductSchema = createProductSchema.extend({
  RawMaterials: z
    .array(
      z.object({
        rawMaterialId: z.number().min(1, "الخامة مطلوبة"),
        quantity: z.number().min(0.01, "الكمية يجب أن تكون أكبر من صفر"),
        unitId: z.number().min(1, "الوحدة مطلوبة"),
      }),
    )
    .min(1, "يجب إضافة خامة واحدة على الأقل للصنف المجهز"),
});
export const createRawMaterialSchema = createProductSchema.extend({
  BaseUnitId: z.number().min(1, "وحدة الأساس مطلوبة"),
  PurchaseUnitId: z.number().min(1, "وحدة الشراء مطلوبة"),
  ConversionFactor: z.number().min(0.01, "معامل التحويل يجب أن يكون أكبر من صفر"),
});

type FormValues = z.infer<typeof createProductSchema> & {
  ChildrenIds?: number[];
  RawMaterials?: {
    rawMaterialId: number;
    quantity: number;
    unitId: number;
  }[];
  BaseUnitId?: number;
  PurchaseUnitId?: number;
  ConversionFactor?: number;
};

export const baseDefaultValues: FormValues = {
  Barcode: "",
  ProductNameAr: "",
  ProductNameEn: "",
  ProductNameUr: "",
  Description: "",
  CategoryId: undefined,
  CostPrice: 0,
  SellingPrice: 0,
  MinStockLevel: 0,
  TaxId: 1,
  TaxCalculation: "1",
  Image: undefined,
  ChildrenIds: [],
  RawMaterials: [],
  BaseUnitId: undefined,
  PurchaseUnitId: undefined,
  ConversionFactor: 1,
};

function createFileValidator(options: { maxFiles: number; maxSizeMB?: number; allowedTypes?: string[] }) {
  return (file: File, currentFiles: File[]) => {
    if (currentFiles.length >= options.maxFiles) return `مسموح بـ ${options.maxFiles} ملفات فقط`;
    if (options.allowedTypes && !options.allowedTypes.some((type) => file.type.startsWith(type))) return "نوع الملف غير مدعوم";
    const maxSize = (options.maxSizeMB || 2) * 1024 * 1024;
    if (file.size > maxSize) return `حجم الملف يجب أن يكون أقل من ${options.maxSizeMB || 2}MB`;
    return null;
  };
}

export default function AddProduct() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  type ProductType = "direct" | "branched" | "prepared" | "raw";
  const [productType, setProductType] = useState<ProductType>("direct");
  const [mainCategoryId, setMainCategoryId] = useState<number>();
  const { data: taxesData } = useGetAllTaxes();
  const { data: mainCategories } = useGetAllMainCategories();
  const { data: subCategories } = useGetAllSubCategoriesWidthParentId(mainCategoryId as number);
  const { data: productsDirect } = useGetAllProductsDirect();
  const { mutateAsync: createProductDirect } = useCreateProductDirect();
  const { mutateAsync: createProductBranched } = useCreateProductBranched();
  const { mutateAsync: createProductPrepared } = useCreateProductPrepared();
  const { mutateAsync: createRawMaterial } = useCreateProductRawMaterial();
  const { data: productRawMatrial } = useGetAllProductsRawMatrial();
  const { data: units } = useGetAllUnits();
  const anchor = useComboboxAnchor();

  const activeSchema = productType === "branched" ? createBranchedProductSchema : productType === "prepared" ? createPreparedProductSchema : productType === "raw" ? createRawMaterialSchema : createProductSchema;
  const methods = useForm<FormValues>({
    resolver: zodResolver(activeSchema),
    defaultValues: baseDefaultValues,
    mode: "onChange",
  });

  const { control, watch, setValue, clearErrors } = methods;
  const {
    fields: rawMaterialFields,
    append: appendRawMaterial,
    remove: removeRawMaterial,
  } = useFieldArray({
    control,
    name: "RawMaterials",
  });

  useEffect(() => {
    clearErrors();
  }, [productType, clearErrors]);

  const CostPrice = watch("CostPrice");
  const SellingPrice = watch("SellingPrice");
  const TaxId = watch("TaxId");
  const TaxCalculation = watch("TaxCalculation");
  const ImageField = watch("Image");

  const files = ImageField instanceof File ? [ImageField] : [];

  const summary = useMemo(() => {
    const selectedTax = (taxesData || []).find((t) => String(t.id) === String(TaxId)) || { id: 1, name: "بدون ضريبة", amount: 0 };
    const taxRate = (selectedTax.amount || 0) / 100;
    let basePrice = Number(SellingPrice) || 0;
    let finalPrice = Number(SellingPrice) || 0;
    let taxAmount = 0;

    if (TaxCalculation === "2") {
      basePrice = finalPrice - finalPrice * taxRate;
      taxAmount = finalPrice - basePrice;
    } else if (TaxCalculation === "3") {
      taxAmount = basePrice * taxRate;
      finalPrice = basePrice + taxAmount;
    }

    const cost = Number(CostPrice) || 0;
    const profit = basePrice - cost;
    const profitMargin = basePrice > 0 ? (profit / basePrice) * 100 : 0;

    return {
      basePrice: basePrice.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      profit: profit.toFixed(2),
      profitMargin: profitMargin.toFixed(1),
      taxName: selectedTax.name,
      taxPercentage: selectedTax.amount || 0,
    };
  }, [CostPrice, SellingPrice, TaxId, TaxCalculation, taxesData]);

  const validateFile = useMemo(() => createFileValidator({ maxFiles: 1, maxSizeMB: 2, allowedTypes: ["image/"] }), []);
  const onSubmit = async (data: FormValues) => {
    console.log("Form Data:", data);
    const formData = new FormData();

    if (productType === "raw") {
      formData.append("ProductNameAr", data.ProductNameAr);
      formData.append("CostPrice", String(data.CostPrice));

      if (data.BaseUnitId) formData.append("BaseUnitId", String(data.BaseUnitId));
      if (data.PurchaseUnitId) formData.append("PurchaseUnitId", String(data.PurchaseUnitId));
      if (data.ConversionFactor) formData.append("ConversionFactor", String(data.ConversionFactor));
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "ChildrenIds" && productType === "branched" && Array.isArray(value)) {
          value.forEach((id) => formData.append("ChildrenIds[]", String(id)));
        } else if (key === "RawMaterials" && productType === "prepared" && Array.isArray(value)) {
          const materials = value as { rawMaterialId: number; quantity: number; unitId: number }[];
          formData.append(
            "Components",
            JSON.stringify(
              materials.map((m) => ({
                componentProductId: m.rawMaterialId,
                quantity: m.quantity,
                unitId: m.unitId,
              })),
            ),
          );
        } else if (value !== undefined && value !== null && key !== "Image" && key !== "image" && key !== "ChildrenIds" && key !== "RawMaterials" && key !== "BaseUnitId" && key !== "PurchaseUnitId" && key !== "ConversionFactor") {
          formData.append(key, String(value));
        }
      });

      if (data.Image instanceof File) {
        formData.append("image", data.Image);
      }
    }

    try {
      if (productType === "raw") {
        await createRawMaterial(formData);
      } else if (productType === "branched") {
        await createProductBranched(formData);
      } else if (productType === "prepared") {
        await createProductPrepared(formData);
      } else {
        await createProductDirect(formData);
      }
    } catch (error) {}
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>
          {t("home")}
        </span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/products")}>
          {t("products")}
        </span>
        <span>/</span>
      </div>

      <div className="bg-white p-5 rounded-sm border border-gray-200  flex items-center gap-3">
        <PlusCircle size={22} className="text-[var(--primary)]" />
        <h1 className="text-xl font-bold text-gray-800">إضافة صنف جديد</h1>
      </div>

      <div className="p-6 md:p-8 w-full bg-white rounded-sm border border-gray-200">
        <Tabs value={productType} onValueChange={(val) => setProductType(val as ProductType)} className="w-full bg-white rounded-sm ">
          <TabsList className="mb-8 w-full! h-fit!">
            <TabsTrigger className="py-2!" value="direct">
              الصنف المباشر
            </TabsTrigger>
            <TabsTrigger className="py-2!" value="branched">
              الصنف المتفرع
            </TabsTrigger>
            <TabsTrigger className="py-2!" value="prepared">
              الصنف المجهز
            </TabsTrigger>
            <TabsTrigger className="py-2!" value="raw">
              الخامة
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <Controller
                name="ProductNameAr"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="gap-x-0">
                      اسم الصنف (باللغة العربية)<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input {...field} placeholder="ادخل اسم التصنيف الرئيسي" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {productType !== "raw" && (
                <Field>
                  <FieldLabel className="gap-x-0">
                    التصنيف الرئيسي<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={(e) => setMainCategoryId(Number(e))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر التصنيف الرئيسي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {mainCategories?.map((cat) => (
                          <SelectItem key={cat?.id} value={String(cat?.id)}>
                            {cat?.categoryNameAr}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}

              <Controller
                name="ProductNameEn"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="gap-x-0">
                      الاسم باللغة الثانية <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input {...field} placeholder="ادخل الاسم باللغة الثانية" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {productType !== "raw" && (
                <Controller
                  name="CategoryId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="gap-x-0">
                        التصنيف الفرعي <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر التصنيف الفرعي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {subCategories?.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.categoryNameAr}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
              <Controller
                name="ProductNameUr"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="gap-x-0">الاسم باللغة الثالثة</FieldLabel>
                    <Input {...field} placeholder="ادخل الاسم باللغة الثالثة" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {productType !== "raw" && productType !== "branched" && (
                <Controller
                  name="Barcode"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        الباركود <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Input {...field} placeholder="ادخل الباركود *" className="flex-1" />
                        <Button
                          type="button"
                          className="h-full"
                          variant="outline"
                          onClick={() => {
                            const randomBarcode = Math.floor(10000000 + Math.random() * 90000000).toString();
                            setValue("Barcode", randomBarcode, { shouldValidate: true });
                          }}
                        >
                          <Barcode size={10} />
                        </Button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              {productType !== "branched" && (
                <Controller
                  name="CostPrice"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="gap-x-0">
                        التكلفة <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" placeholder="ادخل التكلفة *" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              {productType !== "raw" && productType !== "branched" && (
                <>
                  <Controller
                    name="SellingPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          سعر البيع <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" placeholder="ادخل السعر *" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  {productType !== "branched" && (
                    <>
                      <Controller
                        name="TaxId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                              الضريبة المطبقة <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر الضريبة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {taxesData?.map((tax) => (
                                    <SelectItem key={tax.id} value={String(tax.id)}>
                                      {tax.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="TaxCalculation"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                              طريقة حساب الضريبة <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر طريقة الحساب" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="1">لا يوجد ضريبة</SelectItem>
                                  <SelectItem value="2">السعر شامل الضريبة</SelectItem>
                                  <SelectItem value="3">السعر غير شامل الضريبة</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <div className="col-span-2">
                        <div className="w-full bg-[#FFFCF2] border border-[#F3E2B4] rounded-xl p-5">
                          <div className="flex flex-col space-y-3.5">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 text-[15px]">السعر قبل الضريبة</span>
                              <span className="text-slate-500 text-[15px]">{summary.basePrice}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#D97706] text-[15px]">
                                ضريبة ({summary.taxPercentage}%) {summary.taxName}
                              </span>
                              <span className="text-[#D97706] text-[15px]">{summary.taxAmount} +</span>
                            </div>
                            <div className="border-t border-[#E8D49E] my-0.5"></div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-[#8B4513] font-bold text-lg">السعر النهائي</span>
                              <span className="text-[#8B4513] font-bold text-lg">{summary.finalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="col-span-2">
                <Controller
                  name="Description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>الوصف</FieldLabel>
                      <Textarea {...field} placeholder="ادخل الوصف" rows={4} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              {productType === "raw" && (
                <>
                  <Controller
                    name="BaseUnitId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          وحدة المخازن <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="اختر وحدة المخازن" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {units?.items?.map((unit) => (
                                <SelectItem key={unit?.id} value={String(unit?.id)}>
                                  {unit?.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="PurchaseUnitId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          وحدة النسب <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="اختر وحدة النسب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {units?.items?.map((unit) => (
                                <SelectItem key={unit?.id} value={String(unit?.id)}>
                                  {unit?.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <div className="col-span-2">
                    <Controller
                      name="ConversionFactor"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            معامل التحويل <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input {...field} type="number" step="0.01" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="مثال: 1000" />
                          <p className="text-xs text-gray-400 mt-1">كم تساوي وحدة المخازن من وحدة النسب</p>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </>
              )}
              {productType === "branched" && (
                <div className="col-span-2">
                  <Controller
                    name="ChildrenIds"
                    control={control}
                    render={({ field, fieldState }) => {
                      const selectedValues = Array.isArray(field.value) ? field.value.map(String) : [];
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            أحمد<span className="text-red-500">*</span>
                          </FieldLabel>
                          <Combobox
                            multiple
                            items={productsDirect || []}
                            value={selectedValues}
                            onValueChange={(val) => {
                              const numberArray = Array.isArray(val) ? val.map(Number) : [];
                              field.onChange(numberArray);
                            }}
                          >
                            <ComboboxChips ref={anchor} className="w-full h-10! ">
                              <ComboboxValue>
                                {(values: string[]) => (
                                  <React.Fragment>
                                    {values.map((valueId: string) => {
                                      const product = productsDirect?.find((p) => String(p.id) === valueId);
                                      return <ComboboxChip key={valueId}>{product ? product.productNameAr : valueId}</ComboboxChip>;
                                    })}
                                    <ComboboxChipsInput placeholder="ابحث في الاصناف المباشرة..." />
                                  </React.Fragment>
                                )}
                              </ComboboxValue>
                            </ComboboxChips>
                            <ComboboxContent anchor={anchor}>
                              <ComboboxEmpty>لا يوجد اصناف رئيسية.</ComboboxEmpty>
                              <ComboboxList>
                                {(item: ProductDirect) => (
                                  <ComboboxItem key={item.id} value={String(item.id)}>
                                    {item.productNameAr}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />
                </div>
              )}
              {productType === "prepared" && (
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">الخامات المستخدمة</h3>
                    <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={() => appendRawMaterial({ rawMaterialId: 0, quantity: 0, unitId: 0 })}>
                      <Plus size={16} /> إضافة خامة
                    </Button>
                  </div>

                  {rawMaterialFields.length === 0 && <div className="text-center py-4 text-gray-400 text-sm">لم يتم إضافة أي خامات بعد. اضغط على "إضافة خامة".</div>}

                  {rawMaterialFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-3 items-start border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                      <div className="col-span-5">
                        <Controller
                          name={`RawMaterials.${index}.rawMaterialId`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>
                                الخامة <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="اختر الخامة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {productRawMatrial?.map((raw) => (
                                      <SelectItem value={String(raw?.id)}>{raw?.productNameAr}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <Controller
                          name={`RawMaterials.${index}.quantity`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>
                                الكمية <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Input {...field} type="number" step="0.01" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="0.00" className="bg-white" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <Controller
                          name={`RawMaterials.${index}.unitId`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>
                                الوحدة <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="الوحدة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {units?.items?.map((unit) => (
                                      <SelectItem value={String(unit?.id)}>{unit?.name}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-1 flex items-center justify-end pt-8">
                        <Button type="button" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2" onClick={() => removeRawMaterial(index)}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* إظهار خطأ عام إذا لم يتم إضافة خامات وتطلب الـ Schema ذلك */}
                  {methods.formState.errors.RawMaterials?.root?.message && <p className="text-sm text-red-500 mt-2">{methods.formState.errors.RawMaterials.root.message}</p>}
                </div>
              )}
              {productType !== "raw" && (
                <div className="col-span-2">
                  <Controller
                    name="Image"
                    control={control}
                    render={({ field }) => (
                      <FileUpload value={files} onValueChange={(newFiles) => field.onChange(newFiles[0])} onFileValidate={(file) => validateFile(file, files)} accept="image/*" maxFiles={1}>
                        <FileUploadDropzone>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center justify-center rounded-full border p-2.5">
                              <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <p className="font-medium text-sm">اسحب وافلت الصورة هنا</p>
                            <p className="text-muted-foreground text-xs">أو اضغط للتصفح</p>
                          </div>
                          <FileUploadTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2 w-fit">
                              تصفح الملفات
                            </Button>
                          </FileUploadTrigger>
                        </FileUploadDropzone>
                        <FileUploadList>
                          {files.map((file) => (
                            <FileUploadItem key={file.name} value={file}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete asChild>
                                <Button variant="ghost" size="icon" className="size-7" onClick={() => field.onChange(undefined)}>
                                  <X />
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUpload>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between gap-3 flex-wrap px-6 py-4 border-t border-gray-100 bg-gray-50/50 mt-8">
              <Button size="lg" variant="destructive" type="button" className="px-8 h-12">
                إلغاء
              </Button>
              <div className="gap-3 flex items-center flex-wrap">
                <Button variant="outline" size="lg" type="button" className="px-8 h-12 text-base">
                  حفظ وإضافة آخر
                </Button>
                <Button size="lg" type="submit" className="px-8 h-12 text-base">
                  حفظ البيانات
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}