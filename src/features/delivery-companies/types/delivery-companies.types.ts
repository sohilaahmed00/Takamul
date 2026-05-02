export interface DeliveryCompany {
  id: number;
  name: string;
}

export interface CreateDeliveryCompany {
  name: string;
}

export type UpdateDeliveryCompany = CreateDeliveryCompany;

export interface GetAllDeliveryCompaniesResponse {
  success: boolean;
  message: string;
  data: {
    items: DeliveryCompany[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  errors: string[] | null;
}
