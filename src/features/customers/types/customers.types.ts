
export interface Customer {
  id: number;
  customerCode: number;
  customerName: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
  isActive: boolean;
  createdAt: string;
}
export interface createCustomer {
  customerName: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
}

export type GetAllCustomersResponse = Customer[];
