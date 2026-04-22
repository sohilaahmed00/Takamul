import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProducts } from "../services/products";
import type { GetAllProductsResponse } from "../types/products.types";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

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
        return handleEmptyResponse(err, { page, limit });
      }
    },
    placeholderData: keepPreviousData,
    ...options,
  });
