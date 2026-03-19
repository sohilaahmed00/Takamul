export type QuantityAdjustmentOperationType = "Add" | "Remove";

export interface QuantityAdjustmentRow {
  stockInventoryId: number;
  productId?: number;
  productName: string;
  warehouseId?: number | null;
  warehouseName?: string;
  quantityAvailable: number;
  operationType: QuantityAdjustmentOperationType;
  quantityChanged: number;
}

export interface QuantityAdjustmentApiItem {
  id?: number;
  stockInventoryId?: number;
  productName?: string;
  warehouseId?: number | null;
  quantity?: number;
  operationType: QuantityAdjustmentOperationType | string | number;
  quantityChanged: number;
  notes?: string | null;
  operationDate?: string;
}

export interface QuantityAdjustment {
  id: number;
  notes?: string;
  performedBy?: string;
  operationDate?: string;
  items: QuantityAdjustmentApiItem[];
}

export interface QuantityAdjustmentListResponse {
  data: QuantityAdjustment[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}

export interface CreateQuantityAdjustmentPayload {
  notes?: string;
  items: {
    stockInventoryId: number;
    operationType: QuantityAdjustmentOperationType;
    quantity: number;
    notes?: string;
  }[];
}

export interface UpdateQuantityAdjustmentPayload {
  notes?: string;
  items: {
    stockInventoryId: number;
    operationType: QuantityAdjustmentOperationType;
    quantity: number;
    notes?: string;
  }[];
}