import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FinancialStatCardProps {
  title: string;
  value: string | number;
  suffix?: string | React.ReactNode;
  icon?: LucideIcon;
  color?: 'purple' | 'blue' | 'green' | 'red' | 'teal' | 'slate' | 'orange';
  delay?: number;
  onClick?: () => void;
}

const colorConfigs = {
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
  },
  slate: {
    bg: 'bg-slate-50',
    icon: 'text-slate-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
  },
};

export const FinancialStatCard: React.FC<FinancialStatCardProps> = ({
  title,
  value,
  suffix,
  icon: Icon,
  color = 'blue',
  delay = 0,
  onClick,
}) => {
  const { direction } = useLanguage();
  const config = colorConfigs[color] || colorConfigs.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''
      }`}
    >
      <div className={`flex items-center gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {Icon && (
          <div className={`h-12 w-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}>
            <Icon size={24} className={config.icon} />
          </div>
        )}
        <div className={`flex-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
            {value}
            {suffix && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};
