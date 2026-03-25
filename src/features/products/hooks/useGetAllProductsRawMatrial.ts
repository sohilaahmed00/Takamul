import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsRawMatrial } from "../services/products";
import type { GetAllProductRawMatrialResponse } from "../types/products.types";

export const useGetAllProductsRawMatrial = ({ page, limit, SearchTerm }: { page: number; limit: number; SearchTerm?: string }) =>
  useQuery<GetAllProductRawMatrialResponse>({
    queryKey: productsKeys.rawMatrial({ page, limit, SearchTerm }),
    queryFn: async () => {
      try {
        return await getAllProductsRawMatrial(page, limit, SearchTerm);
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
