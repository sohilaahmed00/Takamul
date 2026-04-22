// src/pages/AddProduct.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Upload, Barcode, X, Trash2, Plus } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Controller, FormProvider, useFieldArray, useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload, FileUploadDropzone, FileUploadTrigger, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemDelete } from "@/components/ui/file-upload";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";

import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";
import { useCreateProductDirect } from "@/features/products/hooks/useCreateProductDirect";
import ComboboxField from "@/components/ui/ComboboxField";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";
import { useGetAllProductsDirect } from "@/features/products/hooks/useGetAllProductsDirect";
import type { ProductDirect } from "@/features/products/types/products.types";
import { useCreateProductBranched } from "@/features/products/hooks/useCreateProductBranched";
import { useCreateProductPrepared } from "@/features/products/hooks/useCreateProductPrepared";
import { useGetAllProductsRawMatrial } from "@/features/products/hooks/useGetAllProductsRawMatrial";
import { useCreateProductRawMaterial } from "@/features/products/hooks/useCreateProductRawMaterial";
import { useGetProductBranchedById } from "@/features/products/hooks/useGetProductBranchedById";
import { useUpdateProductBranched } from "@/features/products/hooks/useUpdateProductBranched";
import { useGetProductDirectById } from "@/features/products/hooks/useGetProductDirectById";
import { useUpdateProductDirect } from "@/features/products/hooks/useUpdateProductDirect";
import { useGetProductPreparedById } from "@/features/products/hooks/useGetProductPreparedById";
import { useUpdateProductPrepared } from "@/features/products/hooks/useUpdateProductPrepared";
import { useGetProductRawMaterialtById } from "@/features/products/hooks/useGetProductRawMaterialtById";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import z from "zod/v3";
import useToast from "@/hooks/useToast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateProductRawMatrial } from "@/features/products/hooks/useUpdateProductRawMaterial";

// ─── Schemas ────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  Barcode: z.string().min(1, "الباركود مطلوب"),
  ProductNameAr: z.string().min(1, "اسم المنتج بالعربي مطلوب"),
  ProductNameEn: z.string().nullable().optional(),
  ProductNameUr: z.string().nullable().optional(),
  Description: z.string().optional().or(z.literal("")),
  CategoryId: z.number().min(1, "التصنيف مطلوب"),
  CostPrice: z.number().min(0, "سعر التكلفة يجب أن يكون أكبر من أو يساوي صفر").default(0),
  SellingPrice: z.number({ required_error: "سعر البيع مطلوب" }).min(0, "سعر البيع يجب أن يكون أكبر من أو يساوي صفر"),
  MinStockLevel: z.number().min(1, "الحد الأدنى للمخزون غير صحيح").nullable().optional(),
  TaxId: z.number().min(1, "الضريبة المطبقة مطلوبة"),
  TaxCalculation: z.number().min(1, "طريقة حساب الضريبة مطلوبة"),
  Image: z.union([z.instanceof(File), z.string()]).optional(),
  BaseUnitId: z
    .number({
      required_error: "وحدة الأساس مطلوبة",
      invalid_type_error: "وحدة الأساس مطلوبة",
    })
    .min(1, "وحدة الأساس مطلوبة"),
});

export const createBranchedProductSchema = createProductSchema
  .omit({
    Barcode: true,
    MinStockLevel: true,
    TaxId: true,
    TaxCalculation: true,
    CostPrice: true,
    SellingPrice: true,
    BaseUnitId: true,
  })
  .extend({
    ChildrenIds: z.array(z.number()).min(1, "يجب اختيار صنف أم مباشر واحد على الأقل"),
  });

export const createPreparedProductSchema = createProductSchema
  .omit({
    MinStockLevel: true,
  })
  .extend({
    RawMaterials: z
      .array(
        z.object({
          rawMaterialId: z.number().min(1, "الخامة مطلوبة"),
          quantity: z
            .number({
              required_error: "الكمية مطلوبة",
              invalid_type_error: "الكمية يجب أن تكون رقم",
            })
            .min(1, "الكمية يجب أن تكون أكبر من صفر"),
          unitId: z.number().min(1, "الوحدة مطلوبة"),
        }),
      )
      .min(1, "يجب إضافة خامة واحدة على الأقل للصنف المجهز"),
  });

export const createRawMaterialSchema = createProductSchema
  .omit({
    Barcode: true,
    CategoryId: true,
    TaxId: true,
    TaxCalculation: true,
    SellingPrice: true,
    MinStockLevel: true,
  })
  .extend({
    PurchaseUnitId: z
      .number({
        required_error: "وحدة الشراء مطلوبة",
        invalid_type_error: "وحدة الشراء مطلوبة",
      })
      .min(1, "وحدة الشراء مطلوبة"),
    ConversionFactor: z
      .number({
        required_error: " معامل التحويل مطلوبة",
        invalid_type_error: "ادخل قيمة صحيحة",
      })
      .min(1, "معامل التحويل يجب أن يكون أكبر من صفر"),
  });

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductType = "Direct" | "Branched" | "Prepared" | "RawMatrial";

type FormValues = z.infer<typeof createProductSchema> & z.infer<typeof createBranchedProductSchema> & z.infer<typeof createPreparedProductSchema> & z.infer<typeof createRawMaterialSchema>;

// ─── Constants ───────────────────────────────────────────────────────────────

export const baseDefaultValues: FormValues = {
  Barcode: "",
  ProductNameAr: "",
  ProductNameEn: "",
  ProductNameUr: "",
  Description: "",
  CategoryId: 0,
  CostPrice: undefined,
  SellingPrice: undefined,
  MinStockLevel: undefined,
  TaxId: 0,
  TaxCalculation: 0,
  Image: undefined,
  ChildrenIds: [],
  RawMaterials: [{ rawMaterialId: 0, quantity: undefined as unknown as number, unitId: 0 }],
  BaseUnitId: undefined,
  PurchaseUnitId: 0,
  ConversionFactor: undefined,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createFileValidator(options: { maxFiles: number; maxSizeMB?: number; allowedTypes?: string[] }) {
  return (file: File, currentFiles: File[]) => {
    if (currentFiles.length >= options.maxFiles) return `مسموح بـ ${options.maxFiles} ملفات فقط`;
    if (options.allowedTypes && !options.allowedTypes.some((type) => file.type.startsWith(type))) return "نوع الملف غير مدعوم";
    const maxSize = (options.maxSizeMB || 200) * 1024 * 1024;
    if (file.size > maxSize) return `حجم الملف يجب أن يكون أقل من ${options.maxSizeMB || 2}MB`;
    return null;
  };
}

function generateRandomBarcode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AddProduct() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useToast();
  const [productType, setProductType] = useState<ProductType>("Direct");
  const [submitType, setSubmitType] = useState<"save" | "saveAndNew">("save");

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as ProductType;
  const isEditMode = !!id;
  const [fileError, setFileError] = useState<string | null>(null);

  // ── Data hooks ──────────────────────────────────────────────────────────
  const { data: taxesData } = useGetAllTaxes();
  const { data: mainCategories } = useGetAllMainCategories();
  const { data: productsDirect } = useGetAllProductsDirect(
    { page: 1, limit: 100 },
    {
      enabled: productType == "Branched",
    },
  );
  const { data: productRawMatrial } = useGetAllProductsRawMatrial(
    { page: 1, limit: 100 },
    {
      enabled: productType == "Prepared",
    },
  );
  const { data: units } = useGetAllUnits({ page: 1, size: 100 });

  // ── Edit data hooks ──────────────────────────────────────────────────────
  const { data: productDataBranched } = useGetProductBranchedById(Number(id), {
    enabled: isEditMode && type === "Branched",
  });
  const { data: productDataDirect } = useGetProductDirectById(Number(id), {
    enabled: isEditMode && type === "Direct",
  });
  const { data: productDataPrepared } = useGetProductPreparedById(Number(id), {
    enabled: isEditMode && type === "Prepared",
  });
  const { data: productDataRawMaterial } = useGetProductRawMaterialtById(Number(id), {
    enabled: isEditMode && type === "RawMatrial",
  });

  // ── Mutation hooks ───────────────────────────────────────────────────────
  const { mutateAsync: createProductDirect, isPending: isDirectLoading } = useCreateProductDirect();
  const { mutateAsync: createProductBranched, isPending: isBranchedLoading } = useCreateProductBranched();
  const { mutateAsync: createProductPrepared, isPending: isPreparedLoading } = useCreateProductPrepared();
  const { mutateAsync: createRawMaterial, isPending: isRawLoading } = useCreateProductRawMaterial();
  const { mutateAsync: updateProductBranched } = useUpdateProductBranched();
  const { mutateAsync: updateProductDirect } = useUpdateProductDirect();
  const { mutateAsync: updateProductPrepared } = useUpdateProductPrepared();
  const { mutateAsync: updateProductRawMatrial } = useUpdateProductRawMatrial();

  const isLoading = isDirectLoading || isBranchedLoading || isPreparedLoading || isRawLoading;

  // ── Form ─────────────────────────────────────────────────────────────────
  const activeSchema = productType === "Branched" ? createBranchedProductSchema : productType === "Prepared" ? createPreparedProductSchema : productType === "RawMatrial" ? createRawMaterialSchema : createProductSchema;

  const methods = useForm<FormValues>({
    resolver: zodResolver(activeSchema),
    defaultValues: baseDefaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });

  const { control, watch, setValue, reset } = methods;

  const { fields: rawMaterialFields, append: appendRawMaterial, remove: removeRawMaterial } = useFieldArray({ control, name: "RawMaterials" });

  const anchor = useComboboxAnchor();
  const validateFile = useMemo(() => createFileValidator({ maxFiles: 1, maxSizeMB: 100, allowedTypes: ["image/"] }), []);

  // ── Watched values ───────────────────────────────────────────────────────
  const CostPrice = watch("CostPrice");
  const SellingPrice = watch("SellingPrice");
  const TaxId = watch("TaxId");
  const TaxCalculation = watch("TaxCalculation");
  const ImageField = watch("Image");
  const [files, setFiles] = useState<File[]>(() => (ImageField instanceof File ? [ImageField] : []));

  // ── Price summary ────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const selectedTax = (taxesData || []).find((t) => String(t.id) === String(TaxId)) || { id: 1, name: "بدون ضريبة", amount: 0 };

    const taxRate = (selectedTax.amount || 0) / 100;
    const inputPrice = Number(SellingPrice) || 0;

    let basePrice = inputPrice;
    let taxAmount = 0;
    let finalPrice = inputPrice;

    if (TaxCalculation === 2) {
      basePrice = inputPrice / (1 + taxRate);
      taxAmount = inputPrice - basePrice;
      finalPrice = inputPrice;
    } else if (TaxCalculation === 3) {
      basePrice = inputPrice;
      taxAmount = inputPrice * taxRate;
      finalPrice = inputPrice + taxAmount;
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

  useEffect(() => {
    if (!id) return;
    switch (type) {
      case "Direct": {
        if (!productDataDirect || !units?.items?.length) return;
        setProductType("Direct");
        console.log(productDataDirect?.baseUnitId);
        reset({
          ProductNameAr: productDataDirect.productNameAr,
          ProductNameEn: productDataDirect.productNameEn,
          ProductNameUr: productDataDirect.productNameUr,
          Description: productDataDirect.description || "",
          Barcode: productDataDirect.barcode,
          SellingPrice: productDataDirect?.taxCalculation == 2 ? productDataDirect.priceAfterTax : productDataDirect.priceBeforeTax,
          CostPrice: productDataDirect.costPrice,
          MinStockLevel: productDataDirect.minStockLevel,
          TaxId: productDataDirect?.taxId,
          TaxCalculation: productDataDirect?.taxCalculation,
          CategoryId: productDataDirect?.parentCategoryId,
          BaseUnitId: productDataDirect.baseUnitId,
          Image: productDataDirect.imageUrl ?? undefined,
        });

        break;
      }

      case "Branched": {
        if (!productDataBranched) return;
        setProductType("Branched");
        reset({
          ProductNameAr: productDataBranched.productNameAr,
          ProductNameEn: productDataBranched.productNameEn,
          ProductNameUr: productDataBranched.productNameUr,
          Description: productDataBranched.description || "",
          ChildrenIds: productDataBranched.children?.map((c) => c?.id)?.filter((id): id is number => typeof id === "number") || [],
          CategoryId: productDataDirect?.parentCategoryId,
        });
        break;
      }

      case "Prepared": {
        if (!productDataPrepared) return;
        setProductType("Prepared");
        reset({
          ProductNameAr: productDataPrepared.productNameAr,
          ProductNameEn: productDataPrepared.productNameEn,
          ProductNameUr: productDataPrepared.productNameUr,
          Description: productDataPrepared.description || "",
          Barcode: productDataPrepared.barcode,
          SellingPrice: productDataPrepared?.taxCalculation == 2 ? productDataPrepared.priceAfterTax : productDataPrepared.priceBeforeTax,
          CostPrice: productDataPrepared.costPrice,
          MinStockLevel: productDataPrepared.minStockLevel,
          TaxCalculation: productDataPrepared?.taxCalculation,
          CategoryId: productDataPrepared?.categoryId,
          TaxId: productDataPrepared?.taxId,
          BaseUnitId: productDataPrepared?.baseUnitId,
          RawMaterials:
            productDataPrepared.components?.map((c) => ({
              rawMaterialId: c.componentProductId,
              quantity: c.quantity,
              unitId: 0,
            })) || [],
        });
        break;
      }

      case "RawMatrial": {
        if (!productDataRawMaterial) return;
        setProductType("RawMatrial");
        reset({
          ProductNameAr: productDataRawMaterial.productNameAr,
          ProductNameEn: productDataRawMaterial.productNameEn,
          ProductNameUr: productDataRawMaterial.productNameUr,
          Description: productDataRawMaterial.description || "",
          ConversionFactor: productDataRawMaterial.conversionFactor,
          CostPrice: productDataRawMaterial?.costPrice,
          PurchaseUnitId: productDataRawMaterial?.purchaseUnitId,
          BaseUnitId: productDataRawMaterial?.baseUnitId,
        });
        break;
      }

      default:
        break;
    }
  }, [id, type, reset, productDataDirect, productDataBranched, productDataPrepared, productDataRawMaterial]);

  const rawMaterials = watch("RawMaterials");

  useEffect(() => {
    if (productType !== "Prepared") return;

    const totalCost =
      rawMaterials?.reduce((acc, material) => {
        const selected = productRawMatrial?.items?.find((item) => item.id === material.rawMaterialId);
        const costPrice = selected?.costPrice ?? 0;
        const quantity = material.quantity ?? 0;
        return acc + costPrice * quantity;
      }, 0) ?? 0;

    setValue("CostPrice", totalCost, { shouldValidate: true });
  }, [rawMaterials, productRawMatrial?.items, productType, setValue]);
  // ── Submit ───────────────────────────────────────────────────────────────
  const buildFormData = useCallback(
    (data: FormValues): FormData => {
      const formData = new FormData();
      const skipKeys = new Set(["Image", "image", "ChildrenIds", "RawMaterials", "PurchaseUnitId", "ConversionFactor"]);
      Object.entries(data).forEach(([key, value]) => {
        if (skipKeys.has(key) || value === undefined || value === null) return;
        formData.append(key, String(value));
      });
      if (productType === "Branched" && Array.isArray(data.ChildrenIds)) {
        data.ChildrenIds.forEach((childId) => formData.append("ChildrenIds[]", String(childId)));
      }
      if (productType === "Prepared" && Array.isArray(data.RawMaterials)) {
        formData.append(
          "Components",
          JSON.stringify(
            data.RawMaterials.map((m) => ({
              componentProductId: m.rawMaterialId,
              quantity: m.quantity,
              unitId: m.unitId,
            })),
          ),
        );
      }

      // Image
      if (data.Image instanceof File) {
        formData.append("Image", data.Image);
      } else if (data.Image === undefined || data.Image === null) {
        formData.append("Image", "");
      }
      return formData;
    },
    [productType],
  );

  const buildRawMaterialJson = useCallback(
    (data: FormValues): Record<string, unknown> => ({
      productNameAr: data.ProductNameAr,
      productNameEn: data.ProductNameEn,
      productNameUr: data.ProductNameUr,
      costPrice: data.CostPrice,
      baseUnitId: data.BaseUnitId,
      purchaseUnitId: data.PurchaseUnitId,
      conversionFactor: data.ConversionFactor,
    }),
    [],
  );

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode && id) {
        if (productType === "RawMatrial") {
          const body = { ...buildRawMaterialJson(data), id: Number(id) };
          await updateProductRawMatrial({ id: Number(id), data: body });
        } else {
          const formData = buildFormData(data);
          formData.append("Id", id);
          switch (productType) {
            case "Branched":
              await updateProductBranched({ id: Number(id), data: formData });
              break;
            case "Direct":
              await updateProductDirect({ id: Number(id), data: formData });
              break;
            case "Prepared":
              await updateProductPrepared({ id: Number(id), data: formData });
              break;
            default:
              notifyError(`نوع منتج غير معروف للتعديل: ${productType}`);
          }
        }
      } else {
        if (productType === "RawMatrial") {
          await createRawMaterial(buildRawMaterialJson(data));
        } else {
          const formData = buildFormData(data);
          switch (productType) {
            case "Branched":
              await createProductBranched(formData);
              break;
            case "Prepared":
              await createProductPrepared(formData);
              break;
            default:
              await createProductDirect(formData);
          }
        }
      }
      if (submitType == "save") {
        navigate("/products");
      } else {
        reset();
      }
    } catch (error) {}
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 pb-24">
      {/* Breadcrumb */}
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

      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{isEditMode ? "تعديل صنف" : "إضافة صنف جديد"}</CardTitle>
          <CardDescription>يمكنك إضافة صنف جديد بشكل دوري</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Product type tabs */}
          <Tabs value={productType} onValueChange={(val) => setProductType(val as ProductType)} className="w-full  rounded-sm">
            <TabsList className="mb-8 w-full! h-fit!">
              <TabsTrigger className="py-2!" value="Direct">
                الصنف المباشر
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="Branched">
                الصنف المتفرع
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="Prepared">
                الصنف المجهز
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="RawMatrial">
                الخامة
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                console.log("Form Errors:", errors);
              })}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Arabic name */}
                <Controller
                  name="ProductNameAr"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="gap-x-0">
                        اسم الصنف (باللغة العربية)
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} placeholder="ادخل اسم التصنيف الرئيسي" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* English name */}
                <Controller
                  name="ProductNameEn"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="gap-x-0">الاسم باللغة الثانية</FieldLabel>
                      <Input {...field} placeholder="ادخل الاسم باللغة الثانية" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

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
                {/* Main category */}
                {productType !== "RawMatrial" && (
                  <Controller
                    name="CategoryId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="">
                          التصنيف الرئيسي<span className="text-red-500">*</span>
                        </FieldLabel>
                        <ComboboxField field={field} items={mainCategories} valueKey="id" labelKey="categoryNameAr" placeholder="اختر التصنيف الرئيسي" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                )}

                {/* Barcode */}

                {/* Cost price */}
                {productType !== "Branched" && (
                  <Controller
                    name="CostPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>التكلفة</FieldLabel>
                        <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} type="number" placeholder="ادخل التكلفة *" readOnly={productType === "Prepared"} className={productType === "Prepared" ? "bg-gray-100 cursor-not-allowed" : ""} />
                        {productType === "Prepared" && <p className="text-xs text-gray-400 mt-1">يتم حساب التكلفة تلقائياً بناءً على الخامات المضافة</p>}
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                )}

                {productType !== "RawMatrial" && productType !== "Branched" && (
                  <>
                    <Controller
                      name="SellingPrice"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            سعر البيع <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} type="number" placeholder="ادخل السعر *" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <div className="col-span-2">
                      <Controller
                        name="Barcode"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                              الباركود <span className="text-red-500">*</span>
                            </FieldLabel>
                            <div className="flex flex-row items-stretch gap-2">
                              <Input {...field} placeholder="ادخل الباركود *" className="flex-1 min-w-0" />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon-xl"
                                className="shrink-0 px-3"
                                onClick={() =>
                                  setValue("Barcode", generateRandomBarcode(), {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                <Barcode size={16} />
                              </Button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name="MinStockLevel"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="gap-x-0">الحد الأدنى للمخزون</FieldLabel>
                          <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} placeholder="ادخل الحد الادنى للمخزون" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="BaseUnitId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="gap-x-0">
                            الوحدة <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select key={field.value} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={"اختر الوحدة"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {units?.items?.map((c) => (
                                  <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>{" "}
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="TaxId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            الضريبة المطبقة <span className="text-red-500">*</span>
                          </FieldLabel>
                          <ComboboxField field={field} items={taxesData} valueKey="id" labelKey="name" placeholder="اختر الضريبة" />
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
                          <ComboboxField
                            field={field}
                            items={[
                              { id: 1, name: "لا يوجد ضريبة" },
                              { id: 2, name: "السعر شامل الضريبة" },
                              { id: 3, name: "السعر غير شامل الضريبة" },
                            ]}
                            valueKey="id"
                            labelKey="name"
                            placeholder="اختر طريقة الحساب"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Price summary card */}
                    <div className="lg:col-span-2">
                      <div className="w-full bg-card border border-border rounded-xl p-5">
                        <div className="flex flex-col space-y-3.5">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-[15px]">السعر قبل الضريبة</span>
                            <span className="text-muted-foreground text-[15px]">{summary.basePrice}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-primary text-[15px]">
                              ضريبة ({summary.taxPercentage}%) {summary.taxName}
                            </span>
                            <span className="text-primary text-[15px]">{summary.taxAmount} +</span>
                          </div>

                          <div className="border-t border-border my-0.5" />

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-foreground font-bold text-lg">السعر النهائي</span>
                            <span className="text-foreground font-bold text-lg">{summary.finalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Description */}
                <div className="lg:col-span-2">
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

                {/* Raw material unit fields */}
                {productType === "RawMatrial" && (
                  <>
                    <Controller
                      name="BaseUnitId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            وحدة المخازن <span className="text-red-500">*</span>
                          </FieldLabel>
                          <ComboboxField field={field} items={units?.items} valueKey="id" labelKey="name" placeholder="اختر وحدة المخازن" />
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
                          <ComboboxField field={field} items={units?.items} valueKey="id" labelKey="name" placeholder="اختر وحدة النسب" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <div className="lg:col-span-2">
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

                {productType === "Branched" && (
                  <div className="lg:col-span-2">
                    <Controller
                      name="ChildrenIds"
                      control={control}
                      render={({ field, fieldState }) => {
                        const selectedValues = Array.isArray(field.value) ? field.value.map(String) : [];
                        return (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                              الأصناف المباشرة المرتبطة
                              <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Combobox
                              multiple
                              items={productsDirect?.items || []}
                              value={selectedValues}
                              onValueChange={(val) => {
                                const numberArray = Array.isArray(val) ? val.map(Number) : [];
                                field.onChange(numberArray);
                              }}
                            >
                              <ComboboxChips ref={anchor} className="w-full h-10!">
                                <ComboboxValue>
                                  {(values: string[]) => (
                                    <React.Fragment>
                                      {values.map((valueId: string) => {
                                        const product = productsDirect?.items?.find((p) => String(p.id) === valueId);
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

                {/* Prepared raw materials list */}
                {productType === "Prepared" && (
                  <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-lg">الخامات المستخدمة</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() =>
                          appendRawMaterial({
                            rawMaterialId: 0,
                            quantity: 0,
                            unitId: 0,
                          })
                        }
                      >
                        <Plus size={16} /> إضافة خامة
                      </Button>
                    </div>

                    {rawMaterialFields.length === 0 && <div className="text-center py-4 text-gray-400 text-sm">لم يتم إضافة أي خامات بعد. اضغط على "إضافة خامة".</div>}

                    {rawMaterialFields.map((_field, index) => {
                      const selectedRawMaterialId = watch(`RawMaterials.${index}.rawMaterialId`);
                      const selectedRawMaterial = productRawMatrial?.items?.find((item) => item.id === selectedRawMaterialId);
                      const availableUnits = units?.items?.filter((unit) => unit.id === selectedRawMaterial?.baseUnitId || unit.id === selectedRawMaterial?.purchaseUnitId) ?? [];
                      return (
                        <div key={_field.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                          <div className="lg:col-span-5">
                            <Controller
                              name={`RawMaterials.${index}.rawMaterialId`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>
                                    الخامة <span className="text-red-500">*</span>
                                  </FieldLabel>
                                  <ComboboxField
                                    field={field}
                                    items={productRawMatrial?.items}
                                    valueKey="id"
                                    labelKey="productNameAr"
                                    placeholder="اختر الخامة"
                                    onValueChange={(val) => {
                                      const selected = productRawMatrial?.items?.find((item) => String(item.id) === String(val));
                                      if (selected?.baseUnitId) {
                                        setValue(`RawMaterials.${index}.unitId`, selected.baseUnitId, {
                                          shouldValidate: true,
                                        });
                                      }
                                    }}
                                  />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                          </div>

                          <div className="lg:col-span-3">
                            <Controller
                              name={`RawMaterials.${index}.quantity`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>
                                    الكمية <span className="text-red-500">*</span>
                                  </FieldLabel>
                                  <Input {...field} value={field.value ?? ""} type="number" step="0.01" onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} placeholder="0.00" className="bg-white" />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                          </div>

                          <div className="lg:col-span-3">
                            <Controller
                              name={`RawMaterials.${index}.unitId`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>
                                    الوحدة <span className="text-red-500">*</span>
                                  </FieldLabel>
                                  <ComboboxField disabled={!selectedRawMaterialId} field={field} items={availableUnits} valueKey="id" labelKey="name" placeholder="الوحدة" />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                          </div>

                          <div className="lg:col-span-1 flex items-center justify-center lg:pt-8 pt-2">
                            <Button type="button" variant="destructive" className="" onClick={() => removeRawMaterial(index)}>
                              <Trash2 size={18} className="" />
                              <span className="lg:hidden ml-2">حذف الخامة</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {(methods.formState.errors as FieldErrors<z.infer<typeof createPreparedProductSchema>>).RawMaterials?.root?.message && <p className="text-sm text-red-500 mt-2">{(methods.formState.errors as FieldErrors<z.infer<typeof createPreparedProductSchema>>).RawMaterials?.root?.message}</p>}
                  </div>
                )}

                {/* Image upload */}
                {productType !== "RawMatrial" && (
                  <div className="col-span-2">
                    <Controller
                      name="Image"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          {/* صورة قديمة من السيرفر */}
                          {typeof field.value === "string" && field.value && files.length === 0 && (
                            <div className="relative w-fit mb-3">
                              <img src={field.value} alt="صورة المنتج" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -top-2 -right-2 size-6 bg-white border border-gray-200 rounded-full"
                                onClick={() => {
                                  field.onChange(undefined);
                                }}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          )}

                          <FileUpload
                            value={files}
                            onValueChange={(newFiles) => {
                              setFiles(newFiles);
                              field.onChange(newFiles[0] ?? undefined);
                              if (newFiles.length > 0) setFileError(null);
                            }}
                            onFileValidate={(file) => {
                              const error = validateFile(file, files);
                              if (error) {
                                setFileError(error);
                                return error;
                              }
                              setFileError(null);
                              return null;
                            }}
                            accept="image/*"
                            maxFiles={1}
                          >
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
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7"
                                      onClick={() => {
                                        setFiles([]);
                                        setFileError(null);
                                        field.onChange(undefined);
                                      }}
                                    >
                                      <X />
                                    </Button>
                                  </FileUploadItemDelete>
                                </FileUploadItem>
                              ))}
                            </FileUploadList>
                          </FileUpload>

                          {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                        </>
                      )}
                    />
                  </div>
                )}
              </div>
              {/* Action buttons */}
              <div className="flex flex-col-reverse lg:flex-row justify-between py-4 border px-3 gap-3 rounded border-gray-100">
                <Button size="lg" variant="destructive" type="button" className="w-full lg:w-auto px-8 h-12" onClick={() => navigate("/products")}>
                  إلغاء
                </Button>
                <div className="flex flex-col-reverse lg:flex-row items-center gap-3 w-full lg:w-auto">
                  <Button
                    loading={isLoading}
                    variant="outline"
                    size="lg"
                    type="button"
                    onClick={methods.handleSubmit((data) => {
                      setSubmitType("saveAndNew");
                      onSubmit(data);
                    })}
                    className="w-full lg:w-auto px-8 h-12 text-base"
                  >
                    حفظ وإضافة آخر
                  </Button>
                  <Button loading={isLoading} size="lg" type="submit" className="w-full lg:w-auto px-8 h-12 text-base">
                    حفظ البيانات{" "}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
