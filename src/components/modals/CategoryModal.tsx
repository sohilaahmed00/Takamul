import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserPlus } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetAllCountries } from "@/features/locations/hooks/useGetAllCountries";
import { useGetCityWithCountryId } from "@/features/locations/hooks/useGetCityWithCountryId";
import { useGetStatesWithCityId } from "@/features/locations/hooks/useGetStatesWithCityId";
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateCustomer } from "@/features/customers/hooks/useUpdateCustomer";
import useToast from "@/hooks/useToast";
import axios from "axios";
import { useCreateSupplier } from "@/features/suppliers/hooks/useCreateSupplier";
import { useUpdateSupplier } from "@/features/suppliers/hooks/useUpdateSupplier";
import type { Category } from "@/features/categories/types/categories.types";
import { useGetAllCategories } from "@/features/categories/hooks/useGetAllCategories";
import { useCreateCategory } from "@/features/categories/hooks/useCreateCategory";
import { useUpdateCategory } from "@/features/categories/hooks/useUpdateCategory";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

const CategorySchema = z.object({
  CategoryNameAr: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  CategoryNameEn: z.string().optional(),
  CategoryNameUr: z.string().optional(),
  ParentCategoryId: z.number().optional(),
  description: z.string().optional(),
  Image: z.union([z.instanceof(File), z.string()]).optional(),
});

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  useEffect(() => {
    console.log(category);
  }, [category]);
  const { t } = useLanguage();
  const { data: categoriesData } = useGetAllCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      CategoryNameAr: "",
      CategoryNameEn: "",
      CategoryNameUr: "",
      description: "",
      Image: undefined,
      ParentCategoryId: undefined,
    },
  });
  useEffect(() => {
    if (!isOpen) return;
    if (category) {
      form.reset({
        CategoryNameAr: category?.categoryNameAr ?? "",
        CategoryNameEn: category?.categoryNameEn ?? "",
        CategoryNameUr: category?.categoryNameUr ?? "",
        description: category.description ?? "",
      });
    } else {
      form.reset({
        CategoryNameAr: "",
        CategoryNameEn: "",
        CategoryNameUr: "",
        description: "",
      });
    }
  }, [category, isOpen]);

  const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
    try {
      const formData = new FormData();

      if (category?.id) {
        formData.append("Id", String(category?.id));
      }
      formData.append("CategoryNameAr", data.CategoryNameAr);

      if (data.CategoryNameEn) formData.append("CategoryNameEn", data.CategoryNameEn);

      if (data.CategoryNameUr) formData.append("CategoryNameUr", data.CategoryNameUr);

      if (data.ParentCategoryId !== undefined) formData.append("ParentCategoryId", String(data.ParentCategoryId));

      if (data.description) formData.append("description", data.description);
      // console.log([...formData.entries()]);
      if (!category) {
        await createCategory(formData);
      } else {
        await updateCategory({ id: category?.id, data: formData });
      }
    } catch (error) {
      // if (axios.isAxiosError(error)) {
      //   const message = error.response?.data?.message;
      //   notifyError(message);
      // }
    }

    form.reset();
    onClose();
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
          <DialogHeader className="py-3">
            <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
              <UserPlus size={20} />
              إضافة تصنيف
            </DialogTitle>
          </DialogHeader>

          <form id="addCustomerForm" onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
              <Controller
                name="CategoryNameAr"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      اسم التصنيف (باللغة العربية) <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Input {...field} placeholder="أدخل اسم التصنيف..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="CategoryNameEn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>اسم التصنيف (باللغة الإنجليزية)</FieldLabel>

                    <Input {...field} placeholder="أدخل اسم التصنيف..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="CategoryNameUr"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>اسم التصنيف (باللغة الاوردو)</FieldLabel>

                    <Input {...field} placeholder="أدخل اسم التصنيف..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="ParentCategoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="gap-x-0">الصنف الرئيسي</FieldLabel>
                    <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر الصنف الرئيسي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categoriesData?.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.categoryNameAr}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </form>

          <DialogFooter>
            <Button form="addCustomerForm" className="h-12 px-6 text-base" type="submit">
              إضافة صنف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
