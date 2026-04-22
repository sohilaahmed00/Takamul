import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsBranched } from "../services/products";
import type { GetAllProductBranchedResponse } from "../types/products.types";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

type Params = {
  page: number;
  limit: number;
  SearchTerm?: string;
};

type QueryOptions = Omit<UseQueryOptions<GetAllProductBranchedResponse>, "queryKey" | "queryFn">;

export const useGetAllProductsBranched = ({ page, limit, SearchTerm }: Params, options?: QueryOptions) =>
  useQuery<GetAllProductBranchedResponse>({
    queryKey: productsKeys.branch({ page, limit, SearchTerm }),
    queryFn: async () => {
      try {
        return await getAllProductsBranched(page, limit, SearchTerm);
      } catch (err) {
        return handleEmptyResponse(err, { page, limit });
      }
    },
    placeholderData: keepPreviousData,

    ...options,
  });
