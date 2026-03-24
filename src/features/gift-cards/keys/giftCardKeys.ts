export const giftCardKeys = {
  all: ["gift-cards"] as const,
  lists: () => [...giftCardKeys.all, "list"] as const,
  detail: (id: number) => [...giftCardKeys.all, "detail", id] as const,
};