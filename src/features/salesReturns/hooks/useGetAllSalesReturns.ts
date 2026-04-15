import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import { getAllSalesOrders } from "../services/sales";
import type { GetAllSalesOrderResponse } from "../types/sales.types";

export const useGetAllSalesReturns = ({ page, limit, OrderType }: { page: number; limit: number; OrderType?: "POS" | "A4" }) =>
  useQuery<GetAllSalesOrderResponse>({
    queryKey: salesKeys.list({ page, limit, OrderType }),
    queryFn: () => getAllSalesOrders({ page, limit, OrderType }),
    placeholderData: keepPreviousData,
  });
