import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, FileText, ArrowRight, ArrowLeft, Edit2, Trash2, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useGetQuantityAdjustments } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustments";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { QuantityAdjustment } from "@/features/quantity-adjustments/types/adjustments.types";
import { FilterMatchMode } from "primereact/api";

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuantityAdjustments() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    operationDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    performedBy: { value: null, matchMode: FilterMatchMode.CONTAINS },
    notes: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const {
    data: adjustments,
    isLoading,
    isError,
    refetch,
  } = useGetQuantityAdjustments({
    pageNumber: currentPage,
    pageSize: entriesPerPage,
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder") || "البحث..."} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-GB").replace(",", "");
  };

  return (
    // <div className="space-y-4" dir={direction}>
    //   <div className="takamol-page-header">
    //     <div className={direction === "rtl" ? "text-right" : "text-left"}>
    //       <h1 className="takamol-page-title flex items-center gap-2">
    //         <FileText size={24} className="text-[var(--primary)]" />
    //         <span>تعديلات الكمية</span>
    //       </h1>
    //       <p className="takamol-page-subtitle">إدارة وتتبع مذكرات تسوية المخزون</p>
    //     </div>

    //     <div className="flex flex-wrap gap-2">
    //       <button
    //         onClick={() => navigate("/products/quantity-adjustments/create")}
    //         className="btn-primary"
    //       >
    //         <Plus size={20} /> إضافة تعديل كمية
    //       </button>
    //     </div>
    //   </div>

    //   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-w-0">
    //     <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
    //       <div className="relative w-full md:w-72">
    //         <input
    //           type="text"
    //           placeholder="بحث بالتاريخ أو مدخل البيانات أو المذكرة..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="takamol-input !py-2"
    //         />
    //         <Search
    //           className={cn(
    //             "absolute top-1/2 -translate-y-1/2 text-gray-400",
    //             direction === "rtl" ? "left-3" : "right-3"
    //           )}
    //           size={18}
    //         />
    //       </div>

    //       <div className="flex items-center gap-2 text-sm font-bold text-gray-700 w-full md:w-auto justify-end">
    //         <span>اظهر</span>
    //         <select
    //           className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-1.5 outline-none cursor-pointer"
    //           value={itemsPerPage}
    //           onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
    //         >
    //           <option value={10}>10</option>
    //           <option value={25}>25</option>
    //           <option value={50}>50</option>
    //         </select>

    //         <button
    //           onClick={() => refetch()}
    //           className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5"
    //         >
    //           تحديث
    //         </button>
    //       </div>
    //     </div>

    //     {/* ── Desktop Table ── */}
    //     <div className="hidden md:block overflow-visible pb-4">
    //       <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    //         <table className="takamol-table mb-0">
    //           <thead>
    //             <tr>
    //               <th>التاريخ</th>
    //               <th>مدخل البيانات</th>
    //               <th>مذكرة</th>
    //               <th className="w-40 text-center">الإجراءات</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {isLoading ? (
    //               <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold">جاري التحميل...</td></tr>
    //             ) : isError ? (
    //               <tr><td colSpan={4} className="text-center py-8 text-red-500 font-bold">فشل تحميل البيانات</td></tr>
    //             ) : filteredAdjustments.length > 0 ? (
    //               filteredAdjustments.map((adj) => (
    //                 <tr key={adj.id}>
    //                   <td className="text-gray-800 font-bold whitespace-nowrap">{formatDate(adj.operationDate)}</td>
    //                   <td className="text-gray-600 font-medium">{getPerformedByName(adj.performedBy)}</td>
    //                   <td className="text-gray-600">{adj.notes || "-"}</td>
    //                   <td className="text-center">
    //                     <div className="flex items-center justify-center gap-2">
    //                       <button onClick={() => navigate(`/products/quantity-adjustments/view/${adj.id}`)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">عرض</button>
    //                       <button onClick={() => navigate(`/products/quantity-adjustments/edit/${adj.id}`)} className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">تعديل</button>
    //                     </div>
    //                   </td>
    //                 </tr>
    //               ))
    //             ) : (
    //               <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold">لا توجد سجلات، قم بإضافة تعديل جديد.</td></tr>
    //             )}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>

    //     {/* ── Mobile Cards ── */}
    //     <div className="md:hidden space-y-3">
    //       {isLoading ? (
    //         <div className="text-center py-8 text-gray-500 font-bold">جاري التحميل...</div>
    //       ) : isError ? (
    //         <div className="text-center py-8 text-red-500 font-bold">فشل تحميل البيانات</div>
    //       ) : filteredAdjustments.length > 0 ? (
    //         filteredAdjustments.map((adj) => (
    //           <div key={adj.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
    //             <div className="flex justify-between items-start">
    //               <span className="text-xs text-gray-400 font-medium">التاريخ</span>
    //               <span className="text-sm font-bold text-gray-800">{formatDate(adj.operationDate)}</span>
    //             </div>
    //             <div className="flex justify-between items-center border-t border-gray-100 pt-2">
    //               <span className="text-xs text-gray-400 font-medium">مدخل البيانات</span>
    //               <span className="text-sm font-medium text-gray-600 truncate max-w-[180px]">{getPerformedByName(adj.performedBy)}</span>
    //             </div>
    //             {adj.notes && (
    //               <div className="flex justify-between items-center border-t border-gray-100 pt-2">
    //                 <span className="text-xs text-gray-400 font-medium">مذكرة</span>
    //                 <span className="text-sm text-gray-600">{adj.notes}</span>
    //               </div>
    //             )}
    //             <div className="flex gap-2 pt-2 border-t border-gray-100">
    //               <button onClick={() => navigate(`/products/quantity-adjustments/view/${adj.id}`)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-bold transition-colors">عرض</button>
    //               <button onClick={() => navigate(`/products/quantity-adjustments/edit/${adj.id}`)} className="flex-1 bg-[#2ecc71] hover:bg-[#27ae60] text-white py-2 rounded-lg text-sm font-bold transition-colors">تعديل</button>
    //             </div>
    //           </div>
    //         ))
    //       ) : (
    //         <div className="text-center py-8 text-gray-500 font-bold">لا توجد سجلات، قم بإضافة تعديل جديد.</div>
    //       )}
    //     </div>

    //     <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 pt-4">
    //       <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
    //         <button
    //           disabled={page >= totalPages}
    //           onClick={() => setPage((prev) => prev + 1)}
    //           className="px-4 py-2 hover:bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-50"
    //         >
    //           <ArrowRight className="w-4 h-4" /> التالي
    //         </button>

    //         <button className="px-4 py-2 bg-[#2ecc71] text-white font-bold text-sm border-l border-gray-200">
    //           {page}
    //         </button>

    //         <button
    //           disabled={page <= 1}
    //           onClick={() => setPage((prev) => prev - 1)}
    //           className="px-4 py-2 hover:bg-gray-50 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-50"
    //         >
    //           سابق <ArrowLeft className="w-4 h-4" />
    //         </button>
    //       </div>

    //       <div className="text-sm font-bold text-gray-500">
    //         إجمالي السجلات: {totalCount}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Card>
      <CardHeader>
        <CardTitle>تعديلات الكمية</CardTitle>
        <CardDescription>إدارة وتتبع مذكرات تسوية المخزون</CardDescription>
        <CardAction>
          {" "}
          <Button variant={"default"} asChild>
            <Link to={"/products/quantity-adjustments/create"}>إضافة تعديل كمية </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          value={adjustments?.items}
          totalRecords={adjustments?.totalCount}
          loading={!adjustments?.items}
          rowsPerPageOptions={[5, 10, 20, 50]}
          lazy
          paginator
          rows={entriesPerPage}
          first={(currentPage - 1) * entriesPerPage}
          onPage={(e: DataTablePageEvent) => {
            if (e.page === undefined) return;
            setCurrentPage(e.page + 1);
            setEntriesPerPage(e.rows);
          }}
          // filters={filters}
          header={header}
          responsiveLayout="stack"
          className="custom-green-table custom-compact-table"
          dataKey="id"
        >
          <Column header={"التاريخ"} sortable field="operationDate" body={(item: QuantityAdjustment) => formatDate(item?.operationDate)} />
          <Column header="مدخل البيانات" sortable field={"performedBy"} />
          <Column header="مذكرة" sortable field={"مذكرة"} />
          <Column
            header={t("actions")}
            body={(product: QuantityAdjustment) => (
              <>
                <Link to={`/products/quantity-adjustments/edit/${product?.id}`} className="btn-minimal-action btn-edit">
                  <Edit2 size={16} />
                </Link>
                <Link to={`products/quantity-adjustments/view/${product?.id}`} onClick={async () => {}} className="btn-minimal-action btn-view">
                  <Eye size={16} />
                </Link>
              </>
            )}
          />
        </DataTable>
      </CardContent>
    </Card>
  );
}
