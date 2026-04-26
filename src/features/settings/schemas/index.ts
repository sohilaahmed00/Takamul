import { SiteSettingsFormValues } from "./siteSettings.schema";

export const baseDefaultValues: SiteSettingsFormValues = {
  defaultPaymentCompany: "",
  rowsPerPage: 10,
  showActualBalance: true,
  showItemCodeInSales: true,
  showItemCodeInPurchases: true,
  showItemCodeInQuotes: true,
  showCostGreaterThanPriceWarning: true,
};
