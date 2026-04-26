import { Controller, useFieldArray, useFormContext, type FieldErrors } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ComboboxField from "@/components/ui/ComboboxField";
import type { FormValues } from "../../schemas";
import type { createPreparedProductSchema } from "../../schemas";
import type z from "zod/v3";

interface RawMaterialItem {
  id: number;
  productNameAr: string;
  costPrice?: number;
  baseUnitId?: number;
  purchaseUnitId?: number;
}

interface UnitItem {
  id: number;
  name: string;
}

interface PreparedMaterialsSectionProps {
  productRawMatrial?: { items?: RawMaterialItem[] };
  units?: { items?: UnitItem[] };
}

export function PreparedMaterialsSection({ productRawMatrial, units }: PreparedMaterialsSectionProps) {
  const { control, watch, setValue, formState } = useFormContext<FormValues>();

  const { fields: rawMaterialFields, append: appendRawMaterial, remove: removeRawMaterial } = useFieldArray({ control, name: "RawMaterials" });

  return (
    <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-lg">الخامات المستخدمة</h3>
        <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={() => appendRawMaterial({ rawMaterialId: 0, quantity: 0, unitId: 0 })}>
          <Plus size={16} /> إضافة خامة
        </Button>
      </div>

      {/* Empty state */}
      {rawMaterialFields.length === 0 && <div className="text-center py-4 text-gray-400 text-sm">لم يتم إضافة أي خامات بعد. اضغط على "إضافة خامة".</div>}

      {/* Raw material rows */}
      {rawMaterialFields.map((_field, index) => {
        const selectedRawMaterialId = watch(`RawMaterials.${index}.rawMaterialId`);
        const selectedRawMaterial = productRawMatrial?.items?.find((item) => item.id === selectedRawMaterialId);
        const availableUnits = units?.items?.filter((unit) => unit.id === selectedRawMaterial?.baseUnitId || unit.id === selectedRawMaterial?.purchaseUnitId) ?? [];

        return (
          <div key={_field.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            {/* Raw Material Select */}
            <div className="lg:col-span-5">
              <Controller
                name={`RawMaterials.${index}.rawMaterialId`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      الخامة <span className="text-red-500">*</span>
                    </FieldLabel>
                    <ComboboxField
                      field={field}
                      items={productRawMatrial?.items}
                      valueKey="id"
                      labelKey="productNameAr"
                      placeholder="اختر الخامة"
                      onValueChange={(val) => {
                        const selected = productRawMatrial?.items?.find((item) => String(item.id) === String(val));
                        setValue(`RawMaterials.${index}.unitId`, 0, {
                          shouldValidate: false,
                        });
                        if (selected?.baseUnitId) {
                          setValue(`RawMaterials.${index}.unitId`, selected.baseUnitId, { shouldValidate: true });
                        }
                      }}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Quantity */}
            <div className="lg:col-span-3">
              <Controller
                name={`RawMaterials.${index}.quantity`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      الكمية <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input {...field} value={field.value ?? ""} type="number" step="0.01" onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} placeholder="0.00" className="bg-white" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Unit */}
            <div className="lg:col-span-3">
              <Controller
                name={`RawMaterials.${index}.unitId`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      الوحدة <span className="text-red-500">*</span>
                    </FieldLabel>
                    <ComboboxField disabled={!selectedRawMaterialId} field={field} items={availableUnits} valueKey="id" labelKey="name" placeholder="الوحدة" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Delete */}
            <div className="lg:col-span-1 flex items-center justify-center lg:pt-8 pt-2">
              <Button type="button" variant="destructive" onClick={() => removeRawMaterial(index)}>
                <Trash2 size={18} />
                <span className="lg:hidden ml-2">حذف الخامة</span>
              </Button>
            </div>
          </div>
        );
      })}

      {/* Root error */}
      {(formState.errors as FieldErrors<z.infer<typeof createPreparedProductSchema>>).RawMaterials?.root?.message && <p className="text-sm text-red-500 mt-2">{(formState.errors as FieldErrors<z.infer<typeof createPreparedProductSchema>>).RawMaterials?.root?.message}</p>}
    </div>
  );
}
