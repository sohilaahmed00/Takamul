import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ComboboxField from "@/components/ui/ComboboxField";
import type { FormValues } from "../../schemas";

interface RawMaterialUnitSectionProps {
  units?: { id: number; name: string }[];
}

export function RawMaterialUnitSection({ units }: RawMaterialUnitSectionProps) {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      {/* Base Unit (وحدة المخازن) */}
      <Controller
        name="BaseUnitId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              وحدة المخازن <span className="text-red-500">*</span>
            </FieldLabel>
            <ComboboxField field={field} items={units} valueKey="id" labelKey="name" placeholder="اختر وحدة المخازن" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Purchase Unit (وحدة النسب) */}
      <Controller
        name="PurchaseUnitId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              وحدة النسب <span className="text-red-500">*</span>
            </FieldLabel>
            <ComboboxField field={field} items={units} valueKey="id" labelKey="name" placeholder="اختر وحدة النسب" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Conversion Factor */}
      <div className="lg:col-span-2">
        <Controller
          name="ConversionFactor"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                معامل التحويل <span className="text-red-500">*</span>
              </FieldLabel>
              <Input {...field} type="number" step="0.01" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="مثال: 1000" />
              <p className="text-xs text-gray-400 mt-1">كم تساوي وحدة المخازن من وحدة النسب</p>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </>
  );
}
