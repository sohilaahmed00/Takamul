import { PaginationMeta } from "@/types";

export interface User {
  id: number;
  firstName: string;
  mobile: string;
  userName: string;
  email: string;
  brunchId: number;
  brunchName: string;
  roleName: string;
}
export type CreateUser = {
  employee: {
    firstName: string;
    lastName: string;
    mobile: string;
    branchId: number;
  };
  user: {
    userName: string;
    email: string;
    password: string;
  };
  roleName: string;
};

export type UpdateUser = {
  employee: {
    mobile: string;
    branchId: number;
  };
  user: {
    userName: string;
    email: string;
  };
  roleName: string;
};

export interface GetAllUsersResponse extends PaginationMeta {
  items: User[];
}
