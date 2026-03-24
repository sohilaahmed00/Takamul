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
import type { Addition, createAddition } from "@/features/Additions/types/additions.types";
import { useCreateAddition } from "@/features/Additions/hooks/useCreateAddition";
import { updateAddition } from "@/features/Additions/services/additions";
import { useUpdateAddition } from "@/features/Additions/hooks/useUpdateAddition";

interface AdditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addition: Addition | undefined;
}

const AdditionSchema = z.object({
  additionNameAr: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  additionNameEn: z.string().optional(),
  additionNameUr: z.string().optional(),
});

export default function AdditionModal({ isOpen, onClose, addition }: AdditionModalProps) {
  const { t } = useLanguage();
  const { data: categoriesData } = useGetAllCategories();
  const { mutateAsync: createAddition } = useCreateAddition();
  const { mutateAsync: updateAddition } = useUpdateAddition();

  const form = useForm<z.infer<typeof AdditionSchema>>({
    resolver: zodResolver(AdditionSchema),
    defaultValues: {
      additionNameAr: "",
      additionNameEn: "",
      additionNameUr: "",
    },
  });
  useEffect(() => {
    if (!isOpen) return;
    if (addition) {
      form.reset({
        additionNameAr: addition?.additionNameAr ?? "",
        additionNameEn: addition?.additionNameEn ?? "",
        additionNameUr: addition?.categoryNameUr ?? "",
      });
    } else {
      form.reset({
        additionNameAr: "",
        additionNameEn: "",
        additionNameUr: "",
      });
    }
  }, [addition, isOpen]);

  const onSubmit = async (data: z.infer<typeof AdditionSchema>) => {
    try {
      const payload: createAddition = {
        additionNameAr: data.additionNameAr,
        additionNameEn: data.additionNameEn || "",
        additionNameUr: data.additionNameUr || "",
      };
      // console.log([...formData.entries()]);
      if (!addition) {
        await createAddition(payload);
      } else {
        await updateAddition({ id: addition?.id, data: payload });
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
                name="additionNameAr"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      اسم الإضافة (باللغة العربية) <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Input {...field} placeholder="أدخل اسم الإضافة..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="additionNameEn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>اسم الإضافة (باللغة الإنجليزية)</FieldLabel>

                    <Input {...field} placeholder="أدخل اسم التصنيف..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="additionNameUr"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>اسم الإضافة (باللغة الاوردو)</FieldLabel>

                    <Input {...field} placeholder="أدخل اسم التصنيف..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </form>

          <DialogFooter>
            <Button form="addCustomerForm" className="h-12 px-6 text-base" type="submit">
              إضافة إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
