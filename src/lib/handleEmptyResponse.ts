
export function handleEmptyResponse(err: unknown, params?: { page?: number; limit?: number }) {
  if (typeof err === "string" && err.includes("لا يوجد")) {
    return {
      items: [],
      totalCount: 0,
      pageNumber: params?.page,
      pageSize: params?.limit,
    };
  }
  throw err;
}
