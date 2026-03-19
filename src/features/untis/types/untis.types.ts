export interface Unit {
  id: number;
  name: string;
  description: string;
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

export type GetAllUnitsResponse = {
  items: Unit[];
};
