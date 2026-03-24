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

export type GetAllSalesOrderResponse = {
  items: SalesOrder[];
};
