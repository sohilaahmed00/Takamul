import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups, defaultPermissions, type ModulePermissions } from "@/context/GroupsContext";
import { useLanguage } from "@/context/LanguageContext";
import { CheckSquare, Square, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";

const GroupPermissions = () => {
  const { id } = useParams<{ id: string }>();
  const { direction, language, t } = useLanguage();
  const navigate = useNavigate();
  const { groups, updateGroup } = useGroups();
  const group = groups.find((g) => g.id === Number(id));

  const [permissions, setPermissions] = useState<Record<string, ModulePermissions>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (group && group.permissions) {
      const mergedPermissions = { ...defaultPermissions };
      Object.keys(group.permissions).forEach((module) => {
        if (mergedPermissions[module]) {
          mergedPermissions[module] = {
            ...mergedPermissions[module],
            ...group.permissions[module],
            extra: {
              ...mergedPermissions[module].extra,
              ...group.permissions[module].extra,
            },
          };
        } else {
          mergedPermissions[module] = group.permissions[module];
        }
      });
      setPermissions(mergedPermissions);
    } else if (group) {
      setPermissions(defaultPermissions);
    }
  }, [group]);

  if (!group) {
    return <div className="p-8 text-center">Group not found</div>;
  }

  const handleToggleModule = (module: string) => {
    const perm = permissions[module];
    if (!perm) return;

    const allChecked = perm.view && perm.add && perm.edit && perm.delete && (!perm.extra || Object.values(perm.extra).every((v) => v));

    const newState = {
      ...permissions,
      [module]: {
        ...perm,
        view: !allChecked,
        add: !allChecked,
        edit: !allChecked,
        delete: !allChecked,
        extra: perm.extra ? Object.keys(perm.extra).reduce((acc, key) => ({ ...acc, [key]: !allChecked }), {}) : undefined,
      },
    };
    setPermissions(newState);
  };

  const handleToggleField = (module: string, field: keyof ModulePermissions) => {
    if (field === "extra") {
      const perm = permissions[module];
      if (!perm || !perm.extra) return;
      const allExtraChecked = Object.values(perm.extra).every((v) => v);
      setPermissions((prev) => ({
        ...prev,
        [module]: {
          ...prev[module],
          extra: Object.keys(perm.extra!).reduce((acc, key) => ({ ...acc, [key]: !allExtraChecked }), {}),
        },
      }));
      return;
    }

    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [field]: !prev[module][field],
      },
    }));
  };

  const handleToggleExtra = (module: string, extraKey: string) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        extra: {
          ...prev[module].extra,
          [extraKey]: !prev[module].extra?.[extraKey],
        },
      },
    }));
  };

  const handleToggleAll = () => {
    const permsList = Object.values(permissions) as ModulePermissions[];
    const allChecked = permsList.every((p) => p.view && p.add && p.edit && p.delete && (!p.extra || Object.values(p.extra).every((v) => v)));

    const newState = { ...permissions };
    Object.keys(newState).forEach((module) => {
      newState[module] = {
        ...newState[module],
        view: !allChecked,
        add: !allChecked,
        edit: !allChecked,
        delete: !allChecked,
        extra: newState[module].extra ? Object.keys(newState[module].extra!).reduce((acc, key) => ({ ...acc, [key]: !allChecked }), {}) : undefined,
      };
    });
    setPermissions(newState);
  };

  const handleSave = () => {
    updateGroup(group.id, { permissions });
    alert(language === "ar" ? "تم حفظ الصلاحيات بنجاح" : "Permissions saved successfully");
    navigate("/settings/groups");
  };

  const labels: Record<string, { ar: string; en: string }> = {
    products: { ar: "الأصناف", en: "Products" },
    sales: { ar: "المبيعات", en: "Sales" },
    shipping: { ar: "الشحن والتسليم", en: "Shipping" },
    gift_cards: { ar: "بطاقات هدية", en: "Gift Cards" },
    quotes: { ar: "عروض الأسعار", en: "Quotes" },
    purchases: { ar: "المشتريات", en: "Purchases" },
    transfers: { ar: "تحويل المخزون", en: "Transfers" },
    customers: { ar: "العملاء", en: "Customers" },
    suppliers: { ar: "الموردين", en: "Suppliers" },
    banks: { ar: "البنوك", en: "Banks" },
    reports: { ar: "التقارير", en: "Reports" },
    misc: { ar: "متنوع", en: "Misc" },
    view: { ar: "عرض", en: "View" },
    add: { ar: "إضافة", en: "Add" },
    edit: { ar: t("edit"), en: "Edit" },
    delete: { ar: "حذف", en: "Delete" },
    extra: { ar: "متنوع / إضافي", en: "Misc / Extra" },
    cost: { ar: "تكلفة الصنف", en: "Cost Price" },
    price: { ar: "سعر الصنف", en: "Product Price" },
    quantity_adj: { ar: "التعديلات الكمية", en: "Quantity Adjustments" },
    damage: { ar: "عمليات التوالف", en: "Damage Operations" },
    barcode: { ar: "طباعة باركود", en: "Print Barcode" },
    branch_stock: { ar: "جرد الفروع", en: "Branch Stock" },
    branch_prices: { ar: "الأسعار في الفروع", en: "Branch Prices" },
    email: { ar: "البريد الإلكتروني", en: "Email" },
    pdf: { ar: "PDF", en: "PDF" },
    pos: { ar: "نقاط البيع", en: "POS" },
    payments: { ar: "المدفوعات", en: "Payments" },
    returns: { ar: "الرجيع", en: "Returns" },
    all_sales: { ar: "جميع المبيعات", en: "All Sales" },
    reprint: { ar: "طباعة الفاتورة مرة أخرى", en: "Reprint Invoice" },
    close_shift: { ar: "اغلاق الوردية", en: "Close Shift" },
    link_reps: { ar: "ربط المندوبين بالعملاء", en: "Link Reps to Customers" },
    deposits: { ar: "الايداعات (عرض، تعديل، حذف)", en: "Deposits (View, Edit, Delete)" },
    delete_deposit: { ar: "حذف ايداع", en: "Delete Deposit" },
    external: { ar: "التحويلات البنكية الخارجية", en: "External Bank Transfers" },
    add_external: { ar: "اضافة تحويل بنكي خارجي", en: "Add External Transfer" },
    internal: { ar: "التحويلات البنكية الداخلية", en: "Internal Bank Transfers" },
    add_internal: { ar: "اضافة تحويل بنكي داخلي", en: "Add Internal Transfer" },
    edit_transfer: { ar: "تعديل التحويل البنكي", en: "Edit Bank Transfer" },
    delete_transfer: { ar: "حذف التحويل البنكي", en: "Delete Bank Transfer" },
    reorder_alert: { ar: "الأصناف تحت حد الطلب", en: "Reorder Point Alert" },
    expiry_alert: { ar: "تنبيه صلاحية الأصناف", en: "Expiry Alert" },
    items: { ar: "الأصناف", en: "Items" },
    daily_sales: { ar: "المبيعات اليومية", en: "Daily Sales" },
    monthly_sales: { ar: "المبيعات الشهرية", en: "Monthly Sales" },
    taxes: { ar: "تقرير الضرائب", en: "Tax Report" },
    expenses: { ar: "المصروفات", en: "Expenses" },
    daily_purchases: { ar: "المشتريات اليومية", en: "Daily Purchases" },
    monthly_purchases: { ar: "المشتريات الشهرية", en: "Monthly Purchases" },
    staff: { ar: "العاملين", en: "Staff" },
    till: { ar: "تقرير الصندوق", en: "Till Report" },
    item_sales_invoice: { ar: "تقرير مبيعات الأصناف حسب الفاتورة", en: "Item Sales by Invoice Report" },
    bulk: { ar: "عمليات جماعية", en: "Bulk Actions" },
    edit_price_sale: { ar: "تعديل السعر أثناء البيع", en: "Edit Price During Sale" },
    add_delivery: { ar: "إضافة تسليم", en: "Add Delivery" },
    view_profit: { ar: "مشاهدة الأرباح", en: "View Profit" },
    general_accounts: { ar: "الحسابات العامة", en: "General Accounts" },
    bonds: { ar: "السندات", en: "Bonds" },
  };

  const getLabel = (key: string) =>
    labels[key]?.[language as "ar" | "en" | "ur"] ||
    labels[key]?.en ||
    labels[key]?.ar ||
    key;

  const PermissionTree = ({ label, checked, onToggle, children, level = 0, moduleId }: { label: string; checked: boolean; onToggle: () => void; children?: React.ReactNode; level?: number; moduleId?: string; key?: string | number }) => {
    const isExpanded = moduleId ? expanded[moduleId] : true;

    return (
      <div className="select-none">
        <div
          className={`flex items-center gap-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded px-2 transition-colors border-b border-gray-50 last:border-0`}
          style={{ [direction === "rtl" ? "paddingRight" : "paddingLeft"]: `${level * 24}px` }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <div
            className="flex items-center justify-center w-5 h-5 text-[var(--primary)] cursor-pointer"
            onClick={(e) => {
              if (moduleId) {
                e.stopPropagation();
                setExpanded((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
              }
            }}
          >
            {moduleId ? isExpanded ? <ChevronDown size={14} /> : direction === "rtl" ? <ChevronLeft size={14} /> : <ChevronRight size={14} /> : null}
          </div>

          <div className="text-[var(--primary)]">{checked ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-300" />}</div>

          <span className={`text-sm ${level === 0 ? "font-bold" : "font-medium"} text-gray-700`}>{label}</span>
        </div>

        {children && isExpanded && <div className="mt-0.5">{children}</div>}
      </div>
    );
  };

  const modules = Object.keys(defaultPermissions);
  const permsList = Object.values(permissions) as ModulePermissions[];
  const allChecked = permsList.length > 0 && permsList.every((p) => p.view && p.add && p.edit && p.delete && (!p.extra || Object.values(p.extra).every((v) => v)));

  return (
    <div className="space-y-4 max-w-4xl mx-auto" dir={direction}>
      <div className={`flex justify-between items-center px-2`}>
        <div className="text-[var(--primary)] font-bold text-xs">{language === "ar" ? "الرجاء تعيين الصلاحيات للمجموعة ادناه" : "Please set permissions for the group below"}</div>
        <button onClick={handleToggleAll} className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:opacity-80 transition-opacity">
          {allChecked ? <CheckSquare size={16} /> : <Square size={16} />}
          {language === "ar" ? "تحديد الكل" : "Select All"}
        </button>
      </div>

      {/* Header */}
      <div className="bg-[var(--table-header)] p-2.5 text-[var(--table-header-text)] flex justify-center items-center font-bold text-xs shadow-sm rounded-t-lg">
        <span>{language === "ar" ? `${group.description} ( ${group.name} ) ضوابط وصلاحيات المجموعة` : `Group Permissions: ${group.description} (${group.name})`}</span>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-b-lg p-4">
        <div className="space-y-1">
          {modules.map((module) => {
            const perm = permissions[module];
            if (!perm) return null;

            const moduleChecked = perm.view && perm.add && perm.edit && perm.delete && (!perm.extra || Object.values(perm.extra).every((v) => v));

            return (
              <PermissionTree key={module} moduleId={module} label={getLabel(module)} checked={moduleChecked} onToggle={() => handleToggleModule(module)}>
                <div className="space-y-0.5">
                  {(["view", "add", "edit", "delete"] as const).map((field) => (
                    <PermissionTree key={`${module}-${field}`} level={1} label={getLabel(field)} checked={perm[field]} onToggle={() => handleToggleField(module, field)} />
                  ))}

                  {perm.extra && (
                    <PermissionTree level={1} label={getLabel("extra")} checked={Object.values(perm.extra).every((v) => v)} onToggle={() => handleToggleField(module, "extra")}>
                      <div className="space-y-0.5">
                        {Object.keys(perm.extra).map((extraKey) => (
                          <PermissionTree key={`${module}-extra-${extraKey}`} level={2} label={getLabel(extraKey)} checked={perm.extra![extraKey]} onToggle={() => handleToggleExtra(module, extraKey)} />
                        ))}
                      </div>
                    </PermissionTree>
                  )}
                </div>
              </PermissionTree>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={handleSave} className="btn-primary px-10 py-2.5">
          {language === "ar" ? "تحديث" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default GroupPermissions;
