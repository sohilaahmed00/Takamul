import React, { useState } from "react";
import { Users, Search, Plus, Edit2, Trash2, Shield, X, Save } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useUserGroups, type Permission, type UserGroup } from "@/context/UserGroupsContext";
import { cn } from "@/lib/utils";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

import ResponsiveModal from "@/components/modals/ResponsiveModal";

import { Input } from "@/components/ui/input";

export default function UserGroups() {
  const { t, direction } = useLanguage();
  const { userGroups, addUserGroup, updateUserGroup, deleteUserGroup } = useUserGroups();

  const [view, setView] = useState<"list" | "permissions">("list");
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const filteredGroups = userGroups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()) || group.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({ name: "", description: "" });
    setShowAddEditModal(true);
  };

  const handleEditClick = (group: UserGroup) => {
    setIsEditing(true);
    setSelectedGroup(group);
    setFormData({ name: group.name, description: group.description });
    setShowAddEditModal(true);
  };

  const handlePermissionsClick = (group: UserGroup) => {
    setSelectedGroup(group);
    setView("permissions");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isEditing && selectedGroup) {
      updateUserGroup(selectedGroup.id, formData);
    } else {
      addUserGroup({
        ...formData,
        permissions: {
          items: { view: true, add: false, edit: false, delete: false },
          sales: { view: true, add: false, edit: false, delete: false },
          purchases: { view: true, add: false, edit: false, delete: false },
          customers: { view: true, add: false, edit: false, delete: false },
          suppliers: { view: true, add: false, edit: false, delete: false },
          reports: { view: true, add: false, edit: false, delete: false },
        },
      });
    }
    setShowAddEditModal(false);
  };

  const handleDeleteConfirm = () => {
    if (groupToDelete) {
      deleteUserGroup(groupToDelete);
      setGroupToDelete(null);
    }
  };

  const togglePermission = (module: string, action: keyof Permission) => {
    if (!selectedGroup) return;

    const currentPermissions = { ...selectedGroup.permissions };
    const modulePerms = { ...(currentPermissions[module] || { view: false, add: false, edit: false, delete: false }) };

    // @ts-ignore
    modulePerms[action] = !modulePerms[action];
    currentPermissions[module] = modulePerms;

    updateUserGroup(selectedGroup.id, { permissions: currentPermissions });
  };

  const modules = [
    { id: "items", label: "الأصناف" },
    { id: "sales", label: "المبيعات" },
    { id: "shipping", label: "الشحن والتسليم" },
    { id: "gift_cards", label: "بطاقات هدية" },
    { id: "quotes", label: "عروض الأسعار" },
    { id: "purchases", label: "المشتريات" },
    { id: "transfers", label: "تحويل المخزون" },
    { id: "customers", label: "العملاء" },
    { id: "suppliers", label: "الموردين" },
    { id: "banks", label: "البنوك" },
    { id: "reports", label: "التقارير" },
    { id: "misc", label: "متنوع" },
  ];

  if (view === "permissions" && selectedGroup) {
    return (
      <div className="p-4 space-y-4" dir="rtl">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          <div className="bg-table-header p-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("list")} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                <X size={18} />
              </button>
              <div>
                <h1 className="text-lg font-bold">ضوابط وصلاحيات المجموعة ({selectedGroup.description})</h1>
                <p className="text-xs opacity-90 font-bold">الرجاء تعيين الصلاحيات للمجموعة أدناه</p>
              </div>
            </div>
            <button onClick={() => setView("list")} className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded transition-colors text-sm font-bold shadow-sm">
              <Save size={18} />
              تحديث
            </button>
          </div>

          <div className="p-4">
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-table-header text-white">
                    <th className="p-3 font-bold border border-table-header-border text-sm">اسم وحدة</th>
                    <th className="p-3 font-bold border border-table-header-border text-sm text-center">عرض</th>
                    <th className="p-3 font-bold border border-table-header-border text-sm text-center">إضافة</th>
                    <th className="p-3 font-bold border border-table-header-border text-sm text-center">تعديل</th>
                    <th className="p-3 font-bold border border-table-header-border text-sm text-center">حذف</th>
                    <th className="p-3 font-bold border border-table-header-border text-sm text-center">متنوع</th>
                  </tr>
                </thead>
                <tbody className="bg-table-row">
                  {modules.map((module) => (
                    <tr key={module.id} className="hover:bg-table-row-hover transition-colors border-b border-gray-100 dark:border-border">
                      <td className="p-3 font-bold text-gray-900 dark:text-white border-x border-gray-100 dark:border-border text-sm">{module.label}</td>
                      <td className="p-3 border-x border-gray-100 dark:border-border text-center">
                        <Input type="checkbox" checked={selectedGroup.permissions[module.id]?.view || false} onChange={() => togglePermission(module.id, "view")} className="w-4 h-4 accent-primary" />
                      </td>
                      <td className="p-3 border-x border-gray-100 dark:border-border text-center">
                        <Input type="checkbox" checked={selectedGroup.permissions[module.id]?.add || false} onChange={() => togglePermission(module.id, "add")} className="w-4 h-4 accent-primary" />
                      </td>
                      <td className="p-3 border-x border-gray-100 dark:border-border text-center">
                        <Input type="checkbox" checked={selectedGroup.permissions[module.id]?.edit || false} onChange={() => togglePermission(module.id, "edit")} className="w-4 h-4 accent-primary" />
                      </td>
                      <td className="p-3 border-x border-gray-100 dark:border-border text-center">
                        <Input type="checkbox" checked={selectedGroup.permissions[module.id]?.delete || false} onChange={() => togglePermission(module.id, "delete")} className="w-4 h-4 accent-primary" />
                      </td>
                      <td className="p-3 border-x border-gray-100 dark:border-border text-center">
                        <span className="text-xs text-gray-400">-</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
        <div className={cn("flex flex-col", direction === "rtl" ? "text-right" : "text-left")}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {t("user_groups")}
            <Users size={20} className="text-primary" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("customize_report_below")}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-sm">
            <Plus size={18} />
            {t("add_group")}
          </button>
        </div>
      </div>

      <DeleteConfirmationModal isOpen={!!groupToDelete} onClose={() => setGroupToDelete(null)} onConfirm={handleDeleteConfirm} itemName={userGroups.find((g) => g.id === groupToDelete)?.name} />

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64 order-2 md:order-1">
              <Input type="text" placeholder={t("search_placeholder") || "اكتب ما تريد ان تبحث عنه"} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={cn("w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-primary text-sm", direction === "rtl" ? "pr-10" : "pl-10")} />
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", direction === "rtl" ? "right-3" : "left-3")} size={18} />
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className={cn("w-full border-collapse", direction === "rtl" ? "text-right" : "text-left")}>
              <thead>
                <tr className="bg-[var(--table-header)] text-white">
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t("group_id")}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t("group_name")}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t("group_description")}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10 text-center">{t("actions")}</th>
                  <th className="p-3 w-10 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                      {t("no_data_in_table")}
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((group) => (
                    <tr key={`desktop-${group.id}`} className="hover:bg-primary/5 transition-colors border-b border-gray-100 dark:border-gray-700">
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm text-gray-500">{group.id}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 font-bold text-sm">{group.name}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm text-gray-500">{group.description}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handlePermissionsClick(group)} className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors border border-orange-100 dark:border-orange-900/30" title={t("permissions")}>
                            <Shield size={16} />
                          </button>
                          <button onClick={() => handleEditClick(group)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30" title={t("edit")}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setGroupToDelete(group.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30" title={t("delete")}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Input type="checkbox" className="w-4 h-4 accent-primary" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">{t("no_data_in_table")}</div>
            ) : (
              filteredGroups.map((group) => (
                <div key={`mobile-${group.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-primary">{group.name}</div>
                      <div className="text-xs text-gray-500">{group.id}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{group.description}</div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => handlePermissionsClick(group)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-100 transition-colors flex items-center gap-1 text-xs font-bold">
                      <Shield size={16} />
                      {t("permissions")}
                    </button>
                    <button onClick={() => handleEditClick(group)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold">
                      <Edit2 size={16} />
                      {t("edit")}
                    </button>
                    <button onClick={() => setGroupToDelete(group.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold">
                      <Trash2 size={16} />
                      {t("delete")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{t("showing")}</span>
              <span className="font-bold text-gray-900 dark:text-white">1</span>
              <span>{t("to")}</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredGroups.length}</span>
              <span>{t("of")}</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredGroups.length}</span>
              <span>{t("records")}</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">{t("previous")}</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">{t("next")}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <ResponsiveModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={isEditing ? t("edit_user_group") : t("add_group")}
        maxWidth="max-w-md"
        footer={
          <button onClick={() => handleSubmit()} className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold shadow-sm">
            {isEditing ? t("edit_user_group") : t("add_group")}
          </button>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-emerald-800 font-bold mb-4">{t("please_fill_info")}</p>

          <div className="space-y-1 text-right">
            <label className="block text-sm font-bold text-emerald-800">{t("group_name")} *</label>
            <Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white text-right" />
          </div>

          <div className="space-y-1 text-right">
            <label className="block text-sm font-bold text-emerald-800">{t("description")} *</label>
            <Input type="text" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 bg-white text-right" />
          </div>
        </form>
      </ResponsiveModal>
    </div>
  );
}
