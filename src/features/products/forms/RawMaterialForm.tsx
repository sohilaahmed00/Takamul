import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { BasicInfoSection } from "./sections/BasicInfoSection";
import { RawMaterialUnitSection } from "./sections/RawMaterialUnitSection";
import { FormValues } from "../types/products.types";

interface RawMaterialFormProps {
  units?: { items?: { id: number; name: string }[] };
}

export function RawMaterialForm({ units }: RawMaterialFormProps) {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <BasicInfoSection />

      {/* Cost Price */}
      <Controller
        name="CostPrice"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>التكلفة</FieldLabel>
            <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} type="number" placeholder="ادخل التكلفة *" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Description */}
      <div className="lg:col-span-2">
        <Controller
          name="Description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>الوصف</FieldLabel>
              <Textarea {...field} placeholder="ادخل الوصف" rows={4} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <RawMaterialUnitSection units={units?.items} />
    </>
  );
}
