import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import { getAllSalesOrders } from "../services/sales";
import type { GetAllSalesOrderResponse } from "../types/sales.types";

export const useGetAllSales = (page: number, limit: number) =>
  useQuery<GetAllSalesOrderResponse>({
    queryKey: salesKeys.list({ page, limit }),
    queryFn: () => getAllSalesOrders(page, limit),
    placeholderData: keepPreviousData,
  });
