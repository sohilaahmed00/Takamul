export interface Branch {
  id: number;
  code: string;
  name: string;
  imageUrl: string | null;
  businessName: string | null;
  commercialRegister: string | null;
  taxNumber: string | null;
  footerNote: string | null;
  email: string | null;
  phone: string | null;
  countryId: number | null;
  cityId: number | null;
  stateId: number | null;
  street: string | null;
  buildingNumber: string | null;
  subNumber: string | null;
  postalCode: string | null;
  isActive: boolean;
}

export interface BranchListItem {
  id: number;
  code: string;
  name: string;
  phone: string | null;
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
  email?: string;
  phone?: string;
  countryId?: number | null;
  cityId?: number | null;
  stateId?: number | null;
  street?: string;
  buildingNumber?: string;
  subNumber?: string;
  postalCode?: string;
}

export interface UpdateBranchPayload extends CreateBranchPayload {
  isActive?: boolean;
}