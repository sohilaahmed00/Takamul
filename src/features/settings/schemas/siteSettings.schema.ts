import z from "zod";

export const siteSettingsSchema = z.object({
  defaultPaymentCompany: z.string().optional(),
  rowsPerPage: z.number().min(1, "يجب أن يكون أكبر من 0"),
  showActualBalance: z.boolean(),
  showItemCodeInSales: z.boolean(),
  showItemCodeInPurchases: z.boolean(),
  showItemCodeInQuotes: z.boolean(),
  showCostGreaterThanPriceWarning: z.boolean(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
