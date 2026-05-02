import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCurrency } from "../services/currencies";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useDeleteCurrency = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (id: number) => deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      notifySuccess(t("currency_deleted_successfully") || "تم حذف العملة بنجاح");
    },
  });
};
