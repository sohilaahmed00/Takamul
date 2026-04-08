import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingCart, Barcode, Users } from 'lucide-react';

const PurchasesReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('purchase_reports'), icon: <ShoppingCart />, path: '/reports/purchases' },
    { title: t('item_purchase_report'), icon: <Barcode />, path: '/reports/purchases' },
    { title: t('user_purchase_report'), icon: <Users />, path: '/reports/purchases' },
  ];

  return <ReportsDashboardBase title={t('purchase_reports')} reports={reports} />;
};

export default PurchasesReportsCategory;
