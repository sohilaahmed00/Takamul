import type { PaginationMeta } from "@/types";

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
  balance?: number;

}
export interface createCustomer {
  customerName: string;
  phone: string;
  mobile?: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
}

export interface GetAllCustomersResponse extends PaginationMeta {
  items: Customer[];
}
