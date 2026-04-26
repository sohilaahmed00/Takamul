import z from "zod/v3";
import { createProductSchema } from "./direct.schema";

export const createPreparedProductSchema = createProductSchema.omit({ MinStockLevel: true }).extend({
  RawMaterials: z
    .array(
      z.object({
        rawMaterialId: z.number().min(1, "الخامة مطلوبة"),
        quantity: z.number({ required_error: "", invalid_type_error: "الكمية يجب أن تكون رقم" }).min(1),
        unitId: z.number().min(1, "الوحدة مطلوبة"),
      }),
    )
    .min(1, "يجب إضافة خامة واحدة على الأقل"),
});

export type PreparedProductFormValues = z.infer<typeof createPreparedProductSchema>;
