import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { UserPlus, FileText } from 'lucide-react';

const SuppliersReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('supplier_reports'), icon: <UserPlus />, path: '/reports/vendors' },
    { title: t('supplier_account_statement'), icon: <FileText />, path: '/reports/vendor-aging' },
  ];

  return <ReportsDashboardBase title={t('supplier_reports')} reports={reports} />;
};

export default SuppliersReportsCategory;
