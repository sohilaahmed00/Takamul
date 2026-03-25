import { httpClient } from "@/api/httpClient";
import type { StockInventoryListResponse, StockInventoryOption } from "../types/stock.types";

export async function getStockInventoryOptions(params: { pageNumber: number; pageSize: number }): Promise<StockInventoryListResponse> {
  const response = await httpClient<StockInventoryListResponse>("/StockInventory", {
    method: "GET",
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return response;
}
