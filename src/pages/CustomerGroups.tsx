import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users } from 'lucide-react';

const CustomerGroups: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl bg-[var(--bg-main)]/50 border border-dashed border-[var(--border)] max-w-sm mx-auto">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">{t("customer_groups", "مجموعة العملاء")}</h3>
        <p className="text-[var(--text-muted)] font-medium">{t("not_determined_yet", "لم يتم التحديد بعد")}</p>
      </div>
    </div>
  );
};

export default CustomerGroups;
