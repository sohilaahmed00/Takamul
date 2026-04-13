import {
  TopSellingParams,
  ProductMovementParams,
  InventoryStockParams,
  CustomerStatementParams,
  SupplierStatementParams,
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
};