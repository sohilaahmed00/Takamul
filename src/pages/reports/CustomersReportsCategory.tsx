import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Users, FileText } from 'lucide-react';

const CustomersReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('customer_account_statement', 'كشف حساب عميل'), icon: <Users />, path: '/reports/customer-statement' },
  ];

  return <ReportsDashboardBase title={t('customer_reports', 'تقارير العملاء')} reports={reports} />;
};

export default CustomersReportsCategory;

