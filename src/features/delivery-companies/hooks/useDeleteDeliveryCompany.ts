import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeliveryCompany } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";

export const useDeleteDeliveryCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDeliveryCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.all });
    },
  });
};
