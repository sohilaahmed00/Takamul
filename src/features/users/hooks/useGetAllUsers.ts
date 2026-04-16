import { useQuery } from "@tanstack/react-query";
import { GetAllUsersResponse } from "../types/users.types";
import { usersKeys } from "../keys/users.keys";
import { getAllUsers } from "../services/users";

export const useGetAllUsers = ({ page, limit, searchTerm }: { page: number; limit: number; searchTerm?: string }) =>
  useQuery<GetAllUsersResponse>({
    queryKey: usersKeys.list({ page, limit, searchTerm }),
    queryFn: () => getAllUsers({ page, limit, searchTerm }),
  });
