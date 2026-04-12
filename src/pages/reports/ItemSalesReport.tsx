import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, FileText, Printer, FileSpreadsheet, Barcode } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";

import { Input } from "@/components/ui/input";

interface FilterState { productId: string; from: string; to: string; }

const mockProducts = [
  { value: "prod1", label: "أرز بسمتي 5 كيلو" },
  { value: "prod2", label: "زيت نباتي 2 لتر" },
  { value: "prod3", label: "سكر أبيض 1 كيلو" },
];

const mockRows = [
  { id: "1", serial: 1, date: "2026-01-05", invoiceNumber: "INV-1001", quantity: 10, total: 250.0 },
  { id: "2", serial: 2, date: "2026-01-12", invoiceNumber: "INV-1015", quantity: 5, total: 125.0 },
  { id: "3", serial: 3, date: "2026-01-20", invoiceNumber: "INV-1028", quantity: 20, total: 500.0 },
  { id: "4", serial: 4, date: "2026-02-03", invoiceNumber: "INV-1035", quantity: 8, total: 200.0 },
  { id: "5", serial: 5, date: "2026-02-15", invoiceNumber: "INV-1042", quantity: 15, total: 375.0 },
];

export default function ItemSalesReport() {
  const { t, direction } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({ productId: "", from: "", to: "" });

  const handleSearch = () => {};
  const handleClear = () => setFilters({ productId: "", from: "", to: "" });

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalSalesAmount = useMemo(() => mockRows.reduce((s, r) => s + r.total, 0), []);
  const totalQuantity = useMemo(() => mockRows.reduce((s, r) => s + r.quantity, 0), []);

  return (
    <div dir={direction}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Barcode size={20} className="text-[var(--primary)]" />
              {t("item_sales_report", "تقرير مبيعات صنف")}
            </CardTitle>
            <CardDescription>{t("customize_report_below", "استخدم الفلاتر لتخصيص التقرير")}</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <Printer size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <FileText size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[70px]">
              <FileSpreadsheet size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline">XML</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("product_name", "اسم الصنف")}</label>
                <ComboboxField
                  value={filters.productId}
                  onChange={(val) => setFilters((p) => ({ ...p, productId: val }))}
                  items={mockProducts.map((p) => ({ id: p.value, name: p.label }))} valueKey="id" labelKey="name"
                  placeholder={t("select_product", "اختر الصنف")}
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("from_date", "تاريخ البداية")}</label>
                <Input type="date" value={filters.from}
                  onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                   />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-medium text-[var(--text-main)]">{t("to_date", "تاريخ النهاية")}</label>
                <Input type="date" value={filters.to}
                  onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                   />
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-2 lg:col-span-2">
                <Button onClick={handleSearch} variant="default" className="w-full sm:w-auto h-10 px-6 gap-2">
                  <Search size={16} />
                  {t("execute_operation", "اتمام العملية")}
                </Button>
                <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto h-10 px-4 gap-2">
                  <RotateCcw size={16} />
                  {t("clear", "مسح")}
                </Button>
              </div>
            </div>
          </div>

          {/* 2 Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_item_sales", "إجمالي مبيعات الصنف")}</p>
              <h2 className="text-2xl font-bold">{formatNumber(totalSalesAmount)}</h2>
            </div>
            <div className="bg-blue-500 text-white rounded-xl p-4 shadow flex flex-col justify-center">
              <p className="opacity-90 text-xs font-medium mb-1">{t("total_sales_quantity", "عدد عمليات البيع")}</p>
              <h2 className="text-2xl font-bold">{totalQuantity.toLocaleString()}</h2>
            </div>
          </div>

          {/* Table: م، التاريخ، رقم الفاتورة، الكمية المباعة، إجمالي البيع */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <DataTable
              value={mockRows} paginator rows={5}
              className="custom-green-table custom-compact-table"
              emptyMessage={t("no_data", "لا توجد بيانات")}
              responsiveLayout="stack"
            >
              <Column field="serial" header={t("serial", "م")} sortable body={(r) => <span className="text-sm font-semibold">{r.serial}</span>} />
              <Column field="date" header={t("date", "التاريخ")} sortable body={(r) => <span className="text-sm">{r.date}</span>} />
              <Column field="invoiceNumber" header={t("invoice_number", "رقم الفاتورة")} sortable body={(r) => <span className="text-sm font-bold text-[var(--text-main)]">{r.invoiceNumber}</span>} />
              <Column field="quantity" header={t("sold_quantity", "الكمية المباعة")} sortable body={(r) => <span className="text-sm font-medium">{r.quantity}</span>} />
              <Column field="total" header={t("total_sales_value", "إجمالي البيع")} sortable body={(r) => <span className="text-sm font-bold text-[var(--primary)]">{formatNumber(r.total)}</span>} />
            </DataTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
