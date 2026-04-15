import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Barcode, AlertTriangle, FileText, BarChart3, TrendingUp } from 'lucide-react';


const ItemsReportsCategory: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    { title: t('top_selling_product_report', 'تقرير المنتج الأكثر مبيعاً'), icon: <TrendingUp />, path: '/reports/best-sellers' },
    { title: t('item_movement_report', 'تقرير كشف حركة صنف'), icon: <FileText />, path: '/reports/item-movement' },
    { title: t('stock_alerts_report', 'تقرير تنبيهات المخزون'), icon: <AlertTriangle />, path: '/reports/low-stock' },
    { title: t('stock_balance_report', 'تقرير جرد الأصناف'), icon: <BarChart3 />, path: '/reports/stock-balance' },
  ];

  return <ReportsDashboardBase title={t('item_reports', 'تقارير الأصناف')} reports={reports} />;
};

export default ItemsReportsCategory;


