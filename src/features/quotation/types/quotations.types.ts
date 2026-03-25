import type { PaginationMeta } from "@/types";

export type Quotation = {
  id: number;
  quotationNumber: string;
  customerName: string;
  quotationDate: string;
  validUntil: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  status: boolean;
  items: {
    productId: number;
    productCode: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    discountAmount: number;
    taxPercentage: number;
    taxAmount: number;
    priceAfterTax: number;
    lineTotal: number;
  }[];
};
export type CreateQuotation = {
  customerId: number;
  quotationDate: string;
  validUntil: string;
  discountAmount: number;
  shippingCost: number;
  notes: string;
  globalDiscountValue: number;
  globalDiscountPercentage: number;
  items: {
    productId: number;
    unitId: number;
    taxPercentage: number;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    discountValue: number;
  }[];
};

export type GetAllQuotationsResponse = Quotation[];
