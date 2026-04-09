import { PaginationMeta } from "@/types";

export interface CreateEmployee {
  employee: {
    firstName: string;
    lastName: string;
    address: string;
    mobile: string;
    city: string;
    state: string;
    hireDate: string; // ISO date
    salary: number;
    department: string;
    position: string;
    branchId: number;
  };

  user: {
    userName: string;
    email: string;
    phoneNumber: string;
    password: string;
  };

  roleName: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  mobile: string;
  city: string;
  state: string;
  hireDate: string; // ISO date
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
