import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDeliveryCompany } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";
import { UpdateDeliveryCompany } from "../types/delivery-companies.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useUpdateDeliveryCompany = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeliveryCompany }) => updateDeliveryCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.all });
      notifySuccess(t("delivery_company_updated_successfully") || "تم تحديث شركة التوصيل بنجاح");
    },
  });
};
