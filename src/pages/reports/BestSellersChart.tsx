// import React, { useState, useMemo } from "react";
// import { BarChart2, RotateCcw, Search, Printer, FileText, FileSpreadsheet } from "lucide-react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useLanguage } from "@/context/LanguageContext";
// import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
// import { useGetTopSellingProducts } from "@/features/reports/hooks/useGetTopSellingProducts";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAuthStore } from "@/store/authStore";
// import { Permissions } from "@/lib/permissions";
// import { format } from "date-fns";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { exportToExcel, exportToPDF, printReport } from "@/utils/exportUtils";


// type FilterState = {
//   branchId: string;
//   from: string;
//   to: string;
// };

// export default function BestSellersChart() {
//   const { t, direction } = useLanguage();

//   const [filters, setFilters] = useState<FilterState>({
//     branchId: " ",
//     from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
//     to: new Date().toISOString().split("T")[0],
//   });

//   const [searchParams, setSearchParams] = useState<FilterState>(filters);

//   const {
//     data: reportData,
//     isLoading,
//     isFetching,
//   } = useGetTopSellingProducts({
//     branchid: searchParams.branchId.trim() || undefined,
//     from: searchParams.from,
//     to: searchParams.to,
//   });

//   const { data: branches = [] } = useGetAllBranches();

//   const handleSearch = () => setSearchParams(filters);

//   const handleClear = () => {
//     const resetState: FilterState = {
//       branchId: " ",
//       from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
//       to: new Date().toISOString().split("T")[0],
//     };
//     setFilters(resetState);
//     setSearchParams(resetState);
//   };

//   const formatNumber = (value?: number) =>
//     Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const totalQty  = useMemo(() => reportData?.reduce((s, r) => s + r.totalQuantitySold, 0) || 0, [reportData]);
//   const totalSales = useMemo(() => reportData?.reduce((s, r) => s + r.totalSales, 0) || 0, [reportData]);
//   const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

//   const title = t("top_selling_product_report", "تقرير المنتج الأكثر مبيعا");

//   const getFiltersInfo = () => {
//     const branchName = branches.find((b) => String(b.id) === searchParams.branchId.trim())?.name || t("all", "الكل");
//     return `${t("branch", "الفرع")}: ${branchName} | ${t("from_date", "تاريخ البداية")}: ${searchParams.from} | ${t("to_date", "تاريخ النهاية")}: ${searchParams.to}`;
//   };

//   const handleExportExcel = () => {
//     if (!reportData) return;
//     const excelData = reportData.map((r, i) => ({
//       [t("serial", "م")]: i + 1,
//       [t("barcode", "باركود")]: r.barcode,
//       [t("product_name", "اسم المنتج")]: r.productName,
//       [t("selling_price", "سعر البيع")]: r.sellingPrice,
//       [t("sales_count", "عدد مرات البيع")]: r.totalQuantitySold,
//       [t("total_sales", "إجمالي المبيعات")]: r.totalSales,
//     }));
//     exportToExcel(excelData, title, t, direction);
//   };

//   const [pdfLoading, setPdfLoading] = useState(false);

// const handleExportPDF = async () => {
//   if (!reportData) return;
//   setPdfLoading(true);
//   try {
//     const columns = [
//       { header: t("serial", "م"), field: "serial" },
//       { header: t("barcode", "باركود"), field: "barcode" },
//       { header: t("product_name", "اسم المنتج"), field: "productName" },
//       { header: t("selling_price", "سعر البيع"), field: "sellingPrice" },
//       { header: t("sales_count", "عدد مرات البيع"), field: "totalQuantitySold" },
//       { header: t("total_sales", "إجمالي المبيعات"), field: "totalSales" },
//     ];

//     const pdfData = reportData.map((r, i) => ({
//       serial: i + 1,
//       barcode: r.barcode,
//       productName: r.productName,
//       sellingPrice: formatNumber(r.sellingPrice),
//       totalQuantitySold: r.totalQuantitySold,
//       totalSales: formatNumber(r.totalSales),
//     }));

//     await exportToPDF(title, getFiltersInfo(), pdfData, columns);
//   } finally {
//     setPdfLoading(false);
//   }
// };
//  const handlePrint = () => {
//   if (!reportData) return;

//   const columns = [
//     { header: t("serial", "م"), field: "serial" },
//     { header: t("barcode", "باركود"), field: "barcode" },
//     { header: t("product_name", "اسم المنتج"), field: "productName" },
//     { header: t("selling_price", "سعر البيع"), field: "sellingPrice" },
//     { header: t("sales_count", "عدد مرات البيع"), field: "totalQuantitySold" },
//     { header: t("total_sales", "إجمالي المبيعات"), field: "totalSales" },
//   ];

//   const printData = reportData.map((r, i) => ({
//     serial: i + 1,
//     barcode: r.barcode,
//     productName: r.productName,
//     sellingPrice: formatNumber(r.sellingPrice),
//     totalQuantitySold: r.totalQuantitySold,
//     totalSales: formatNumber(r.totalSales),
//   }));

//   printReport(title, getFiltersInfo(), printData, columns);
// };

//   return (
//     <div dir={direction}>
//       <Card>
//         <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart2 size={20} className="text-[var(--primary)]" />
//               {title}
//             </CardTitle>
//           </div>

//           <div className="flex items-center gap-4 text-sm font-medium">
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
//             >
//               <Printer size={16} />
//               <span className="hidden sm:inline">{t("print", "طباعة")}</span>
//             </button>
//             <button
//               onClick={handleExportPDF}
//               disabled={pdfLoading}
//               className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
//             >
//               <FileText size={16} />
//               <span className="hidden sm:inline">PDF</span>
//             </button>
//             <button
//               onClick={handleExportExcel}
//               className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400"
//             >
//               <FileSpreadsheet size={16} />
//               <span className="hidden sm:inline">Excel</span>
//             </button>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-5">
//           {/* Filters */}
//           <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//               {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
//                 <div className="space-y-2 lg:col-span-1">
//                   <Label className="text-xs font-medium text-text-main">{t("branch", "الفرع")}</Label>
//                   <Select value={filters.branchId} onValueChange={(val) => setFilters((p) => ({ ...p, branchId: val }))}>
//                     <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
//                       <SelectValue placeholder={t("select_branch", "اختر الفرع")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value=" ">{t("all", "الكل")}</SelectItem>
//                       {branches.map((b) => (
//                         <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label className="text-xs font-medium text-text-main">{t("from_date", "تاريخ البداية")}</Label>
//                 <div className="relative flex items-center border border-input rounded-md bg-background">
//                   <DatePicker
//                     selected={filters.from ? new Date(filters.from) : null}
//                     onChange={(date) => setFilters((p) => ({ ...p, from: date ? format(date, "yyyy-MM-dd") : "" }))}
//                     dateFormat="dd/MM/yyyy"
//                     placeholderText={t("select_date", "يوم/شهر/سنة")}
//                     popperPlacement="bottom-start"
//                     portalId="root-portal"
//                     customInput={
//                       <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
//                         <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
//                         <span className="text-sm">{filters.from ? format(new Date(filters.from), "dd/MM/yyyy") : t("select_date", "يوم/شهر/سنة")}</span>
//                       </div>
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-xs font-medium text-text-main">{t("to_date", "تاريخ النهاية")}</Label>
//                 <div className="relative flex items-center border border-input rounded-md bg-background">
//                   <DatePicker
//                     selected={filters.to ? new Date(filters.to) : null}
//                     onChange={(date) => setFilters((p) => ({ ...p, to: date ? format(date, "yyyy-MM-dd") : "" }))}
//                     dateFormat="dd/MM/yyyy"
//                     placeholderText={t("select_date", "يوم/شهر/سنة")}
//                     popperPlacement="bottom-start"
//                     portalId="root-portal"
//                     customInput={
//                       <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
//                         <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
//                         <span className="text-sm">{filters.to ? format(new Date(filters.to), "dd/MM/yyyy") : t("select_date", "يوم/شهر/سنة")}</span>
//                       </div>
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-row items-end gap-2">
//                 <Button
//                   onClick={handleSearch}
//                   className="h-10 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold flex-1 transition-all duration-300 hover:scale-[1.02] transform"
//                   disabled={isLoading || isFetching}
//                 >
//                   <Search size={16} />
//                   {t("execute_operation", "اتمام العملية")}
//                 </Button>
//                 <Button
//                   onClick={handleClear}
//                   variant="outline"
//                   className="h-10 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300"
//                 >
//                   <RotateCcw size={15} />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div id="best-sellers-table" className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
//             <DataTable
//               value={reportData || []}
//               loading={isLoading || isFetching}
//               scrollable
//               scrollHeight="flex"
//               className="custom-green-table custom-compact-table"
//               emptyMessage={t("no_data", "لا توجد بيانات")}
//               paginator
//               rows={10}
//             >
//               <Column header={t("serial", "م")} body={(_, options) => options.rowIndex + 1} className="w-16" />
//               <Column field="barcode" header={t("barcode", "باركود")} sortable />
//               <Column field="productName" header={t("product_name", "اسم المنتج")} sortable />
//               <Column field="sellingPrice" header={t("selling_price", "سعر البيع")} body={(r) => formatNumber(r.sellingPrice)} sortable />
//               <Column field="totalQuantitySold" header={t("sales_count", "عدد مرات البيع")} sortable />
//               <Column field="totalSales" header={t("total_sales", "إجمالي المبيعات")} body={(r) => formatNumber(r.totalSales)} sortable />
//             </DataTable>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import React, { useState, useMemo } from "react";
import { BarChart2, RotateCcw, Search, Printer, FileText, FileSpreadsheet } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { useGetTopSellingProducts } from "@/features/reports/hooks/useGetTopSellingProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { exportToExcel, exportToPDF, printReport } from "@/utils/exportUtils";

type FilterState = {
  branchId: string;
  from: string;
  to: string;
};

export default function BestSellersChart() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    branchId: " ",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  const {
    data: reportData,
    isLoading,
    isFetching,
  } = useGetTopSellingProducts({
    branchid: searchParams.branchId.trim() || undefined,
    from: searchParams.from,
    to: searchParams.to,
  });

  const { data: branches = [] } = useGetAllBranches();

  const handleSearch = () => setSearchParams(filters);

  const handleClear = () => {
    const resetState: FilterState = {
      branchId: " ",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
    };
    setFilters(resetState);
    setSearchParams(resetState);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);
  const title = t("top_selling_product_report", "تقرير المنتج الأكثر مبيعا");

  const getFiltersInfo = () => {
    const trimmedId = searchParams.branchId.trim();
    const branchName = trimmedId
      ? branches.find((b) => String(b.id) === trimmedId)?.name ?? t("all", "الكل")
      : t("all", "الكل");

    const fromFmt = searchParams.from ? searchParams.from.split("-").reverse().join("/") : "-";
    const toFmt = searchParams.to ? searchParams.to.split("-").reverse().join("/") : "-";

    return `${t("branch", "الفرع")}: ${branchName} | ${t("from_date", "تاريخ البداية")}: ${fromFmt} | ${t("to_date", "تاريخ النهاية")}: ${toFmt}`;
  };

  const handleExportExcel = () => {
    if (!reportData) return;
    const excelData = reportData.map((r, i) => ({
      [t("serial", "م")]: i + 1,
      [t("barcode", "باركود")]: r.barcode,
      [t("product_name", "اسم المنتج")]: r.productName,
      [t("selling_price", "سعر البيع")]: r.sellingPrice,
      [t("sales_count", "عدد مرات البيع")]: r.totalQuantitySold,
      [t("total_sales", "إجمالي المبيعات")]: r.totalSales,
    }));
    exportToExcel(excelData, title, t, direction);
  };

  const [pdfLoading, setPdfLoading] = useState(false);

const handleExportPDF = async () => {
  if (!reportData) return;
  setPdfLoading(true);
  try {
    const columns = [
      { header: t("serial", "م"), field: "serial" },
      { header: t("barcode", "باركود"), field: "barcode" },
      { header: t("product_name", "اسم المنتج"), field: "productName" },
      { header: t("selling_price", "سعر البيع"), field: "sellingPrice" },
      { header: t("sales_count", "عدد مرات البيع"), field: "totalQuantitySold" },
      { header: t("total_sales", "إجمالي المبيعات"), field: "totalSales" },
    ];

    const pdfData = reportData.map((r, i) => ({
      serial: i + 1,
      barcode: r.barcode,
      productName: r.productName,
      sellingPrice: formatNumber(r.sellingPrice),
      totalQuantitySold: r.totalQuantitySold,
      totalSales: formatNumber(r.totalSales),
    }));

    await exportToPDF(title, getFiltersInfo(), pdfData, columns);
  } finally {
    setPdfLoading(false);
  }
};
 const handlePrint = () => {
  if (!reportData) return;

  const columns = [
    { header: t("serial", "م"), field: "serial" },
    { header: t("barcode", "باركود"), field: "barcode" },
    { header: t("product_name", "اسم المنتج"), field: "productName" },
    { header: t("selling_price", "سعر البيع"), field: "sellingPrice" },
    { header: t("sales_count", "عدد مرات البيع"), field: "totalQuantitySold" },
    { header: t("total_sales", "إجمالي المبيعات"), field: "totalSales" },
  ];

  const printData = reportData.map((r, i) => ({
    serial: i + 1,
    barcode: r.barcode,
    productName: r.productName,
    sellingPrice: formatNumber(r.sellingPrice),
    totalQuantitySold: r.totalQuantitySold,
    totalSales: formatNumber(r.totalSales),
  }));

  printReport(title, getFiltersInfo(), printData, columns);
};

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={20} className="text-[var(--primary)]" />
              {title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button onClick={handlePrint} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} />
              <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button onClick={handleExportPDF} disabled={pdfLoading} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} />
              <span className="hidden sm:inline">{pdfLoading ? "تحميل..." : "PDF"}</span>
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Filters Section */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {hasAnyPermission([Permissions?.branches?.all, Permissions?.branches?.view]) && (
                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-xs font-medium text-text-main">{t("branch", "الفرع")}</Label>
                  <Select value={filters.branchId} onValueChange={(val) => setFilters((p) => ({ ...p, branchId: val }))}>
                    <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                      <SelectValue placeholder={t("select_branch", "اختر الفرع")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">{t("all", "الكل")}</SelectItem>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-medium text-text-main">{t("from_date", "تاريخ البداية")}</Label>
                <div className="relative flex items-center border border-input rounded-md bg-background">
                  <DatePicker
                    selected={filters.from ? new Date(filters.from) : null}
                    onChange={(date) => setFilters((p) => ({ ...p, from: date ? format(date, "yyyy-MM-dd") : "" }))}
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{filters.from ? format(new Date(filters.from), "dd/MM/yyyy") : t("select_date", "يوم/شهر/سنة")}</span>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-text-main">{t("to_date", "تاريخ النهاية")}</Label>
                <div className="relative flex items-center border border-input rounded-md bg-background">
                  <DatePicker
                    selected={filters.to ? new Date(filters.to) : null}
                    onChange={(date) => setFilters((p) => ({ ...p, to: date ? format(date, "yyyy-MM-dd") : "" }))}
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{filters.to ? format(new Date(filters.to), "dd/MM/yyyy") : t("select_date", "يوم/شهر/سنة")}</span>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-row items-end gap-2">
                <Button onClick={handleSearch} className="h-10 px-6 bg-[var(--primary)] text-white gap-2 flex-1 shadow-sm font-bold transition-all hover:scale-[1.02]" disabled={isLoading || isFetching}>
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-10 px-3 border-slate-200">
                  <RotateCcw size={15} />
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container - الـ ID هنا هو سر النجاح */}
          <div id="best-sellers-table-container" className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={reportData || []}
              loading={isLoading || isFetching}
              scrollable
              scrollHeight="flex"
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              paginator
              rows={10}
            >
              <Column header={t("serial", "م")} body={(_, options) => options.rowIndex + 1} className="w-16" />
              <Column field="barcode" header={t("barcode", "باركود")} sortable />
              <Column field="productName" header={t("product_name", "اسم المنتج")} sortable />
              <Column field="sellingPrice" header={t("selling_price", "سعر البيع")} body={(r) => formatNumber(r.sellingPrice)} sortable />
              <Column field="totalQuantitySold" header={t("sales_count", "عدد مرات البيع")} sortable />
              <Column field="totalSales" header={t("total_sales", "إجمالي المبيعات")} body={(r) => formatNumber(r.totalSales)} sortable />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}