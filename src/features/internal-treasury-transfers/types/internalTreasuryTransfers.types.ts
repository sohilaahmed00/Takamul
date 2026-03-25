export interface CreateInternalTreasuryTransferPayload {
  fromTreasuryId: number;
  toTreasuryId: number;
  amount: number;
  date: string;
  notes?: string;
}

export interface InternalTreasuryTransferApiItem {
  id: number;
  fromTreasuryId: number;
  fromTreasuryName: string;
  toTreasuryId: number;
  toTreasuryName: string;
  amount: number;
  date: string;
  notes?: string | null;
}

export type GetAllInternalTreasuryTransfersResponse =
  InternalTreasuryTransferApiItem[];

export interface InternalTreasuryTransferRow {
  id: number | string;
  fromTreasuryId: number;
  toTreasuryId: number;
  fromTreasuryName: string;
  toTreasuryName: string;
  amount: number;
  date: string;
  notes?: string;
}