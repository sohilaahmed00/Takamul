import { PaginationMeta } from "@/types";

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
}

export interface CreateCurrency {
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
}

export type UpdateCurrency = CreateCurrency;

export interface GetAllCurrenciesResponse {
  success: boolean;
  message: string;
  data: {
    items: Currency[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  errors: string[] | null;
}
