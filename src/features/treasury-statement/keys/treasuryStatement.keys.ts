export const treasuryStatementKeys = {
  all: ["treasury-statement"] as const,

  list: (params: {
    treasuryId?: number;
    from?: string;
    to?: string;
  }) => [...treasuryStatementKeys.all, "list", params] as const,
};