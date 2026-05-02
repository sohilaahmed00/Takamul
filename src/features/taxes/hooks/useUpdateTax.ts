import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTax } from "../services/taxes";
import { taxesKeys } from "../keys/taxes.keys";
import { UpdateTax } from "../types/taxes.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useUpdateTax = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTax }) => updateTax(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxesKeys.list() });
      notifySuccess(t("tax_updated_successfully") || "تم تحديث الضريبة بنجاح");
    },
  });
};
