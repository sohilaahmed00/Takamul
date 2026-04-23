import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tablesKeys } from "../keys/tables.keys";
import { addTable, getAllTables, updateTable } from "../services/tables";
import { CreateTable } from "../types/tables.types";

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: CreateTable; id: number }) => updateTable({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tablesKeys.all,
      });
    },
  });
};
