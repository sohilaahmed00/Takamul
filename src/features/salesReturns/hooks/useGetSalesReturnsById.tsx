import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getCategoryById } from "@/features/categories/services/categories";
import type { Category } from "@/features/categories/types/categories.types";
import { salesKeys } from "@/features/sales/keys/sales.keys";
import { getSalesOrderById } from "@/features/sales/services/sales";
import { SalesOrder } from "@/features/sales/types/sales.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSalesReturnOrderById } from "../services/salesReturns";
import { salesReturnsKeys } from "../keys/salesReturns.keys";
import { SalesReturn } from "../types/salesReturns.types";

type QueryOptions = Omit<UseQueryOptions<SalesReturn>, "queryKey" | "queryFn">;
export const useGetSalesReturnsById = (id?: number, options?: QueryOptions) =>
  useQuery<SalesReturn>({
    queryKey: salesReturnsKeys.detail(id as number),
    queryFn: () => getSalesReturnOrderById(id as number),
    enabled: options?.enabled ?? !!id,
    ...options,
  });
