import React from 'react';
import ReportsDashboardBase from '@/components/ReportsDashboardBase';
import { useLanguage } from '@/context/LanguageContext';
import { Barcode, AlertTriangle, FileText, BarChart3, TrendingUp } from 'lucide-react';


import { useAuthStore } from '@/store/authStore';
import { Permissions } from '@/lib/permissions';

const ItemsReportsCategory: React.FC = () => {
  const { t } = useLanguage();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const reports = [
    hasPermission(Permissions?.reports?.products?.topSelling) && { title: t('top_selling_product_report', 'تقرير المنتج الأكثر مبيعاً'), icon: <TrendingUp />, path: '/reports/best-sellers' },
    hasPermission(Permissions?.reports?.products?.movement) && { title: t('item_movement_report', 'تقرير كشف حركة صنف'), icon: <FileText />, path: '/reports/item-movement' },
    hasPermission(Permissions?.reports?.products?.stockAlerts) && { title: t('stock_alerts_report', 'تقرير تنبيهات المخزون'), icon: <AlertTriangle />, path: '/reports/low-stock' },
    hasPermission(Permissions?.reports?.products?.inventory) && { title: t('stock_balance_report', 'تقرير جرد الأصناف'), icon: <BarChart3 />, path: '/reports/stock-balance' },
  ].filter(Boolean);

  return <ReportsDashboardBase title={t('item_reports', 'تقارير الأصناف')} reports={reports as any} />;
};

export default ItemsReportsCategory;


