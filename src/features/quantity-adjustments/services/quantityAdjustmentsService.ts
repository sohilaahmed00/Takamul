import { httpClient } from "@/api/httpClient";
import type {
  CreateQuantityAdjustmentPayload,
  QuantityAdjustment,
  QuantityAdjustmentListResponse,
  UpdateQuantityAdjustmentPayload,
} from "../types/adjustments.types";

type RawPaginatedResponse<T> = {
  data?: T[];
  items?: T[];
  totalCount?: number;
  totalItems?: number;
  pageNumber?: number;
  pageIndex?: number;
  pageSize?: number;
  totalPages?: number;
};

function normalizePaginatedResponse<T>(
  response: RawPaginatedResponse<T> | T[]
): {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
} {
  if (Array.isArray(response)) {
    return {
      data: response,
      totalCount: response.length,
      pageNumber: 1,
      pageSize: response.length,
      totalPages: 1,
    };
  }

  const data = response.data ?? response.items ?? [];
  const totalCount = response.totalCount ?? response.totalItems ?? data.length;
  const pageNumber = response.pageNumber ?? response.pageIndex ?? 1;
  const pageSize = response.pageSize ?? data.length;
  const totalPages =
    response.totalPages ??
    (pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1);

  return { data, totalCount, pageNumber, pageSize, totalPages };
}

export async function getQuantityAdjustments(params: {
  pageNumber: number;
  pageSize: number;
}): Promise<QuantityAdjustmentListResponse> {
  const response = await httpClient<
    RawPaginatedResponse<QuantityAdjustment> | QuantityAdjustment[]
  >("/StockInventory/bulk-adjustments", {
    method: "GET",
    params: { page: params.pageNumber, pageSize: params.pageSize },
  });

  return normalizePaginatedResponse(response);
}

export async function getQuantityAdjustmentById(
  id: number
): Promise<QuantityAdjustment> {
  const response = await httpClient<
    RawPaginatedResponse<QuantityAdjustment> | QuantityAdjustment[]
  >("/StockInventory/bulk-adjustments", {
    method: "GET",
    params: { page: 1, pageSize: 1000 },
  });

  const normalized = normalizePaginatedResponse(response);
  const found = normalized.data.find((item) => Number(item.id) === Number(id));

  if (!found) throw new Error("لم يتم العثور على حركة التعديل");
  return found;
}

export async function createQuantityAdjustment(
  payload: CreateQuantityAdjustmentPayload
): Promise<any> {
  // ✅ POST /StockInventory/bulk-adjust
  return await httpClient<any>("/StockInventory/bulk-adjust", {
    method: "POST",
    data: payload,
  });
}

export async function updateQuantityAdjustment(
  id: number,
  payload: UpdateQuantityAdjustmentPayload
): Promise<any> {
  // ✅ PUT /StockInventory/{id}
  return await httpClient<any>(`/StockInventory/${id}`, {
    method: "PUT",
    data: payload,
  });
}