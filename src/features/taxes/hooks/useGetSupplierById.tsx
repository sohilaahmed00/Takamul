import { useQuery } from "@tanstack/react-query";
import { suppliersKeys } from "../keys/suppliers.keys";
import { getSupplierById } from "../services/suppliers";
import type { Supplier } from "../types/suppliers.types";

export const useGetSupplierById = (id?: number) =>
  useQuery<Supplier>({
    queryKey: suppliersKeys.detail(id as number),
    queryFn: () => getSupplierById(id as number),
    enabled: !!id,
  });
