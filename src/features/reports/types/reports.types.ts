// ─── Shared ────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// ─── Top Selling ───────────────────────────────────────────────
export interface TopSellingProduct {
  productId: number;
  productName: string;
  barcode: string;
  sellingPrice: number;
  totalQuantitySold: number;
  totalSales: number;
}

export interface TopSellingParams {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

// ─── Product Movement ──────────────────────────────────────────
export interface ProductMovement {
  productId: number;
  productNameAr: string;
  barcode: string;
  transDate: string;
  transType: string;
  qtyIn: number;
  qtyOut: number;
  invoiceNo: number;
  runningBalance: number;
}

export interface ProductMovementParams {
  productId: number | string;
  from?: string;
  to?: string;
}

// ─── Inventory Stock ───────────────────────────────────────────
export interface InventoryStockItem {
  productId: number;
  productName: string;
  unitName: string;
  currentQty: number;
  costPrice: number;
  salePrice: number;
  totalCostValue: number;
  totalSaleValue: number;
}

export interface InventoryStockParams {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

// ─── Customer Statement ────────────────────────────────────────
export interface StatementItem {
  date: string;
  type: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CustomerStatementParams {
  customerId: number | string;
  from?: string;
  to?: string;
  type?: string; // "Sales" | "Collections"
  page?: number;
  pageSize?: number;
}

// ─── Supplier Statement ────────────────────────────────────────
export interface SupplierStatementParams {
  supplierId: number | string;
  from?: string;
  to?: string;
  type?: string; // "Purchases" | "Payments"
  page?: number;
  pageSize?: number;
}