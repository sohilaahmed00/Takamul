import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetAllQuotationsResponse } from "../types/quotations.types";
import { getAllQuotations } from "../services/quotations";
import { quotationsKeys } from "../keys/quotations.keys";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

export const useGetAllQuotations = (page?: number, limit?: number) =>
  useQuery<GetAllQuotationsResponse>({
    queryKey: quotationsKeys.list({}),
    queryFn: async () => {
      try {
        return await getAllQuotations(page, limit);
      } catch (error) {
        console.log(error);
        handleEmptyResponse(error, { page, limit });
      }
    },
    placeholderData: keepPreviousData,
  });
