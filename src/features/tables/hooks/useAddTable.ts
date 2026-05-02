import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTable } from "../services/tables";
import { tablesKeys } from "../keys/tables.keys";
import { CreateTable } from "../types/tables.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useAddTable = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (data: CreateTable) => addTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      notifySuccess(t("table_added_successfully") || "تم إضافة الطاولة بنجاح");
    },
  });
};
