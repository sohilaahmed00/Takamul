import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Barcode, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComboboxField from "@/components/ui/ComboboxField";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Field, FieldLabel } from "@/components/ui/field";

export default function BarcodeSettings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { systemSettings, updateSystemSettings, saveSettings } = useSettings();

  const handleUpdate = (field: string, value: any) => {
    updateSystemSettings({
      barcode: {
        ...(systemSettings.barcode as any),
        [field]: value,
      },
    });
  };

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
        <span className="text-gray-900">{t("barcode_scale") || "ميزان الباركود"}</span>
      </div>

      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{t("barcode_scale") || "ميزان الباركود"}</CardTitle>
          <CardDescription>{t("required_fields_note") || "يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_type")}</FieldLabel>
              <ComboboxField
                items={[t("weight_qty_type") || "الوزن/الكمية"]}
                value={systemSettings.barcode.type === "الوزن/الكمية" ? (t("weight_qty_type") || "الوزن/الكمية") : systemSettings.barcode.type}
                onValueChange={(val) => handleUpdate("type", "الوزن/الكمية")}
              />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_total_chars")}</FieldLabel>
              <Input type="number" value={systemSettings.barcode.totalCharacters} onChange={(e) => handleUpdate("totalCharacters", parseInt(e.target.value))} className="w-full" />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_flag_chars")}</FieldLabel>
              <Input type="text" value={systemSettings.barcode.flagCharacters} onChange={(e) => handleUpdate("flagCharacters", e.target.value)} className="w-full" />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_start_pos")}</FieldLabel>
              <Input type="number" value={systemSettings.barcode.codeStart} onChange={(e) => handleUpdate("codeStart", parseInt(e.target.value))} className="w-full" />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_code_length")}</FieldLabel>
              <Input type="number" value={systemSettings.barcode.codeLength} onChange={(e) => handleUpdate("codeLength", parseInt(e.target.value))} className="w-full" />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_weight_start")}</FieldLabel>
              <Input type="number" value={systemSettings.barcode.weightStart} onChange={(e) => handleUpdate("weightStart", parseInt(e.target.value))} className="w-full" />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_weight_length")}</FieldLabel>
              <Input type="number" value={systemSettings.barcode.weightLength} onChange={(e) => handleUpdate("weightLength", parseInt(e.target.value))} className="w-full" />
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("barcode_weight_divider")}</FieldLabel>
              <Input type="number" value={systemSettings.barcode.weightDivider} onChange={(e) => handleUpdate("weightDivider", parseInt(e.target.value))} className="w-full" />
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
