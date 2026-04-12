import { httpClient } from "@/api/httpClient";
import { 
  TopSellingProduct, 
  TopSellingParams, 
  ProductMovement, 
  ProductMovementParams 
} from "../types/reports.types";

export const getTopSellingProducts = async (params: TopSellingParams): Promise<TopSellingProduct[]> => {
  return httpClient<TopSellingProduct[]>("/reports/products/TopSelling", { params });
};

export const getProductMovement = async (params: ProductMovementParams): Promise<ProductMovement[]> => {
  if (!params.productId) return [];
  return httpClient<ProductMovement[]>("/reports/products/Movement", { params });
};
