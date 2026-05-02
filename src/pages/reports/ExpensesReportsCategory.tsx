import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Wallet, Receipt, History } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { Permissions } from '@/lib/permissions';

const ExpensesReportsCategory: React.FC = () => {
  const { t } = useLanguage();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const reports = [
    hasPermission(Permissions?.reports?.expenses?.list) && { title: t('expenses_report', 'تقرير المصروفات'), icon: <Wallet />, path: '/reports/expenses-detail' },
  ].filter(Boolean);

  return <ReportsDashboardBase title={t('expenses_reports', 'تقارير المصروفات')} reports={reports as any} />;
};

export default ExpensesReportsCategory;
