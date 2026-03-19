import { useQuery } from "@tanstack/react-query";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { getStockInventoryOptions } from "../services/stockInventoryService";

export function useGetStockInventory(params: {
  pageNumber: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery({
    queryKey: quantityAdjustmentKeys.stockInventoryList(
      params.pageNumber,
      params.pageSize,
      params.search
    ),
    queryFn: () => getStockInventoryOptions(params),
    placeholderData: (previousData) => previousData,
  });
}