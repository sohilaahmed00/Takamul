import z from "zod/v3";
import { createProductSchema } from "./direct.schema";

export const createBranchedProductSchema = createProductSchema.omit({ Barcode: true, MinStockLevel: true, TaxId: true, TaxCalculation: true, CostPrice: true, SellingPrice: true, BaseUnitId: true }).extend({
  ChildrenIds: z.array(z.number()).min(1, "يجب اختيار صنف أم مباشر واحد على الأقل"),
});

export type BranchedProductFormValues = z.infer<typeof createBranchedProductSchema>;
