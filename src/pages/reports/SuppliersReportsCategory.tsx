import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, History, List } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { Permissions } from '@/lib/permissions';

const SuppliersReportsCategory: React.FC = () => {
  const { t } = useLanguage();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const reports = [
    hasPermission(Permissions?.reports?.suppliers?.list) && { title: t('supplier_statement', 'كشف حساب مورد'), icon: <History />, path: '/reports/supplier-statement' },
  ].filter(Boolean);

  return <ReportsDashboardBase title={t('suppliers_reports', 'تقارير الموردين')} reports={reports as any} />;
};

export default SuppliersReportsCategory;
