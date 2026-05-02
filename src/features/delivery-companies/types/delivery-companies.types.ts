import { ApiResponse, Paginated } from "@/types";

export interface DeliveryCompany {
  id: number;
  name: string;
}

export interface CreateDeliveryCompany {
  name: string;
}

export interface GetAllDeliveryCompaniesResponse extends ApiResponse<Paginated<DeliveryCompany[]>> {}
