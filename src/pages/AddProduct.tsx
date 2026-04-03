import React, { useState, useMemo, useEffect } from "react";
import { Upload, Barcode, X, Trash2, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";
import { useCreateProductDirect } from "@/features/products/hooks/useCreateProductDirect";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";
import { useGetAllSubCategoriesWidthParentId } from "@/features/categories/hooks/useGetAllSubCategoriesWidthParentId";
import { useGetAllProductsDirect } from "@/features/products/hooks/useGetAllProductsDirect";
import type { ProductDirect } from "@/features/products/types/products.types";
import { useCreateProductBranched } from "@/features/products/hooks/useCreateProductBranched";
import { useCreateProductPrepared } from "@/features/products/hooks/useCreateProductPrepared";
import { useGetAllProductsRawMatrial } from "@/features/products/hooks/useGetAllProductsRawMatrial";
import { useCreateProductRawMaterial } from "@/features/products/hooks/useCreateProductRawMaterial";
import { useGetProductById } from "@/features/products/hooks/useGetProductById";
import { useUpdateProduct } from "@/features/products/hooks/useUpdateProduct";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import useToast from "@/hooks/useToast";

export const createProductSchema = (t: (key: string) => string) =>
  z.object({
    Barcode: z.string().min(1, t("validation_barcode_required")),
    ProductNameAr: z.string().min(1, t("validation_product_name_ar_required")),
    ProductNameEn: z.string().min(1, t("validation_product_name_en_required")),
    ProductNameUr: z.string().min(1, t("validation_product_name_ur_required")),
    Description: z.string().optional().or(z.literal("")),
    CategoryId: z.number().min(1, t("validation_category_required")),
    CostPrice: z.number().min(0, t("validation_cost_price_invalid")),
    SellingPrice: z.number().min(0, t("validation_selling_price_invalid")),
    MinStockLevel: z.number().min(1, t("validation_min_stock_invalid")),
    TaxId: z.number().min(1, t("validation_tax_required")),
    TaxCalculation: z.string().min(1, t("validation_tax_calc_required")),
    Image: z.union([z.instanceof(File), z.string()]).optional(),
  });

export const createBranchedProductSchema = (t: (key: string) => string) =>
  createProductSchema(t)
    .omit({
      Barcode: true,
      MinStockLevel: true,
      TaxId: true,
      TaxCalculation: true,
    })
    .extend({
      ChildrenIds: z.array(z.number()).min(1, t("validation_children_required")),
    });

export const createPreparedProductSchema = (t: (key: string) => string) =>
  createProductSchema(t)
    .extend({
      RawMaterials: z
        .array(
          z.object({
            rawMaterialId: z.number().min(1, t("validation_raw_material_required")),
            quantity: z.number().min(0.01, t("validation_quantity_gt_zero")),
            unitId: z.number().min(1, t("validation_unit_required")),
          })
        )
        .min(1, t("validation_prepared_requires_raw")),
    })
    .extend({
      ChildrenIds: z.array(z.number()).min(1, t("validation_children_required")),
    });

export const createRawMaterialSchema = (t: (key: string) => string) =>
  createProductSchema(t)
    .omit({
      Barcode: true,
      CategoryId: true,
      TaxId: true,
      TaxCalculation: true,
      SellingPrice: true,
      MinStockLevel: true,
    })
    .extend({
      BaseUnitId: z.number().min(1, t("validation_base_unit_required")),
      PurchaseUnitId: z.number().min(1, t("validation_purchase_unit_required")),
      ConversionFactor: z.number().min(0.01, t("validation_conversion_factor_required")),
    });

type DirectFormValues = z.infer<ReturnType<typeof createProductSchema>>;
type BranchedFormValues = z.infer<ReturnType<typeof createBranchedProductSchema>>;
type PreparedFormValues = z.infer<ReturnType<typeof createPreparedProductSchema>>;
type RawFormValues = z.infer<ReturnType<typeof createRawMaterialSchema>>;
type FormValues = DirectFormValues | BranchedFormValues | PreparedFormValues | RawFormValues;

const baseDefaultValues: any = {
  Barcode: "",
  ProductNameAr: "",
  ProductNameEn: "",
  ProductNameUr: "",
  Description: "",
  CategoryId: 0,
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

function createFileValidator(options: {
  maxFiles: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  t: (key: string) => string;
}) {
  return (file: File, currentFiles: File[]) => {
    if (currentFiles.length >= options.maxFiles) {
      return tWithReplace(options.t, "max_files_allowed", {
        count: String(options.maxFiles),
      });
    }
    if (
      options.allowedTypes &&
      !options.allowedTypes.some((type) => file.type.startsWith(type))
    ) {
      return options.t("unsupported_file_type");
    }
    const maxSize = (options.maxSizeMB || 2) * 1024 * 1024;
    if (file.size > maxSize) {
      return tWithReplace(options.t, "max_file_size_mb", {
        size: String(options.maxSizeMB || 2),
      });
    }
    return null;
  };
}

function tWithReplace(
  t: (key: string) => string,
  key: string,
  vars: Record<string, string>
) {
  let text = t(key) || key;
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  return text;
}

export default function AddProduct() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { notifyError } = useToast();

  type ProductType = "direct" | "branched" | "prepared" | "raw";
  const [productType, setProductType] = useState<ProductType>("direct");
  const [mainCategoryId, setMainCategoryId] = useState<number>();

  const { data: taxesData } = useGetAllTaxes();
  const { data: mainCategories } = useGetAllMainCategories();
  const { data: subCategories } =
    useGetAllSubCategoriesWidthParentId(mainCategoryId as number);
  const { data: productsDirect } = useGetAllProductsDirect({ page: 1, limit: 100 });
  const { mutateAsync: createProductDirect, isPending: isDirectLoading } =
    useCreateProductDirect();
  const { mutateAsync: createProductBranched, isPending: isBranchedLoading } =
    useCreateProductBranched();
  const { mutateAsync: createProductPrepared, isPending: isPreparedLoading } =
    useCreateProductPrepared();
  const { mutateAsync: createRawMaterial, isPending: isRawLoading } =
    useCreateProductRawMaterial();
  const { data: productRawMatrial } = useGetAllProductsRawMatrial({
    page: 1,
    limit: 100,
  });
  const { data: units } = useGetAllUnits({ page: 1, size: 1000000 });
  const { data: productData, error } = useGetProductById(Number(id));
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const isLoading =
    isDirectLoading || isBranchedLoading || isPreparedLoading || isRawLoading;

  useEffect(() => {
    if (error?.message) notifyError(String(error.message));
  }, [error, notifyError]);

  const activeSchema =
    productType === "branched"
      ? createBranchedProductSchema(t)
      : productType === "prepared"
        ? createPreparedProductSchema(t)
        : productType === "raw"
          ? createRawMaterialSchema(t)
          : createProductSchema(t);

  const methods = useForm<FormValues>({
    resolver: zodResolver(activeSchema) as Resolver<FormValues>,
    defaultValues: baseDefaultValues,
    mode: "onChange",
  });

  const { control, watch, setValue, clearErrors, reset } = methods;

  useEffect(() => {
    if (productData && id) {
      setMainCategoryId(productData.parentCategoryId);

      switch (productData.productType) {
        case "Direct":
          setProductType("direct");
          break;
        case "Branched":
          setProductType("branched");
          break;
        case "Prepared":
          setProductType("prepared");
          break;
        case "RawMatrial":
          setProductType("raw");
          break;
        default:
          setProductType("direct");
      }

      reset({
        ProductNameAr: productData.productNameAr,
        ProductNameEn: productData.productNameEn,
        ProductNameUr: productData.productNameUr,
        Description: productData.description || "",
        SellingPrice: productData.sellingPrice,
        CostPrice: productData.costPrice,
        TaxCalculation: productData.taxCalculation,
        CategoryId: undefined as any,
        Barcode: productData.barcode,
        TaxId: productData.taxId,
        Image: undefined,
        MinStockLevel: productData.minStockLevel,
      } as any);
    }
  }, [productData, reset, id]);

  useEffect(() => {
    if (productData?.categoryId && subCategories && subCategories.length > 0) {
      setValue("CategoryId" as any, productData.categoryId, { shouldValidate: true });
    }
  }, [subCategories, productData?.categoryId, setValue]);

  const {
    fields: rawMaterialFields,
    append: appendRawMaterial,
    remove: removeRawMaterial,
  } = useFieldArray({
    control,
    name: "RawMaterials" as never,
  });

  useEffect(() => {
    clearErrors();
  }, [productType, clearErrors]);

  const costPrice = watch("CostPrice" as any);
  const sellingPrice = watch("SellingPrice" as any);
  const taxId = watch("TaxId" as any);
  const taxCalculation = watch("TaxCalculation" as any);
  const imageField = watch("Image" as any);

  const files = imageField instanceof File ? [imageField] : [];
  const anchor = useComboboxAnchor();

  const summary = useMemo(() => {
    const selectedTax =
      (taxesData || []).find((tx) => String(tx.id) === String(taxId)) || {
        id: 1,
        name: t("no_tax"),
        amount: 0,
      };

    const taxRate = (selectedTax.amount || 0) / 100;
    let basePrice = Number(sellingPrice) || 0;
    let finalPrice = Number(sellingPrice) || 0;
    let taxAmount = 0;

    if (taxCalculation === "2") {
      basePrice = finalPrice - finalPrice * taxRate;
      taxAmount = finalPrice - basePrice;
    } else if (taxCalculation === "3") {
      taxAmount = basePrice * taxRate;
      finalPrice = basePrice + taxAmount;
    }

    const cost = Number(costPrice) || 0;
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
  }, [costPrice, sellingPrice, taxId, taxCalculation, taxesData, t]);

  const validateFile = useMemo(
    () =>
      createFileValidator({
        maxFiles: 1,
        maxSizeMB: 2,
        allowedTypes: ["image/"],
        t,
      }),
    [t]
  );

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    if (productType === "raw") {
      const rawData = data as RawFormValues;

      formData.append("ProductNameAr", data.ProductNameAr);
      formData.append("ProductNameEN", data.ProductNameEn);
      formData.append("ProductNameUr", data.ProductNameUr);
      formData.append("CostPrice", String(data.CostPrice));
      if (rawData.BaseUnitId) formData.append("BaseUnitId", String(rawData.BaseUnitId));
      if (rawData.PurchaseUnitId)
        formData.append("PurchaseUnitId", String(rawData.PurchaseUnitId));
      if (rawData.ConversionFactor)
        formData.append("ConversionFactor", String(rawData.ConversionFactor));
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "ChildrenIds" && productType === "branched" && Array.isArray(value)) {
          value.forEach((childId) => formData.append("ChildrenIds[]", String(childId)));
        } else if (key === "RawMaterials" && productType === "prepared" && Array.isArray(value)) {
          const materials = value as {
            rawMaterialId: number;
            quantity: number;
            unitId: number;
          }[];
          formData.append(
            "Components",
            JSON.stringify(
              materials.map((m) => ({
                componentProductId: m.rawMaterialId,
                quantity: m.quantity,
                unitId: m.unitId,
              }))
            )
          );
        } else if (
          value !== undefined &&
          value !== null &&
          key !== "Image" &&
          key !== "image" &&
          key !== "ChildrenIds" &&
          key !== "RawMaterials" &&
          key !== "BaseUnitId" &&
          key !== "PurchaseUnitId" &&
          key !== "ConversionFactor"
        ) {
          formData.append(key, String(value));
        }
      });

      if (data.Image instanceof File) {
        formData.append("image", data.Image);
      }
    }

    try {
      if (id) {
        formData.append("Id", id);
        formData.append("productType", productData?.productType || "");
        await updateProduct({ id: Number(id), data: formData });
      } else {
        if (productType === "raw") {
          await createRawMaterial(formData);
        } else if (productType === "branched") {
          await createProductBranched(formData);
        } else if (productType === "prepared") {
          await createProductPrepared(formData);
        } else {
          await createProductDirect(formData);
        }
      }
      navigate("/products");
    } catch { }
  };

  return (
    <div className="space-y-4 pb-24" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span
          className="cursor-pointer hover:text-[var(--primary)]"
          onClick={() => navigate("/")}
        >
          {t("home")}
        </span>
        <span>/</span>
        <span
          className="cursor-pointer hover:text-[var(--primary)]"
          onClick={() => navigate("/products")}
        >
          {t("products")}
        </span>
        <span>/</span>
      </div>

      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{t("add_new_product")}</CardTitle>
          <CardDescription>{t("add_new_product_desc")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={productType}
            onValueChange={(val) => setProductType(val as ProductType)}
            className="w-full bg-white rounded-sm"
          >
            <TabsList className="mb-8 w-full! h-fit!">
              <TabsTrigger className="py-2!" value="direct">
                {t("direct_product")}
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="branched">
                {t("branched_product")}
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="prepared">
                {t("prepared_product")}
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="raw">
                {t("raw_material")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Controller
                  name="ProductNameAr"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="gap-x-0">
                        {t("product_name_ar")}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} placeholder={t("enter_main_category_name")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {productType !== "raw" && (
                  <Field>
                    <FieldLabel className="gap-x-0">
                      {t("main_category")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={mainCategoryId ? String(mainCategoryId) : ""}
                      onValueChange={(e) => setMainCategoryId(Number(e))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("choose_main_category")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {mainCategories?.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.categoryNameAr}
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
                        {t("product_name_en")}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} placeholder={t("enter_name_in_second_language")} />
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
                          {t("sub_category")}
                          <span className="text-red-500">*</span>
                        </FieldLabel>

                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("choose_sub_category")} />
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
                      <FieldLabel className="gap-x-0">{t("product_name_ur")}</FieldLabel>
                      <Input {...field} placeholder={t("enter_name_in_third_language")} />
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
                          {t("barcode")}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="flex gap-2">
                          <Input {...field} placeholder={t("enter_barcode")} className="flex-1" />
                          <Button
                            type="button"
                            className="h-full"
                            variant="outline"
                            onClick={() => {
                              const randomBarcode = Math.floor(
                                10000000 + Math.random() * 90000000
                              ).toString();
                              setValue("Barcode" as any, randomBarcode, {
                                shouldValidate: true,
                              });
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
                          {t("cost")}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          type="number"
                          placeholder={t("enter_cost")}
                        />
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
                            {t("selling_price")}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            type="number"
                            placeholder={t("enter_price")}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <div className="lg:col-span-2">
                      <Controller
                        name="MinStockLevel"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="gap-x-0">{t("min_stock_level")}</FieldLabel>
                            <Input
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder={t("enter_min_stock_level")}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name="TaxId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            {t("applied_tax")}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("choose_tax")} />
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
                            {t("tax_calculation_method")}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("choose_calculation_method")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="1">{t("no_tax")}</SelectItem>
                                <SelectItem value="2">{t("price_includes_tax")}</SelectItem>
                                <SelectItem value="3">{t("price_excludes_tax")}</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <div className="lg:col-span-2">
                      <div className="w-full bg-[#FFFCF2] border border-[#F3E2B4] rounded-xl p-5">
                        <div className="flex flex-col space-y-3.5">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[15px]">{t("price_before_tax")}</span>
                            <span className="text-slate-500 text-[15px]">{summary.basePrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#D97706] text-[15px]">
                              {t("tax")} ({summary.taxPercentage}%) {summary.taxName}
                            </span>
                            <span className="text-[#D97706] text-[15px]">
                              {summary.taxAmount} +
                            </span>
                          </div>
                          <div className="border-t border-[#E8D49E] my-0.5"></div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[#8B4513] font-bold text-lg">{t("final_price")}</span>
                            <span className="text-[#8B4513] font-bold text-lg">{summary.finalPrice}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[#0f5132] font-bold text-base">{t("expected_profit")}</span>
                            <span className="text-[#0f5132] font-bold text-base">
                              {summary.profit} ({summary.profitMargin}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="lg:col-span-2">
                  <Controller
                    name="Description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t("description")}</FieldLabel>
                        <Textarea {...field} placeholder={t("enter_description")} rows={4} />
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
                            {t("warehouse_unit")}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("choose_warehouse_unit")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {units?.items?.map((unit) => (
                                  <SelectItem key={unit.id} value={String(unit.id)}>
                                    {unit.name}
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
                            {t("ratio_unit")}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("choose_purchase_unit")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {units?.items?.map((unit) => (
                                  <SelectItem key={unit.id} value={String(unit.id)}>
                                    {unit.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
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
                              {t("conversion_factor")}
                              <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder={t("example_1000")}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              {t("conversion_factor_hint")}
                            </p>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  </>
                )}

                {productType === "branched" && (
                  <div className="lg:col-span-2">
                    <Controller
                      name="ChildrenIds"
                      control={control}
                      render={({ field, fieldState }) => {
                        const selectedValues = Array.isArray(field.value)
                          ? field.value.map(String)
                          : [];

                        return (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                              {t("direct_parent_products")}
                              <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Combobox
                              multiple
                              items={productsDirect?.items || []}
                              value={selectedValues}
                              onValueChange={(val) => {
                                const numberArray = Array.isArray(val)
                                  ? val.map(Number)
                                  : [];
                                field.onChange(numberArray);
                              }}
                            >
                              <ComboboxChips ref={anchor} className="w-full h-10!">
                                <ComboboxValue>
                                  {(values: string[]) => (
                                    <>
                                      {values.map((valueId: string) => {
                                        const product = productsDirect?.items?.find(
                                          (p) => String(p.id) === valueId
                                        );
                                        return (
                                          <ComboboxChip key={valueId}>
                                            {product ? product.productNameAr : valueId}
                                          </ComboboxChip>
                                        );
                                      })}
                                      <ComboboxChipsInput placeholder={t("search_direct_products")} />
                                    </>
                                  )}
                                </ComboboxValue>
                              </ComboboxChips>

                              <ComboboxContent anchor={anchor}>
                                <ComboboxEmpty>{t("no_direct_products")}</ComboboxEmpty>
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
                  <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {t("used_raw_materials")}
                      </h3>
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
                          } as never)
                        }
                      >
                        <Plus size={16} /> {t("add_raw_material")}
                      </Button>
                    </div>

                    {rawMaterialFields.length === 0 && (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        {t("no_raw_materials_added")}
                      </div>
                    )}

                    {rawMaterialFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
                      >
                        <div className="lg:col-span-5">
                          <Controller
                            name={`RawMaterials.${index}.rawMaterialId` as any}
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                  {t("raw_material")}
                                  <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Select
                                  value={field.value ? String(field.value) : ""}
                                  onValueChange={(val) => field.onChange(Number(val))}
                                >
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder={t("choose_raw_material")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {productRawMatrial?.items?.map((raw) => (
                                        <SelectItem key={raw.id} value={String(raw.id)}>
                                          {raw.productNameAr}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="lg:col-span-3">
                          <Controller
                            name={`RawMaterials.${index}.quantity` as any}
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                  {t("quantity")}
                                  <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  placeholder={t("zero_decimal")}
                                  className="bg-white"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="lg:col-span-3">
                          <Controller
                            name={`RawMaterials.${index}.unitId` as any}
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                  {t("unit")}
                                  <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Select
                                  value={field.value ? String(field.value) : ""}
                                  onValueChange={(val) => field.onChange(Number(val))}
                                >
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder={t("unit")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {units?.items?.map((unit) => (
                                        <SelectItem key={unit.id} value={String(unit.id)}>
                                          {unit.name}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="lg:col-span-1 flex items-center justify-end lg:pt-8 pt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 w-full lg:w-auto"
                            onClick={() => removeRawMaterial(index)}
                          >
                            <Trash2 size={18} />
                            <span className="lg:hidden ml-2">{t("delete_raw_material")}</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {(methods.formState.errors as FieldErrors<any>).RawMaterials?.root?.message && (
                      <p className="text-sm text-red-500 mt-2">
                        {(methods.formState.errors as FieldErrors<any>).RawMaterials?.root
                          ?.message as string}
                      </p>
                    )}
                  </div>
                )}

                {productType !== "raw" && (
                  <div className="lg:col-span-2">
                    <Controller
                      name="Image"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          value={files}
                          onValueChange={(newFiles) => field.onChange(newFiles[0])}
                          onFileValidate={(file) => validateFile(file, files)}
                          accept="image/*"
                          maxFiles={1}
                        >
                          <FileUploadDropzone>
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center justify-center rounded-full border p-2.5">
                                <Upload className="size-6 text-muted-foreground" />
                              </div>
                              <p className="font-medium text-sm">{t("drag_drop_image_here")}</p>
                              <p className="text-muted-foreground text-xs">{t("or_click_to_browse")}</p>
                            </div>
                            <FileUploadTrigger asChild>
                              <Button variant="outline" size="sm" className="mt-2 w-fit">
                                {t("browse_files")}
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
                                    onClick={() => field.onChange(undefined)}
                                  >
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

              <div className="flex flex-col-reverse lg:flex-row justify-between gap-3 py-4 border-t border-gray-100 bg-gray-50/50 mt-8">
                <Button
                  size="lg"
                  variant="destructive"
                  type="button"
                  className="w-full lg:w-auto px-8 h-12"
                >
                  {t("cancel")}
                </Button>

                <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    type="button"
                    className="w-full lg:w-auto px-8 h-12 text-base"
                  >
                    {t("save_and_add_another")}
                  </Button>

                  <Button
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="w-full lg:w-auto px-8 h-12 text-base"
                  >
                    {isLoading ? t("saving") : t("save_data")}
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