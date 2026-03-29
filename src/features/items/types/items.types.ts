export interface Item {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ItemsResponse {
  items: Item[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface GetItemsParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface CreateItemPayload {
  name: string;
}

export interface UpdateItemPayload {
  name: string;
  isActive: boolean;
}