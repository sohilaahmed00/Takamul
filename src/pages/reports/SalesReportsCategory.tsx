import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { SaudiRiyal, Barcode, Users, UserCheck, RefreshCw } from 'lucide-react';

const SalesReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('sales_report'), icon: <SaudiRiyal />, path: '/reports/sales' },
    { title: t('shifts'), icon: <RefreshCw />, path: '/reports/shifts' },
    { title: t('item_sales_report'), icon: <Barcode />, path: '/reports/sales-by-item-invoice' },
    { title: t('user_sales_report'), icon: <Users />, path: '/reports/cashier-sales-summary' },
    { title: t('employee_sales_report'), icon: <UserCheck />, path: '/reports/reps-sales' },
  ];

  return <ReportsDashboardBase title={t('sales_reports')} reports={reports} />;
};

export default SalesReportsCategory;
