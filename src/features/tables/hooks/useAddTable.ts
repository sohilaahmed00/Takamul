import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tablesKeys } from "../keys/tables.keys";
import { addTable, getAllTables } from "../services/tables";
import { CreateTable } from "../types/tables.types";

export const useAddTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTable) => addTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tablesKeys.all,
      });
    },
  });
};
