import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface BranchInfo {
  id: number;
  code: string;
  name: string;
  nameEN: string;
  imageUrl: string | null;
  businessName: string;
  commercialRegister: string;
  taxNumber: string;
  footerNote: string;
  email: string;
  phone: string;
  address: string | null;
  countryId: number;
  countryName: string;
  cityName: string;
  stateName: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  organizationName: string;
  organizationUnitName: string;
  industryBusinessCategory: string;
  environment: string;
  isActive: boolean;
}

export const useBranch = () => {
  return useQuery<BranchInfo>({
    queryKey: ["employee-branch"],
    queryFn: async () => {
      const response = await apiClient.get("/Branch/Employeebranch");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};
