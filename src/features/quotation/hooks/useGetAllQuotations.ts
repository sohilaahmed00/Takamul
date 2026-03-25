import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetAllQuotationsResponse } from "../types/quotations.types";
import { getAllQuotations } from "../services/quotations";
import { quotationsKeys } from "../keys/quotations.keys";

export const useGetAllQuotations = (page?: number, limit?: number) =>
  useQuery<GetAllQuotationsResponse>({
    queryKey: quotationsKeys.list({}),
    queryFn: () => getAllQuotations(page, limit),
    placeholderData: keepPreviousData,
  });
