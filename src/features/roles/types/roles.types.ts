import { Permission } from "@/lib/permissions";
import type { PaginationMeta } from "@/types";

export type Role = {
  roleId: string;
  roleName: string;
  permissions: string[];
};
export type CreateRole = {
  roleId?: string;
  roleName: string;
  permissions: string[];
};
export type UpdateRole = Omit<Role, "roleName">;

export interface GetAllRolesResponse extends PaginationMeta {
  items: Role[];
}
