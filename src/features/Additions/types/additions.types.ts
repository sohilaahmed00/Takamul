export interface Addition {
  id: number;
  additionNameAr: string | null;
  additionNameEn: string | null;
  additionNameUr: string | null;
  categoryNameUr: string | null;
  isActive: number;
  createdAt: string;
}
export interface createAddition {
  additionNameAr: string;
  additionNameEn: string;
  additionNameUr: string;
}

export type GetAllAdditionsResponse = Addition[];
