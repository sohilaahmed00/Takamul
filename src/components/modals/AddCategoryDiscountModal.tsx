import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Tag, Percent, DollarSign } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitHandler, Resolver } from "react-hook-form";

import { CategoryDiscount } from "@/features/category-discount/types/category-discount.types";
import { useCreateCategoryDiscount, useUpdateCategoryDiscount } from "@/features/category-discount/hooks/useCategoryDiscount";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";

interface AddCategoryDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount?: CategoryDiscount;
}


export default function AddCategoryDiscountModal({ isOpen, onClose, discount }: AddCategoryDiscountModalProps) {
  const { t, direction, language } = useLanguage();
  const { mutateAsync: addDiscount } = useCreateCategoryDiscount();
  const { mutateAsync: updateDiscount } = useUpdateCategoryDiscount();
  const { data: categories } = useGetAllMainCategories();

  const schema = useMemo(() => z.object({
    categoryId: z.coerce.number().min(1, t("validation_category_required")),
    discountValue: z.coerce.number().min(0, t("validation_discount_value_required")),
    discountType: z.enum(["Percentage", "FixedAmount"]),
  }), [t]);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      categoryId: 0,
      discountValue: 0,
      discountType: "Percentage",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (discount) {
      form.reset({
        categoryId: discount.categoryId,
        discountValue: discount.discountValue,
        discountType: discount.discountType,
      });
    } else {
      form.reset({
        categoryId: 0,
        discountValue: 0,
        discountType: "Percentage",
      });
    }
  }, [discount, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (discount) {
        await updateDiscount({ 
          id: discount.id, 
          data: { 
            categoryId: data.categoryId,
            discountValue: data.discountValue, 
            discountType: data.discountType 
          } 
        });
      } else {
        await addDiscount(data);
      }
      form.reset();
      onClose();
    } catch (error) {}
  };

  const getCategoryName = (cat: any) => {
    if (language === "en") return cat.categoryNameEn || cat.categoryNameAr;
    return cat.categoryNameAr;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[450px]">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 text-[var(--primary)]">
            <Tag size={20} />
            {discount ? t("edit_category_discount", "تعديل خصم التصنيف") : t("add_category_discount", "إضافة خصم تصنيف")}
          </DialogTitle>
        </DialogHeader>

        <form id="addCategoryDiscountForm" onSubmit={form.handleSubmit(onSubmit)} className="p-2 space-y-4">
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("category", "التصنيف")} <span className="text-red-500">*</span>
                </FieldLabel>
                <Select disabled={!!discount} value={String(field.value)} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("choose_category", "اختر التصنيف")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {getCategoryName(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="discountValue"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t("discount_value", "قيمة الخصم")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input type="number" step="0.01" {...field} placeholder="0.00" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="discountType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t("discount_type", "نوع الخصم")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">{t("percentage", "نسبة مئوية")}</SelectItem>
                      <SelectItem value="FixedAmount">{t("flat", "مبلغ ثابت")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button size="2xl" variant="outline" onClick={onClose} className="flex-1">
            {t("cancel")}
          </Button>
          <Button size="2xl" form="addCategoryDiscountForm" className="flex-1" type="submit">
            {discount ? t("save_changes", "حفظ التغييرات") : t("add_discount", "إضافة الخصم")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
