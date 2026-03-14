import { useQuery } from "@tanstack/react-query";
import type { GetAllSalesOrderResponse } from "../types/categories.types";
import { salesKeys } from "../keys/sales.keys";
import { getAllSalesOrders } from "../services/categories";

export const useGetAllSales = () =>
  useQuery<GetAllSalesOrderResponse>({
    queryKey: salesKeys.list(),
    queryFn: () => getAllSalesOrders(),
  });
