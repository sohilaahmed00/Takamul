import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Product, ProductBranch, ProductDirect, ProductRawMatrial } from "../types/products.types";
import { productsKeys } from "../keys/products.keys";
import { getProductBranchedById, getProductById, getProductDirectById, getProductRawMaterialById } from "../services/products";

type QueryOptions = Omit<UseQueryOptions<ProductRawMatrial>, "queryKey" | "queryFn">;
export const useGetProductRawMaterialtById = (id: number, options?: QueryOptions) =>
  useQuery<ProductRawMatrial>({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProductRawMaterialById(id),
    enabled: options?.enabled ?? !!id,
    ...options,
  });
