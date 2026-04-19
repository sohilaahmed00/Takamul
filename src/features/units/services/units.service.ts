import { httpClient } from "@/api/httpClient";
import type { CreateUnitPayload, GetAllUnitsParams, UpdateUnitPayload, Unit, UnitsResponse } from "../types/units.types";

const BASE_URL = "/UnitOfMeasure";

export const getAllUnits = async (params?: GetAllUnitsParams): Promise<UnitsResponse> => {
  const response = await httpClient<UnitsResponse>(BASE_URL, {
    method: "GET",
    params: {
      PageNumber: params?.page,
      PageSize: params?.size,
    },
  });

  return response;
};

export const getUnitById = async (id: number): Promise<Unit> => {
  return httpClient<Unit>(`${BASE_URL}/${id}`, {
    method: "GET",
  });
};

export const createUnit = async (payload: CreateUnitPayload) => {
  return httpClient<{ message: string }>(BASE_URL, {
    method: "POST",
    data: {
      name: payload.name,
      description: payload.description ?? "",
    },
  });
};

export const updateUnit = async ({ id, data }: { id: number; data: UpdateUnitPayload }) => {
  return httpClient<{ message: string }>(BASE_URL, {
    method: "PUT",
    params: {
      id: id,
    },
    data: {
      name: data.name,
      description: data.description ?? "",
    },
  });
};

export const deleteUnit = async (id: number): Promise<unknown> => {
  return httpClient(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
