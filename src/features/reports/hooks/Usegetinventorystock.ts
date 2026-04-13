import { useQuery } from "@tanstack/react-query";
import { getInventoryStock } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { InventoryStockParams } from "../types/reports.types";

export const useGetInventoryStock = (params: InventoryStockParams) => {
  return useQuery({
    queryKey: reportsKeys.inventoryStock(params),
    queryFn: () => getInventoryStock(params),
    enabled: !!(params.from && params.to),
    select: (data) => data.items ?? [],
  });
};