import { Control, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useLanguage } from "@/context/LanguageContext";
import { PartnerFormValues } from "../schemas/partnerSchema";

export function NationalAddressSection({ control, isTaxable }: { control: Control<PartnerFormValues>; isTaxable: boolean }) {
  const { t } = useLanguage();

  return (
    <div className="col-span-1 md:col-span-2 border border-gray-200 rounded-2xl p-5 my-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">{t("national_address")}</h3>
          <p className="text-sm text-gray-500 mt-1">{t("tax_registration_helper_text")}</p>
        </div>
        <Controller name="isTaxable" control={control} render={({ field }) => <Switch className="scale-130 cursor-pointer" checked={field.value} onCheckedChange={field.onChange} />} />
      </div>

      {isTaxable && (
        <div className="mt-5 pt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300 grid gap-4 grid-cols-2">
          <Controller
            name="taxNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("tax_number")} <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder={t("enter_tax_number")} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="commercialRegister"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("commercial_register")} <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} type="number" placeholder={t("enter_commercial_register")} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      )}
    </div>
  );
}
