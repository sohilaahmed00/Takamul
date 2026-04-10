import { useQuery } from "@tanstack/react-query";
import { employeesKeys } from "../keys/employees.keys";
import { getEmployeeById } from "../services/employees";
import { Employee } from "../types/employees.types";

export const useGetEmployeeById = (employeeId?: number) =>
  useQuery<Employee>({
    queryKey: employeesKeys.details(employeeId),
    queryFn: () => {
      return getEmployeeById(employeeId);
    },
    enabled: !!employeeId,
  });
