import { useQuery } from "@tanstack/react-query";
import { suppliersKeys } from "@/features/suppliers/keys/suppliers.keys";
import { getSupplierById } from "@/features/suppliers/services/suppliers";
import type { Supplier } from "@/features/suppliers/types/suppliers.types";

export const useGetSupplierById = (id?: number) =>
  useQuery<Supplier>({
    queryKey: suppliersKeys.detail(id as number),
    queryFn: () => getSupplierById(id as number),
    enabled: !!id,
  });
