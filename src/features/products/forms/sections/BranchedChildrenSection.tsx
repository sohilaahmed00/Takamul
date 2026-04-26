import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import type { ProductDirect } from "@/features/products/types/products.types";
import type { FormValues } from "../../schemas";

interface BranchedChildrenSectionProps {
  productsDirect?: { items?: ProductDirect[] };
}

export function BranchedChildrenSection({ productsDirect }: BranchedChildrenSectionProps) {
  const { control } = useFormContext<FormValues>();
  const anchor = useComboboxAnchor();

  return (
    <div className="lg:col-span-2">
      <Controller
        name="ChildrenIds"
        control={control}
        render={({ field, fieldState }) => {
          const selectedValues = Array.isArray(field.value) ? field.value.map(String) : [];

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                الأصناف المباشرة المرتبطة
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Combobox
                multiple
                items={productsDirect?.items || []}
                value={selectedValues}
                onValueChange={(val) => {
                  const numberArray = Array.isArray(val) ? val.map(Number) : [];
                  field.onChange(numberArray);
                }}
              >
                <ComboboxChips ref={anchor} className="w-full h-10!">
                  <ComboboxValue>
                    {(values: string[]) => (
                      <React.Fragment>
                        {values.map((valueId: string) => {
                          const product = productsDirect?.items?.find((p) => String(p.id) === valueId);
                          return <ComboboxChip key={valueId}>{product ? product.productNameAr : valueId}</ComboboxChip>;
                        })}
                        <ComboboxChipsInput placeholder="ابحث في الاصناف المباشرة..." />
                      </React.Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>لا يوجد اصناف رئيسية.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: ProductDirect) => (
                      <ComboboxItem key={item.id} value={String(item.id)}>
                        {item.productNameAr}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </div>
  );
}
