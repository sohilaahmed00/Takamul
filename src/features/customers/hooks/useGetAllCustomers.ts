import { useQuery } from "@tanstack/react-query";
import type { GetAllCustomersResponse } from "../types/customers.types";
import { customersKeys } from "../keys/customers.keys";
import { getAllCustomers } from "../services/customers";

export const useGetAllCustomers = () =>
  useQuery<GetAllCustomersResponse>({
    queryKey: customersKeys.list(),
    queryFn: () => getAllCustomers(),
  });
