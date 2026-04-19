import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { getStockInventoryOptions } from "../services/stockInventoryService";
import type { StockInventoryListResponse } from "../types/stock.types";

type QueryOptions = Omit<UseQueryOptions<StockInventoryListResponse>, "queryKey" | "queryFn">;
export function useGetStockInventory(params: { pageNumber: number; pageSize: number; search?: string }, options?: QueryOptions) {
  return useQuery<StockInventoryListResponse>({
    queryKey: quantityAdjustmentKeys.stockInventoryList({ pageNumber: params.pageNumber, pageSize: params.pageSize, searchTerm: params.search }),
    queryFn: () => getStockInventoryOptions(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
}
