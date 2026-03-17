import { useQuery } from "@tanstack/react-query";
import { customersKeys } from "../keys/customers.keys";
import { getCustomerById } from "../services/customers";
import type { Customer } from "../types/customers.types";

export const useGetCustomerById = (id?: number) =>
  useQuery<Customer>({
    queryKey: customersKeys.detail(id as number),
    queryFn: () => getCustomerById(id as number),
    enabled: !!id,
  });
