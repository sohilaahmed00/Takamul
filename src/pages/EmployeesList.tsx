import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllEmployees } from "@/features/employees/hooks/useGetAllEmployees";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";

export default function AllEmployees() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const { data: employees } = useGetAllEmployees({ page: currentPage, limit: entriesPerPage, searchTerm: globalFilterValue });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search employee..." className="w-full border border-gray-200 focus:border-[var(--primary)] text-sm rounded-lg py-2 pr-11 pl-4 outline-none" />
      </div>
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue]);

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 font-medium px-2">
        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[var(--primary)]">
          {t("home")}
        </span>
        <span>/</span>
        <span className="text-gray-800">Employees</span>
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage employees</CardDescription>

          <CardAction>
            <Button asChild>
              <Link to="/employees/create">Add Employee</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DataTable
            value={employees?.data}
            rowsPerPageOptions={[5, 10, 20, 50]}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={employees?.totalCount || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!employees?.data}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
          >
            <Column field="id" header="ID" sortable />

            <Column header="Name" body={(row) => `${row.firstName} ${row.lastName}`} />

            <Column field="mobile" header="Phone" />
            <Column field="department" header="Department" />
            <Column field="position" header="Position" />
            <Column field="brunchName" header="Branch" />

            <Column
              header="Actions"
              body={(row) => (
                <div className="flex gap-2">
                  <Link to={`/employees/edit/${row.id}`} className="btn-minimal-action btn-compact-action">
                    <Edit2 size={16} />
                  </Link>
                  <button className="btn-minimal-action btn-compact-action text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
