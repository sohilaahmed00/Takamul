import React, { useState, useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLogo } from '@/context/LogoContext';
import { cn } from '@/lib/utils';
import ResponsiveModal from './ResponsiveModal';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoModal({ isOpen, onClose }: LogoModalProps) {
  const { t, direction } = useLanguage();
  const { updateLogo } = useLogo();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    if (previewUrl) {
      updateLogo(previewUrl);
      onClose();
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('change_logo')}
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-6" dir={direction}>
        <div className="text-center space-y-2">
          <p className="text-[var(--text-muted)] text-sm">
            {t('mandatory_fields')}
          </p>
          <p className="text-[var(--text-muted)] text-xs">
            {t('logo_size_hint')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">
              {t('cashier_logo')} *
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary !px-4 !py-2 !text-sm whitespace-nowrap"
              >
                <Upload size={18} />
                <span>{t('browse')}</span>
              </button>
              <div className="flex-1 takamol-input !py-2 !bg-[var(--bg-main)] truncate">
                {selectedFile ? selectedFile.name : ''}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {t('logo_update_hint')}
            </p>
          </div>

          {previewUrl && (
            <div className="flex justify-center p-6 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-main)]">
              <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded-lg shadow-sm" />
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <button
            onClick={handleUpdate}
            disabled={!previewUrl}
            className={cn(
              "btn-primary w-full flex items-center justify-center gap-2",
              !previewUrl && "opacity-50 cursor-not-allowed"
            )}
          >
            <Check size={20} />
            <span>{t('update_logo')}</span>
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
