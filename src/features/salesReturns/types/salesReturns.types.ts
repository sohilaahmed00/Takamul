import type { PaginationMeta } from "@/types";

export interface CreateSalesReturns {
  salesOrderId: number;
  warehouseId: number;
  returnDate: string;
  reason: string;
  refundMethod: string;
  treasuryId: number;
  items: {
    originalItemId: number;
    productId: number;
    unitId: number;
    quantity: number;
  }[];
}

type SalesReturnItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountValue: number;
  taxPercentage: number;
  lineTotal: number;
  unitId: number;
  priceAfterTax: number;
};

export type SalesReturn = {
  id: number;
  returnNumber: string;
  salesOrderId: number;
  salesOrderNumber: string;
  customerId: number;
  customerName: string;
  warehouseId: number;
  warehouseName: string;
  treasuryId: number | null;
  treasuryName: string;
  returnDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  refundedAmount: number;
  priceAfterTax: number;
  returnStatus: "Approved" | "Pending" | "Rejected";
  refundStatus: "Pending" | "Completed";
  reason: string;
  createdAt: string;
  items: SalesReturnItem[];
};

export interface GetAllSalesReturnResponse extends PaginationMeta {
  items: SalesReturn[];
}
