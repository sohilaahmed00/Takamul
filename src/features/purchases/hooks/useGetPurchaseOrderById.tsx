import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getCategoryById } from "@/features/categories/services/categories";
import type { Category } from "@/features/categories/types/categories.types";
import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrderById } from "../services/purchases";
import type { Purchase } from "../types/purchase.types";
import { purchasesKeys } from "../keys/purchases.keys";

export const useGetPurchaseOrderById = (id: number) =>
  useQuery<Purchase>({
    queryKey: purchasesKeys.detail(id as number),
    queryFn: () => getPurchaseOrderById(id as number),
    enabled: !!id,
  });
