import { useState, type ReactNode } from 'react';
import { 
  Barcode, Rocket, ArrowDown, AlertTriangle, Calendar, RefreshCw, 
  Layers, FileText, DollarSign, Sparkles, Layout, XCircle, 
  Hammer, LineChart, Network, Grid, Clock, List, Users, 
  UserCheck, Percent, Search, FileCheck, Calculator, ShoppingCart,
  PieChart, BarChart3, TrendingUp, Settings2, ArrowLeftRight, 
  Wallet, Landmark, UserPlus, Scale, FileSpreadsheet,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ReportCard {
  title: string;
  icon: ReactNode;
  category: string;
  path?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Reports() {
  const { t, direction } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('items');

  const categories: Category[] = [
    { id: 'items', name: 'تقارير الأصناف' },
    { id: 'sales', name: 'تقارير المبيعات' },
    { id: 'taxes', name: 'تقارير الضرائب' },
    { id: 'purchases', name: 'تقارير المشتريات' },
    { id: 'charts', name: 'رسوم بيانية' },
    { id: 'quantity', name: 'التعديلات الكمية للتقارير' },
    { id: 'financials', name: 'تقارير الماليات والورديات' },
    { id: 'customers', name: 'تقارير العملاء والموردين' },
    { id: 'employees', name: 'المندوبين والموظفين التقارير' },
    { id: 'accounts', name: 'الحسابات العامة التقارير' },
    { id: 'reservations', name: 'الحجوزات التقارير' },
  ];

  const reports: ReportCard[] = [
    // Items Reports
    { category: 'items', title: 'تقارير الأصناف', icon: <Barcode className="w-8 h-8" />, path: '/reports/items' },
    { category: 'items', title: 'العروض الترويجية', icon: <Rocket className="w-8 h-8" />, path: '/reports/promotions' },
    { category: 'items', title: 'الأصناف تحت حد الطلب', icon: <ArrowDown className="w-8 h-8" />, path: '/reports/low-stock' },
    { category: 'items', title: 'تنبيه صلاحية الأصناف', icon: <AlertTriangle className="w-8 h-8" />, path: '/reports/expiry-alert' },
    { category: 'items', title: 'تقرير تواريخ انتهاء الأصناف', icon: <Calendar className="w-8 h-8" />, path: '/reports/expiry-dates' },
    { category: 'items', title: 'تقرير الأصناف بيع وشراء', icon: <RefreshCw className="w-8 h-8" />, path: '/reports/sales-purchases' },
    { category: 'items', title: 'تقرير رصيد المخزون خلال فترة', icon: <Layers className="w-8 h-8" />, path: '/reports/stock-balance' },
    { category: 'items', title: 'كشف حركة صنف', icon: <FileText className="w-8 h-8" />, path: '/reports/item-movement' },
    { category: 'items', title: 'تقرير المبيعات', icon: <DollarSign className="w-8 h-8" /> },
    { category: 'items', title: 'تقرير توريد الأصناف', icon: <Sparkles className="w-8 h-8" />, path: '/reports/item-supply' },
    { category: 'items', title: 'أصناف الليسته', icon: <Layout className="w-8 h-8" />, path: '/reports/list-items' },
    { category: 'items', title: 'تقرير الأصناف النافذة', icon: <XCircle className="w-8 h-8" />, path: '/reports/out-of-stock' },
    { category: 'items', title: 'تقرير الأصناف الخاسرة', icon: <Hammer className="w-8 h-8" />, path: '/reports/losing-items' },
    { category: 'items', title: 'تقرير الأصناف الراكدة', icon: <TrendingUp className="w-8 h-8" />, path: '/reports/stagnant-items' },
    { category: 'items', title: 'تقرير عن التصنيفات', icon: <Network className="w-8 h-8" />, path: '/reports/categories' },
    { category: 'items', title: 'تقرير الماركات', icon: <Grid className="w-8 h-8" />, path: '/reports/brands' },

    // Sales Reports
    { category: 'sales', title: 'المبيعات اليومية', icon: <Clock className="w-8 h-8" />, path: '/reports/daily-sales' },
    { category: 'sales', title: 'المبيعات الشهرية', icon: <Calendar className="w-8 h-8" />, path: '/reports/monthly-sales' },
    { category: 'sales', title: 'تقرير المبيعات', icon: <DollarSign className="w-8 h-8" />, path: '/reports/sales' },
    { category: 'sales', title: 'تقرير المبيعات اليومية مفصل', icon: <List className="w-8 h-8" />, path: '/reports/detailed-daily-sales' },
    { category: 'sales', title: 'تقرير المبيعات اليومية مفصل بالأصناف', icon: <List className="w-8 h-8" />, path: '/reports/detailed-daily-sales' },
    { category: 'sales', title: 'تقرير مبيعات الكاشيرات اجمالي', icon: <Users className="w-8 h-8" />, path: '/reports/cashier-sales-summary' },
    { category: 'sales', title: 'مبيعات الأصناف حسب الفاتورة', icon: <Barcode className="w-8 h-8" />, path: '/reports/sales-by-item-invoice' },
    { category: 'sales', title: 'مبيعات المندوبين / الموظفين', icon: <UserCheck className="w-8 h-8" />, path: '/reports/reps-sales' },
    { category: 'sales', title: 'influencer percents', icon: <Percent className="w-8 h-8" />, path: '/reports/influencer-percents' },
    { category: 'sales', title: 'تقرير المبيعات حسب التصنيفات', icon: <Layout className="w-8 h-8" />, path: '/reports/sales-by-category' },
    { category: 'sales', title: 'البحث عن فاتورة', icon: <Search className="w-8 h-8" />, path: '/reports/search-invoice' },
    { category: 'sales', title: 'الفواتير الغير مسددة', icon: <DollarSign className="w-8 h-8" />, path: '/reports/unpaid-invoices' },

    // Tax Reports
    { category: 'taxes', title: 'تقرير الضرائب', icon: <Calculator className="w-8 h-8" />, path: '/reports/taxes' },

    // Purchases Reports
    { category: 'purchases', title: 'المشتريات اليومية', icon: <ShoppingCart className="w-8 h-8" />, path: '/reports/purchases' },
    { category: 'purchases', title: 'المشتريات الشهرية', icon: <Calendar className="w-8 h-8" />, path: '/reports/monthly-purchases' },
    { category: 'purchases', title: 'تقرير المشتريات', icon: <FileCheck className="w-8 h-8" />, path: '/reports/purchases' },
    { category: 'purchases', title: 'تقرير المصروفات', icon: <PieChart className="w-8 h-8" />, path: '/reports/expenses' },

    // Charts
    { category: 'charts', title: 'charts', icon: <BarChart3 className="w-8 h-8" />, path: '/reports/charts-overview' },
    { category: 'charts', title: 'رسم بياني للمخزون', icon: <TrendingUp className="w-8 h-8" />, path: '/reports/inventory-chart' },
    { category: 'charts', title: 'الافضل مبيعا', icon: <LineChart className="w-8 h-8" />, path: '/reports/best-sellers' },

    // Quantity Adjustments
    { category: 'quantity', title: 'تقرير تعديلات الكميات', icon: <Settings2 className="w-8 h-8" />, path: '/reports/quantity-adjustments' },
    { category: 'quantity', title: 'التعديلات الكمية للماكينة', icon: <Settings2 className="w-8 h-8" />, path: '/reports/machine-adjustments' },
    { category: 'quantity', title: 'تقرير تحويلات المخزون', icon: <ArrowLeftRight className="w-8 h-8" />, path: '/reports/inventory-transfers' },

    // Financials and Shifts
    { category: 'financials', title: 'تقرير الورديات', icon: <Clock className="w-8 h-8" />, path: '/reports/shifts' },
    { category: 'financials', title: 'تقرير الليسته', icon: <DollarSign className="w-8 h-8" />, path: '/reports/list' },
    { category: 'financials', title: 'تقرير عن المدفوعات', icon: <Wallet className="w-8 h-8" />, path: '/reports/payments' },
    { category: 'financials', title: 'تقرير حركات مختصرة', icon: <FileText className="w-8 h-8" />, path: '/reports/summary-movements' },
    { category: 'financials', title: 'تقرير البنك', icon: <Landmark className="w-8 h-8" />, path: '/reports/bank' },

    // Customers and Vendors
    { category: 'customers', title: 'تقرير العملاء', icon: <Users className="w-8 h-8" />, path: '/reports/customers' },
    { category: 'customers', title: 'تقرير أعمار الديون للعملاء', icon: <DollarSign className="w-8 h-8" />, path: '/reports/customer-aging' },
    { category: 'customers', title: 'تقرير الموردين', icon: <UserPlus className="w-8 h-8" />, path: '/reports/vendors' },
    { category: 'customers', title: 'تقرير أعمار الديون للموردين', icon: <DollarSign className="w-8 h-8" />, path: '/reports/vendor-aging' },

    // Employees and Reps
    { category: 'employees', title: 'تقرير الموظفين', icon: <UserCheck className="w-8 h-8" />, path: '/reports/employees' },
    { category: 'employees', title: 'تقرير المندوبين', icon: <UserCheck className="w-8 h-8" />, path: '/reports/reps' },

    // General Accounts
    { category: 'accounts', title: 'الميزانية العمومية', icon: <Calculator className="w-8 h-8" />, path: '/reports/balance-sheet' },
    { category: 'accounts', title: 'قائمة الدخل', icon: <FileSpreadsheet className="w-8 h-8" />, path: '/reports/income-statement' },
    { category: 'accounts', title: 'كشف حساب لحساب استاذ', icon: <FileText className="w-8 h-8" />, path: '/reports/ledger-statement' },
    { category: 'accounts', title: 'ميزان مراجعة الاستاذ العام', icon: <Scale className="w-8 h-8" />, path: '/reports/trial-balance' },
    { category: 'accounts', title: 'كشف حساب استاذ مساعد', icon: <FileText className="w-8 h-8" />, path: '/reports/subsidiary-ledger' },
    { category: 'accounts', title: 'Financial Reports', icon: <DollarSign className="w-8 h-8" />, path: '/reports/financial-summary' },

    // Reservations
    { category: 'reservations', title: 'الحجوزات', icon: <Calendar className="w-8 h-8" />, path: '/reports/reservations' },
  ];

  const filteredReports = reports.filter(report => report.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900" dir={direction}>
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-600 text-white rounded">
            <BarChart3 size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">التقريرات</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-row-reverse">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-800"></div>
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col items-center p-6 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="w-1 h-4 bg-emerald-600"></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{report.title}</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center py-4 text-emerald-600">
                  {report.icon}
                </div>

                {report.path ? (
                  <Link 
                    to={report.path}
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-bold transition-colors text-center"
                  >
                    عرض التقرير
                  </Link>
                ) : (
                  <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-bold transition-colors">
                    عرض التقرير
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Left Sidebar Navigation (Moved from right to left) */}
        <div className="w-72 bg-[#004d2c] border-r border-emerald-900 overflow-y-auto">
          <div className="p-4 bg-[#003d23] text-white font-bold mb-2 flex items-center gap-2">
            <List size={20} />
            <span>قائمة التقارير</span>
          </div>
          <div className="p-2 space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "w-full text-right px-4 py-3 rounded text-sm font-medium transition-all flex items-center justify-between group",
                  activeCategory === category.id 
                    ? "bg-white/20 text-white shadow-sm font-bold" 
                    : "text-emerald-100/70 hover:text-white hover:bg-white/10"
                )}
              >
                <span>{category.name}</span>
                {activeCategory !== category.id && (
                  <ChevronLeft size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
