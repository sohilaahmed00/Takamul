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
  cityName?: string | null;
  state?: string | null;
  stateName?: string | null;
  country?: string | null;
  postalCode?: string | null;
  commercialRegister?: string | null;
  taxNumber?: string | null;
  paymentTerms: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  balance: number;
  cityId: number | null;
  stateId: number | null;
  countryId: number | null;
  district?: string | null;
  street?: string | null;
}
export interface createSupplier {
  supplierName: string;
  email?: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxNumber: string;
  paymentTerms?: number;
  buildingNumber: string;
  additionalNumber: string;
  commercialRegister: string;
  cityId: number | null;
  stateId: number | null;
  countryId: number | null;
  address: string;
  district: string;
  street: string;
}

export interface GetAllSuppliersResponse extends PaginationMeta {
  items: Supplier[];
}
