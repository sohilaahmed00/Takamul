import type { PaginationMeta } from "@/types";

export interface OrderItem {
  originalItemId: number;
  productId: number;
  unitId: number;
  quantity: number;
}

export interface CreateSalesReturns {
  salesOrderId: number;
  warehouseId: number;
  returnDate: string;
  reason: string;
  refundMethod: string;
  treasuryId: number;
  items: OrderItem[];
}

// export interface GetAllSalesOrderResponse extends PaginationMeta {
//   items: SalesOrder[];
// }
