import { httpClient } from "@/api/httpClient";
import { CreateEmployee, Employee, GetAllEmployeesResponse } from "../types/employees.types";

export const createEmployee = (data: CreateEmployee) =>
  httpClient<{ message: string }>("/employees/CreateEmployee", {
    method: "POST",
    data,
  });
export const getAllEmployees = ({ page, limit, searchTerm }: { page: number; limit: number; searchTerm?: string }) =>
  httpClient<GetAllEmployeesResponse>(`/employees`, {
    method: "GET",
    params: {
      Page: page,
      PageSize: limit,
      SearchTerm: searchTerm,
    },
  });
export const getEmployeeById = (id: number) =>
  httpClient<Employee>(`/employees/${id}`, {
    method: "GET",
  });
export const updateEmployee = ({ data, id }: { data: CreateEmployee; id: number }) =>
  httpClient<{ message: string }>(`/employees/${id}`, {
    method: "PUT",
    data,
  });
export const deleteEmployee = (id: number) =>
  httpClient<{ message: string }>(`/employees/${id}`, {
    method: "DELETE",
  });
