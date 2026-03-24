import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types/products.types";
import { productsKeys } from "../keys/products.keys";
import { getProductById } from "../services/products";

export const useGetProductById = (id?: number) =>
  useQuery<Product>({
    queryKey: productsKeys.detail(id as number),
    queryFn: () => getProductById(id as number),
    enabled: !!id,
  });
