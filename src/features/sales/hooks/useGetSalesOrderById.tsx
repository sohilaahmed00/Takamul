import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getCategoryById } from "@/features/categories/services/categories";
import type { Category } from "@/features/categories/types/categories.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import { getSalesOrderById } from "../services/sales";
import type { SalesOrder } from "../types/sales.types";

type QueryOptions = Omit<UseQueryOptions<SalesOrder>, "queryKey" | "queryFn">;
export const useGetSalesOrderById = (id?: number, options?: QueryOptions) =>
  useQuery<SalesOrder>({
    queryKey: salesKeys.detail(id as number),
    queryFn: () => getSalesOrderById(id as number),
    enabled: options?.enabled ?? !!id,
    ...options,
  });
