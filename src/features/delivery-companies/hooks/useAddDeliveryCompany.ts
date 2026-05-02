import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeliveryCompany } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";
import { CreateDeliveryCompany } from "../types/delivery-companies.types";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useAddDeliveryCompany = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (data: CreateDeliveryCompany) => createDeliveryCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.all });
      notifySuccess(t("delivery_company_added_successfully") || "تم إضافة شركة التوصيل بنجاح");
    },
  });
};
