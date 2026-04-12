import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import axios from "axios";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { getAllPermissions } from "../services/permissions";
import { permissionsKeys } from "../keys/permissions.keys";

export function useGetAllPermissions() {
  return useQuery({
    queryFn: getAllPermissions,
    queryKey: permissionsKeys.list(),
  });
}
