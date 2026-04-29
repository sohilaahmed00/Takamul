import React, { useState, useMemo } from "react";
import { Search, RotateCcw, Calendar as CalendarIcon, Printer, FileText, FileSpreadsheet, TrendingUp, DollarSign, BarChart2, Receipt } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import formatDate from "@/lib/formatDate";
import { useGetAllSalesReturns } from "@/features/salesReturns/hooks/useGetAllSalesReturns";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { FinancialStatCard } from "@/components/FinancialStatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SalesReturnsReport() {
  const { t, direction } = useLanguage();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    branchId: "all",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
    searchTerm: "",
  });

  const [searchParams, setSearchParams] = useState(filters);

  const { data: salesReturnOrders, isLoading, isFetching } = useGetAllSalesReturns({
    page: currentPage,
    limit: entriesPerPage,
    searchTerm: searchParams.searchTerm,
    fromDate: searchParams.from,
    toDate: searchParams.to,
    branchId: searchParams.branchId === "all" ? undefined : searchParams.branchId,
  });

  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  const { data: branches = [] } = useGetAllBranches();

  const orders = salesReturnOrders?.items || [];
  const totalCount = salesReturnOrders?.totalCount || 0;

  const summary = useMemo(() => {
    const totalGrandTotal = orders.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    const totalRefunded = orders.reduce((sum, s) => sum + (s.refundedAmount || 0), 0);
    const totalTax = orders.reduce((sum, s) => sum + (s.taxAmount || 0), 0);

    return {
      totalGrandTotal,
      totalRefunded,
      totalTax,
      count: totalCount,
    };
  }, [orders, totalCount]);

  const fmt = (n: number) => (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchParams(filters);
  };

  const handleClear = () => {
    const reset = {
      branchId: "all",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      searchTerm: "",
    };
    setFilters(reset);
    setSearchParams(reset);
    setCurrentPage(1);
  };

  const statusBodyTemplate = (rowData: any) => {
    const isActive = rowData?.returnStatus === "Approved" || rowData?.returnStatus === "Confirmed";
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${isActive ? "text-[#09ad95] bg-[#00e6821a]" : "text-[#b40b09] bg-[#f50b0b1a]"}`}>
        {isActive ? t("confirmed", "مؤكدة") : t("not_confirmed", "غير مؤكدة")}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12" dir={direction}>
      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#22c55e]" />
              {t("sales_returns_report", "تقرير مرتجعات المبيعات")}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("customize_report_below", "تخصيص التقرير أدناه")}
            </CardDescription>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} />
              <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Filters Bar matching SalesReport.tsx exactly */}
       <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-end">
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
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
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
                    placeholderText={t("select_date", "يوم/شهر/سنة")}
                    popperPlacement="bottom-start"
                    portalId="root-portal"
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
                    placeholderText={t("select_date", "يوم/شهر/سنة")}
                    popperPlacement="bottom-start"
                    portalId="root-portal"
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {filters.to ? format(new Date(filters.to), "dd/MM/yyyy") : t("select_date", "يوم/شهر/سنة")}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row items-end gap-2 mb-2 lg:col-span-1">
                <Button onClick={handleSearch} disabled={isLoading || isFetching} className="flex-1 h-9 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold">
                  <Search size={16} />
                  {t("search", "بحث")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} className="text-[var(--primary)]" />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={orders}
              lazy
              paginator
              rows={entriesPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              first={(currentPage - 1) * entriesPerPage}
              totalRecords={totalCount}
              onPage={(e: DataTablePageEvent) => {
                if (e.page === undefined) return;
                setCurrentPage(e.page + 1);
                setEntriesPerPage(e.rows ?? entriesPerPage);
              }}
              loading={isLoading || isFetching}
              responsiveLayout="scroll"
              className="custom-green-table"
              dataKey="id"
              emptyMessage={t("no_available_options", "No available options")}
              stripedRows={false}
            >
              <Column header={t("invoice_number", "رقم الفاتورة")} sortable field="salesOrderNumber" body={(row) => <span className="font-bold text-[#22c55e]">{row.salesOrderNumber}</span>} />
              <Column header={t("return_number", "رقم المرتجع")} sortable field="returnNumber" />
              <Column header={t("date", "التاريخ")} sortable field="returnDate" body={(row) => formatDate(row.returnDate, "dateOnly")} />
              <Column header={t("customer_name", "اسم العميل")} sortable field="customerName" />
              <Column header={t("invoice_status", "حالة الفاتورة")} sortable body={statusBodyTemplate} field="returnStatus" />
              <Column header={t("total_amount", "الإجمالي")} sortable field="grandTotal" body={(row) => <span className="font-bold">{fmt(row.grandTotal)}</span>} />
              <Column header={t("refunded_amount", "المبلغ المرتجع")} sortable field="refundedAmount" body={(row) => <span className="font-bold text-slate-700">{fmt(row.refundedAmount)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

