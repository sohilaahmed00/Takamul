import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PriceGroup } from '@/types';
import ResponsiveModal from './ResponsiveModal';

interface PriceGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PriceGroup>) => void;
  initialData?: PriceGroup | null;
}

export default function PriceGroupsModal({ isOpen, onClose, onSave, initialData }: PriceGroupsModalProps) {
  const { t, direction } = useLanguage();
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('edit_pricing_group') : t('add_pricing_group')}
      maxWidth="md:max-w-xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <div className="bg-[var(--primary)]/10 p-4 rounded-2xl text-sm text-[var(--primary)] border border-[var(--primary)]/20">
          {t('pricing_group_info')}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">
              {t('group_name')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="takamol-input"
              placeholder={t('enter_group_name')}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <button
            type="submit"
            className="btn-primary w-full"
          >
            <Check size={20} />
            {initialData ? t('update_pricing_group') : t('add_pricing_group')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
