import type { PaginationMeta } from "@/types";

export interface Supplier {
  id: number;
  supplierCode?: number | null;
  supplierName: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  address?: string | null;
  streetName: string;
  buildingNumber?: string | null;
  additionalNumber?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  commercialRegister?: string | null;
  taxNumber?: string | null;
  paymentTerms: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  balance: number;
  cityId: number;
  stateId: number;
  countryId: number;
}
export interface createSupplier {
  supplierName: string;
  email?: string;
  phone: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxNumber: string;
  paymentTerms?: number;
  buildingNumber: string;
  additionalNumber: string;
  commercialRegister: string;
  cityId: number;
  stateId: number;
  countryId: number;
}

export interface GetAllSuppliersResponse extends PaginationMeta {
  items: Supplier[];
}
