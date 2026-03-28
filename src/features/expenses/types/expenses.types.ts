export type Expense = {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId?: number | null;
  treasuryName?: string | null;
  itemId?: number | null;
  itemName?: string | null;
  createdBy?: string;
  createdAt?: string;
};

export type ExpensesListResponse = {
  items: Expense[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type CreateExpensePayload = {
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId?: number | null;
  itemId?: number | null;
};

export type UpdateExpensePayload = {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId?: number | null;
  itemId?: number | null;
};
