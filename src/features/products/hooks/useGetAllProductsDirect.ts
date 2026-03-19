import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsDirect } from "../services/products";
import type { GetAllProductDirectResponse } from "../types/products.types";

export const useGetAllProductsDirect = () =>
  useQuery<GetAllProductDirectResponse>({
    queryKey: productsKeys.list(),
    queryFn: () => getAllProductsDirect(),
  });
