import { httpClient } from "@/api/httpClient";
import type { CreateQuantityAdjustmentPayload, QuantityAdjustment, QuantityAdjustmentListResponse, UpdateQuantityAdjustmentPayload } from "../types/adjustments.types";

export async function getQuantityAdjustments(params: { pageNumber: number; pageSize: number }): Promise<QuantityAdjustmentListResponse> {
  const response = await httpClient<QuantityAdjustmentListResponse>("/StockInventory/bulk-adjustments", {
    method: "GET",
    params: { page: params.pageNumber, pageSize: params.pageSize },
  });

  return response;
}

export async function getQuantityAdjustmentById(id: number): Promise<QuantityAdjustment> {
  const response = await httpClient<QuantityAdjustment>(`/StockInventory/${id}`, {
    method: "GET",
    params: { page: 1, pageSize: 1000 },
  });

  return response;
}

export async function createQuantityAdjustment(payload: CreateQuantityAdjustmentPayload) {
  return await httpClient<{ message: string }>("/StockInventory/bulk-adjust", {
    method: "POST",
    data: payload,
  });
}

export async function updateQuantityAdjustment(id: number, payload: UpdateQuantityAdjustmentPayload): Promise<any> {
  // ✅ PUT /StockInventory/{id}
  return await httpClient<any>(`/StockInventory/${id}`, {
    method: "PUT",
    data: payload,
  });
}
