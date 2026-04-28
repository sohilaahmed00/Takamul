
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ShoppingCart, Truck, FileText, Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Hooks
import { useGetAllSales } from '@/features/sales/hooks/useGetAllSales';
import { useGetAllPurchases } from '@/features/purchases/hooks/useGetAllSales';
import { useGetAllQuotations } from '@/features/quotation/hooks/useGetAllQuotations';
import { useGetAllSuppliers } from '@/features/suppliers/hooks/useGetAllSuppliers';
import { useGetAllCustomers } from '@/features/customers/hooks/useGetAllCustomers';
import formatDate from '@/lib/formatDate';

export default function RecentTransactions() {
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState('sales');

  const { data: salesOrders } = useGetAllSales({ page: 1, limit: 5 });
  const { data: purchases } = useGetAllPurchases({ page: 1, limit: 5, searchTerm: "" });
  const { data: quotations } = useGetAllQuotations();
  const { data: suppliers } = useGetAllSuppliers();
  const { data: customersResponse } = useGetAllCustomers({ page: 1, limit: 5 });

  const tabs = [
    { id: 'sales', label: t('sales') || 'المبيعات', icon: ShoppingCart },
    { id: 'purchases', label: t('purchases') || 'المشتريات', icon: Truck },
    { id: 'quotes', label: t('quotes') || 'عروض الأسعار', icon: FileText },
    { id: 'suppliers', label: t('suppliers') || 'الموردين', icon: Users },
    { id: 'customers', label: t('customers') || 'العملاء', icon: UserPlus },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden" dir={direction}>
      {/* Header and Tabs */}
      <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-main)]/50">
        <h2 className="text-base font-bold text-[var(--text-main)] mb-3">{t('recent_operations') || 'العمليات الأخيرة'}</h2>
        <div className="flex overflow-x-auto hide-scrollbar gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border)] hover:bg-[var(--bg-main)]"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-2">
        {activeTab === 'sales' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <DataTable
              value={salesOrders?.items?.slice(0, 5) || []}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              dataKey="id"
              emptyMessage={t("no_data")}
            >
              <Column header={t("code")} field="id" />
              <Column header={t("date")} body={(row) => new Date(row.orderDate).toLocaleDateString("ar-EG")} />
              <Column header={t("customer_name")} field="customerName" />
              <Column header={t("cashier")} field="createdBy" />
              <Column 
                header={t("invoice_status")} 
                body={(rowData) => {
                  if (rowData.orderStatus === "Confirmed") return "مكتملة";
                  if (rowData.orderStatus === "UnConfirmed") return "غير مكتملة";
                  return rowData.orderStatus;
                }}
              />
              <Column header={t("total_amount")} field="grandTotal" />
              <Column header={t("paid_amount")} body={(rowData) => rowData.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) ?? 0} />
            </DataTable>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <DataTable
              value={purchases?.items?.slice(0, 5) || []}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              dataKey="id"
              emptyMessage={t("no_data")}
            >
              <Column header={t("date")} body={(row) => formatDate(row.orderDate)} />
              <Column header={t("code")} field="id" />
              <Column header={t("supplier_name")} field="supplierName" />
              <Column 
                header={t("purchase_order_status")} 
                body={(rowData) => {
                  if (rowData.orderStatus === "Confirmed") return "مكتملة";
                  if (rowData.orderStatus === "UnConfirmed") return "غير مكتملة";
                  return rowData.orderStatus;
                }}
              />
            </DataTable>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <DataTable
              value={quotations?.slice(0, 5) || []}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              dataKey="id"
              emptyMessage={t("no_data")}
            >
              <Column header={t("code")} field="id" />
              <Column header={t("date")} body={(row) => formatDate(row.quotationDate)} />
              <Column header={t("customer_name")} field="customerName" />
              <Column 
                header={t("quote_status")} 
                body={(rowData) => {
                  if (rowData.status === "Confirmed" || rowData.status === "Active") return "مكتملة";
                  if (rowData.status === "UnConfirmed" || rowData.status === "Pending") return "غير مكتملة";
                  return rowData.status;
                }}
              />
              <Column header={t("subtotal")} field="subTotal" />
              <Column header={t("tax_amount")} field="taxAmount" />
              <Column header={t("discount_amount")} field="discountAmount" />
              <Column header={t("total_amount")} field="grandTotal" />
            </DataTable>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <DataTable
              value={suppliers?.items?.slice(0, 5) || []}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              dataKey="id"
              emptyMessage={t("no_data")}
            >
              <Column field="id" header={t("code")} sortable />
              <Column field="supplierName" header={t("name")} />
              <Column field="phone" header={t("phone")} />
            </DataTable>
          </div>
        )}

        {activeTab === 'customers' && (
            <DataTable
              value={customersResponse?.items?.slice(0, 5) || []}
              responsiveLayout="stack"
              className="custom-green-table custom-compact-table"
              dataKey="id"
              emptyMessage={t("no_data")}
            >
              <Column field="id" header={t("code")} sortable />
              <Column field="customerName" header={t("name")} sortable />
              <Column field="phone" header={t("phone")} />
            </DataTable>
        )}
      </div>
    </div>
  );
}
