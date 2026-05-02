import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCurrency } from "../services/currencies";
import { CreateCurrency } from "../types/currencies.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useAddCurrency = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (data: CreateCurrency) => createCurrency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      notifySuccess(t("currency_added_successfully") || "تم إضافة العملة بنجاح");
    },
  });
};
