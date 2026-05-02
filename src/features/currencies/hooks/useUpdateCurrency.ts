import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrency } from "../services/currencies";
import { CreateCurrency } from "../types/currencies.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCurrency }) => updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      notifySuccess(t("currency_updated_successfully") || "تم تحديث العملة بنجاح");
    },
  });
};
