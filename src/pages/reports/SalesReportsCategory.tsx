import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { SaudiRiyal, Barcode, Users, RefreshCw, Calendar, FileText, RotateCcw } from 'lucide-react';

const SalesReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('sales_by_invoice', 'تقرير اجمالي المبيعات على مستوى ارقام الفواتير'), icon: <FileText />, path: '/reports/sales-by-invoice' },
    { title: t('sales_by_day', 'تقرير اجمالي المبيعات على مستوى الأيام'), icon: <Calendar />, path: '/reports/sales-by-day' },
    { title: t('item_sales_report', 'تقرير مبيعات صنف'), icon: <Barcode />, path: '/reports/item-sales' },
    { title: t('shifts_report', 'تقرير الورديات'), icon: <RefreshCw />, path: '/reports/shifts' },
    { title: t('sales_returns_report', 'تقرير مرتجعات المبيعات'), icon: <RotateCcw />, path: '/reports/sales-returns' },
    { title: t('employee_sales_report', 'تقرير مبيعات موظف'), icon: <Users />, path: '/reports/employee-sales' },
  ];


  return <ReportsDashboardBase title={t('sales_reports')} reports={reports} />;
};

export default SalesReportsCategory;
