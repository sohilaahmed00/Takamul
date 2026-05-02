import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTable } from "../services/tables";
import { tablesKeys } from "../keys/tables.keys";
import { UpdateTable } from "../types/tables.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTable }) => updateTable({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      notifySuccess(t("table_updated_successfully") || "تم تحديث الطاولة بنجاح");
    },
  });
};
