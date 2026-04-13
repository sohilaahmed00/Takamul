import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

const ProfitsReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('profit_report', 'تقرير الأرباح'), icon: <TrendingUp />, path: '/reports/financial-summary' },
  ];

  return <ReportsDashboardBase title={t('profits_reports', 'تقارير الأرباح')} reports={reports} />;
};

export default ProfitsReportsCategory;
