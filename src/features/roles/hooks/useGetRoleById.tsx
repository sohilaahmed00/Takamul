import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getCategoryById } from "@/features/categories/services/categories";
import type { Category } from "@/features/categories/types/categories.types";
import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../keys/roles.keys";
import { getRoleById } from "../services/roles";
import { Role } from "../types/roles.types";

export const useGetRoleById = (id: number) =>
  useQuery<Role>({
    queryKey: rolesKeys.detail(id),
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
