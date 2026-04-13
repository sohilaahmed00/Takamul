import { httpClient } from "@/api/httpClient";
import {
  TopSellingProduct,
  TopSellingParams,
  PaginatedResponse,
  ProductMovement,
  ProductMovementParams,
  InventoryStockItem,
  InventoryStockParams,
  StatementItem,
  CustomerStatementParams,
  SupplierStatementParams,
} from "../types/reports.types";

// ─── Top Selling ───────────────────────────────────────────────
// بترجع paginated response
export const getTopSellingProducts = async (
  params: TopSellingParams
): Promise<PaginatedResponse<TopSellingProduct>> => {
  return httpClient<PaginatedResponse<TopSellingProduct>>(
    "/reports/products/TopSelling",
    { params }
  );
};

// ─── Product Movement ──────────────────────────────────────────
// بترجع array مباشرة
export const getProductMovement = async (
  params: ProductMovementParams
): Promise<ProductMovement[]> => {
  if (!params.productId) return [];
  return httpClient<ProductMovement[]>("/reports/products/Movement", { params });
};

// ─── Inventory Stock ───────────────────────────────────────────
// بترجع paginated response
export const getInventoryStock = async (
  params: InventoryStockParams
): Promise<PaginatedResponse<InventoryStockItem>> => {
  return httpClient<PaginatedResponse<InventoryStockItem>>(
    "/reports/products/InventoryStock",
    { params }
  );
};

// ─── Customer Statement ────────────────────────────────────────
// بترجع paginated response
export const getCustomerStatement = async (
  params: CustomerStatementParams
): Promise<PaginatedResponse<StatementItem>> => {
  if (!params.customerId) return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20 };
  const { customerId, ...rest } = params;
  return httpClient<PaginatedResponse<StatementItem>>(
    "/reports/products/CustomarsStatement",
    { params: { CustomerId: customerId, ...rest } }
  );
};

// ─── Supplier Statement ────────────────────────────────────────
// بترجع paginated response
export const getSupplierStatement = async (
  params: SupplierStatementParams
): Promise<PaginatedResponse<StatementItem>> => {
  if (!params.supplierId) return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20 };
  const { supplierId, ...rest } = params;
  return httpClient<PaginatedResponse<StatementItem>>(
    "/reports/products/SupplierStatement",
    { params: { SupplierId: supplierId, ...rest } }
  );
};