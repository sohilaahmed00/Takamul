import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileText, Search, Edit2, Trash2, ArrowRight, ArrowLeft, Download, Printer, Menu, LayoutGrid, ShoppingCart, ArrowUp, ArrowDown, PlusCircle, DollarSign, FileSpreadsheet, Mail, Filter, MoreHorizontal, RotateCcw, Warehouse, FileCheck, FileDown, MessageCircle, UserCog } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllSales } from "../features/sales/hooks/useGetAllSales";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { SalesOrder } from "@/features/sales/types/sales.types";
import formatDate from "@/lib/formatDate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGetAllRoles } from "@/features/roles/hooks/useGetAllRoles";
import { Role } from "@/features/roles/types/roles.types";
import { useDeleteRole } from "@/features/roles/hooks/useDeleteRole";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
export default function RolesPage() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { data: roles } = useGetAllRoles({ page: currentPage, limit: entriesPerPage });
  const { mutate: deleterole } = useDeleteRole();

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className=" pr-11 " />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  const hasPermission = useAuthStore((state) => state?.hasPermission);
  const hasAnyPermission = useAuthStore((state) => state?.hasAnyPermission);

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>الصللاحيات</CardTitle>
        <CardDescription>إدارة الصلاحيات</CardDescription>
        {hasPermission(Permissions?.roles?.add) && (
          <CardAction>
            <Button size="xl" variant={"default"} asChild>
              <Link to={"/add-roles"}>إضافة صلاحية</Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <DataTable
          value={roles?.items || []}
          lazy
          paginator
          rows={entriesPerPage}
          first={(currentPage - 1) * entriesPerPage}
          totalRecords={roles?.totalCount || 0}
          onPage={(e: DataTablePageEvent) => {
            if (e.page === undefined) return;
            setCurrentPage(e.page + 1);
            setEntriesPerPage(e.rows);
          }}
          loading={!roles?.items}
          header={header}
          responsiveLayout="stack"
          className="custom-green-table custom-compact-table"
          dataKey="roleId"
          stripedRows={false}
        >
          <Column header={"اسم الصلاحية"} sortable field="roleName" />
          <Column header={"عدد الاذونات"} sortable field="permissions" body={(raw: Role) => raw?.permissions?.length} />
          {hasAnyPermission([Permissions?.roles?.edit, Permissions?.roles?.delete]) && (
            <Column
              header={t("actions")}
              body={(raw: Role) => {
                return (
                  <div className="space-x-2">
                    {hasPermission(Permissions?.roles?.edit) && (
                      <Link to={`/roles/${raw?.roleId}`} className="btn-minimal-action btn-edit">
                        <Edit2 size={16} />
                      </Link>
                    )}
                    {hasPermission(Permissions?.roles?.delete) && (
                      <button onClick={() => deleterole(raw?.roleName)} className="btn-minimal-action btn-delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              }}
            />
          )}
        </DataTable>
      </CardContent>
    </Card>
  );
}
