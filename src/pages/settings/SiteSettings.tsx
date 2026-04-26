import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

import { useForm, Controller } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function SiteSettings() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const settings = useSettingsStore((state) => state?.settings);

  const enableStr = t("enable_option") || "تمكين";
  const disableStr = t("disable_option") || "تعطيل";

  const { control, handleSubmit } = useForm({
    defaultValues: {
      rowsPerPage: settings?.location?.rowsPerPage ?? 10,
      defaultPaymentCompany: settings?.location?.defaultPaymentCompany ?? "",

      showActualBalance: settings?.location?.showActualBalance ?? true,

      showCostGreaterThanSalePriceMessage: settings?.location?.showCostGreaterThanSalePriceMessage ?? true,

      showItemCodeInSalesPrint: settings?.location?.showItemCodeInSalesPrint ?? true,

      showItemCodeInQuotations: settings?.location?.showItemCodeInQuotations ?? true,

      showItemCodeInPurchases: settings?.location?.showItemCodeInPurchases ?? true,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const booleanToString = (val: boolean) => (val ? enableStr : disableStr);

  const stringToBoolean = (val: string) => val === enableStr;

  return (
    <Card>
      <CardHeader className="max-md:flex max-md:flex-col">
        <CardTitle>{t("site_settings") || "إعدادات الموقع"}</CardTitle>
        <CardDescription>{t("required_fields_note") || "يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية"}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {/* rowsPerPage */}
            <Controller
              name="rowsPerPage"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("rows_per_page")} *</FieldLabel>

                  <Select value={String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {[10, 25, 50].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* showActualBalance */}
            <Controller
              name="showActualBalance"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("show_actual_balance_entities")} *</FieldLabel>

                  <Select value={booleanToString(field.value)} onValueChange={(val) => field.onChange(stringToBoolean(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={enableStr}>{enableStr}</SelectItem>
                      <SelectItem value={disableStr}>{disableStr}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* showCostGreaterThanSalePriceMessage */}
            <Controller
              name="showCostGreaterThanSalePriceMessage"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("show_cost_greater_msg")} *</FieldLabel>

                  <Select value={booleanToString(field.value)} onValueChange={(val) => field.onChange(stringToBoolean(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={enableStr}>{enableStr}</SelectItem>
                      <SelectItem value={disableStr}>{disableStr}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* showItemCodeInSalesPrint */}
            <Controller
              name="showItemCodeInSalesPrint"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("show_item_code_in_sales_print")} *</FieldLabel>

                  <Select value={booleanToString(field.value)} onValueChange={(val) => field.onChange(stringToBoolean(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={enableStr}>{enableStr}</SelectItem>
                      <SelectItem value={disableStr}>{disableStr}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* showItemCodeInQuotations */}
            <Controller
              name="showItemCodeInQuotations"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("show_item_code_in_quotes")} *</FieldLabel>

                  <Select value={booleanToString(field.value)} onValueChange={(val) => field.onChange(stringToBoolean(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={enableStr}>{enableStr}</SelectItem>
                      <SelectItem value={disableStr}>{disableStr}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* showItemCodeInPurchases */}
            <Controller
              name="showItemCodeInPurchases"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("show_item_code_in_purchases")} *</FieldLabel>

                  <Select value={booleanToString(field.value)} onValueChange={(val) => field.onChange(stringToBoolean(val))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={enableStr}>{enableStr}</SelectItem>
                      <SelectItem value={disableStr}>{disableStr}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse lg:flex-row justify-between py-4 border px-3 gap-3 rounded border-gray-100 mt-8">
            <Button size="lg" variant="destructive" type="button" className="w-full lg:w-auto px-8 h-12" onClick={() => navigate(-1)}>
              إلغاء
            </Button>

            <Button size="lg" type="submit" className="w-full lg:w-auto px-8 h-12 text-base">
              {t("save_settings") || "حفظ الإعدادات"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
