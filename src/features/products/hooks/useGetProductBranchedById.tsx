import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Product, ProductBranch } from "../types/products.types";
import { productsKeys } from "../keys/products.keys";
import { getProductBranchedById, getProductById } from "../services/products";

type QueryOptions = Omit<UseQueryOptions<ProductBranch>, "queryKey" | "queryFn">;
export const useGetProductBranchedById = (id?: number, options?: QueryOptions) =>
  useQuery<ProductBranch>({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProductBranchedById(id),
    enabled: options?.enabled ?? !!id,
    ...options,
  });
