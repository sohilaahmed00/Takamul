import {
  TopSellingParams,
  ProductMovementParams,
  InventoryStockParams,
  CustomerStatementParams,
  SupplierStatementParams,
  ExpensesReportParams,
  ItemSalesReportParams,
  DailySalesReportParams,
  SalesInvoiceReportParams,
  ProductPurchasesParams,
  DailyPurchasesReportParams,
  PurchaseInvoiceReportParams,
  ProfitReportParams,
} from "../types/reports.types";

export const reportsKeys = {
  all: ["reports"] as const,

  topSelling: (params: TopSellingParams) =>
    [...reportsKeys.all, "topSelling", params] as const,

  movement: (params: ProductMovementParams) =>
    [...reportsKeys.all, "movement", params] as const,

  inventoryStock: (params: InventoryStockParams) =>
    [...reportsKeys.all, "inventoryStock", params] as const,

  customerStatement: (params: CustomerStatementParams) =>
    [...reportsKeys.all, "customerStatement", params] as const,

  supplierStatement: (params: SupplierStatementParams) =>
    [...reportsKeys.all, "supplierStatement", params] as const,

  expenses: (params: ExpensesReportParams) =>
    [...reportsKeys.all, "expenses", params] as const,

  itemSales: (params: ItemSalesReportParams) =>
    [...reportsKeys.all, "itemSales", params] as const,

  dailySales: (params: DailySalesReportParams) =>
    [...reportsKeys.all, "dailySales", params] as const,

  salesInvoices: (params: SalesInvoiceReportParams) =>
    [...reportsKeys.all, "salesInvoices", params] as const,

  itemPurchases: (params: ProductPurchasesParams) =>
    [...reportsKeys.all, "itemPurchases", params] as const,

  dailyPurchases: (params: DailyPurchasesReportParams) =>
    [...reportsKeys.all, "dailyPurchases", params] as const,

  purchaseInvoices: (params: PurchaseInvoiceReportParams) =>
    [...reportsKeys.all, "purchaseInvoices", params] as const,

  profit: (params: ProfitReportParams) =>
    [...reportsKeys.all, "profit", params] as const,
};