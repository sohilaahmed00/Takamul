import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Users, FileText } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { Permissions } from '@/lib/permissions';

const CustomersReportsCategory: React.FC = () => {
  const { t } = useLanguage();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const reports = [
    hasPermission(Permissions?.reports?.customers?.list) && { title: t('customer_account_statement', 'كشف حساب عميل'), icon: <Users />, path: '/reports/customer-statement' },
  ].filter(Boolean);

  return <ReportsDashboardBase title={t('customer_reports', 'تقارير العملاء')} reports={reports as any} />;
};

export default CustomersReportsCategory;

