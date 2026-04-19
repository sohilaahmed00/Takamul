import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings, type SystemSettings } from "@/context/SettingsContext";
import { Settings, Package, ShoppingCart, Hash, SaudiRiyal, Barcode, Mail, Star, Percent, FileText, Printer, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";
import { Input } from "@/components/ui/input";

interface SettingSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({ id, title, children, onSave }) => {
  const { t } = useLanguage();
  return (
    <section id={id} className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden mb-8 scroll-mt-24">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-main)]/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <div className="w-1 h-6 bg-[var(--primary)] rounded-full"></div>
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-start">
          <button onClick={onSave} className="bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm font-bold">
            <Save size={18} />
            {t("save_settings")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default function SystemSettings() {
  const { t, direction } = useLanguage();
  const { systemSettings, updateSystemSettings, saveSettings } = useSettings();
  const [activeSection, setActiveSection] = React.useState("site");

  const handleUpdate = (section: keyof SystemSettings, field: string, value: any) => {
    updateSystemSettings({
      [section]: {
        ...(systemSettings[section] as any),
        [field]: value,
      },
    });
  };

  const handleNestedUpdate = (section: keyof SystemSettings, field: string, nestedField: string, value: any) => {
    const sectionData = systemSettings[section] as any;
    updateSystemSettings({
      [section]: {
        ...sectionData,
        [field]: {
          ...sectionData[field],
          [nestedField]: value,
        },
      },
    });
  };

  const sections = [
    { id: "site", title: t("site_settings"), icon: Settings },
    { id: "items", title: t("items_settings"), icon: Package },
    { id: "sales", title: t("sales_settings"), icon: ShoppingCart },
    { id: "prefixes", title: t("prefixes_settings"), icon: Hash },
    { id: "money", title: t("money_formatting"), icon: SaudiRiyal },
    { id: "barcode", title: t("barcode_scale"), icon: Barcode },
    { id: "email", title: t("email_settings"), icon: Mail },
    { id: "points", title: t("earned_points"), icon: Star },
    { id: "fees", title: t("sales_fees"), icon: Percent },
    { id: "reports", title: t("report_print_settings"), icon: FileText },
    { id: "sales_print", title: t("sales_print_settings"), icon: Printer },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
  };

  const handleSave = () => {
    saveSettings();
  };

  const section = sections?.find((section) => section?.id == activeSection);
  const SectionIcon = section?.icon;
  return (
    <div className="flex flex-col md:flex-row gap-8 relative items-start">
      {/* Sticky Sidebar Navigation */}
      <div className="w-full md:w-64">
        <div className="sticky top-24 bg-[#004d2c] rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-[#003d23] text-white font-bold flex items-center gap-2">
            <Settings size={20} />
            {t("system_settings")}
          </div>
          <nav className="p-2 space-y-1">
            {sections.map((section) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm text-right", activeSection === section.id ? "bg-white/20 text-white font-bold" : "text-white/80 hover:text-white hover:bg-white/10")}>
                <section.icon size={18} />
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className=" flex items-center gap-2">
                {SectionIcon && <SectionIcon size={20} />}
                {section?.title}
              </div>
            </CardTitle>
            <CardDescription>يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSection === "site" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t("company_name")} *</label>
                  <Input type="text" value={systemSettings.site.companyName} onChange={(e) => handleUpdate("site", "companyName", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t("language")} *</label>
                  <ComboboxField
                    items={["Arabic", "English"]}
                    value={systemSettings.site.language}
                    onValueChange={(val) => handleUpdate("site", "language", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العملة الافتراضية *</label>
                  <ComboboxField
                    items={["Saudi Riyal"]}
                    value={systemSettings.site.defaultCurrency}
                    onValueChange={(val) => handleUpdate("site", "defaultCurrency", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الرقم الضريبي *</label>
                  <Input type="text" className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">* رقم السجل التجاري (CR)</label>
                  <Input type="text" className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t("accounting_method")} *</label>
                  <ComboboxField
                    items={["FIFO (First In First Out)"]}
                    value={systemSettings.site.accountingMethod}
                    onValueChange={(val) => handleUpdate("site", "accountingMethod", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t("default_email")} *</label>
                  <Input type="email" value={systemSettings.site.defaultEmail} onChange={(e) => handleUpdate("site", "defaultEmail", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t("default_customer_group")} *</label>
                  <ComboboxField
                    items={[t("general")]}
                    value={systemSettings.site.defaultCustomerGroup}
                    onValueChange={(val) => handleUpdate("site", "defaultCustomerGroup", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مجموعة الأسعار العامة *</label>
                  <ComboboxField
                    items={[t("general")]}
                    value={systemSettings.site.generalPriceGroup}
                    onValueChange={(val) => handleUpdate("site", "generalPriceGroup", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">دعم RTL *</label>
                  <ComboboxField
                    items={["تمكين", "تعطيل"]}
                    value={systemSettings.site.rtlSupport ? "تمكين" : "تعطيل"}
                    onValueChange={(val) => handleUpdate("site", "rtlSupport", val === "تمكين")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد الأيام التى لا يمكن تعديل فواتير المبيعات بعدها *</label>
                  <Input type="number" value={systemSettings.site.invoiceEditDays} onChange={(e) => handleUpdate("site", "invoiceEditDays", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الصفوف لكل صفحة *</label>
                  <ComboboxField
                    items={[10, 25, 50]}
                    value={systemSettings.site.rowsPerPage}
                    onValueChange={(val) => handleUpdate("site", "rowsPerPage", parseInt(val))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">المنطقة الزمنية *</label>
                  <ComboboxField
                    items={["Asia/Kuwait"]}
                    value={systemSettings.site.timezone}
                    onValueChange={(val) => handleUpdate("site", "timezone", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الفرع الافتراضي *</label>
                  <ComboboxField
                    items={["تجريبي (WHI)"]}
                    value={systemSettings.site.defaultBranch}
                    onValueChange={(val) => handleUpdate("site", "defaultBranch", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الكاشير الافتراضي *</label>
                  <ComboboxField
                    items={[t("demo_branch")]}
                    value={systemSettings.site.defaultCashier}
                    onValueChange={(val) => handleUpdate("site", "defaultCashier", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">PDF Library *</label>
                  <ComboboxField
                    items={["mPDF"]}
                    value={systemSettings.site.pdfLibrary}
                    onValueChange={(val) => handleUpdate("site", "pdfLibrary", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">شركة الدفع الافتراضية *</label>
                  <ComboboxField
                    items={["بدون"]}
                    value={systemSettings.site.defaultPaymentCompany}
                    onValueChange={(val) => handleUpdate("site", "defaultPaymentCompany", val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد أيام تنبيه الصلاحية *</label>
                  <Input type="number" value={systemSettings.site.expiryAlertDays} onChange={(e) => handleUpdate("site", "expiryAlertDays", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار الرصيد الفعلي في قائمة العملاء *</label>
                  <ComboboxField
                    items={["نعم", "لا"]}
                    value={systemSettings.site.showActualBalance ? "نعم" : "لا"}
                    onValueChange={(val) => handleUpdate("site", "showActualBalance", val === "نعم")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار رسالة التكلفة أكبر من سعر البيع *</label>
                  <ComboboxField
                    items={["نعم", "لا"]}
                    value={systemSettings.site.showCostGreaterMsg ? "نعم" : "لا"}
                    onValueChange={(val) => handleUpdate("site", "showCostGreaterMsg", val === "نعم")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار كود الصنف في المبيعات *</label>
                  <ComboboxField
                    items={["نعم", "لا"]}
                    value={systemSettings.site.showItemCodeInSales ? "نعم" : "لا"}
                    onValueChange={(val) => handleUpdate("site", "showItemCodeInSales", val === "نعم")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار كود الصنف في عروض الأسعار *</label>
                  <ComboboxField
                    items={["نعم", "لا"]}
                    value={systemSettings.site.showItemCodeInQuotes ? "نعم" : "لا"}
                    onValueChange={(val) => handleUpdate("site", "showItemCodeInQuotes", val === "نعم")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار كود الصنف في المشتريات *</label>
                  <ComboboxField
                    items={["نعم", "لا"]}
                    value={systemSettings.site.showItemCodeInPurchases ? "نعم" : "لا"}
                    onValueChange={(val) => handleUpdate("site", "showItemCodeInPurchases", val === "نعم")}
                  />
                </div>
              </div>
            )}
            {activeSection === "items" && (
              <SettingSection id="items" title={t("items_settings")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">ضريبة الأصناف *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.items.itemTax ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("items", "itemTax", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">رفوف *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.items.shelves ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("items", "shelves", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">متغيرات الأصناف *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.items.itemVariants ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("items", "itemVariants", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">انتهاء صلاحية الصنف *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.items.itemExpiry ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("items", "itemExpiry", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حذف الأصناف منتهية الصلاحية من المخزون *</label>
                    <ComboboxField
                      items={["نعم", "لا، أنا سأقوم بالحذف يدوياً"]}
                      value={systemSettings.items.deleteExpiredItems ? "نعم" : "لا، أنا سأقوم بالحذف يدوياً"}
                      onValueChange={(val) => handleUpdate("items", "deleteExpiredItems", val === "نعم")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حجم الصورة (Width : Height) *</label>
                      <Input type="number" value={systemSettings.items.imageSize.width} onChange={(e) => handleNestedUpdate("items", "imageSize", "width", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                    <div className="pt-6">
                      <Input type="number" value={systemSettings.items.imageSize.height} onChange={(e) => handleNestedUpdate("items", "imageSize", "height", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حجم الصورة المصغرة (Width : Height) *</label>
                      <Input type="number" value={systemSettings.items.thumbnailSize.width} onChange={(e) => handleNestedUpdate("items", "thumbnailSize", "width", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                    <div className="pt-6">
                      <Input type="number" value={systemSettings.items.thumbnailSize.height} onChange={(e) => handleNestedUpdate("items", "thumbnailSize", "height", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العلامة المائية *</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.items.watermark ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("items", "watermark", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار أصناف المخزن *</label>
                    <ComboboxField
                      items={["اظهار جميع الاصناف حتى لو رصيدها صفر"]}
                      value={systemSettings.items.showWarehouseItems}
                      onValueChange={(val) => handleUpdate("items", "showWarehouseItems", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">فاصل الباركود *</label>
                    <ComboboxField
                      items={["( _ ) Underscore", "( - ) Hyphen", "( . ) Dot"]}
                      value={systemSettings.items.barcodeSeparator}
                      onValueChange={(val) => handleUpdate("items", "barcodeSeparator", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">معيار الباركود *</label>
                    <ComboboxField
                      items={["صورة", "نص"]}
                      value={systemSettings.items.barcodeStandard}
                      onValueChange={(val) => handleUpdate("items", "barcodeStandard", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تحويل المخزون *</label>
                    <ComboboxField
                      items={["تكلفة", "سعر البيع"]}
                      value={systemSettings.items.inventoryTransfer}
                      onValueChange={(val) => handleUpdate("items", "inventoryTransfer", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل اسم الصنف باللغة الثانية *</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.items.enableSecondLangName ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("items", "enableSecondLangName", val === "نعم")}
                    />
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "sales" && (
              <SettingSection id="sales" title={t("sales_settings")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البيع حتى لو كان الرصيد صفر *</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.sales.sellIfZero ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("sales", "sellIfZero", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تنسيق الرقم المرجعي *</label>
                    <ComboboxField
                      items={["الشهر / السنة / تسلسل رقم (م / 08/001 / 4..)"]}
                      value={systemSettings.sales.referenceFormat}
                      onValueChange={(val) => handleUpdate("sales", "referenceFormat", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">سيريال الصنف *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.sales.itemSerial ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("sales", "itemSerial", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طريقة اضافة بند الصنف فى فاتورة المبيعات *</label>
                    <ComboboxField
                      items={["زيادة كمية البند، إذا كان موجوداً بالفعل في ..", "إضافة كسطر جديد"]}
                      value={systemSettings.sales.addItemMethod}
                      onValueChange={(val) => handleUpdate("sales", "addItemMethod", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مكان وقوف المؤشر بعد اضافة الصنف *</label>
                    <ComboboxField
                      items={["اضافة منتج جديد", "الكمية", "السعر"]}
                      value={systemSettings.sales.cursorPosition}
                      onValueChange={(val) => handleUpdate("sales", "cursorPosition", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طريقة الدفع الافتراضية *</label>
                    <ComboboxField
                      items={["شبكة", "كاش", "آجل"]}
                      value={systemSettings.sales.defaultPaymentMethod}
                      onValueChange={(val) => handleUpdate("sales", "defaultPaymentMethod", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">اسم الرقم التسلسلي في الفواتير</label>
                    <Input type="text" value={systemSettings.sales.serialNameInInvoices} onChange={(e) => handleUpdate("sales", "serialNameInInvoices", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طريقة الدفع الافتراضية للمشتريات</label>
                    <ComboboxField
                      items={["آجل", "كاش", "شبكة"]}
                      value={systemSettings.sales.defaultPurchasePaymentMethod}
                      onValueChange={(val) => handleUpdate("sales", "defaultPurchasePaymentMethod", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل البحث السريع</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.sales.enableQuickSearch ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("sales", "enableQuickSearch", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حذف محددات البحث</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.sales.clearSearchFilters ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("sales", "clearSearchFilters", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل المسوقين</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.sales.enableMarketers ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("sales", "enableMarketers", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل النظارات *</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.sales.enableGlasses ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("sales", "enableGlasses", val === "نعم")}
                    />
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "prefixes" && (
              <SettingSection id="prefixes" title={t("prefixes_settings")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للمبيعات</label>
                    <Input type="text" value={systemSettings.prefixes.sales} onChange={(e) => handleUpdate("prefixes", "sales", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لرجيع المبيعات</label>
                    <Input type="text" value={systemSettings.prefixes.salesReturn} onChange={(e) => handleUpdate("prefixes", "salesReturn", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للدفع</label>
                    <Input type="text" value={systemSettings.prefixes.payment} onChange={(e) => handleUpdate("prefixes", "payment", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Purchase Payment Prefix</label>
                    <Input type="text" value={systemSettings.prefixes.purchasePayment} onChange={(e) => handleUpdate("prefixes", "purchasePayment", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للتسليم</label>
                    <Input type="text" value={systemSettings.prefixes.delivery} onChange={(e) => handleUpdate("prefixes", "delivery", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لعروض الأسعار</label>
                    <Input type="text" value={systemSettings.prefixes.quotes} onChange={(e) => handleUpdate("prefixes", "quotes", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للمشتريات</label>
                    <Input type="text" value={systemSettings.prefixes.purchases} onChange={(e) => handleUpdate("prefixes", "purchases", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لرجيع المشتريات</label>
                    <Input type="text" value={systemSettings.prefixes.purchasesReturn} onChange={(e) => handleUpdate("prefixes", "purchasesReturn", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">نقل وتحويل</label>
                    <Input type="text" value={systemSettings.prefixes.transfer} onChange={(e) => handleUpdate("prefixes", "transfer", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للمصروفات</label>
                    <Input type="text" value={systemSettings.prefixes.expenses} onChange={(e) => handleUpdate("prefixes", "expenses", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لتعديل الكميات</label>
                    <Input type="text" value={systemSettings.prefixes.quantityAdjustment} onChange={(e) => handleUpdate("prefixes", "quantityAdjustment", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "money" && (
              <SettingSection id="money" title={t("money_formatting")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الكسور العشرية *</label>
                    <ComboboxField
                      items={[2, 3, 4]}
                      value={systemSettings.money.decimals}
                      onValueChange={(val) => handleUpdate("money", "decimals", parseInt(val))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العلامات العشرية للكمية *</label>
                    <ComboboxField
                      items={[2, 3, 4]}
                      value={systemSettings.money.quantityDecimals}
                      onValueChange={(val) => handleUpdate("money", "quantityDecimals", parseInt(val))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تنسيق جنوب اسيا لبلدان العملات *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.money.southAsiaFormat ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("money", "southAsiaFormat", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">فاصل درجة عشرية *</label>
                    <ComboboxField
                      items={[".", ","]}
                      value={systemSettings.money.decimalSeparator}
                      onValueChange={(val) => handleUpdate("money", "decimalSeparator", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">فاصل درجة الفيه *</label>
                    <ComboboxField
                      items={[",", ".", " "]}
                      value={systemSettings.money.thousandSeparator}
                      onValueChange={(val) => handleUpdate("money", "thousandSeparator", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">اظهار رمز العملة *</label>
                    <ComboboxField
                      items={["تمكين", "تعطيل"]}
                      value={systemSettings.money.showCurrencySymbol ? "تمكين" : "تعطيل"}
                      onValueChange={(val) => handleUpdate("money", "showCurrencySymbol", val === "تمكين")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">رمز العملة</label>
                    <Input type="text" value={systemSettings.money.currencySymbol} onChange={(e) => handleUpdate("money", "currencySymbol", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العلامات العشرية لفاتورة الـ A4 *</label>
                    <ComboboxField
                      items={[2, 3, 4]}
                      value={systemSettings.money.a4InvoiceDecimals}
                      onValueChange={(val) => handleUpdate("money", "a4InvoiceDecimals", parseInt(val))}
                    />
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "barcode" && (
              <SettingSection id="barcode" title={t("barcode_scale")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">نوع الباركود</label>
                    <ComboboxField
                      items={["الوزن/الكمية"]}
                      value={systemSettings.barcode.type}
                      onValueChange={(val) => handleUpdate("barcode", "type", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الحروف الكلية للباركود</label>
                    <Input type="number" value={systemSettings.barcode.totalCharacters} onChange={(e) => handleUpdate("barcode", "totalCharacters", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Flag Characters</label>
                    <Input type="text" value={systemSettings.barcode.flagCharacters} onChange={(e) => handleUpdate("barcode", "flagCharacters", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مكان بدء الباركود</label>
                    <Input type="number" value={systemSettings.barcode.codeStart} onChange={(e) => handleUpdate("barcode", "codeStart", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد الحروف فى الكود</label>
                    <Input type="number" value={systemSettings.barcode.codeLength} onChange={(e) => handleUpdate("barcode", "codeLength", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مكان بداية الوزن</label>
                    <Input type="number" value={systemSettings.barcode.weightStart} onChange={(e) => handleUpdate("barcode", "weightStart", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد الحروف فى الوزن</label>
                    <Input type="number" value={systemSettings.barcode.weightLength} onChange={(e) => handleUpdate("barcode", "weightLength", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الوزن مقسوم على</label>
                    <Input type="number" value={systemSettings.barcode.weightDivider} onChange={(e) => handleUpdate("barcode", "weightDivider", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "email" && (
              <SettingSection id="email" title={t("email_settings")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">بروتوكول البريد الإلكتروني *</label>
                    <ComboboxField
                      items={["SMTP"]}
                      value={systemSettings.email.protocol}
                      onValueChange={(val) => handleUpdate("email", "protocol", val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">المضيف SMTP</label>
                    <Input type="text" value={systemSettings.email.smtpHost} onChange={(e) => handleUpdate("email", "smtpHost", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP مستخدم</label>
                    <Input type="text" value={systemSettings.email.smtpUser} onChange={(e) => handleUpdate("email", "smtpUser", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP كلمة المرور</label>
                    <Input type="password" value={systemSettings.email.smtpPassword} onChange={(e) => handleUpdate("email", "smtpPassword", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP PORT</label>
                    <Input type="number" value={systemSettings.email.smtpPort} onChange={(e) => handleUpdate("email", "smtpPort", parseInt(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP تشفير</label>
                    <ComboboxField
                      items={["SSL", "TLS"]}
                      value={systemSettings.email.smtpEncryption}
                      onValueChange={(val) => handleUpdate("email", "smtpEncryption", val)}
                    />
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "points" && (
              <SettingSection id="points" title={t("earned_points")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-[var(--text-main)]">جائزة العملاء نقاط</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">كل مصروف يساوي</label>
                        <Input type="number" value={systemSettings.points.customerPointsPerSpend} onChange={(e) => handleUpdate("points", "customerPointsPerSpend", parseFloat(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                      </div>
                      <div className="pt-6">
                        <Save size={20} className="text-[var(--primary)]" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">اجمالي النقاط المكتسبة</label>
                        <Input type="number" value={systemSettings.points.totalCustomerPoints} onChange={(e) => handleUpdate("points", "totalCustomerPoints", parseFloat(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-[var(--text-main)]">جائزة الموظفين نقاط</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">كل في بيع ما يعادل</label>
                        <Input type="number" value={systemSettings.points.staffPointsPerSale} onChange={(e) => handleUpdate("points", "staffPointsPerSale", parseFloat(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                      </div>
                      <div className="pt-6">
                        <Save size={20} className="text-[var(--primary)]" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">اجمالي النقاط المكتسبة</label>
                        <Input type="number" value={systemSettings.points.totalStaffPoints} onChange={(e) => handleUpdate("points", "totalStaffPoints", parseFloat(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "fees" && (
              <SettingSection id="fees" title={t("sales_fees")} onSave={handleSave}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Input type="checkbox" id="enable_fees" checked={systemSettings.fees.enableFees} onChange={(e) => handleUpdate("fees", "enableFees", e.target.checked)} className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded" />
                    <label htmlFor="enable_fees" className="text-sm font-medium text-[var(--text-main)]">
                      تفعيل رسوم البيع
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">قيمة رسوم البيع % *</label>
                      <Input type="number" value={systemSettings.fees.feesValue} onChange={(e) => handleUpdate("fees", "feesValue", parseFloat(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الحد الأدنى لرسوم البيع *</label>
                      <Input type="number" value={systemSettings.fees.minFees} onChange={(e) => handleUpdate("fees", "minFees", parseFloat(e.target.value))} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "reports" && (
              <SettingSection id="reports" title={t("report_print_settings")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حالة الترويسة العلوية</label>
                    <ComboboxField
                      items={["إظهار", "إخفاء"]}
                      value={systemSettings.reports.headerStatus ? "إظهار" : "إخفاء"}
                      onValueChange={(val) => handleUpdate("reports", "headerStatus", val === "إظهار")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">صورة الترويسة العلوية Max( 2500px w * 600px h)</label>
                    <div className="flex gap-2">
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors font-bold">
                        <FileText size={16} />
                        استعراض ...
                      </button>
                      <Input type="text" value={systemSettings.reports.headerImage} onChange={(e) => handleUpdate("reports", "headerImage", e.target.value)} className="flex-1 p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                  </div>
                </div>
              </SettingSection>
            )}
            {activeSection === "sales_print" && (
              <SettingSection id="sales_print" title={t("sales_print_settings")} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طباعة الترويسة العلوية *</label>
                    <ComboboxField
                      items={["إظهار", "إخفاء"]}
                      value={systemSettings.salesPrint.printHeader ? "إظهار" : "إخفاء"}
                      onValueChange={(val) => handleUpdate("salesPrint", "printHeader", val === "إظهار")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">صورة الترويسة العلوية Max( 2500px w * 600px h)</label>
                    <div className="flex gap-2">
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors font-bold">
                        <FileText size={16} />
                        استعراض ...
                      </button>
                      <Input type="text" value={systemSettings.salesPrint.headerImage} onChange={(e) => handleUpdate("salesPrint", "headerImage", e.target.value)} className="flex-1 p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">خيار البائع والمستلم</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.salesPrint.showSellerAndRecipient ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("salesPrint", "showSellerAndRecipient", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل طباعة dot matrix *</label>
                    <ComboboxField
                      items={["نعم", "لا"]}
                      value={systemSettings.salesPrint.enableDotMatrix ? "نعم" : "لا"}
                      onValueChange={(val) => handleUpdate("salesPrint", "enableDotMatrix", val === "نعم")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حقل رقم أمر الشراء *</label>
                    <Input type="text" value={systemSettings.salesPrint.purchaseOrderField} onChange={(e) => handleUpdate("salesPrint", "purchaseOrderField", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حقل اسم المشروع *</label>
                    <Input type="text" value={systemSettings.salesPrint.projectNameField} onChange={(e) => handleUpdate("salesPrint", "projectNameField", e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" />
                  </div>
                </div>
              </SettingSection>
            )}{" "}
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
