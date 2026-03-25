import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProducts } from "../services/products";
import type { GetAllProductsResponse } from "../types/products.types";

type Params = {
  page: number;
  limit: number;
  SearchTerm?: string;
};

type QueryOptions = Omit<UseQueryOptions<GetAllProductsResponse>, "queryKey" | "queryFn">;

export const useGetAllProducts = ({ page, limit, SearchTerm }: Params, options?: QueryOptions) =>
  useQuery<GetAllProductsResponse>({
    queryKey: productsKeys.list({ page, limit, SearchTerm }),
    queryFn: async () => {
      try {
        return await getAllProducts(page, limit, SearchTerm);
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
