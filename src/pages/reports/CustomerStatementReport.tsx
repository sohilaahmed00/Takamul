import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Users } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import { Input } from "@/components/ui/input";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { useGetCustomerStatement } from "@/features/reports/hooks/Usegetcustomerstatement";

// ✅ الـ Type options بالقيم الإنجليزية اللي بتقبلها الـ API
const operationTypes = [
  { id: "Sales", name: "مبيعات" },
  { id: "Collections", name: "تحصيلات" },
];

type FilterState = {
  customerId: string;
  from: string;
  to: string;
  type: string;
};

export default function CustomerStatementReport() {
  const { t, direction } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    customerId: "",
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
    type: "Sales",
  });

  const [searchParams, setSearchParams] = useState<FilterState>(filters);

  // ✅ جيب العملاء الحقيقيين
  const { data: customersResponse, isLoading: customersLoading } = useGetAllCustomers({ limit: 500 });
  const customersList = useMemo(() => customersResponse?.items ?? [], [customersResponse]);

  // ✅ params للـ API
  const statementParams = useMemo(
    () => ({
      customerId: searchParams.customerId ? Number(searchParams.customerId) : "",
      from: searchParams.from,
      to: searchParams.to,
      type: searchParams.type || undefined,
    }),
    [searchParams]
  );

  const { data: statementData, isLoading, isFetching } = useGetCustomerStatement(statementParams);

  const handleSearch = () => setSearchParams(filters);

  const handleClear = () => {
    const reset: FilterState = {
      customerId: "",
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      type: "Sales",
    };
    setFilters(reset);
    setSearchParams(reset);
  };

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-GB", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // ✅ Summary من الداتا الحقيقية
  const totalDebit  = useMemo(() => statementData?.reduce((s, r) => s + (r.debit ?? 0), 0) ?? 0, [statementData]);
  const totalCredit = useMemo(() => statementData?.reduce((s, r) => s + (r.credit ?? 0), 0) ?? 0, [statementData]);
  const totalBalance = useMemo(() => statementData?.[statementData.length - 1]?.balance ?? 0, [statementData]);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} className="text-[var(--primary)]" />
              {t("customer_account_statement", "كشف حساب عميل")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Printer size={16} /><span className="hidden sm:inline">{t("print", "طباعة")}</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileText size={16} /><span className="hidden sm:inline">PDF</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileSpreadsheet size={16} /><span className="hidden sm:inline">XML</span></Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_debit", "إجمالي المدين")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalDebit)}</h2>
            </div>
            <div className="bg-teal-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_credit", "إجمالي الدائن")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalCredit)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("current_balance", "الرصيد الحالي")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalBalance)}</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* ✅ اختيار العميل الحقيقي - labelKey="customerName" */}
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("customer_name", "اسم العميل")}</label>
                <ComboboxField
                  value={filters.customerId}
                  onChange={(val) => setFilters((p) => ({ ...p, customerId: String(val) }))}
                  items={customersList}
                  valueKey="id"
                  labelKey="customerName"
                  placeholder={customersLoading ? t("loading", "جاري التحميل...") : t("select_customer", "اختر العميل")}
                  disabled={customersLoading}
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <Input type="date" value={filters.from} onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <Input type="date" value={filters.to} onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))} />
              </div>
              {/* ✅ نوع العملية بالقيم الإنجليزية */}
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("operation_type", "نوع العملية")}</label>
                <ComboboxField
                  value={filters.type}
                  onChange={(val) => setFilters((p) => ({ ...p, type: String(val) }))}
                  items={operationTypes}
                  valueKey="id"
                  labelKey="name"
                  placeholder={t("select_type", "اختر النوع")}
                />
              </div>
              <div className="flex flex-row items-end gap-2 lg:col-span-1">
                <Button onClick={handleSearch} variant="default"
                  className="flex-1 h-10 px-4 gap-2"
                  disabled={isLoading || isFetching || !filters.customerId}>
                  <Search size={16} />{t("search", "بحث")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="h-10 px-3"><RotateCcw size={15} /></Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={statementData || []}
              loading={isLoading || isFetching}
              paginator rows={10}
              className="custom-green-table custom-compact-table"
              emptyMessage={
                !searchParams.customerId
                  ? t("select_customer_first", "اختر عميلاً أولاً لعرض الكشف")
                  : t("no_data", "لا توجد بيانات")
              }
              responsiveLayout="stack"
            >
              <Column field="date" header={t("date", "التاريخ")} sortable
                body={(r) => <span className="text-sm whitespace-nowrap">{formatDate(r.date)}</span>} />
              <Column field="type" header={t("type", "النوع")} sortable
                body={(r) => <span className="text-sm font-medium text-[var(--text-main)]">{r.type}</span>} />
              <Column field="reference" header={t("reference", "المرجع")} sortable
                body={(r) => <span className="text-sm">{r.reference}</span>} />
              <Column field="debit" header={t("debit", "المدين")} sortable
                body={(r) => <span className="text-sm text-red-500">{r.debit > 0 ? formatNumber(r.debit) : "-"}</span>} />
              <Column field="credit" header={t("credit", "الدائن")} sortable
                body={(r) => <span className="text-sm text-green-600">{r.credit > 0 ? formatNumber(r.credit) : "-"}</span>} />
              <Column field="balance" header={t("balance", "الرصيد")} sortable
                body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.balance)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
