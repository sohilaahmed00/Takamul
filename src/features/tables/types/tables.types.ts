import type { PaginationMeta } from "@/types";

export interface CreateTable {
  tableName: string;
}
export interface Table {
  id: number;
  tableName: string;
  status: "Free" | "Occupied";
  currentOrderId: number;
}

export type GetAllTablesResponse = Table[];
