import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsDirect } from "../services/products";
import type { GetAllProductDirectResponse } from "../types/products.types";

type Params = {
  page: number;
  limit: number;
  SearchTerm?: string;
};

type QueryOptions = Omit<UseQueryOptions<GetAllProductDirectResponse>, "queryKey" | "queryFn">;

export const useGetAllProductsDirect = ({ page, limit, SearchTerm }: Params, options?: QueryOptions) =>
  useQuery<GetAllProductDirectResponse>({
    queryKey: productsKeys.direct({ page, limit, SearchTerm }),
    queryFn: async () => {
      try {
        return await getAllProductsDirect(page, limit, SearchTerm);
      } catch (err) {
        if (typeof err === "string" && err.includes("لا يوجد")) {
          return {
            items: [],
            totalCount: 0,
            pageNumber: page,
            pageSize: limit,
          };
        }
        throw err;
      }
    },
        placeholderData: keepPreviousData,

    ...options,
  });
