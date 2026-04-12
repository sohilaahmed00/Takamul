import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Shield, UserCheck, UserX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useUsers } from "@/context/UsersContext";
import { useNavigate } from "react-router-dom";
import MobileDataCard from "@/components/MobileDataCard";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { cn } from "@/lib/utils";
import AddUserModal from "@/components/modals/AddUserModal";
import ComboboxField from "@/components/ui/ComboboxField";

import { Input } from "@/components/ui/input";

export default function UsersList() {
  const { t, direction } = useLanguage();
  const { users, deleteUser } = useUsers();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.usernameEmail.toLowerCase().includes(searchTerm.toLowerCase()));

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">{t("users_list")}</span>
      </div>

      {/* Page Header */}
      <div className="bg-[var(--bg-card)] p-4 rounded-t-2xl border border-[var(--border)] border-b-0 shadow-sm">
        {/* Page Header الموحد */}
        <div className="takamol-page-header">
          <div className={direction === "rtl" ? "text-right" : "text-left"}>
            <h1 className="takamol-page-title">قائمة المستخدمين</h1>
            <p className="takamol-page-subtitle">يرجى تخصيص التقرير أدناه</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={20} />
            إضافة مستخدم
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} onConfirm={confirmDelete} itemName={users.find((u) => u.id === userToDelete)?.firstName + " " + users.find((u) => u.id === userToDelete)?.lastName} />

      {/* Table Container */}
      <div className="bg-[var(--bg-card)] rounded-b-2xl shadow-sm border border-[var(--border)] p-4 min-h-[400px]">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80 order-2 md:order-1">
              <Input type="text" placeholder={t("search_placeholder") || "اكتب ما تريد ان تبحث عنه"} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={cn("w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--primary)] transition-all text-[var(--text-main)]", direction === "rtl" ? "pr-10" : "pl-10")} />
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)]", direction === "rtl" ? "right-3" : "left-3")} size={18} />
            </div>

            {/* Show Records */}
            <div className="flex items-center gap-2 order-1 md:order-2">
              <span className="text-sm text-[var(--text-muted)]">{t("show")}</span>
              <div className="w-20">
                <ComboboxField
                  items={[10, 25, 50, 100]}
                  value={10}
                  onValueChange={() => {}}
                />
              </div>
              <span className="text-sm text-[var(--text-muted)]">{t("records")}</span>
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto mt-6">
            <table className="takamol-table">
              <thead>
                <tr>
                  <th>{t("name")}</th>
                  <th>{t("username_email")}</th>
                  <th>{t("group")}</th>
                  <th>{t("phone")}</th>
                  <th>{t("status")}</th>
                  <th className="text-center">{t("actions")}</th>
                  <th className="w-10 text-center">
                    <Input type="checkbox" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] italic">
                      {t("no_data_in_table")}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={`desktop-${user.id}`}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[var(--primary)] font-bold text-xs border border-gray-200">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          <div className={direction === "rtl" ? "text-right" : "text-left"}>
                            <p className="font-bold text-[var(--text-main)] text-sm">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-[var(--text-main)]">{user.usernameEmail}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                          <Shield size={10} />
                          {user.group}
                        </span>
                      </td>
                      <td className="text-[var(--text-main)]">{user.phone}</td>
                      <td>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", user.status === "active" ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20" : "bg-red-100 text-red-700 border-red-200")}>
                          {user.status === "active" ? <UserCheck size={10} /> : <UserX size={10} />}
                          {user.status === "active" ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => navigate(`/users/edit/${user.id}`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title={t("edit")}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setUserToDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title={t("delete")}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="text-center">
                        <Input type="checkbox" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 mt-6">
            {filteredUsers.map((user) => (
              <MobileDataCard
                key={`mobile-${user.id}`}
                title={`${user.firstName} ${user.lastName}`}
                subtitle={user.email}
                status={{
                  label: user.status === "active" ? t("active") : t("inactive"),
                  type: user.status === "active" ? "success" : "danger",
                }}
                fields={[
                  { label: t("username_email"), value: user.usernameEmail },
                  { label: t("group"), value: user.group, isBadge: true, badgeType: "info" },
                  { label: t("phone"), value: user.phone },
                  { label: t("company"), value: user.company },
                ]}
                actions={
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/users/edit/${user.id}`)} className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-600 bg-blue-50 rounded-lg font-bold text-sm">
                      <Edit2 size={16} />
                      {t("edit")}
                    </button>
                    <button onClick={() => setUserToDelete(user.id)} className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 rounded-lg font-bold text-sm">
                      <Trash2 size={16} />
                      {t("delete")}
                    </button>
                  </div>
                }
              />
            ))}
            {filteredUsers.length === 0 && <div className="p-12 text-center text-[var(--text-muted)] bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">{t("no_data_in_table")}</div>}
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
              <span>{t("showing")}</span>
              <span className="font-bold text-[var(--text-main)]">1</span>
              <span>{t("to")}</span>
              <span className="font-bold text-[var(--text-main)]">{filteredUsers.length}</span>
              <span>{t("of")}</span>
              <span className="font-bold text-[var(--text-main)]">{filteredUsers.length}</span>
              <span>{t("records")}</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-main)] text-sm font-medium transition-colors text-[var(--text-main)]">{t("previous")}</button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--primary)] text-white font-bold text-sm shadow-sm">1</button>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-main)] text-sm font-medium transition-colors text-[var(--text-main)]">{t("next")}</button>
            </div>
          </div>
        </div>
      </div>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
