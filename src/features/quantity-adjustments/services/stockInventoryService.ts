import { httpClient } from "@/api/httpClient";
import type {
  StockInventoryListResponse,
  StockInventoryOption,
} from "../types/stock.types";

type RawPaginatedResponse<T> = {
  data?: T[];
  items?: T[];
  totalCount?: number;
  totalItems?: number;
  pageNumber?: number;
  pageIndex?: number;
  pageSize?: number;
  totalPages?: number;
};

function normalizePaginatedResponse<T>(
  response: RawPaginatedResponse<T> | T[]
): {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
} {
  if (Array.isArray(response)) {
    return {
      data: response,
      totalCount: response.length,
      pageNumber: 1,
      pageSize: response.length,
      totalPages: 1,
    };
  }

  const data = response.data ?? response.items ?? [];
  const totalCount = response.totalCount ?? response.totalItems ?? data.length;
  const pageNumber = response.pageNumber ?? response.pageIndex ?? 1;
  const pageSize = response.pageSize ?? data.length;
  const totalPages =
    response.totalPages ??
    (pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1);

  return {
    data,
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
  };
}

export async function getStockInventoryOptions(params: {
  pageNumber: number;
  pageSize: number;
  search?: string;
}): Promise<StockInventoryListResponse> {
  const response = await httpClient<RawPaginatedResponse<any> | any[]>(
    "/StockInventory",
    {
      method: "GET",
      params: {
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
      },
    }
  );

  const normalized = normalizePaginatedResponse<any>(response);

  const mapped = normalized.data.map(
    (item): StockInventoryOption => ({
      id: Number(item.id),
      productId: item.productId,
      productName: item.productName ?? "بدون اسم",
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName ?? "",
      quantityAvailable: item.quantityAvailable ?? 0,
      lastUpdated: item.lastUpdated,
      displayName: `${item.productName ?? "بدون اسم"} - ${item.warehouseName ?? ""}`,
    })
  );

  const filtered = params.search?.trim()
    ? mapped.filter((item) =>
        `${item.productName} ${item.warehouseName ?? ""} ${item.productId ?? ""}`
          .toLowerCase()
          .includes(params.search!.trim().toLowerCase())
      )
    : mapped;

  return {
    ...normalized,
    data: filtered,
    totalCount: filtered.length,
  };
}