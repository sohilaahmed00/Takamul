import { useQuery } from "@tanstack/react-query";
import { getEmployeeSalesReport } from "../services/reportsService";
import { EmployeeSalesParams } from "../types/reports.types";

export const useGetEmployeeSalesReport = (params: EmployeeSalesParams) => {
  return useQuery({
    queryKey: ["employee-sales-report", params],
    queryFn: () => getEmployeeSalesReport(params),
  });
};
