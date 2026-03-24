import { useQuery } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import { getAllSalesOrders } from "../services/sales";
import type { GetAllSalesOrderResponse } from "../types/sales.types";

export const useGetAllSales = () =>
  useQuery<GetAllSalesOrderResponse>({
    queryKey: salesKeys.list(),
    queryFn: () => getAllSalesOrders(),
  });
