import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, UserPlus } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import { Input } from "@/components/ui/input";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { useGetSupplierStatement } from "@/features/reports/hooks/Usegetsupplierstatement";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToExcel } from "@/utils/exportUtils";
import { exportCustomPDF, printCustomHTML, getAccountStatementHTML } from "@/utils/customExportUtils";

// ✅ الـ Type options بالقيم الإنجليزية اللي بتقبلها الـ API
const operationTypes = [
  { id: "Purchases", name: "مشتريات" },
  { id: "Payments", name: "مدفوعات" },
];

type FilterState = {
  supplierId: string;
  from: string;
  to: string;
  type: string;
};

export default function SupplierStatementReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    supplierId: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
    type: "",
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // ✅ جيب الموردين الحقيقيين
  const { data: suppliersResponse, isLoading: suppliersLoading } = useGetAllSuppliers();
  const suppliersList = useMemo(() => suppliersResponse?.items ?? [], [suppliersResponse]);

  // ✅ params للـ API
  const statementParams = useMemo(
    () => ({
      supplierId: searchParams.supplierId ? Number(searchParams.supplierId) : "",
      from: searchParams.from,
      to: searchParams.to,
      type: searchParams.type || undefined,
    }),
    [searchParams],
  );

  const { data: statementData, isLoading, isFetching } = useGetSupplierStatement(statementParams);

  const handleSearch = () => setSearchParams(filters);

  const handleClear = () => {
    const reset: FilterState = {
      supplierId: "",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      type: "",
    };
    setFilters(reset);
    setSearchParams(reset);
  };

  const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalDebit = useMemo(() => statementData?.reduce((s, r) => s + (r.debit ?? 0), 0) ?? 0, [statementData]);
  const totalCredit = useMemo(() => statementData?.reduce((s, r) => s + (r.credit ?? 0), 0) ?? 0, [statementData]);
  const totalBalance = useMemo(() => statementData?.[statementData.length - 1]?.balance ?? 0, [statementData]);

  const selectedSupplierName = suppliersList.find((c) => String(c.id) === searchParams.supplierId)?.supplierName || "";
  const title = t("supplier_account_statement", "كشف حساب مورد");
  
  const getFiltersInfo = () => {
    return `${t("from_date")}: ${searchParams.from || "-"} | ${t("to_date")}: ${searchParams.to || "-"} | ${t("operation_type")}: ${searchParams.type || t("all")}`;
  };

  const getSummaryData = () => ({
    total1: totalDebit, label1: t("total_purchases", "إجمالي المشتريات"), tableCol1: direction === "ltr" ? "Due to Supplier" : "المستحق للمورد",
    total2: totalCredit, label2: t("total_payments", "إجمالي المدفوعات"), tableCol2: direction === "ltr" ? "Paid by Supplier" : "المسدد للمورد",
    total3: totalBalance, label3: t("total_debit", "إجمالي المديونية"),
  });

  const [pdfLoading, setPdfLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!statementData?.length) return;
    setPdfLoading(true);
    try {
      const htmlString = getAccountStatementHTML(
        title, 
        { name: selectedSupplierName, label: t("supplier_name", "اسم المورد") },
        getFiltersInfo(), 
        getSummaryData(), 
        statementData, 
        t,
        direction
      );
      await exportCustomPDF(title, htmlString);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    if (!statementData?.length) return;
    const htmlString = getAccountStatementHTML(
       title, 
        { name: selectedSupplierName, label: t("supplier_name", "اسم المورد") },
        getFiltersInfo(), 
        getSummaryData(), 
        statementData, 
        t,
        direction
    );
    printCustomHTML(title, htmlString);
  };

  const handleExportExcel = () => {
    if (!statementData?.length) return;
    const excelData = statementData.map((r, i) => ({
      [t("serial", "م")]: i + 1,
      [t("date", "التاريخ")]: r.date ? new Date(r.date).toLocaleString("en-GB") : "-",
      [t("operation_type", "نوع العملية")]: r.type,
      [t("reference", "المرجع")]: r.reference || "-",
      [t("total_purchases", "مشتريات")]: r.debit,
      [t("total_payments", "مدفوعات")]: r.credit,
      [t("balance", "الرصيد")]: r.balance,
    }));
    exportToExcel(excelData, title, t, direction);
  };

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} className="text-[var(--primary)]" />
              {t("supplier_account_statement", "كشف حساب مورد")}
            </CardTitle>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button onClick={handlePrint} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <Printer size={16} /> <span className="hidden sm:inline">{t("print", "طباعة")}</span>
            </button>
            <button onClick={handleExportPDF} disabled={pdfLoading} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileText size={16} /> <span className="hidden sm:inline">{pdfLoading ? "تحميل..." : "PDF"}</span>
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors text-slate-600 dark:text-slate-400">
              <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_purchases", "إجمالي المشتريات")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalDebit)}</h2>
            </div>
            <div className="bg-teal-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_paids", "إجمالي المسدد")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalCredit)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_debit", "إجمالي المديونية")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalBalance)}</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* ✅ اختيار المورد الحقيقي - labelKey="supplierName" */}
              <div className=" lg:col-span-1">
                <Label className="mb-2 text-xs font-medium text-[var(--text-main)]">{t("supplier_name", "اسم المورد")}</Label>
                <ComboboxField value={filters.supplierId} onChange={(val) => setFilters((p) => ({ ...p, supplierId: String(val) }))} items={suppliersList} valueKey="id" labelKey="supplierName" placeholder={suppliersLoading ? t("loading", "جاري التحميل...") : t("select_supplier", "اختر المورد")} disabled={suppliersLoading} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</Label>
                <div className="relative flex items-center border border-input rounded-md bg-background">
                  <DatePicker
                    selected={filters.from ? new Date(filters.from) : null}
                    onChange={(date) => setFilters((p) => ({ ...p, from: date ? format(date, "yyyy-MM-dd") : "" }))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("select_date", "يوم/شهر/سنة")}
                    popperPlacement="bottom-start"
                    portalId="root-portal" // لحل مشكلة الطبقات (z-index)
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
                <Label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</Label>
                <div className="relative flex items-center border border-input rounded-md bg-background">
                  <DatePicker
                    selected={filters.to ? new Date(filters.to) : null}
                    onChange={(date) => setFilters((p) => ({ ...p, to: date ? format(date, "yyyy-MM-dd") : "" }))}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("select_date", "يوم/شهر/سنة")}
                    popperPlacement="bottom-start"
                    portalId="root-portal" // لحل مشكلة الطبقات (z-index)
                    customInput={
                      <div className="flex items-center gap-2 cursor-pointer px-3 h-10 w-full">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {/* هنا تم التعديل من filters.from إلى filters.to */}
                          {filters.to ? format(new Date(filters.to), "dd/MM/yyyy") : t("select_date", "يوم/شهر/سنة")}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Label className="text-xs font-medium text-[var(--text-main)]">{t("operation_type", "نوع العملية")}</Label>
                <Select value={filters.type} onValueChange={(val) => setFilters((p) => ({ ...p, type: val }))}>
                  <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 text-sm">
                    <SelectValue placeholder={t("select_type", "اختر النوع")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>{t("all", "الكل")}</SelectItem>
                    {operationTypes.map((b) => (
                      <SelectItem key={String(b.id)} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row items-end gap-2 mb-2">
                <Button onClick={handleSearch} className="flex-1 h-9 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white gap-2 rounded-lg shadow-sm font-bold" disabled={isLoading || isFetching || !filters.supplierId}>
                  <Search size={16} />
                  {t("search", "بحث")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-9 px-3 gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RotateCcw size={15} /> {t("clear", "مسح")}
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable value={statementData || []} loading={isLoading || isFetching} paginator rows={10} className="custom-green-table custom-compact-table" emptyMessage={!searchParams.supplierId ? t("select_supplier_first", "اختر مورداً أولاً لعرض الكشف") : t("no_data", "لا توجد بيانات")} responsiveLayout="stack">
              <Column field="date" header={t("date", "التاريخ")} sortable body={(r) => <span className="text-sm whitespace-nowrap">{formatDate(r.date)}</span>} />
              <Column field="type" header={t("type", "النوع")} sortable body={(r) => <span className="text-sm font-medium text-[var(--text-main)]">{r.type}</span>} />
              <Column field="reference" header={t("reference", "المرجع")} sortable body={(r) => <span className="text-sm font-medium text-[var(--text-main)]">{r.reference}</span>} />
              <Column field="debit" header={t("supplier_due", "المستحق للمورد")} sortable body={(r) => <span className="text-sm text-red-500">{r.debit > 0 ? formatNumber(r.debit) : "-"}</span>} />
              <Column field="credit" header={t("supplier_paid", "المسدد للمورد")} sortable body={(r) => <span className="text-sm text-green-600">{r.credit > 0 ? formatNumber(r.credit) : "-"}</span>} />
              {/* <Column field="balance" header={t("balance", "الرصيد")} sortable
                body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.balance)}</span>} /> */}
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
