import { PaginationMeta } from "@/types";

export interface CreateEmployee {
  firstName: string;
  mobile?: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  mobile: string;
  city: string;
  state: string;
  hireDate: string;
  salary: number;
  department: string;
  position: string;

  userName: string | null;
  email: string | null;
  phoneNumber: string | null;

  brunchId: number;
  brunchName: string;
}
export interface GetAllEmployeesResponse extends PaginationMeta {
  data: Employee[];
}
// export type GetCitiesWithCountryIdResponse = City[];
// export type GetStatesWithCityIdResponse = State[];
