import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Truck } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { useAddDeliveryCompany } from "@/features/delivery-companies/hooks/useAddDeliveryCompany";
import { useUpdateDeliveryCompany } from "@/features/delivery-companies/hooks/useUpdateDeliveryCompany";
import { DeliveryCompany } from "@/features/delivery-companies/types/delivery-companies.types";

interface AddDeliveryCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: DeliveryCompany;
}

const createSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation_name_required")),
  });

export default function AddDeliveryCompanyModal({ isOpen, onClose, company }: AddDeliveryCompanyModalProps) {
  const { t, direction } = useLanguage();
  const { mutateAsync: addCompany } = useAddDeliveryCompany();
  const { mutateAsync: updateCompany } = useUpdateDeliveryCompany();

  const schema = useMemo(() => createSchema(t), [t]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (company) {
      form.reset({ name: company.name });
    } else {
      form.reset({ name: "" });
    }
  }, [company, isOpen]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (company) {
        await updateCompany({ id: company.id, data });
      } else {
        await addCompany(data);
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
            <Truck size={20} />
            {company ? t("edit_delivery_company", "تعديل شركة توصيل") : t("add_delivery_company", "إضافة شركة توصيل")}
          </DialogTitle>
        </DialogHeader>

        <form id="addDeliveryCompanyForm" onSubmit={form.handleSubmit(onSubmit)} className="p-2 space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("company_name", "اسم الشركة")} <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder={t("enter_company_name", "ادخل اسم الشركة")} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button size="2xl" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button size="2xl" form="addDeliveryCompanyForm" className="" type="submit">
            {company ? t("edit_delivery_company", "تعديل شركة توصيل") : t("add_delivery_company", "إضافة شركة توصيل")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
