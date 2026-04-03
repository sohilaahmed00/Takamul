import { User, Search, Edit2, Trash2, Plus, FileText, ChevronRight, ChevronLeft, UserPlus, CreditCard, List, Minus, PlusCircle, ChevronDown, Wallet, ArrowDownCircle, ArrowUpCircle, History, Printer, Menu, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer";
import useToast from "@/hooks/useToast";
import { useGetAllCategories } from "@/features/categories/hooks/useGetAllCategories";
import type { Category } from "@/features/categories/types/categories.types";
import CategoryModal from "@/components/modals/CategoryModal";
import { useMemo, useState } from "react";
import { useGetAllAdditions } from "@/features/Additions/hooks/useGetAllAdditions";
import type { Addition } from "@/features/Additions/types/additions.types";
import AdditionModal from "@/components/modals/AdditionModal";
import { useDeleteAddition } from "@/features/Additions/hooks/useDeleteAddition";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Additions() {
  const { t, direction } = useLanguage();
  const { data: additions } = useGetAllAdditions();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddition, setSelectedAddition] = useState<Addition | undefined>();
  const { mutateAsync: deleteAddition } = useDeleteAddition();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4  items-center">
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
  return (
    // <div className="p-4 space-y-4">
    //   {/* Breadcrumb */}
    //   <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
    //     <span>{t("home")}</span>
    //     <span>/</span>
    //     <span className="text-[var(--text-main)] font-medium">{t("customers")}</span>
    //   </div>

    //   {/* Page Header */}
    //   <div className="bg-white p-4 rounded-lg   ">
    //     <div className="flex justify-between items-center">
    //       <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
    //         <UserPlus size={20} className="text-[var(--primary)]" />
    //         الإضافات
    //       </h1>
    //       <Button onClick={() => setIsAddModalOpen(true)} variant="default" size={"xl"}>
    //         <Plus size={20} />
    //         إضافة إضافة
    //       </Button>
    //       {/* <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
    //         <Plus size={20} />
    //         {t("add_customer")}
    //       </button> */}
    //     </div>
    //     <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
    //   </div>

    //   {/* Table Container */}
    //   <div className="bg-white rounded-lg    p-4 min-h-100">
    //     <div className="space-y-4">
    //       {/* Table Controls */}
    //       <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
    //         <div className="relative flex-grow">
    //           <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
    //             <Search size={18} className="text-gray-400" />
    //           </div>
    //           <input
    //             type="text"
    //             value={searchTerm}
    //             onChange={(e) => {
    //               setSearchTerm(e.target.value);
    //               setCurrentPage(1);
    //             }}
    //             placeholder={t("search_placeholder") || "البحث برقم الهاتف، الكود، أو الاسم..."}
    //             className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-primary focus:bg-white text-gray-700 text-sm rounded-xl py-3 pr-11 pl-4 transition-all outline-none"
    //           />{" "}
    //         </div>

    //         {/* <div className="flex gap-3 shrink-0">
    //           <button className="flex items-center gap-2 bg-[#f8fafc] hover:bg-gray-100 text-gray-600 border border-transparent text-sm font-medium rounded-xl px-4 py-3 transition-colors">
    //             <SlidersHorizontal size={16} className="text-gray-400" />
    //             <span>{t("filters") || "الفلاتر"}</span>
    //             <ChevronDown size={16} className="text-gray-400 ml-1" />
    //           </button>

    //           <button className="flex items-center gap-2 bg-[#f8fafc] hover:bg-gray-100 text-gray-600 border border-transparent text-sm font-medium rounded-xl px-4 py-3 transition-colors">
    //             <span>{t("recent_customers") || "أحدث العملاء"}</span>
    //             <ChevronDown size={16} className="text-gray-400 ml-1" />
    //           </button>
    //         </div> */}
    //       </div>
    //       {/* Table - Desktop */}
    //       <div className="overflow-x-auto rounded-xl border border-gray-100">
    //         <DataTable responsiveLayout="stack" className="custom-green-table custom-compact-table" value={filteredAdditions} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage(e.page + 1)} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
    //           {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}

    //           <Column
    //             header={t("name")}
    //             sortable
    //             body={(addition: Addition) => (
    //               <div className="cell-data-stack">
    //                 {" "}
    //                 <span className="customer-name-main">{addition.additionNameAr}</span>
    //               </div>
    //             )}
    //           />
    //           <Column
    //             header={t("actions")}
    //             body={(addition) => (
    //               <>
    //                 <button
    //                   onClick={async () => {
    //                     setSelectedAddition(addition);
    //                     setIsAddModalOpen(true);
    //                   }}
    //                   className="btn-minimal-action btn-compact-action"
    //                 >
    //                   <Edit2 size={16} />
    //                 </button>
    //                 <button
    //                   onClick={async () => {
    //                     await deleteAddition(addition?.id);
    //                   }}
    //                   className="btn-minimal-action btn-compact-action"
    //                 >
    //                   <Trash2 size={16} />
    //                 </button>
    //               </>
    //             )}
    //           />
    //         </DataTable>
    //       </div>
    //     </div>
    //   </div>

    //   <AdditionModal
    //     addition={selectedAddition}
    //     isOpen={isAddModalOpen}
    //     onClose={() => {
    //       setIsAddModalOpen(false);
    //       setSelectedAddition(undefined);
    //     }}
    //   />
    // </div>
    <>
      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>إدارة الإضافات</CardTitle>
          <CardDescription>إدارة الإضافات الخاصة بالأصناف مثل الخيارات الإضافية والتعديلات التي يمكن تطبيقها على المنتجات داخل النظام.</CardDescription>{" "}
          <CardAction className="max-md:flex max-md:justify-end max-md:mt-2">
            {" "}
            <Button size={"xl"} variant={"default"} onClick={() => setIsAddModalOpen(true)}>
              إضافة جديدة{" "}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={additions}
            totalRecords={additions?.length}
            loading={!additions}
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
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
          >
            <Column
              header={t("name")}
              sortable
              body={(addition: Addition) => (
                <div className="cell-data-stack">
                  {" "}
                  <span className="customer-name-main">{addition.additionNameAr}</span>
                </div>
              )}
            />
            <Column
              header={t("actions")}
              body={(addition) => (
                <div className="space-x-2">
                  <button
                    onClick={async () => {
                      setSelectedAddition(addition);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      await deleteAddition(addition?.id);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>
      <AdditionModal
        addition={selectedAddition}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedAddition(undefined);
        }}
      />
    </>
  );
}
