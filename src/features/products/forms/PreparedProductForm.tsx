import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { BasicInfoSection } from "./sections/BasicInfoSection";
import { CategorySection } from "./sections/CategorySection";
import { PricingSection } from "./sections/PricingSection";
import { ImageSection } from "./sections/ImageSection";
import { BarcodeUnitSection } from "./sections/Barcodeunitsection";
import { PreparedMaterialsSection } from "./sections/Preparedmaterialssection";
import { FormValues } from "../types/products.types";

interface RawMaterialItem {
  id: number;
  productNameAr: string;
  costPrice?: number;
  baseUnitId?: number;
  purchaseUnitId?: number;
}

interface PreparedProductFormProps {
  taxesData?: { id: number; name: string; amount: number }[];
  mainCategories?: { id: number; categoryNameAr: string }[];
  units?: { items?: { id: number; name: string }[] };
  productRawMatrial?: { items?: RawMaterialItem[] };
  summary: {
    basePrice: string;
    taxAmount: string;
    finalPrice: string;
    taxName: string;
    taxPercentage: number;
  };
}

export function PreparedProductForm({ taxesData, mainCategories, units, productRawMatrial, summary }: PreparedProductFormProps) {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <BasicInfoSection />

      <CategorySection mainCategories={mainCategories} />

      <PricingSection taxesData={taxesData} summary={summary} isPrepared={true} />

      <BarcodeUnitSection units={units?.items} showMinStock={false} />

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

      <PreparedMaterialsSection productRawMatrial={productRawMatrial} units={units} />

      <ImageSection />
    </>
  );
}
