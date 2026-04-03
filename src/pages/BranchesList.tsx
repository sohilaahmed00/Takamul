import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Edit2, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useDeleteBranch } from "@/features/Branches/hooks/Usedeletebranch";
import {
  Card, CardAction, CardContent,
  CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import type { BranchListItem } from "@/features/Branches/types/Branches.types";
import useToast from "@/hooks/useToast";

export default function Branches() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { notifyError } = useToast();

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [rowToDelete, setRowToDelete] = useState<BranchListItem | null>(null);

  const { data: branches, isLoading } = useGetAllBranches();
  const { mutateAsync: deleteBranch, isPending: isDeleting } = useDeleteBranch();

  const filteredRows = useMemo(() => {
    const term = globalFilterValue.trim().toLowerCase();
    if (!term) return branches ?? [];
    return (branches ?? []).filter((r) =>
      r.name?.toLowerCase().includes(term) ||
      r.code?.toLowerCase().includes(term) ||
      r.phone?.toLowerCase().includes(term)
    );
  }, [branches, globalFilterValue]);

  const handleDelete = async () => {
    if (!rowToDelete) return;
    try {
      await deleteBranch(rowToDelete.id);
      setRowToDelete(null);
    } catch (error: any) {
      notifyError(error?.response?.data?.message || error?.message || t("error_occurred") || "حدث خطأ");
    }
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={globalFilterValue}
          onChange={(e) => { setGlobalFilterValue(e.target.value); setCurrentPage(1); }}
          placeholder={t("search_placeholder") || "ابحث باسم الفرع أو الكود أو الهاتف..."}
          className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none"
        />
      </div>
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);

  const statusBody = (row: BranchListItem) => (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {row.isActive ? (t("active") || "نشط") : (t("inactive") || "غير نشط")}
    </span>
  );

  const actionsBody = (row: BranchListItem) => (
    <div className="flex items-center gap-2">
      <Link
        to={`/branches/edit/${row.id}`}
        className="btn-minimal-action btn-edit"
      >
        <Edit2 size={16} />
      </Link>
      <Link
        to={`/branches/view/${row.id}`}
        className="btn-minimal-action btn-view"
      >
        <Eye size={16} />
      </Link>
      {/* <button
        onClick={() => setRowToDelete(row)}
        className="btn-minimal-action btn-delete"
      >
        <Trash2 size={16} />
      </button> */}
    </div>
  );

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle className="flex items-center gap-2">
            <Building2 size={20} className="text-[var(--primary)]" />
            {t("branches") || "قائمة الفروع"}
          </CardTitle>
          {/* <CardDescription>
            {t("branches_desc") || "إدارة وعرض فروع المنشأة"}
          </CardDescription> */}
          <CardAction className="max-md:flex max-md:justify-end max-md:mt-2">
            <Button variant="default" asChild>
              <Link to="/branches/create">
                <Plus size={18} />
                {t("add_branch") || "إضافة فرع"}
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DataTable
            value={filteredRows}
            loading={isLoading || isDeleting}
            totalRecords={filteredRows.length}
            paginator
            rows={entriesPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            first={(currentPage - 1) * entriesPerPage}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            emptyMessage={t("no_data_in_table") || "لا توجد بيانات"}
          >
            <Column
              field="code"
              header={t("branch_code")}
              sortable
              style={{ minWidth: "8rem" }}
              bodyStyle={{ whiteSpace: "nowrap" }}
            />
            <Column
              field="name"
              header={t("branch_name") || "اسم الفرع"}
              sortable
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="phone"
              header={t("phone") || "الهاتف"}
              body={(r: BranchListItem) => r.phone || "-"}
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="isActive"
              header={t("status") || "الحالة"}
              body={statusBody}
              style={{ minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            />
            <Column
              header={t("actions") || "الإجراءات"}
              body={actionsBody}
              style={{ minWidth: "10rem" }}
              bodyStyle={{ whiteSpace: "nowrap" }}
            />
          </DataTable>
        </CardContent>
      </Card>

      <DeleteTreasuryDialog
        open={!!rowToDelete}
        itemLabel={rowToDelete?.name ? `${t("branch") || "فرع"} "${rowToDelete.name}"` : ""}
        loading={isDeleting}
        onClose={() => setRowToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}