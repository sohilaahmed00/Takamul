import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { BasicInfoSection } from "./sections/BasicInfoSection";
import { CategorySection } from "./sections/CategorySection";
import { PricingSection } from "./sections/PricingSection";
import { ImageSection } from "./sections/ImageSection";
import { BarcodeUnitSection } from "./sections/Barcodeunitsection";
import { FormValues } from "../types/products.types";

interface DirectProductFormProps {
  taxesData?: { id: number; name: string; amount: number }[];
  mainCategories?: { id: number; categoryNameAr: string }[];
  units?: { items?: { id: number; name: string }[] };
  summary: {
    basePrice: string;
    taxAmount: string;
    finalPrice: string;
    taxName: string;
    taxPercentage: number;
  };
}

export function DirectProductForm({
  taxesData,
  mainCategories,
  units,
  summary,
}: DirectProductFormProps) {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <BasicInfoSection />

      <CategorySection mainCategories={mainCategories} />

      <PricingSection
        taxesData={taxesData}
        summary={summary}
        isPrepared={false}
      />

      <BarcodeUnitSection units={units?.items} showMinStock={true} />

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

      <ImageSection />
    </>
  );
}