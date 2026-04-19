import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import { getAllSalesOrders } from "../services/sales";
import type { GetAllSalesOrderResponse } from "../types/sales.types";

export const useGetAllSales = ({ page, limit, SearchTerm, OrderType }: { page: number; limit: number; SearchTerm?: string; OrderType?: "POS" | "A4" }) =>
  useQuery<GetAllSalesOrderResponse>({
    queryKey: salesKeys.list({ page, limit, OrderType, SearchTerm }),
    queryFn: () => getAllSalesOrders({ page, limit, SearchTerm, OrderType }),
    placeholderData: keepPreviousData,
  });
