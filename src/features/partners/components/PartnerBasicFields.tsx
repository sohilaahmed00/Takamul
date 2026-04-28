import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useLanguage } from "@/context/LanguageContext";
import { PartnerFormValues } from "../schemas/partnerSchema";

export function PartnerBasicFields({ control, isSupplier }: { control: Control<PartnerFormValues>; isSupplier: boolean }) {
  const { t } = useLanguage();

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {isSupplier ? t("supplier_name") : t("customer_name")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={isSupplier ? t("enter_supplier_name") : t("enter_customer_name")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("mobile")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} type="number" placeholder={t("enter_mobile")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
