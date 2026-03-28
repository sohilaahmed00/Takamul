import type { PaginationMeta } from "@/types";

export interface Purchase {
  id: number;
  purchaseOrderNumber: string;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  orderStatus: "UnConfirmed" | "Confirmed";

  items: {
    productId: number;
    unitId: number;
    quantity: number;
    unitPrice: number;
  }[];
}
export type CreatePurchaseOrder = {
  orderDate: string;
  warehouseId: number;
  notes: string;
  items: {
    productId: number;
    unitId: number;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    discountValue: number;
  }[];
};

export interface GetAllPurchasesResponse extends PaginationMeta {
  items: Purchase[];
}
