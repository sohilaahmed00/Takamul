import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsDirect } from "../services/products";
import type { GetAllProductDirectResponse } from "../types/products.types";

export const useGetAllProductsDirect = ({ page, limit, SearchTerm }: { page: number; limit: number; SearchTerm?: string }) =>
  useQuery<GetAllProductDirectResponse>({
    queryKey: productsKeys.direct({ page, limit, SearchTerm }),
    queryFn: async () => {
      try {
        return await getAllProductsDirect(page, limit, SearchTerm);
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
