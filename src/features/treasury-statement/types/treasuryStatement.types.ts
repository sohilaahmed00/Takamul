export interface TreasuryStatementItem {
  date: string;
  type: string;
  number: string;
  debit: number;
  credit: number;
  balance: number;
  partyName: string;
  paymentMethod: string | null;
}

export interface TreasuryStatementQuery {
  treasuryId: number;
  from?: string;
  to?: string;
}