import { PaginationMeta } from "@/types";

export interface GiftCard {
  id: number;
  code: string;
  initialAmount: number;
  remainingAmount: number;
  customerName: string;
  createdAt: string;
  expiryDate: string | null;
  isDeleted: boolean;
  notes: string | null;
  isActive: boolean;
  createdByName?: string;
  customerId: number;
}
export interface CreateGiftCardPayload {
  code: string;
  amount: number;
  customerId: number | null;
  expiryDate: string | null;
  notes: string;
}

export interface getAllGiftCardsResponse extends PaginationMeta {
  items: GiftCard[];
}

export interface UpdateGiftCardPayload extends Omit<CreateGiftCardPayload, "amount"> {
  id: number;
  initialAmount: number;
}

export type GiftCardApi = GiftCard;
