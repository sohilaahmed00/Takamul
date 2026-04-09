import { useQuery } from "@tanstack/react-query";
import { GetAllEmployeesResponse } from "../types/employees.types";
import { employeesKeys } from "../keys/employees.keys";
import { getAllEmployees } from "../services/employees";

export const useGetAllEmployees = ({ page, limit, searchTerm }: { page: number; limit: number; searchTerm?: string }) =>
  useQuery<GetAllEmployeesResponse>({
    queryKey: employeesKeys.list(),
    queryFn: () => getAllEmployees({ page, limit, searchTerm }),
  });
