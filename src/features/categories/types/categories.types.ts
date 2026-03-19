export interface Category {
  id: number;
  categoryNameAr: string;
  categoryNameEn: string;
  categoryNameUr: string;
  description: string;
  parentCategoryId: number | null;
  isActive: number;
  imageUrl: string;
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

export type GetAllCategoriesResponse = Category[];
