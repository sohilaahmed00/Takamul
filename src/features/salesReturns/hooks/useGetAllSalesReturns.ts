import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { salesReturnsKeys } from "../keys/salesReturns.keys";
import { GetAllSalesReturnResponse } from "../types/salesReturns.types";
import { getAllSalesReturnOrders } from "../services/salesReturns";

export const useGetAllSalesReturns = ({ page, limit, searchTerm }: { page: number; limit: number; searchTerm?: string }) =>
  useQuery<GetAllSalesReturnResponse>({
    queryKey: salesReturnsKeys.list({ limit, page, searchTerm }),
    queryFn: () => getAllSalesReturnOrders({ page, limit, searchTerm }),
    placeholderData: keepPreviousData,
  });
