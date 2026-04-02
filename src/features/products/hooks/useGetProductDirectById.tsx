import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Product, ProductBranch, ProductDirect } from "../types/products.types";
import { productsKeys } from "../keys/products.keys";
import { getProductBranchedById, getProductById, getProductDirectById } from "../services/products";

type QueryOptions = Omit<UseQueryOptions<ProductDirect>, "queryKey" | "queryFn">;
export const useGetProductDirectById = (id: number, options?: QueryOptions) =>
  useQuery<ProductDirect>({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProductDirectById(id),
    enabled: options?.enabled ?? !!id,
    ...options,
  });
