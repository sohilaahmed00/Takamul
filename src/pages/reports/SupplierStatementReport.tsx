import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, UserPlus } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";

interface FilterState { supplierId: string; from: string; to: string; operationType: string; }

const mockSuppliers = [
  { id: "s1", name: "شركة الأمل للتوريدات" },
  { id: "s2", name: "مؤسسة النور التجارية" },
  { id: "s3", name: "مصنع الخليج للمواد" },
];

const operationTypes = [
  { id: "purchases", name: "مشتريات" },
  { id: "payment", name: "سداد" },
];

const mockRows = [
  { id: "1", date: "2026-01-05 16:04:00", type: "فاتورة", debit: 0, credit: 0 },
  { id: "2", date: "2026-01-05 16:04:00", type: "فاتورة", debit: 0, credit: 400.0 },
  { id: "3", date: "2026-01-05 16:03:00", type: "سداد", debit: 50.0, credit: 0 },
  { id: "4", date: "2026-01-05 16:02:37", type: "فاتورة", debit: 0, credit: 0 },
];

export default function SupplierStatementReport() {
  const { t, direction } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({ supplierId: "", from: "", to: "", operationType: "" });

  const handleSearch = () => { };
  const handleClear = () => setFilters({ supplierId: "", from: "", to: "", operationType: "" });

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  const totalPurchases = useMemo(() => mockRows.reduce((s, r) => s + r.credit, 0), []);
  const totalPaid = useMemo(() => mockRows.reduce((s, r) => s + r.debit, 0), []);
  const totalDebt = useMemo(() => Math.abs(totalPurchases - totalPaid), [totalPurchases, totalPaid]);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} className="text-[var(--primary)]" />
              {t("supplier_account_statement", "كشف حساب مورد")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Printer size={16} /><span className="hidden sm:inline">Print</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileText size={16} /><span className="hidden sm:inline">PDF</span></Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><FileSpreadsheet size={16} /><span className="hidden sm:inline">XML</span></Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 3 Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_purchases", "إجمالي المشتريات")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalPurchases)}</h2>
            </div>
            <div className="bg-teal-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_paid", "إجمالي المسدد")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalPaid)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_debt", "إجمالي المديونية")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalDebt)}</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("supplier_name", "اسم المورد")}</label>
                <ComboboxField value={filters.supplierId} onChange={val => setFilters(p => ({ ...p, supplierId: val }))}
                  items={mockSuppliers} valueKey="id" labelKey="name" placeholder={t("select_supplier", "اختر المورد")} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))} className="takamol-input h-10 w-full" />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <input type="date" value={filters.to} onChange={e => setFilters(p => ({ ...p, to: e.target.value }))} className="takamol-input h-10 w-full" />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("operation_type", "نوع العملية")}</label>
                <ComboboxField value={filters.operationType} onChange={val => setFilters(p => ({ ...p, operationType: val }))}
                  items={operationTypes} valueKey="id" labelKey="name" placeholder={t("select_type", "اختر النوع")} />
              </div>
              <div className="flex flex-row items-end gap-2 lg:col-span-1">
                <Button onClick={handleSearch} variant="default" className="flex-1 h-10 px-4 gap-2"><Search size={16} />{t("execute_operation", "اتمام العملية")}</Button>
                <Button onClick={handleClear} variant="outline" className="h-10 px-3 gap-1"><RotateCcw size={15} /></Button>
              </div>
            </div>

            {/* {filters.operationType === "" && (
              <div className="mt-3 text-sm text-[var(--text-main)] opacity-70 flex gap-4">
                <span className="font-medium">↓ {t("purchases", "مشتريات")}</span>
                <span className="font-medium">{t("payment", "سداد")}</span>
              </div>
            )} */}
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable value={mockRows} paginator rows={5} className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")} responsiveLayout="stack">
              <Column field="date" header={t("date", "التاريخ")} sortable body={r => <span className="text-sm">{r.date}</span>} />
              <Column field="type" header={t("type", "النوع")} sortable body={r => <span className="text-sm font-medium text-[var(--text-main)]">{r.type}</span>} />
              <Column field="credit" header={t("debit_supplier_due", "الدائن (للمورد)")} sortable body={r => <span className="text-sm">{r.credit > 0 ? formatNumber(r.credit) : "-"}</span>} />
              <Column field="debit" header={t("credit_supplier_paid", "الدائن (المسدد للمورد)")} sortable body={r => <span className="text-sm font-bold text-[var(--primary)]">{r.debit > 0 ? formatNumber(r.debit) : "-"}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
