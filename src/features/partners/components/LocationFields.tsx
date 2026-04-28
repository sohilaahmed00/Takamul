// features/partners/components/LocationFields.tsx
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useLanguage } from "@/context/LanguageContext";
import { PartnerFormValues } from "../schemas/partnerSchema";

interface LocationFieldsProps {
  control: Control<PartnerFormValues>;
  setValue: UseFormSetValue<PartnerFormValues>;
}

export function LocationFields({ control, setValue }: LocationFieldsProps) {
  const { t } = useLanguage();

  return (
    <>
      <Controller
        name="additionalNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("additional_number")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_additional_number")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="buildingNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("building_number")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_building_number")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="postalCode"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("postal_code")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_postal_code")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
