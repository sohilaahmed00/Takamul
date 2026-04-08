import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Barcode, AlertTriangle, FileText } from 'lucide-react';

const ItemsReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('item_reports'), icon: <Barcode />, path: '/reports/items' },
    { title: t('stock_alerts_report'), icon: <AlertTriangle />, path: '/reports/low-stock' },
    { title: t('item_movement_report'), icon: <FileText />, path: '/reports/item-movement' },
  ];

  return <ReportsDashboardBase title={t('item_reports')} reports={reports} />;
};

export default ItemsReportsCategory;
