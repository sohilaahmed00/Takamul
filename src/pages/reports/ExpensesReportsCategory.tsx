import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { PieChart } from 'lucide-react';

const ExpensesReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('expense_reports'), icon: <PieChart />, path: '/reports/expenses' },
  ];

  return <ReportsDashboardBase title={t('expense_reports')} reports={reports} />;
};

export default ExpensesReportsCategory;
