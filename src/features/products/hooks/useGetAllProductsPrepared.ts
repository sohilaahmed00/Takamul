import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { getAllProductsPrepared } from "../services/products";
import type { GetAllProductPreparedResponse } from "../types/products.types";

export const useGetAllProductsPrepared = ({ page, limit, SearchTerm }: { page: number; limit: number; SearchTerm?: string }) =>
  useQuery<GetAllProductPreparedResponse>({
    queryKey: productsKeys.prepared({ page, limit, SearchTerm }),
 queryFn: async () => {
      try {
        return await getAllProductsPrepared(page, limit, SearchTerm);
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
    },  });
