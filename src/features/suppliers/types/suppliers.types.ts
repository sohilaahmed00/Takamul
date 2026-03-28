export interface Supplier {
  id: number;
  supplierCode: number;
  supplierName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
  paymentTerms: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  balance?: number;
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

export type GetAllSuppliersResponse = Supplier[];
