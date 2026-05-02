import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateSalesSettings } from "@/features/settings/hooks/useUpdateSettings";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";

export default function SalesSettings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { systemSettings, updateSystemSettings } = useSettings();
  const { mutate: updateSales } = useUpdateSalesSettings();
  const { data: treasuries } = useGetAllTreasurys();

  const handleUpdate = (field: string, value: any) => {
    updateSystemSettings({
      sales: {
        ...(systemSettings.sales as any),
        [field]: value,
      },
    });
  };

  const onSave = () => {
    updateSales({
      allowSaleWithZeroStock: systemSettings.sales.sellIfZero,
      defaultSalesVault: Number(systemSettings.sales.defaultPaymentMethod) || 0,
      defaultPurchasesVault: Number(systemSettings.sales.defaultPurchasePaymentMethod) || 0,
      showOrderDeviceNumber: systemSettings.sales.showOrderDeviceNumber,
    });
  };

  const enableStr = t("enable_option") || "تمكين";
  const disableStr = t("disable_option") || "تعطيل";

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
        <span className="text-gray-900">{t("sales_settings") || "إعدادات المبيعات"}</span>
      </div>

      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{t("sales_settings") || "إعدادات المبيعات"}</CardTitle>
          <CardDescription>{t("required_fields_note") || "يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <Field>
              <FieldLabel className="gap-x-0">{t("sell_if_zero")} <span className="text-red-500">*</span></FieldLabel>
              <Select value={systemSettings.sales.sellIfZero ? enableStr : disableStr} onValueChange={(val) => handleUpdate("sellIfZero", val === enableStr)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={enableStr}>{enableStr}</SelectItem>
                  <SelectItem value={disableStr}>{disableStr}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("enable_cursor_on_add_product")} <span className="text-red-500">*</span></FieldLabel>
              <Select value={systemSettings.sales.enableCursorOnAddProduct ? enableStr : disableStr} onValueChange={(val) => handleUpdate("enableCursorOnAddProduct", val === enableStr)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={enableStr}>{enableStr}</SelectItem>
                  <SelectItem value={disableStr}>{disableStr}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("default_sales_payment_method")} <span className="text-red-500">*</span></FieldLabel>
              <Select 
                value={systemSettings.sales.defaultPaymentMethod || ""} 
                onValueChange={(val) => handleUpdate("defaultPaymentMethod", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={!treasuries ? t("loading") : (t("select_treasury") || "اختر الخزينة")} />
                </SelectTrigger>
                <SelectContent>
                  {treasuries?.map((treasury) => (
                    <SelectItem key={treasury.id} value={String(treasury.id)}>
                      {treasury.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("default_purchase_payment_method")} <span className="text-red-500">*</span></FieldLabel>
              <Select 
                value={systemSettings.sales.defaultPurchasePaymentMethod || ""} 
                onValueChange={(val) => handleUpdate("defaultPurchasePaymentMethod", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={!treasuries ? t("loading") : (t("select_treasury") || "اختر الخزينة")} />
                </SelectTrigger>
                <SelectContent>
                  {treasuries?.map((treasury) => (
                    <SelectItem key={treasury.id} value={String(treasury.id)}>
                      {treasury.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>


            <Field>
              <FieldLabel className="gap-x-0">{t("show_order_device_number")} <span className="text-red-500">*</span></FieldLabel>
              <Select value={systemSettings.sales.showOrderDeviceNumber ? enableStr : disableStr} onValueChange={(val) => handleUpdate("showOrderDeviceNumber", val === enableStr)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={enableStr}>{enableStr}</SelectItem>
                  <SelectItem value={disableStr}>{disableStr}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="gap-x-0">{t("enable_glasses")} <span className="text-red-500">*</span></FieldLabel>
              <Select value={systemSettings.sales.enableGlasses ? enableStr : disableStr} onValueChange={(val) => handleUpdate("enableGlasses", val === enableStr)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={enableStr}>{enableStr}</SelectItem>
                  <SelectItem value={disableStr}>{disableStr}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex flex-col-reverse lg:flex-row justify-between py-4 border px-3 gap-3 rounded border-gray-100 mt-8">
            <Button size="lg" variant="destructive" type="button" className="w-full lg:w-auto px-8 h-12" onClick={() => navigate(-1)}>
              إلغاء
            </Button>
            <div className="flex flex-col-reverse lg:flex-row items-center gap-3 w-full lg:w-auto">
              <Button size="lg" type="button" onClick={onSave} className="w-full lg:w-auto px-8 h-12 text-base">
                {t("save_settings") || "حفظ الإعدادات"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
