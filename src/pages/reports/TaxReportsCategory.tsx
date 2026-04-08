import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Calculator } from 'lucide-react';

const TaxReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('tax_reports'), icon: <Calculator />, path: '/reports/taxes' },
  ];

  return <ReportsDashboardBase title={t('tax_reports')} reports={reports} />;
};

export default TaxReportsCategory;
