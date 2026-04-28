import type { PaginationMeta } from "@/types";

export interface Customer {
  id: number;
  customerCode: number;
  customerName: string;

  phone: string;
  mobile: string;

  address: string | null;
  buildingNumber: string | null;
  additionalNumber: string | null;

  city: string | null;
  cityId: number | null;

  state: string | null;
  stateId: number | null;

  countryName: string | null;
  countryId: number | null;

  postalCode: string | null;

  commercialRegister: string | null;
  taxNumber: string | null;

  balance: number;
  isActive: boolean;

  createdAt: string;
  
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
  cityId: number;
  stateId: number;
  countryId: number;
}

export interface GetAllCustomersResponse extends PaginationMeta {
  items: Customer[];
}
