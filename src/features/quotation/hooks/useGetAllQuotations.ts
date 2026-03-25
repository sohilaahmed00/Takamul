import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import { getAllSalesOrders } from "../services/sales";
import type { GetAllQuotationsResponse } from "../types/quotations.types";

export const useGetAllQuotations = (page: number, limit: number) =>
  useQuery<GetAllQuotationsResponse>({
    queryKey: salesKeys.list({ page, limit }),
    queryFn: () => getAllSalesOrders(page, limit),
    placeholderData: keepPreviousData,
  });
