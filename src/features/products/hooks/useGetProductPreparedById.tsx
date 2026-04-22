import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Product, ProductBranch, ProductDirect, ProductPrepared } from "../types/products.types";
import { productsKeys } from "../keys/products.keys";
import { getProductBranchedById, getProductById, getProductDirectById, getProductPreparedById } from "../services/products";

type QueryOptions = Omit<UseQueryOptions<ProductPrepared>, "queryKey" | "queryFn">;
export const useGetProductPreparedById = (id: number, options?: QueryOptions) =>
  useQuery<ProductPrepared>({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProductPreparedById(id),
    ...options,
    enabled: options?.enabled ?? !!id,
  });
