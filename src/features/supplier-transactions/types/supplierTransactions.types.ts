export type SupplierTransaction = {
  id: number;
  supplierId: number;
  supplierName: string;
  treasuryId: number;
  treasuryName: string;
  transactionType: string;
  transactionDate: string;
  amount: number;
  description: string;
  createdAt: string;
};

export type CreateSupplierTransactionPayload = {
  supplierId: number;
  treasuryId: number;
  transactionType: string;
  transactionDate: string;
  amount: number;
  description: string;
};

export type UpdateSupplierTransactionPayload = {
  id: number;
  supplierId: number;
  treasuryId: number;
  transactionType: string;
  transactionDate: string;
  amount: number;
  description: string;
};