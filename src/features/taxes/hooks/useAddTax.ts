import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTax } from "../services/taxes";
import { taxesKeys } from "../keys/taxes.keys";
import { CreateTax } from "../types/taxes.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useAddTax = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (data: CreateTax) => createTax(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxesKeys.list() });
      notifySuccess(t("tax_added_successfully") || "تم إضافة الضريبة بنجاح");
    },
  });
};
