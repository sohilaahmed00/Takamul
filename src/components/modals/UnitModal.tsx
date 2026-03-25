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
import { Textarea } from "../ui/textarea";
import type { Unit } from "@/features/units/types/units.types";
import { useUpdateUnit } from "@/features/units/hooks/useUpdateUnit";
import { useCreateUnit } from "@/features/units/hooks/useCreateUnit";

interface UnitModalModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: Unit;
}

const UnitSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().optional(),
});

export default function UnitModal({ isOpen, onClose, unit }: UnitModalModalProps) {
  const { t } = useLanguage();
  const { data: categoriesData } = useGetAllCategories();
  const { mutateAsync: createUnit } = useCreateUnit();
  const { mutateAsync: updateUpdateUnit } = useUpdateUnit();

  const form = useForm<z.infer<typeof UnitSchema>>({
    resolver: zodResolver(UnitSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  useEffect(() => {
    if (!isOpen) return;
    if (unit) {
      form.reset({
        name: unit?.name ?? "",
        description: unit.description ?? "",
      });
    } else {
      form.reset();
    }
  }, [unit, isOpen]);

  const onSubmit = async (data: z.infer<typeof UnitSchema>) => {
    try {
      // console.log([...formData.entries()]);
      if (!unit) {
        await createUnit(data);
      } else {
        await updateUpdateUnit({ id: Number(unit?.id), data });
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
              {unit ? "تعديل وحدة" : " إضافة وحدة"}
            </DialogTitle>
          </DialogHeader>

          <form id="addCustomerForm" onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <div className="grid grid-cols-1 gap-5 p-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      اسم الوحدة <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Input {...field} placeholder="أدخل اسم الوحدة..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>الوصف</FieldLabel>
                    <Textarea {...field} placeholder="ادخل الوصف" rows={4} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </form>

          <DialogFooter>
            <Button form="addCustomerForm" className="h-12 px-6 text-base" type="submit">
              {unit ? "تعديل وحدة" : " إضافة وحدة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
