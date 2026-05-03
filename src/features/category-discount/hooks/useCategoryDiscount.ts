import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { categoryDiscountKeys } from "../keys/category-discount.keys";
import {
  getAllCategoryDiscounts,
  getCategoryDiscountById,
  createCategoryDiscount,
  updateCategoryDiscount,
  deactivateCategoryDiscount,
} from "../services/category-discount";
import { CreateCategoryDiscountRequest, UpdateCategoryDiscountRequest } from "../types/category-discount.types";
import useToast from "@/hooks/useToast";

export const useGetAllCategoryDiscounts = (params?: { Page?: number; PageSize?: number; IsActive?: boolean; CategoryId?: number }) =>
  useQuery({
    queryKey: categoryDiscountKeys.list(params),
    queryFn: () => getAllCategoryDiscounts(params),
    placeholderData: keepPreviousData,
  });

export const useGetCategoryDiscountById = (id: number) =>
  useQuery({
    queryKey: categoryDiscountKeys.detail(id),
    queryFn: () => getCategoryDiscountById(id),
    enabled: !!id,
  });

export const useCreateCategoryDiscount = () => {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryDiscountRequest) => createCategoryDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryDiscountKeys.all });
      notifySuccess("تم إضافة الخصم بنجاح");
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "حدث خطأ أثناء إضافة الخصم");
    },
  });
};

export const useUpdateCategoryDiscount = () => {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDiscountRequest }) => updateCategoryDiscount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryDiscountKeys.all });
      notifySuccess("تم تحديث الخصم بنجاح");
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "حدث خطأ أثناء تحديث الخصم");
    },
  });
};

export const useDeactivateCategoryDiscount = () => {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useToast();

  return useMutation({
    mutationFn: (id: number) => deactivateCategoryDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryDiscountKeys.all });
      notifySuccess("تم تعطيل الخصم بنجاح");
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "حدث خطأ أثناء تعطيل الخصم");
    },
  });
};
