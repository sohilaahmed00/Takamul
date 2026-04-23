import type { PaginationMeta } from "@/types";

export interface Customer {
  id: number;
  customerCode: number;
  customerName: string;
  phone: string | null;
  mobile: string | null;
  address: string;
  buildingNumber: string | null;
  additionalNumber: string | null;
  commercialRegister: string | null;
  city: string;
  state: string;
  postalCode: string | null;
  taxNumber: string | null;
  isActive: boolean;
  createdAt: string;
  balance: number;
}
export interface createCustomer {
  customerName: string;
  phone: string;
  mobile?: string;
  buildingNumber: string;
  additionalNumber: string;
  commercialRegister: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
}

export interface GetAllCustomersResponse extends PaginationMeta {
  items: Customer[];
}
