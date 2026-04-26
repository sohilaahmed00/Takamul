import { Controller, useFormContext } from "react-hook-form";
import { Barcode } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateRandomBarcode } from "../../hooks/useAddProduct";
import type { FormValues } from "../../schemas";

interface BarcodeUnitSectionProps {
  units?: { id: number; name: string }[];
  showMinStock?: boolean;
}

export function BarcodeUnitSection({ units, showMinStock = true }: BarcodeUnitSectionProps) {
  const { control, setValue } = useFormContext<FormValues>();

  return (
    <>
      {/* Barcode */}
      <Controller
        name="Barcode"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              الباركود <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="flex flex-row items-stretch gap-2">
              <Input {...field} placeholder="ادخل الباركود *" className="flex-1 min-w-0" />
              <Button
                type="button"
                variant="outline"
                size="icon-xl"
                className="shrink-0 px-3"
                onClick={() =>
                  setValue("Barcode", generateRandomBarcode(), {
                    shouldValidate: true,
                  })
                }
              >
                <Barcode size={16} />
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Base Unit */}
      <Controller
        name="BaseUnitId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="gap-x-0">
              الوحدة <span className="text-red-500">*</span>
            </FieldLabel>
            <Select key={field.value} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={"اختر الوحدة"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {units?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Min Stock Level */}
      {showMinStock && (
        <div className="col-span-2">
          <Controller
            name="MinStockLevel"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="gap-x-0">الحد الأدنى للمخزون</FieldLabel>
                <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} placeholder="ادخل الحد الادنى للمخزون" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      )}
    </>
  );
}
