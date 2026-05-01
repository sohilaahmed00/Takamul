import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { SaudiRiyal, Barcode, Users, RefreshCw, Calendar, FileText, RotateCcw } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { Permissions } from '@/lib/permissions';

const SalesReportsCategory: React.FC = () => {
  const { t } = useLanguage();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const reports = [
    hasPermission(Permissions?.reports?.sales?.invoices) && { title: t('sales_by_invoice', 'تقرير اجمالي المبيعات على مستوى ارقام الفواتير'), icon: <FileText />, path: '/reports/sales-by-invoice' },
    hasPermission(Permissions?.reports?.sales?.daily) && { title: t('sales_by_day', 'تقرير اجمالي المبيعات على مستوى الأيام'), icon: <Calendar />, path: '/reports/sales-by-day' },
    hasPermission(Permissions?.reports?.products?.sales) && { title: t('item_sales_report', 'تقرير مبيعات صنف'), icon: <Barcode />, path: '/reports/item-sales' },
    hasPermission(Permissions?.shifts?.view) && { title: t('shifts_report', 'تقرير الورديات'), icon: <RefreshCw />, path: '/reports/shifts' },
    hasPermission(Permissions?.reports?.sales?.returns) && { title: t('sales_returns_report', 'تقرير مرتجعات المبيعات'), icon: <RotateCcw />, path: '/reports/sales-returns' },
    hasPermission(Permissions?.reports?.sales?.employee) && { title: t('employee_sales_report', 'تقرير مبيعات موظف'), icon: <Users />, path: '/reports/employee-sales' },
  ].filter(Boolean);


  return <ReportsDashboardBase title={t('sales_reports')} reports={reports as any} />;
};

export default SalesReportsCategory;
