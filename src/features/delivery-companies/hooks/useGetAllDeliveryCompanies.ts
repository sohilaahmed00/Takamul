import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryCompanies } from "../services/delivery-companies";
import { deliveryCompaniesKeys } from "../keys/delivery-companies.keys";

export const useGetAllDeliveryCompanies = (params?: { Page?: number; PageSize?: number; SearchTerm?: string }) =>
  useQuery({
    queryKey: deliveryCompaniesKeys.list(params),
    queryFn: () => getAllDeliveryCompanies(params),
  });
