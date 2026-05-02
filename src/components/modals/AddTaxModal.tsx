import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Percent } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { useAddTax } from "@/features/taxes/hooks/useAddTax";
import { useUpdateTax } from "@/features/taxes/hooks/useUpdateTax";
import { Tax } from "@/features/taxes/types/taxes.types";

interface AddTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  tax?: Tax;
}

const createTaxSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation_name_required")),
    amount: z.coerce.number().min(0, "يجب أن تكون القيمة 0 أو أكثر"),
  });

export default function AddTaxModal({ isOpen, onClose, tax }: AddTaxModalProps) {
  const { t, direction } = useLanguage();
  const { mutateAsync: addTax } = useAddTax();
  const { mutateAsync: updateTax } = useUpdateTax();

  const schema = useMemo(() => createTaxSchema(t), [t]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (tax) {
      form.reset({ name: tax.name, amount: tax.amount });
    } else {
      form.reset({ name: "", amount: 0 });
    }
  }, [tax, isOpen]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (tax) {
        await updateTax({ id: tax.id, data });
      } else {
        await addTax(data);
      }
      form.reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[400px]">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
            <Percent size={20} />
            {tax ? t("edit_tax", "تعديل ضريبة") : t("add_tax", "إضافة ضريبة")}
          </DialogTitle>
        </DialogHeader>

        <form id="addTaxForm" onSubmit={form.handleSubmit(onSubmit)} className="p-2 space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("tax_name", "اسم الضريبة")} <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder={t("enter_tax_name", "ادخل اسم الضريبة")} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("tax_amount", "قيمة الضريبة (%)")} <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} type="number" placeholder={t("enter_tax_amount", "ادخل قيمة الضريبة")} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button size="2xl" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button size="2xl" form="addTaxForm" className="" type="submit">
            {tax ? t("edit_tax", "تعديل ضريبة") : t("add_tax", "إضافة ضريبة")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
