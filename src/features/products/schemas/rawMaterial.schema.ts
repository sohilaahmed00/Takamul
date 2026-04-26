import z from "zod/v3";
import { createProductSchema } from "./direct.schema";

export const createRawMaterialSchema = createProductSchema.omit({ Barcode: true, CategoryId: true, TaxId: true, TaxCalculation: true, SellingPrice: true, MinStockLevel: true }).extend({
  PurchaseUnitId: z.number({ required_error: "وحدة الشراء مطلوبة", invalid_type_error: "وحدة الشراء مطلوبة" }).min(1),
  ConversionFactor: z.number({ required_error: "معامل التحويل مطلوبة", invalid_type_error: "ادخل قيمة صحيحة" }).min(1),
});

export type RawMaterialFormValues = z.infer<typeof createRawMaterialSchema>;
