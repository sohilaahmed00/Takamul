export interface CategoryDiscount {
  id: number;
  categoryId: number;
  categoryNameAr: string;
  discountValue: number;
  discountType: "Percentage" | "FixedAmount";
  discountTypeLabel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCategoryDiscountRequest {
  categoryId: number;
  discountValue: number;
  discountType: "Percentage" | "FixedAmount";
}

export interface UpdateCategoryDiscountRequest {
  categoryId: number;
  discountValue: number;
  discountType: "Percentage" | "FixedAmount";
}

export interface CategoryDiscountResponse {
  items: CategoryDiscount[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
