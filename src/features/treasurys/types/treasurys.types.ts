export interface Treasury {
  id: number;
  name: string;
  openingBalance: number;
  currentBalance?: number;
}

export interface CreateTreasuryPayload {
  name: string;
  openingBalance: number;
}

export interface UpdateTreasuryPayload {
  id: number;
  name: string;
  openingBalance?: number;
}

export type GetAllTreasurysResponse = Treasury[];