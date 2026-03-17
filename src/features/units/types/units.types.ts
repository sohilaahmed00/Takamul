export interface Unit {
  id: number;
  name: string;
  description?: string;
}

export interface UnitsResponse {
  data: Unit[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
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
  id: number;
  name: string;
  description?: string;
}