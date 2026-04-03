import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getCategoryById } from "@/features/categories/services/categories";
import type { Category } from "@/features/categories/types/categories.types";
import { useQuery } from "@tanstack/react-query";
import { salesKeys } from "@/features/sales/keys/sales.keys";
import { getSalesOrderById } from "@/features/sales/services/sales";
import type { SalesOrder } from "@/features/sales/types/sales.types";

export const useGetSalesOrderById = (id?: number) =>
  useQuery<SalesOrder>({
    queryKey: salesKeys.detail(id as number),
    queryFn: () => getSalesOrderById(id as number),
    enabled: !!id,
  });
