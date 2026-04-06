import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  const { direction } = useLanguage();
  const { theme } = useTheme();

  const lang = direction === 'rtl' ? 'ar' : 'en';
  const shade = theme === 'dark' ? 'dark' : 'light';
  const logoSrc = `/logo_${lang}_${shade}.png`;

  return (
    <div className={`flex items-center ${className}` + (showText ? '' : ' justify-center')}>
      <img src={logoSrc} alt="Takamul Al-Bayanat Logo" style={{ height: '100px', width: '185px', objectFit: 'contain' }} />
      {/* optionally show text next to logo if requested (currently unused but available) */}
    </div>
  );
}
