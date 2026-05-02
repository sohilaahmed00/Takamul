import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTable } from "../services/tables";
import { tablesKeys } from "../keys/tables.keys";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      notifySuccess(t("table_deleted_successfully") || "تم حذف الطاولة بنجاح");
    },
  });
};
