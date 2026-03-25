import { useQuery } from "@tanstack/react-query";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { getStockInventoryOptions } from "../services/stockInventoryService";
import type { StockInventoryListResponse } from "../types/stock.types";

export function useGetStockInventory(params: { pageNumber: number; pageSize: number; search?: string }) {
  return useQuery<StockInventoryListResponse>({
    queryKey: quantityAdjustmentKeys.stockInventoryList(params.pageNumber, params.pageSize, params.search),
    queryFn: () => getStockInventoryOptions(params),
    placeholderData: (previousData) => previousData,
  });
}
