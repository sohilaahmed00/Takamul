import type { PaginationMeta } from "@/types";

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
  items: {
    productId: number;
    unitId: number;
    quantity: number;
    discountPercentage: number;
    discountValue: number;
  }[];
  payments: {
    amount: number;
    paymentMethod: "Cash" | "Visa" | "CreditCard" | "DebitCard" | "BankTransfer" | "Check" | "MobilePayment" | "OnlinePayment" | "Other";
    notes: string;
  }[];
}
export type CreateTakeawayOrder = {
  customerId: number;
  warehouseId: number;
  notes: string;
  globalDiscountPercentage: number;
  globalDiscountValue: number;
  giftCardId: number | null;
  items: {
    productId: number;
    quantity: number;
    discountPercentage: number;
    discountValue: number;
  }[];
  payments: {
    amount: number;
    treasuryId: number;
    paymentMethod?: "Cash";
    notes: string;
  }[];
  additionIds: number[];
};

export type CreateDeliveryOrder = CreateTakeawayOrder;
export interface GetAllSalesOrderResponse extends PaginationMeta {
  items: SalesOrder[];
}
