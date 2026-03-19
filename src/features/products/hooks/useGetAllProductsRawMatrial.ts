import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsRawMatrial } from "../services/products";
import type { GetAllProductRawMatrialResponse } from "../types/products.types";

export const useGetAllProductsRawMatrial = () =>
  useQuery<GetAllProductRawMatrialResponse>({
    queryKey: productsKeys.rawMatrial(),
    queryFn: () => getAllProductsRawMatrial(),
  });
