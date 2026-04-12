import { TopSellingParams, ProductMovementParams } from "../types/reports.types";

export const reportsKeys = {
  all: ["reports"] as const,
  topSelling: (params: TopSellingParams) => [...reportsKeys.all, "topSelling", params] as const,
  movement: (params: ProductMovementParams) => [...reportsKeys.all, "movement", params] as const,
};
