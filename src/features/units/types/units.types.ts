import type { PaginationMeta } from "@/types";

export interface Unit {
  id: number;
  name: string;
  description?: string;
}

export interface UnitsResponse extends PaginationMeta {
  items: Unit[];
}

export interface GetAllUnitsParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface CreateUnitPayload {
  name: string;
  description?: string;
}

export interface UpdateUnitPayload {
  id?: number;
  name: string;
  description?: string;
}
