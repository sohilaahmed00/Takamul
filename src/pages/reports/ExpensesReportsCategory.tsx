import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Wallet, Receipt, History } from 'lucide-react';

const ExpensesReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('expenses_report', 'تقرير المصروفات'), icon: <Wallet />, path: '/reports/expenses' },
    { title: t('expenses_detail_report', 'تفاصيل المصروفات'), icon: <History />, path: '/reports/expenses-detail' },
  ];

  return <ReportsDashboardBase title={t('expenses_reports', 'تقارير المصروفات')} reports={reports} />;
};

export default ExpensesReportsCategory;
