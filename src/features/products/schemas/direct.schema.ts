import z from "zod/v3";

export const createProductSchema = z.object({
  Barcode: z.string().min(1, "الباركود مطلوب"),
  ProductNameAr: z.string().min(1, "اسم المنتج بالعربي مطلوب"),
  ProductNameEn: z.string().nullable().optional(),
  ProductNameUr: z.string().nullable().optional(),
  Description: z.string().optional().or(z.literal("")),
  CategoryId: z.number().min(1, "التصنيف مطلوب"),
  CostPrice: z.number().min(0).default(0),
  SellingPrice: z.number({ required_error: "سعر البيع مطلوب" }).min(0),
  MinStockLevel: z.number().min(1).nullable().optional(),
  TaxId: z.number().min(1, "الضريبة المطبقة مطلوبة"),
  TaxCalculation: z.number().min(1, "طريقة حساب الضريبة مطلوبة"),
  Image: z.union([z.instanceof(File), z.string()]).optional(),
  BaseUnitId: z.number({ required_error: "وحدة الأساس مطلوبة", invalid_type_error: "وحدة الأساس مطلوبة" }).min(1),
});

export type DirectProductFormValues = z.infer<typeof createProductSchema>;
