import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Banknote, 
  ShoppingBag, 
  Loader2, 
  TrendingUp, 
  CreditCard,
  SaudiRiyal,
  Calendar,
  ArrowUpLeft
} from 'lucide-react';

import RecentTransactions from '@/components/RecentTransactions';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { useSales } from '@/context/SalesContext';
import { usePurchases } from '@/context/PurchasesContext';
import { useExpenses } from '@/context/ExpensesContext';
import { formatCurrency } from '@/lib/format';

const SaudiRiyalIcon = ({ size = 24, className = "", ...props }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M30 10 L30 45 L15 48 L15 58 L30 55 L30 70 L15 73 L15 83 L30 80 L30 88 
             Q30 95 40 95 L60 90 L60 80 L40 85 L40 80 L65 75 L65 65 L40 70 
             L40 55 L65 50 L65 40 L40 45 L40 10 Z" />
             
    <path d="M70 10 L70 45 L85 40 L85 50 L70 55 L70 70 L85 65 L85 75 
             L70 80 L70 90 L80 85 L80 10 Z" />
  </svg>
);

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, delay, onClick }: any) => {
  const { t, direction } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`rounded-xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${bgClass}`}
    >
      <div className="relative z-10">
        <p className="text-white/80 text-sm font-medium mb-1 truncate">{title}</p>
        <h3 className="text-2xl md:text-3xl font-bold flex items-baseline gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {value}
        </h3>
      </div>
      <div className={`absolute ${direction === 'rtl' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className={`absolute ${direction === 'rtl' ? '-left-6' : '-right-6'} -bottom-6 opacity-10`}>
          <Icon size={120} />
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { t, direction } = useLanguage();
  const { systemSettings } = useSettings();
  const { sales } = useSales();
  const { purchases } = usePurchases();
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  const totalSalesValue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalPurchasesValue = purchases.reduce((sum, p) => sum + p.total, 0);
  const totalExpensesValue = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfitValue = totalSalesValue - totalPurchasesValue - totalExpensesValue;
  const totalReceivablesValue = sales.reduce((sum, s) => sum + s.remaining, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={direction}>
        <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-gray-500 font-medium">{t('loading_data')}</p>
        </div>
      </div>
    );
  }

  // Get current date formatted like 20-02-2026
  const currentDateFormatted = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

  return (
    <div className="space-y-6 relative dashboard-page" dir={direction}>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={`${t('recent_sales')} (${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })})`} 
          value={`${formatCurrency(totalSalesValue, { ...systemSettings, money: { ...systemSettings.money, showCurrencySymbol: false } })} SAR`} 
          icon={SaudiRiyal} 
          bgClass="bg-[#38bdf8]" // Baby Blue
          delay={0.1}
          onClick={() => navigate('/reports/sales')}
        />
        <StatCard 
          title={t('total_purchases')} 
          value={formatCurrency(totalPurchasesValue, systemSettings)} 
          icon={ShoppingBag} 
          bgClass="bg-[#f97316]" // Orange
          delay={0.2}
          onClick={() => navigate('/reports/purchases')}
        />
        <StatCard 
          title={t('net_profit')} 
          value={formatCurrency(netProfitValue, systemSettings)} 
          icon={TrendingUp} 
          bgClass="bg-[#8b5cf6]" // Mauve / Purple
          delay={0.3}
          onClick={() => navigate('/reports/income-statement')}
        />
        <StatCard 
          title={t('total_expenses')} 
          value={formatCurrency(totalExpensesValue, systemSettings)} 
          icon={Banknote} 
          bgClass="bg-[#d97706]" // Dark Yellow / Reddish Brown
          delay={0.4}
          onClick={() => navigate('/reports/expenses')}
        />
      </div>

      {/* Charts Section */}
      

      {/* Recent Transactions */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
      >
          {/* <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
                  <span className="w-1 h-6 bg-[var(--secondary)] rounded-full"></span>
                  {t('recent_operations')}
              </h3>
          </div> */}
          <RecentTransactions />
      </motion.div>
    </div>
  );
}
