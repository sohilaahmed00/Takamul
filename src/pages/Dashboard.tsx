import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, ShoppingBag, Loader2, TrendingUp, CreditCard, SaudiRiyal, Calendar, ArrowUpLeft } from "lucide-react";

import RecentTransactions from "@/components/RecentTransactions";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { useSales } from "@/context/SalesContext";
import { usePurchases } from "@/context/PurchasesContext";
import { useExpenses } from "@/context/ExpensesContext";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { Permissions } from "@/lib/permissions";

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, textColor = "text-white", delay, onClick }: any) => {
  const { t, direction, language } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} onClick={onClick} className={`rounded-xl p-4 shadow-lg relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${bgClass} ${textColor}`}>
      <div className="relative z-10">
        <p className="opacity-80 text-base font-bold mb-1 truncate">{title}</p>
        <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {value}
          {language === "ar" ? <SaudiRiyal size={30} className="opacity-90" /> : <span className="text-2xl font-bold opacity-90 ml-1">SAR</span>}
        </h3>
      </div>
      <div className={`absolute ${direction === "rtl" ? "-left-6" : "-right-6"} -bottom-6 opacity-10`}>
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
  const currentDateFormatted = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

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
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center" dir={direction}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-[var(--primary)] animate-spin" />
          <p className="text-[var(--text-muted)] font-medium">{t("loading_data")}</p>
        </div>
      </div>
    );
  }

  // Get current date formatted like 20-02-2026

  return (
    <>
      {hasAnyPermission([Permissions?.salesOrders?.view, Permissions?.expenses?.view, Permissions?.purchaseOrders?.view]) && (
        <div className="space-y-4 relative dashboard-page" dir={direction}>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hasPermission(Permissions?.salesOrders?.view) && <StatCard title={t("total_sales")} value={`${formatCurrency(totalSalesValue, { ...systemSettings, money: { ...systemSettings.money, showCurrencySymbol: false } })}`} icon={SaudiRiyal} bgClass="bg-[var(--dashboard-sales)]" textColor="text-[var(--dashboard-sales-text)]" delay={0.1} />}
            {hasPermission(Permissions?.expenses?.view) && <StatCard title={t("total_expenses")} value={formatCurrency(totalExpensesValue, { ...systemSettings, money: { ...systemSettings.money, showCurrencySymbol: false } })} icon={Banknote} bgClass="bg-[var(--dashboard-expenses)]" textColor="text-[var(--dashboard-expenses-text)]" delay={0.2} />}
            <StatCard title={t("net_profit")} value={formatCurrency(netProfitValue, { ...systemSettings, money: { ...systemSettings.money, showCurrencySymbol: false } })} icon={TrendingUp} bgClass="bg-[var(--dashboard-profit)]" textColor="text-[var(--dashboard-profit-text)]" delay={0.3} onClick={() => navigate("/reports/profit")} />
            {hasPermission(Permissions?.purchaseOrders?.view) && <StatCard title={t("total_purchases")} value={formatCurrency(totalPurchasesValue, { ...systemSettings, money: { ...systemSettings.money, showCurrencySymbol: false } })} icon={ShoppingBag} bgClass="bg-[var(--dashboard-purchases)]" textColor="text-[var(--dashboard-purchases-text)]" delay={0.4} />}
          </div>

          {/* Charts Section */}

          {/* Recent Transactions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {/* <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
                  <span className="w-1 h-6 bg-[var(--secondary)] rounded-full"></span>
                  {t('recent_operations')}
              </h3>
          </div> */}
            <RecentTransactions />
          </motion.div>
        </div>
      )}
    </>
  );
}
