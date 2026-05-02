import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeliveryCompany } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";
import { CreateDeliveryCompany } from "../types/delivery-companies.types";

export const useAddDeliveryCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeliveryCompany) => createDeliveryCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryCompaniesKeys.all });
    },
  });
};
