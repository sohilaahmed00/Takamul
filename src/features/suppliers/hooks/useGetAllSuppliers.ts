import { useQuery } from "@tanstack/react-query";
import type { GetAllSuppliersResponse } from "../types/suppliers.types";
import { suppliersKeys } from "../keys/suppliers.keys";
import { getAllSuppliers } from "../services/suppliers";

export const useGetAllSuppliers = () =>
  useQuery<GetAllSuppliersResponse>({
    queryKey: suppliersKeys.list(),
    queryFn: () => getAllSuppliers(),
  });
