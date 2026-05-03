export interface Branch {
  id: number;
  code: string;
  name: string;
  nameEn: string | null;
  imageUrl: string | null;
  businessName: string | null;
  commercialRegister: string | null;
  taxNumber: string | null;
  footerNote: string | null;
  phone: string | null;
  email: string | null;
  countryId: number | null;
  cityId: number | null;
  stateId: number | null;
  street: string | null;
  district: string | null;
  buildingNumber: string | null;
  subNumber: string | null;
  postalCode: string | null;
  additionalNumber: string | null;
  organizationName: string | null;
  organizationUnitName: string | null;
  locationAddress: string | null;
  industryBusinessCategory: string | null;
  isActive: boolean;
}

export interface BranchListItem {
  id: number;
  code: string;
  name: string;
  phone: string | null;
  district: string | null;
  isActive: boolean;
}

export interface CreateBranchPayload {
  code: string;
  name: string;
  imageUrl?: string;
  businessName?: string;
  commercialRegister?: string;
  taxNumber?: string;
  footerNote?: string;
  nameEn?: string;
  phone?: string;
  email?: string;
  countryId?: number | null;
  cityId?: number | null;
  stateId?: number | null;
  street?: string;
  district?: string;
  buildingNumber?: string;
  subNumber?: string;
  postalCode?: string;
  additionalNumber?: string;
  organizationName?: string;
  organizationUnitName?: string;
  locationAddress?: string;
  industryBusinessCategory?: string;
}

export interface UpdateBranchPayload extends CreateBranchPayload {
  isActive?: boolean;
}
