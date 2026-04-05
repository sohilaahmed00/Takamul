export const giftCardKeys = {
  all: ["gift-cards"] as const,
  lists: (params: { limit: number; page: number; SearchTerm?: string }) => [...giftCardKeys.all, "list", params] as const,
  detail: (id: number) => [...giftCardKeys.all, "detail", id] as const,
};
