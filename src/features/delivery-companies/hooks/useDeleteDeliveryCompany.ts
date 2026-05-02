import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeliveryCompany } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";

export const useDeleteDeliveryCompany = () => {
  const queryClient = useQueryClient();
  const { notifySuccess } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (id: number) => deleteDeliveryCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.all });
      notifySuccess(t("delivery_company_deleted_successfully") || "تم حذف شركة التوصيل بنجاح");
    },
  });
};
