import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllEmployees } from "@/features/employees/hooks/useGetAllEmployees";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import AddEmployeeModal from "@/components/modals/AddEmployeeModal";

import { Input } from "@/components/ui/input";
import { Employee } from "@/features/employees/types/employees.types";
import AddUserModal from "@/components/modals/AddUserModal";
import { User } from "@/features/users/types/users.types";
import { useGetAllUsers } from "@/features/users/hooks/useGetAllUsers";

export default function UsersList() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const { data: users } = useGetAllUsers({ page: currentPage, limit: entriesPerPage, searchTerm: globalFilterValue });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };

  const header = useMemo(() => renderHeader(), [globalFilterValue]);

  return (
    <>
      {/* Breadcrumb */}

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>المستخدمين</CardTitle>
          <CardDescription>إدارة حسابات المستخدمين، التحكم في الصلاحيات، ومتابعة بياناتهم بسهولة من مكان واحد.</CardDescription>
          <CardAction>
            <Button size="xl" onClick={() => setIsAddModalOpen(true)}>
              إضافة مستخدم
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={users?.items}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={users?.totalCount || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!users?.items}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
          >
            <Column header="الإسم" field="firstName" />
            <Column field="userName" header="اسم المستخدم" />
            <Column header="رقم الجوال" field="mobile" />
            <Column
              header="العمليات"
              body={(raw: User) => (
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedUser(raw);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <button className="btn-minimal-action btn-compact-action text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedUser(undefined);
        }}
        user={selectedUser}
      />
    </>
  );
}
