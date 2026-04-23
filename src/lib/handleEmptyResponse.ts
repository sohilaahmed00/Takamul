export function handleEmptyResponse(err: unknown, params?: { page?: number; limit?: number }) {
  return {
    items: [],
    totalCount: 0,
    pageNumber: params?.page,
    pageSize: params?.limit,
  };
}
