export const internalTreasuryTransfersKeys = {
  all: ["internal-treasury-transfers"] as const,

  list: () => [...internalTreasuryTransfersKeys.all, "list"] as const,

  detail: (id: string | number) =>
    [...internalTreasuryTransfersKeys.all, "detail", id] as const,
};