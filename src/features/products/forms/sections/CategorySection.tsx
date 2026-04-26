import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormValues } from "../../schemas";

interface CategorySectionProps {
  mainCategories?: { id: number; categoryNameAr: string }[];
}

export function CategorySection({ mainCategories }: CategorySectionProps) {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name="CategoryId"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            التصنيف الرئيسي<span className="text-red-500">*</span>
          </FieldLabel>
          <Select key={field.value} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر التصنيف الرئيسي" />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectGroup>
                {mainCategories?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.categoryNameAr}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
