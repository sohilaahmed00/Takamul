import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsPrepared } from "../services/products";
import type { GetAllProductPreparedResponse } from "../types/products.types";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

type Params = {
  page: number;
  limit: number;
  SearchTerm?: string;
};

type QueryOptions = Omit<UseQueryOptions<GetAllProductPreparedResponse>, "queryKey" | "queryFn">;

export const useGetAllProductsPrepared = ({ page, limit, SearchTerm }: Params, options?: QueryOptions) =>
  useQuery<GetAllProductPreparedResponse>({
    queryKey: productsKeys.prepared({ page, limit, SearchTerm }),
    queryFn: async () => {
      try {
        return await getAllProductsPrepared(page, limit, SearchTerm);
      } catch (err) {
        handleEmptyResponse(err, { page, limit });
      }
    },
    placeholderData: keepPreviousData,

    ...options,
  });
