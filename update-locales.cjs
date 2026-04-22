const fs = require('fs');

const ar = require('./src/locales/ar.json');
const en = require('./src/locales/en.json');
const ur = require('./src/locales/ur.json');

const newTranslations = {
  // Common
  "enable_option": { ar: "تمكين", en: "Enable", ur: "فعال کریں" },
  "disable_option": { ar: "تعطيل", en: "Disable", ur: "غیر فعال کریں" },
  "required_fields_note": { ar: "يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية", en: "Please update the information below. Fields marked with * are mandatory", ur: "براہ کرم ذیل میں دی گئی معلومات کو اپ ڈیٹ کریں۔ * کے ساتھ نشان زد فیلڈز لازمی ہیں۔" },
  
  // Site Settings
  "default_currency": { ar: "العملة الافتراضية", en: "Default Currency", ur: "پہلے سے طے شدہ کرنسی" },
  "rows_per_page": { ar: "الصفوف لكل صفحة", en: "Rows Per Page", ur: "پتیاں فی صفحہ" },
  "default_payment_company": { ar: "الخزنة الافتراضية", en: "Default Vault", ur: "پہلے سے طے شدہ والٹ" },
  "show_actual_balance_entities": { ar: "إظهار الرصيد الفعلي للجهات", en: "Show Actual Balance for Entities", ur: "اداروں کے لئے اصل بیلنس دکھائیں" },
  "show_cost_greater_msg": { ar: "إظهار رسالة التكلفة أكبر من سعر البيع", en: "Show Cost Greater Than Sale Price Message", ur: "قیمت فروخت سے زیادہ لاگت کا پیغام دکھائیں" },
  "show_item_code_in_sales_print": { ar: "إظهار كود الصنف في المبيعات في الطباعة", en: "Show Item Code in Sales Printing", ur: "سیلز پرنٹنگ میں آئٹم کوڈ دکھائیں" },
  "show_item_code_in_quotes": { ar: "إظهار كود الصنف في عروض الأسعار", en: "Show Item Code in Quotes", ur: "اقتباسات میں آئٹم کوڈ دکھائیں" },
  "show_item_code_in_purchases": { ar: "إظهار كود الصنف في المشتريات", en: "Show Item Code in Purchases", ur: "خریداریوں میں آئٹم کوڈ دکھائیں" },

  // Items Settings
  "settings_item_tax": { ar: "ضريبة الصنف", en: "Item Tax", ur: "آئٹم ٹیکس" },
  "item_expiry_setting": { ar: "انتهاء صلاحية الصنف", en: "Item Expiry", ur: "آئٹم کی میعاد" },
  "show_warehouse_items_setting": { ar: "إظهار أصناف المخزن", en: "Show Warehouse Items", ur: "گودام کے آئٹمز دکھائیں" },
  "show_all_items_even_zero": { ar: "إظهار جميع الأصناف حتى لو رصيدها صفر", en: "Show All Items Even If Balance is Zero", ur: "تمام آئٹمز دکھائیں یہاں تک کہ بیلنس صفر ہو" },
  "hide_all_items_if_zero": { ar: "عدم إظهار جميع الأصناف حتى لو رصيدها صفر", en: "Do Not Show All Items If Balance is Zero", ur: "تمام آئٹمز نہ دکھائیں اگر بیلنس صفر ہو" },
  "enable_second_lang_name": { ar: "تفعيل اسم الصنف باللغة الثانية", en: "Enable Item Name in Secondary Language", ur: "ثانوی زبان میں آئٹم کا نام فعال کریں" },
  "enable_third_lang_name": { ar: "تفعيل اسم الصنف باللغة الثالثة", en: "Enable Item Name in Third Language", ur: "تیسری زبان میں آئٹم کا نام فعال کریں" },
  "show_product_balance_at_sale": { ar: "إظهار رصيد المنتج وقت البيع", en: "Show Product Balance at Sale Time", ur: "فروخت کے وقت پروڈکٹ کا بیلنس دکھائیں" },

  // Sales Settings
  "sell_if_zero": { ar: "البيع حتى لو كان الرصيد صفر", en: "Sell Even If Balance is Zero", ur: "فروخت کریں یہاں تک کہ بیلنس صفر ہو" },
  "enable_cursor_on_add_product": { ar: "وقوف المؤشر على إضافة منتج جديد", en: "Cursor Focus on Add New Product", ur: "نئی مصنوعات شامل کرنے پر کرسر فوکس" },
  "default_sales_payment_method": { ar: "طريقة الدفع الافتراضية للمبيعات", en: "Default Sales Payment Method", ur: "پہلے سے طے شدہ سیلز کی ادائیگی کا طریقہ" },
  "default_purchase_payment_method": { ar: "طريقة الدفع الافتراضية للمشتريات", en: "Default Purchases Payment Method", ur: "پہلے سے طے شدہ خریداری کی ادائیگی کا طریقہ" },
  "show_service_number": { ar: "إظهار رقم الخدمة", en: "Show Service Number", ur: "سروس نمبر دکھائیں" },
  "show_order_device_number": { ar: "إظهار رقم جهاز الطلب", en: "Show Order Device Number", ur: "آرڈر ڈیوائس نمبر دکھائیں" },
  "enable_glasses": { ar: "تفعيل النظارات", en: "Enable Glasses", ur: "چشمے فعال کریں" },
  
  // Payment Options
  "payment_network": { ar: "شبكة", en: "Network", ur: "نیٹ ورک" },
  "payment_cash": { ar: "كاش", en: "Cash", ur: "نقد" },
  "payment_credit": { ar: "آجل", en: "Credit", ur: "کریڈٹ" },

  // Barcode Settings
  "barcode_type": { ar: "نوع الباركود", en: "Barcode Type", ur: "بارکوڈ کی قسم" },
  "weight_qty_type": { ar: "الوزن/الكمية", en: "Weight/Quantity", ur: "وزن/مقدار" },
  "barcode_total_chars": { ar: "الحروف الكلية للباركود", en: "Total Barcode Characters", ur: "کل بارکوڈ کریکٹرز" },
  "barcode_flag_chars": { ar: "Flag Characters", en: "Flag Characters", ur: "فلیگ کریکٹرز" },
  "barcode_start_pos": { ar: "مكان بدء الباركود", en: "Barcode Start Position", ur: "بارکوڈ شروع ہونے کی جگہ" },
  "barcode_code_length": { ar: "عدد الحروف فى الكود", en: "Code Length", ur: "کوڈ کی لمبائی" },
  "barcode_weight_start": { ar: "مكان بداية الوزن", en: "Weight Start Position", ur: "وزن شروع ہونے کی پوزیشن" },
  "barcode_weight_length": { ar: "عدد الحروف فى الوزن", en: "Weight Length", ur: "وزن کی لمبائی" },
  "barcode_weight_divider": { ar: "الوزن مقسوم على", en: "Weight Divider", ur: "وزن کو تقسیم کیا گیا" },

  // Email Settings
  "email_protocol": { ar: "بروتوكول البريد الإلكتروني", en: "Email Protocol", ur: "ای میل پروٹوکول" },
  "smtp_host": { ar: "المضيف SMTP", en: "SMTP Host", ur: "SMTP ہوسٹ" },
  "smtp_user": { ar: "SMTP مستخدم", en: "SMTP User", ur: "SMTP صارف" },
  "smtp_password": { ar: "SMTP كلمة المرور", en: "SMTP Password", ur: "SMTP پاس ورڈ" },
  "smtp_port": { ar: "SMTP PORT", en: "SMTP Port", ur: "SMTP پورٹ" },
  "smtp_encryption": { ar: "SMTP تشفير", en: "SMTP Encryption", ur: "SMTP انکرپشن" }
};

for (const [key, langs] of Object.entries(newTranslations)) {
  if (!ar[key]) ar[key] = langs.ar;
  if (!en[key]) en[key] = langs.en;
  if (!ur[key]) ur[key] = langs.ur;
}

fs.writeFileSync('./src/locales/ar.json', JSON.stringify(ar, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('./src/locales/ur.json', JSON.stringify(ur, null, 2));

console.log("Locales updated!");
