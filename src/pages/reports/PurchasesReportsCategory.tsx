import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Calendar, Barcode } from 'lucide-react';

const PurchasesReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('purchases_by_invoice', 'تحليل مشتريات على مستوى أرقام الفواتير'), icon: <FileText />, path: '/reports/purchases-by-invoice' },
    { title: t('purchases_by_day', 'تحليل مشتريات على مستوى الأيام'), icon: <Calendar />, path: '/reports/purchases-by-day' },
    { title: t('item_purchases_report', 'تقرير مشتريات صنف'), icon: <Barcode />, path: '/reports/item-purchases' },
  ];

  return <ReportsDashboardBase title={t('purchase_reports', 'تقارير المشتريات')} reports={reports} />;
};

export default PurchasesReportsCategory;
