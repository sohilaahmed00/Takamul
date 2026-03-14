import type { PaginationMeta } from "@/types/common";

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  warehouseName: string;
  orderDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  orderStatus: "UnConfirmed" | "Confirmed";
}
export type CreateCategory = {
  name: string;
  description: string;
};

export type GetAllSalesOrderResponse = SalesOrder[];
