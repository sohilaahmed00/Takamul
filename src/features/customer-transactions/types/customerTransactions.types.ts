export type CustomerTransaction = {
  id: number;
  customerId: number;
  customerName: string;
  treasuryId: number;
  treasuryName: string;
  transactionDate: string;
  amount: number;
  description: string;
  createdAt: string;
};

export type CreateCustomerTransactionPayload = {
  customerId: number;
  treasuryId: number;
  transactionDate: string;
  amount: number;
  description: string;
};

export type UpdateCustomerTransactionPayload = {
  id: number;
  treasuryId: number;
  transactionDate: string;
  amount: number;
  description: string;
};

export type CustomerPaymentRow = CustomerTransaction;