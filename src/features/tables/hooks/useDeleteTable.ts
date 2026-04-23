import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tablesKeys } from "../keys/tables.keys";
import { addTable, deleteTable, getAllTables } from "../services/tables";
import { CreateTable } from "../types/tables.types";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { handleApiError } from "@/lib/handleApiError";

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: tablesKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => {
      handleApiError(error, notifyError);
    },
  });
};
