import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProducts, getAllProductsDirect } from "../services/products";
import type { GetAllProductsResponse } from "../types/products.types";

export const useGetAllProducts = () =>
  useQuery<GetAllProductsResponse>({
    queryKey: productsKeys.list(),
    queryFn: () => getAllProducts(),
  });
