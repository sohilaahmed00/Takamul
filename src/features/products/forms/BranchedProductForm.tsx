import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { BasicInfoSection } from "./sections/BasicInfoSection";
import { CategorySection } from "./sections/CategorySection";
import { BranchedChildrenSection } from "./sections/BranchedChildrenSection";
import { ImageSection } from "./sections/ImageSection";
import type { FormValues, ProductDirect } from "@/features/products/types/products.types";

interface BranchedProductFormProps {
  mainCategories?: { id: number; categoryNameAr: string }[];
  productsDirect?: { items?: ProductDirect[] };
}

export function BranchedProductForm({ mainCategories, productsDirect }: BranchedProductFormProps) {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <BasicInfoSection />

      <CategorySection mainCategories={mainCategories} />

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

      <BranchedChildrenSection productsDirect={productsDirect} />

      <ImageSection />
    </>
  );
}
