import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Settings, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComboboxField from "@/components/ui/ComboboxField";
import { Link, useNavigate } from "react-router-dom";
import { Field, FieldLabel } from "@/components/ui/field";

export default function SiteSettings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { systemSettings, updateSystemSettings, saveSettings } = useSettings();

  const handleUpdate = (field: string, value: any) => {
    updateSystemSettings({
      site: {
        ...(systemSettings.site as any),
        [field]: value,
      },
    });
  };

  const enableStr = t("enable_option") || "تمكين";
  const disableStr = t("disable_option") || "تعطيل";
  const booleanItems = [enableStr, disableStr];

  return (
    <div className="space-y-4 pb-24">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>
          {t("home")}
        </span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/settings/system")}>
          إعدادات
        </span>
        <span>/</span>
        <span className="text-gray-900">{t("site_settings") || "إعدادات الموقع"}</span>
      </div>

      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{t("site_settings") || "إعدادات الموقع"}</CardTitle>
          <CardDescription>{t("required_fields_note") || "يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <Field>
              <FieldLabel className="gap-x-0">{t("default_currency")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={["Saudi Riyal"]}
                value={systemSettings.site.defaultCurrency}
                onValueChange={(val) => handleUpdate("defaultCurrency", val)}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("rows_per_page")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={[10, 25, 50]}
                value={systemSettings.site.rowsPerPage}
                onValueChange={(val) => handleUpdate("rowsPerPage", parseInt(val))}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("default_payment_company")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={["بدون"]}
                value={systemSettings.site.defaultPaymentCompany}
                onValueChange={(val) => handleUpdate("defaultPaymentCompany", val)}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("show_actual_balance_entities")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={booleanItems}
                value={systemSettings.site.showActualBalance ? enableStr : disableStr}
                onValueChange={(val) => handleUpdate("showActualBalance", val === enableStr)}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("show_cost_greater_msg")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={booleanItems}
                value={systemSettings.site.showCostGreaterMsg ? enableStr : disableStr}
                onValueChange={(val) => handleUpdate("showCostGreaterMsg", val === enableStr)}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("show_item_code_in_sales_print")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={booleanItems}
                value={systemSettings.site.showItemCodeInSales ? enableStr : disableStr}
                onValueChange={(val) => handleUpdate("showItemCodeInSales", val === enableStr)}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("show_item_code_in_quotes")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={booleanItems}
                value={systemSettings.site.showItemCodeInQuotes ? enableStr : disableStr}
                onValueChange={(val) => handleUpdate("showItemCodeInQuotes", val === enableStr)}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("show_item_code_in_purchases")} <span className="text-red-500">*</span></FieldLabel>
              <ComboboxField
                items={booleanItems}
                value={systemSettings.site.showItemCodeInPurchases ? enableStr : disableStr}
                onValueChange={(val) => handleUpdate("showItemCodeInPurchases", val === enableStr)}
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse lg:flex-row justify-between py-4 border px-3 gap-3 rounded border-gray-100 mt-8">
            <Button size="lg" variant="destructive" type="button" className="w-full lg:w-auto px-8 h-12" onClick={() => navigate(-1)}>
              إلغاء
            </Button>
            <div className="flex flex-col-reverse lg:flex-row items-center gap-3 w-full lg:w-auto">
              <Button size="lg" type="button" onClick={saveSettings} className="w-full lg:w-auto px-8 h-12 text-base">
                {t("save_settings") || "حفظ الإعدادات"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
