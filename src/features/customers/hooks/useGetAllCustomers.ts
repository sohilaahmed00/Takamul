import { useQuery } from "@tanstack/react-query";
import type { GetAllCustomersResponse } from "../types/customers.types";
import { customersKeys } from "../keys/customers.keys";
import { getAllCustomers } from "../services/customers";

export const useGetAllCustomers = ({ page, limit, searchTerm }: { page: number; limit: number; searchTerm: string }) =>
  useQuery<GetAllCustomersResponse>({
    queryKey: customersKeys.list({ page, limit, searchTerm }),
    queryFn: () => getAllCustomers({ page, limit, searchTerm }),
  });
