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
  cityName: string | null;
  cityId: number | null;

  state: string | null;
  stateName: string | null;
  stateId: number | null;
  
  district: string | null;
  street: string | null;

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
  buildingNumber: string;
  additionalNumber: string;
  commercialRegister: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
  cityId: number | null;
  stateId: number | null;
  countryId: number | null;
  address: string;
  district: string;
  street: string;
}

export interface GetAllCustomersResponse extends PaginationMeta {
  items: Customer[];
}
