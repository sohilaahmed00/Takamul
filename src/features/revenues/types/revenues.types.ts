export interface Revenue {
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

export interface CreateRevenuePayload {
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId: number;
  itemId?: number | null;
}

// ✅ PUT يقبل كل الحقول زي الـ POST
export interface UpdateRevenuePayload {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId: number;
  itemId?: number | null;
}