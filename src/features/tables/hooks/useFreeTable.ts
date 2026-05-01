import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllTablesResponse } from "../types/tables.types";
import { tablesKeys } from "../keys/tables.keys";
import { freeTable, getAllFreeTables } from "../services/tables";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

export const useFreeTable = () => {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => freeTable(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: tablesKeys?.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => {
      handleApiError(error, notifyError);
    },
  });
};
