export interface StockInventoryOption {
  id: number;
  productId?: number;
  productName: string;
  warehouseId?: number;
  warehouseName?: string;
  quantityAvailable?: number;
  lastUpdated?: string;
  displayName?: string;
}

export interface StockInventoryListResponse {
  data: StockInventoryOption[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}