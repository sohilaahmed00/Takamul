// features/partners/components/LocationFields.tsx
import { Control, Controller } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useLanguage } from "@/context/LanguageContext";
import { PartnerFormValues } from "../schemas/partnerSchema";

interface LocationFieldsProps {
  control: Control<PartnerFormValues>;
  setValue: any;
  countriesData: any[];
  citiesData: any[];
  statesData: any[];
}

export function LocationFields({ control, setValue, countriesData, citiesData, statesData }: LocationFieldsProps) {
  const { t } = useLanguage();

  return (
    <>
      <Controller
        name="countryId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("country")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Select
              key={`country-${field.value}-${countriesData?.length}`}
              value={field.value ? String(field.value) : ""}
              onValueChange={(value) => {
                field.onChange(Number(value));
                setValue("cityId", 0);
                setValue("stateId", 0);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select_country")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countriesData?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.countryName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="cityId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("region")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Select
              key={`city-${field.value}-${citiesData?.length}`}
              value={field.value ? String(field.value) : ""}
              onValueChange={(value) => {
                field.onChange(Number(value));
                setValue("stateId", 0);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select_region")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {citiesData?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.cityName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="stateId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("city")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Select key={`state-${field.value}-${statesData?.length}`} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select_city")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statesData?.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.statesName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="district"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("district")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_district")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="streetName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("street_name")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_street_name")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="additionalNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("additional_number")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_additional_number")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="buildingNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("building_number")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_building_number")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="postalCode"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              {t("postal_code")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...field} placeholder={t("enter_postal_code")} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
