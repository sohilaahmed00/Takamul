import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultCurrency } from "../services/currencies";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useSetDefaultCurrency = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (id: number) => setDefaultCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      notifySuccess(t("currency_set_as_default_successfully") || "تم تعيين العملة كافتراضية بنجاح");
    },
  });
};
