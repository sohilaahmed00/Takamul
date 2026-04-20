import type { PaginationMeta } from "@/types";

export interface OrderItem {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  unitId: number;
  quantity: number;
  unitPrice: number;
  priceBeforeTax: number;
  taxPercentage: number;
  taxAmount: number;
  discountPercentage: number;
  discountValue: number;
  lineTotal: number;
  taxCalculation: number;
}

export interface OrderPayment {
  id: number;
  paymentNumber: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes: string;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerId: number;
  createdBy: string;
  orderDate: string;
  warehouseName: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  orderStatus: "Confirmed" | "UnConfirmed" | "InProgress" | "Canceled";
  paymentStatus: string;
  notes: string;
  items: OrderItem[];
  payments: OrderPayment[];
}

export type CreateSalesOrder = {
  customerId: number;
  orderDate: string;
  warehouseId: number;
  notes: string;
  description: string;
  globalDiscountPercentage: number;
  globalDiscountValue: number;
  items: {
    productId: number;
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

export interface GetAllSalesOrderResponse extends PaginationMeta {
  items: SalesOrder[];
}
