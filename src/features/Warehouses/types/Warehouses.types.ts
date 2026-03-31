// src/features/Warehouses/types/Warehouses.types.ts

export interface Warehouse {
  id: number;
  warehouseCode: string;
  warehouseName: string;
  address: string;
  isActive: boolean;
  managerId: number;
  managerName?: string;
  branchId: number;
  branchName?: string;
}

export interface CreateWarehousePayload {
  warehouseCode: string;
  warehouseName: string;
  address: string;
  managerId: number;
  branchId: number;
}

export interface UpdateWarehousePayload {
  id: number;
  warehouseName: string;
  address: string;
  city?: string;     // مطلوب في الـ PUT
  state?: string;    // مطلوب في الـ PUT
  capacity?: number; // مطلوب في الـ PUT
}