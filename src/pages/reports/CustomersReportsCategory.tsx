import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Users, FileText } from 'lucide-react';

const CustomersReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('customer_reports'), icon: <Users />, path: '/reports/customers' },
    { title: t('customer_account_statement'), icon: <FileText />, path: '/reports/customer-aging' },
  ];

  return <ReportsDashboardBase title={t('customer_reports')} reports={reports} />;
};

export default CustomersReportsCategory;
