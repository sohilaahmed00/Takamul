export type Revenue = {
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

export type CreateRevenuePayload = {
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId?: number | null;
  itemId?: number | null;
};

export type UpdateRevenuePayload = {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId?: number | null;
  itemId?: number | null;
};