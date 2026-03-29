export interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
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