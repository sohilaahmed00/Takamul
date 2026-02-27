import { useLanguage } from '@/context/LanguageContext';

export default function Logo({ className = "" }: { className?: string }) {
  const { direction } = useLanguage();

  const logoSrc = direction === 'rtl' ? '/logo_ar.png' : '/logo_en.png';

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoSrc} alt="Takamul Al-Bayanat Logo" className="h-10" />
    </div>
  );
}
