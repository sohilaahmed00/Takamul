import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Edit, Trash2, PlusCircle, Search, Check, X, RefreshCw, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Pagination from "@/components/Pagination";
import { useLanguage } from "@/context/LanguageContext";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetAllUnits } from "@/features/units/hooks/useGetAllUnits";
import { useCreateUnit } from "@/features/units/hooks/useCreateUnit";
import { useUpdateUnit } from "@/features/units/hooks/useUpdateUnit";
import { useDeleteUnit } from "@/features/units/hooks/useDeleteUnit";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import UnitModal from "@/components/modals/UnitModal";
import type { Unit } from "@/features/units/types/units.types";


const Units = () => {
  const { t, direction } = useLanguage();

  const [SelectedUnit, setSelectedUnit] = useState<Unit | undefined>();
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: units,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useGetAllUnits({
    page: currentPage,
    size: entriesPerPage,
    search: searchTerm,
  });

  const { mutateAsync: createUnitMutation, isPending: isCreating } = useCreateUnit();
  const { mutateAsync: updateUnitMutation, isPending: isUpdating } = useUpdateUnit();
  const { mutateAsync: deleteUnit, isPending: isDeleting } = useDeleteUnit();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
    name: { value: "", matchMode: FilterMatchMode.CONTAINS },
    description: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));

    setGlobalFilterValue(value);
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
    // <div className="space-y-4">
    //   <div className="text-sm text-gray-500 flex items-center gap-1">
    //     <span>{t("home")}</span>
    //     <span>/</span>
    //     <span>{t("products")}</span>
    //     <span>/</span>
    //     <span className="text-gray-800 font-medium">{t("units")}</span>
    //   </div>

    //   <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
    //     <h1 className="text-xl font-bold text-gray-800">{t("units")}</h1>

    //     <div className="flex gap-2">
    //       <Button
    //         type="button"
    //         variant="outline"
    //         size="icon"
    //         onClick={() => refetch()}
    //         title="تحديث"
    //         disabled={isFetching}
    //       >
    //         <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
    //       </Button>

    //       <Button
    //         type="button"
    //         onClick={() => {
    //           setAddName("");
    //           setAddDesc("");
    //           setActionError(null);
    //           setShowAddModal(true);
    //         }}
    //         className="flex items-center gap-2"
    //       >
    //         <PlusCircle size={18} />
    //         {t("add_new_unit")}
    //       </Button>
    //     </div>
    //   </div>

    //   {(error || actionError) && (
    //     <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex justify-between items-center">
    //       <span>
    //         {actionError ||
    //           (direction === "rtl" ? "فشل تحميل البيانات" : "Failed to load data")}
    //       </span>
    //       <button type="button" onClick={() => setActionError(null)}>
    //         <X size={16} />
    //       </button>
    //     </div>
    //   )}

    //   <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[300px]">
    //     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
    //       <div className="flex items-center gap-2 text-sm text-gray-600">
    //         <span>{t("show")}</span>

    //         <select
    //           value={itemsPerPage}
    //           onChange={(e) => {
    //             setItemsPerPage(Number(e.target.value));
    //             setCurrentPage(1);
    //           }}
    //           className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-green-500 text-black"
    //         >
    //           <option value={10}>10</option>
    //           <option value={25}>25</option>
    //           <option value={50}>50</option>
    //         </select>
    //       </div>

    //       <div className="relative w-full sm:w-64">
    //         <input
    //           type="text"
    //           placeholder={t("search_placeholder")}
    //           className={`w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-black ${
    //             direction === "rtl" ? "pr-8" : "pl-8"
    //           }`}
    //           value={searchInput}
    //           onChange={(e) => setSearchInput(e.target.value)}
    //         />
    //         <Search
    //           className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
    //             direction === "rtl" ? "right-2" : "left-2"
    //           }`}
    //           size={16}
    //         />
    //       </div>
    //     </div>

    //     {isLoading ? (
    //       <div className="flex justify-center py-10">
    //         <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    //       </div>
    //     ) : (
    //       <>
    //         <div className="hidden md:block overflow-hidden rounded-t-xl">
    //           <table className="w-full text-sm text-right text-gray-500 border-collapse">
    //             <thead className="text-xs text-white uppercase bg-green-600">
    //               <tr>
    //                 <th className="px-6 py-3">{t("unit_name")}</th>
    //                 <th className="px-6 py-3">{t("description")}</th>
    //                 <th className="px-6 py-3 text-center">{t("actions")}</th>
    //               </tr>
    //             </thead>

    //             <tbody className="bg-white">
    //               {units.length === 0 ? (
    //                 <tr>
    //                   <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
    //                     {t("no_results_found")}
    //                   </td>
    //                 </tr>
    //               ) : (
    //                 units.map((unit) => (
    //                   <tr
    //                     key={unit.id}
    //                     className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    //                   >
    //                     <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
    //                       {editingId === unit.id ? (
    //                         <Input
    //                           type="text"
    //                           value={editName}
    //                           onChange={(e) => setEditName(e.target.value)}
    //                           className="w-40"
    //                           autoFocus
    //                         />
    //                       ) : (
    //                         getName(unit)
    //                       )}
    //                     </td>

    //                     <td className="px-6 py-4">
    //                       {editingId === unit.id ? (
    //                         <Input
    //                           type="text"
    //                           value={editDesc}
    //                           onChange={(e) => setEditDesc(e.target.value)}
    //                           className="w-40"
    //                         />
    //                       ) : (
    //                         getDesc(unit)
    //                       )}
    //                     </td>

    //                     <td className="px-6 py-4 text-center">
    //                       {editingId === unit.id ? (
    //                         <div className="flex items-center justify-center gap-1">
    //                           <Button
    //                             type="button"
    //                             size="icon-sm"
    //                             onClick={() => saveEdit(unit.id)}
    //                             disabled={isUpdating}
    //                           >
    //                             {isUpdating ? (
    //                               <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
    //                             ) : (
    //                               <Check size={14} />
    //                             )}
    //                           </Button>

    //                           <Button
    //                             type="button"
    //                             size="icon-sm"
    //                             variant="outline"
    //                             onClick={cancelEdit}
    //                           >
    //                             <X size={14} />
    //                           </Button>
    //                         </div>
    //                       ) : (
    //                         <Button
    //                           type="button"
    //                           size="sm"
    //                           onClick={(e) => toggleActionMenu(unit.id, e)}
    //                           className="inline-flex items-center gap-2"
    //                         >
    //                           <span>{t("actions")}</span>
    //                           <ChevronDown size={14} />
    //                         </Button>
    //                       )}
    //                     </td>
    //                   </tr>
    //                 ))
    //               )}
    //             </tbody>
    //           </table>
    //         </div>

    //         <div className="md:hidden space-y-3">
    //           {units.map((unit) => (
    //             <div
    //               key={unit.id}
    //               className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
    //             >
    //               {editingId === unit.id ? (
    //                 <div className="space-y-2 mb-3">
    //                   <Input
    //                     type="text"
    //                     value={editName}
    //                     onChange={(e) => setEditName(e.target.value)}
    //                     className="w-full font-bold"
    //                     autoFocus
    //                     placeholder={t("unit_name")}
    //                   />
    //                   <Input
    //                     type="text"
    //                     value={editDesc}
    //                     onChange={(e) => setEditDesc(e.target.value)}
    //                     className="w-full"
    //                     placeholder={t("description")}
    //                   />
    //                 </div>
    //               ) : (
    //                 <div className="mb-3">
    //                   <p className="font-bold text-gray-800 text-base">{getName(unit)}</p>
    //                   <p className="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">
    //                     {getDesc(unit)}
    //                   </p>
    //                 </div>
    //               )}

    //               <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
    //                 {editingId === unit.id ? (
    //                   <>
    //                     <Button
    //                       type="button"
    //                       size="sm"
    //                       onClick={() => saveEdit(unit.id)}
    //                       disabled={isUpdating}
    //                       className="flex items-center gap-1"
    //                     >
    //                       {isUpdating ? (
    //                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
    //                       ) : (
    //                         <>
    //                           <Check size={15} />
    //                           {t("save")}
    //                         </>
    //                       )}
    //                     </Button>

    //                     <Button
    //                       type="button"
    //                       size="sm"
    //                       variant="outline"
    //                       onClick={cancelEdit}
    //                       className="flex items-center gap-1"
    //                     >
    //                       <X size={15} />
    //                       {t("cancel")}
    //                     </Button>
    //                   </>
    //                 ) : (
    //                   <>
    //                     <Button
    //                       type="button"
    //                       size="sm"
    //                       variant="outline"
    //                       onClick={() => startEdit(unit)}
    //                       className="flex items-center gap-1"
    //                     >
    //                       <Edit size={15} />
    //                       {t("edit")}
    //                     </Button>

    //                     <Button
    //                       type="button"
    //                       size="sm"
    //                       variant="destructive"
    //                       onClick={() => handleDelete(unit.id)}
    //                       className="flex items-center gap-1"
    //                     >
    //                       <Trash2 size={15} />
    //                       {t("delete")}
    //                     </Button>
    //                   </>
    //                 )}
    //               </div>
    //             </div>
    //           ))}

    //           {units.length === 0 && (
    //             <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
    //               {t("no_results_found")}
    //             </div>
    //           )}
    //         </div>

    //         <div className="rounded-b-xl">
    //           <Pagination
    //             currentPage={serverPageNumber}
    //             totalItems={totalItems}
    //             itemsPerPage={serverPageSize}
    //             onPageChange={setCurrentPage}
    //           />
    //         </div>
    //       </>
    //     )}
    //   </div>

    //   {/* <AnimatePresence>
    //     {openActionId !== null && menuPosition && (
    //       <motion.div
    //         ref={actionMenuRef}
    //         initial={{ opacity: 0, scale: 0.95, y: -10 }}
    //         animate={{ opacity: 1, scale: 1, y: 0 }}
    //         exit={{ opacity: 0, scale: 0.95, y: -10 }}
    //         className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-40 ${
    //           direction === "rtl" ? "text-right" : "text-left"
    //         }`}
    //         style={{ top: menuPosition.top, left: menuPosition.left }}
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <button
    //           onMouseDown={(e) => e.stopPropagation()}
    //           onClick={() => {
    //             const unit = units.find((u) => u.id === openActionId);
    //             if (unit) startEdit(unit);
    //           }}
    //           className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${
    //             direction === "rtl" ? "justify-end" : "justify-start"
    //           }`}
    //         >
    //           {direction === "rtl" ? (
    //             <>
    //               <span>{t("edit")}</span>
    //               <Edit size={14} className="text-green-600" />
    //             </>
    //           ) : (
    //             <>
    //               <Edit size={14} className="text-green-600" />
    //               <span>{t("edit")}</span>
    //             </>
    //           )}
    //         </button>

    //         <button
    //           onMouseDown={(e) => e.stopPropagation()}
    //           onClick={() => handleDelete(openActionId)}
    //           className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${
    //             direction === "rtl" ? "justify-end" : "justify-start"
    //           }`}
    //         >
    //           {direction === "rtl" ? (
    //             <>
    //               <span>{t("delete")}</span>
    //               <Trash2 size={14} className="text-red-500" />
    //             </>
    //           ) : (
    //             <>
    //               <Trash2 size={14} className="text-red-500" />
    //               <span>{t("delete")}</span>
    //             </>
    //           )}
    //         </button>
    //       </motion.div>
    //     )}
    //   </AnimatePresence>

    //   <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
    //     <DialogContent className="sm:max-w-md" dir={direction}>
    //       <DialogHeader>
    //         <DialogTitle className="flex items-center gap-2">
    //           <PlusCircle size={20} />
    //           {t("add_new_unit")}
    //         </DialogTitle>
    //       </DialogHeader>

    //       <div className="space-y-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="unit-name">
    //             {t("unit_name")} <span className="text-red-500">*</span>
    //           </Label>
    //           <Input
    //             id="unit-name"
    //             type="text"
    //             value={addName}
    //             onChange={(e) => setAddName(e.target.value)}
    //             onKeyDown={(e) => e.key === "Enter" && handleAddUnit()}
    //             placeholder={direction === "rtl" ? "مثال: كيلو، قطعة، لتر" : "Ex: Kg, Piece, Liter"}
    //             autoFocus
    //           />
    //         </div>

    //         <div className="space-y-2">
    //           <Label htmlFor="unit-description">{t("description")}</Label>
    //           <Input
    //             id="unit-description"
    //             type="text"
    //             value={addDesc}
    //             onChange={(e) => setAddDesc(e.target.value)}
    //             onKeyDown={(e) => e.key === "Enter" && handleAddUnit()}
    //             placeholder={t("description")}
    //           />
    //         </div>
    //       </div>

    //       <DialogFooter className="sm:justify-end">
    //         <Button type="button" variant="outline" onClick={resetAddModal}>
    //           {t("cancel")}
    //         </Button>

    //         <Button
    //           type="button"
    //           onClick={handleAddUnit}
    //           disabled={isCreating || !addName.trim()}
    //         >
    //           {isCreating ? (
    //             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
    //           ) : direction === "rtl" ? (
    //             "إضافة"
    //           ) : (
    //             "Add"
    //           )}
    //         </Button>
    //       </DialogFooter>
    //     </DialogContent>
    //   </Dialog>

    //   <Dialog open={unitToDelete !== null} onOpenChange={() => setUnitToDelete(null)}>
    //     <DialogContent className="sm:max-w-sm" dir={direction}>
    //       <DialogHeader>
    //         <DialogTitle className="text-center">
    //           {direction === "rtl" ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?"}
    //         </DialogTitle>
    //       </DialogHeader>

    //       <div className="text-center space-y-2">
    //         <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
    //           <Trash2 size={30} />
    //         </div>

    //         <p className="text-gray-600 font-medium">{currentDeleteUnit?.name}</p>

    //         <p className="text-gray-400 text-sm">
    //           {direction === "rtl"
    //             ? "هذا الإجراء لا يمكن التراجع عنه"
    //             : "This action cannot be undone"}
    //         </p>
    //       </div>

    //       <DialogFooter className="sm:justify-end">
    //         <Button
    //           type="button"
    //           variant="outline"
    //           onClick={() => setUnitToDelete(null)}
    //         >
    //           {t("cancel")}
    //         </Button>

    //         <Button
    //           type="button"
    //           variant="destructive"
    //           onClick={confirmDelete}
    //           disabled={isDeleting}
    //         >
    //           {isDeleting ? (
    //             <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
    //           ) : (
    //             t("delete")
    //           )}
    //         </Button>
    //       </DialogFooter>
    //     </DialogContent>
    //   </Dialog> */}
    // </div>
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة الوحدات</CardTitle>
          <CardDescription>إدارة الوحدات </CardDescription>
          <CardAction>
            <Button variant={"default"} onClick={() => setIsAddModalOpen(true)}>
              إضافة وحدة
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={units?.items}
            totalRecords={units?.totalCount}
            loading={!units?.items}
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
            globalFilterFields={["categoryNameAr", "description"]}
            filters={filters}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
          >
            <Column header={t("name")} field="name" sortable />
            <Column header={t("description")} field="description" />
            <Column
              header={t("actions")}
              body={(unit: Unit) => (
                <>
                  <button
                    onClick={async () => {
                      setSelectedUnit(unit);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      const res = await deleteUnit(unit?.id);
                    }}
                    className="btn-minimal-action btn-compact-action"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>
      <UnitModal
        unit={SelectedUnit}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedUnit(undefined);
        }}
      />
    </>
  );
};

export default Units;
