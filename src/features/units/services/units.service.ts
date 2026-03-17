import { httpClient } from "@/api/httpClient";
import type {
  CreateUnitPayload,
  GetAllUnitsParams,
  UpdateUnitPayload,
  Unit,
  UnitsResponse,
} from "../types/units.types";

const BASE_URL = "/UnitOfMeasure";

export const getAllUnits = async (
  params?: GetAllUnitsParams
): Promise<UnitsResponse> => {
  const response = await httpClient<any>(BASE_URL, {
    method: "GET",
    params: {
      PageNumber: params?.page ?? 1,
      PageSize: params?.size ?? 10,
    },
  });

  const serverData = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response)
        ? response
        : [];

  return {
    data: serverData,
    totalCount: response?.totalCount ?? serverData.length,
    pageNumber: response?.pageNumber ?? params?.page ?? 1,
    pageSize: response?.pageSize ?? params?.size ?? 10,
  };
};

export const getUnitById = async (id: number): Promise<Unit> => {
  return httpClient<Unit>(`${BASE_URL}/${id}`, {
    method: "GET",
  });
};

export const createUnit = async (
  payload: CreateUnitPayload
): Promise<unknown> => {
  return httpClient(BASE_URL, {
    method: "POST",
    data: {
      name: payload.name,
      description: payload.description ?? "",
    },
  });
};

export const updateUnit = async (
  payload: UpdateUnitPayload
): Promise<unknown> => {
  return httpClient(BASE_URL, {
    method: "PUT",
    params: {
      id: payload.id,
    },
    data: {
      id: payload.id,
      name: payload.name,
      description: payload.description ?? "",
    },
  });
};

export const deleteUnit = async (id: number): Promise<unknown> => {
  return httpClient(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};