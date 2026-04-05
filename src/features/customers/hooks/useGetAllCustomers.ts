import { useQuery } from "@tanstack/react-query";
import type { GetAllCustomersResponse } from "../types/customers.types";
import { customersKeys } from "../keys/customers.keys";
import { getAllCustomers } from "../services/customers";

type GetAllCustomersParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export const useGetAllCustomers = ({ page = 1, limit = 100, searchTerm }: GetAllCustomersParams = {}) =>
  useQuery<GetAllCustomersResponse>({
    queryKey: customersKeys.list({ page, limit, searchTerm }),
    queryFn: () => getAllCustomers({ page, limit, searchTerm }),
  });
