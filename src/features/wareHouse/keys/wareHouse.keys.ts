// import type { PaginationMeta } from "@/types/common";

export const wareHousesKeys = {
  all: ["wareHouse"] as const,
  list: () => [...wareHousesKeys.all, "list"] as const,
  detail: (id: string | number) => [...wareHousesKeys.all, "detail", id] as const,
};
