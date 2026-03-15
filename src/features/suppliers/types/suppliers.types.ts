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
}
export interface createSupplier {
  supplierName: number;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  coutry: string;
  postalCode: string;
  taxNumber: string;
  paymentTerms: string;
}

export type GetAllSuppliersResponse = Supplier[];
