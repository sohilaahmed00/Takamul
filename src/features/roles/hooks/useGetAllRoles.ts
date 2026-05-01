import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../keys/roles.keys";
import { getAllRoles } from "../services/roles";
import { GetAllRolesResponse } from "../types/roles.types";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

export const useGetAllRoles = ({ page, limit }: { page: number; limit: number }) =>
  useQuery<GetAllRolesResponse>({
    queryKey: rolesKeys.list({ page, limit }),
    queryFn: async () => {
      try {
        return await getAllRoles({ page, limit });
      } catch (error) {
        return handleEmptyResponse(error);
      }
    },
    placeholderData: keepPreviousData,
  });
