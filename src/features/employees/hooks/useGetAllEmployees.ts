import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetAllEmployeesResponse } from "../types/employees.types";
import { employeesKeys } from "../keys/employees.keys";
import { getAllEmployees } from "../services/employees";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

export const useGetAllEmployees = ({ page, limit, searchTerm }: { page: number; limit: number; searchTerm?: string }) =>
  useQuery<GetAllEmployeesResponse>({
    queryKey: employeesKeys.list(),
    queryFn: async () => {
      try {
        return await getAllEmployees({ page, limit, searchTerm });
      } catch (err) {
        return handleEmptyResponse(err, { limit, page });
      }
    },
    placeholderData: keepPreviousData,
  });
