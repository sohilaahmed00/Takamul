import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, History, List } from 'lucide-react';

const SuppliersReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('supplier_statement', 'كشف حساب مورد'), icon: <History />, path: '/reports/supplier-statement' },
  ];

  return <ReportsDashboardBase title={t('suppliers_reports', 'تقارير الموردين')} reports={reports} />;
};

export default SuppliersReportsCategory;
