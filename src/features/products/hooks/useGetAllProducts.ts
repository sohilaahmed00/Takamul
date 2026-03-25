import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProducts, getAllProductsDirect } from "../services/products";
import type { GetAllProductsResponse } from "../types/products.types";

export const useGetAllProducts = ({ page, limit, SearchTerm }: { page: number; limit: number; SearchTerm?: string }) =>
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
  });
