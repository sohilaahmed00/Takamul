export interface GiftCard {
  id: number;
  code: string;
  initialAmount: number;
  remainingAmount: number;
  customerId: number | null;
  createdAt: string;
  expiryDate: string | null;
  isDeleted: boolean;
  notes: string | null;
  customer?: { id: number; customerName: string } | null;
  isActive: boolean;
  createdByName?: string;
}

export interface GiftCardRow {
  id: number;
  cardNumber: string;
  value: number;
  balance: number;
  dataEntry: string;
  notes: string;
  customer: string;
  customerId: number | '';
  expiryDate: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateGiftCardPayload {
  code: string;
  initialAmount: number;
  remainingAmount: number;
  customerId: number | null;
  expiryDate: string | null;
  notes: string;
  isActive: boolean;
}

export interface UpdateGiftCardPayload extends CreateGiftCardPayload {
  id: number;
}

export type GiftCardApi = GiftCard;
