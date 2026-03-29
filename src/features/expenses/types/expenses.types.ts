<<<<<<< HEAD
export interface Expense {
=======
import type { PaginationMeta } from "@/types";

export type Expense = {
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
  id: number;
  name: string;
  amount: number;
  date: string;
<<<<<<< HEAD
  notes: string | null;
  createdBy: string;
  createdAt: string;
  treasuryId: number | null;
  treasuryName: string | null;
  itemId: number | null;
  itemName: string | null;
}

export interface ExpensesResponse {
  items: Expense[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export type ExpensesListResponse = ExpensesResponse;

export interface GetExpensesParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface CreateExpensePayload {
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId: number;
  itemId?: number | null;
}

export interface UpdateExpensePayload {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId: number;
  itemId?: number | null;
}
=======
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
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
