import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDeliveryCompany } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";
import { CreateDeliveryCompany } from "../types/delivery-companies.types";

export const useUpdateDeliveryCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDeliveryCompany }) => updateDeliveryCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.all });
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.detail(variables.id) });
    },
  });
};
