import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from './ResponsiveModal';

interface EmailQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailQuoteModal({ isOpen, onClose }: EmailQuoteModalProps) {
  const { t, direction } = useLanguage();
  const [showBcc, setShowBcc] = useState(false);

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('send_quote_email')}
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)] text-center">
          {t('mandatory_fields')}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">{t('to_label')} *</label>
            <input 
              type="email" 
              defaultValue="mtawfik12b@gmail.com" 
              className="takamol-input" 
            />
          </div>

          {showBcc && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="takamol-label">{t('network')}</label>
                <input type="text" className="takamol-input" />
              </div>
              <div className="space-y-2">
                <label className="takamol-label">{t('bcc')}</label>
                <input type="text" className="takamol-input" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="takamol-label">{t('subject')} *</label>
            <input 
              type="text" 
              defaultValue="عرض أسعار (QUOTE2025/09/0003) من مؤسسة تكامل" 
              className="takamol-input" 
            />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t('message')}</label>
            <textarea 
              rows={6}
              className="takamol-input min-h-[150px]"
              defaultValue={`{logo}\n\nQuotation Details\n\nHello {contact_person} ({company}),\n\nPlease find the attachment for our purposed quotation ({reference_number}).\n\nBest regards,\n{site_name}`}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-[var(--border)]">
          <button 
            onClick={() => setShowBcc(!showBcc)}
            className="btn-secondary flex-1"
          >
            {showBcc ? t('hide_bcc') : t('show_hide_bcc')}
          </button>
          <button 
            onClick={onClose}
            className="btn-primary flex-1"
          >
            {t('send_email')}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}