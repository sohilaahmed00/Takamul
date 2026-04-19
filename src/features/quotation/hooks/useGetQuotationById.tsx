import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getCategoryById } from "@/features/categories/services/categories";
import type { Category } from "@/features/categories/types/categories.types";
import { useQuery } from "@tanstack/react-query";
import { quotationsKeys } from "../keys/quotations.keys";
import { getQuotationById } from "../services/quotations";
import { Quotation } from "../types/quotations.types";

export const useGetQuotationById = (id?: string | number) =>
  useQuery<Quotation>({
    queryKey: quotationsKeys.detail(id as string | number),
    queryFn: () => getQuotationById(id as number),
    enabled: !!id,
  });
