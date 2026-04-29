import type { PaginationMeta } from "@/types";

export interface StockInventoryOption {
  id: number;
  productId?: number;
  productName: string;
  barcode: number;
  warehouseId?: number;
  warehouseName?: string;
  quantityAvailable?: number;
  lastUpdated?: string;
}

export interface StockInventoryListResponse extends PaginationMeta {
  items: StockInventoryOption[];
}
