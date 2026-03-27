import type { PaginationMeta } from "@/types";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId: number;
  treasuryName: string;
  createdBy: string;
  createdAt: string;
};
export type CreateSalesOrder = {
  customerId: number;
  orderDate: string;
  warehouseId: number;
  notes: string;
  description: string;
  globalDiscountPercentage: number;
  globalDiscountValue: number;
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
};

export interface GetAllExpenseResponse extends PaginationMeta {
  items: Expense[];
}
