export interface Tax {
  id: number;
  name: string;
  amount: number;
}
export interface createSupplier {
  supplierName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxNumber: string;
  paymentTerms?: number;
}

export type GetAllTaxesResponse = Tax[];
