import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormValues } from "../../schemas";

export function BasicInfoSection() {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <Controller
        name="ProductNameAr"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="gap-x-0">
              اسم الصنف (باللغة العربية)
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder="ادخل اسم التصنيف الرئيسي" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="ProductNameEn"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="gap-x-0">الاسم باللغة الثانية</FieldLabel>
            <Input {...field} placeholder="ادخل الاسم باللغة الثانية" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="ProductNameUr"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="gap-x-0">الاسم باللغة الثالثة</FieldLabel>
            <Input {...field} placeholder="ادخل الاسم باللغة الثالثة" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
