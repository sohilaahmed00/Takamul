import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Calendar, Barcode } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { Permissions } from '@/lib/permissions';

const PurchasesReportsCategory: React.FC = () => {
  const { t } = useLanguage();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const reports = [
    hasPermission(Permissions?.reports?.purchases?.invoices) && { title: t('purchases_by_invoice', 'تحليل مشتريات على مستوى أرقام الفواتير'), icon: <FileText />, path: '/reports/purchases-by-invoice' },
    hasPermission(Permissions?.reports?.purchases?.daily) && { title: t('purchases_by_day', 'تحليل مشتريات على مستوى الأيام'), icon: <Calendar />, path: '/reports/purchases-by-day' },
    hasPermission(Permissions?.reports?.products?.purchases) && { title: t('item_purchases_report', 'تقرير مشتريات صنف'), icon: <Barcode />, path: '/reports/item-purchases' },
  ].filter(Boolean);

  return <ReportsDashboardBase title={t('purchase_reports', 'تقارير المشتريات')} reports={reports as any} />;
};

export default PurchasesReportsCategory;
