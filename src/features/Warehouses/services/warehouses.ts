import { httpClient } from "@/api/httpClient";
import type { CreateWarehousePayload, UpdateWarehousePayload, Warehouse } from "../types/Warehouses.types";

/** جلب كل المخازن */
export const getAllWarehouses = () =>
  httpClient<Warehouse[]>("/Warehouse");

/** جلب مخزن بالـ ID */
export const getWarehouseById = (id: number) =>
  httpClient<Warehouse>(`/Warehouse/${id}`);

/** جلب مخازن فرع معين */
export const getWarehousesByBranch = (branchId: number) =>
  httpClient<Warehouse[]>(`/Warehouse/branch/${branchId}`);

/** إضافة مخزن جديد - (تستخدم Schema الـ POST) */
export const createWarehouse = (data: CreateWarehousePayload) =>
  httpClient<Warehouse>("/Warehouse", {
    method: "POST",
    data: {
      warehouseCode: data.warehouseCode,
      warehouseName: data.warehouseName,
      address: data.address,
      managerId: Number(data.managerId),
      branchId: Number(data.branchId),
    },
  });

/** تحديث مخزن - (تستخدم Schema الـ PUT المختلفة تماماً) */
export const updateWarehouse = (data: UpdateWarehousePayload) =>
  httpClient<string>(`/Warehouse/${data.id}`, { // السيرفر بيرجع نص "تم تعديل بيانات المخزن"
    method: "PUT",
    data: {
      warehouseName: data.warehouseName,
      address: data.address,
      city: (data as any).city || "Cairo",   // حقل مطلوب في الـ PUT فقط
      state: (data as any).state || "Egypt", // حقل مطلوب في الـ PUT فقط
      capacity: Number((data as any).capacity) || 0, // حقل مطلوب في الـ PUT فقط
    },
  });

/** حذف مخزن */
export const deleteWarehouse = (id: number) =>
  httpClient<void>(`/Warehouse/${id}`, {
    method: "DELETE",
  });