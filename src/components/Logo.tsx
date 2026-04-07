import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  const { direction } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const lang = direction === 'rtl' ? 'ar' : 'en';
  const shade = theme === 'dark' ? 'dark' : 'light';
  const logoSrc = `/logo_${lang}_${shade}.png`;

  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className={cn(
        `flex items-center cursor-pointer hover:scale-[1.05] transition-transform duration-200 ${className}`,
        showText ? '' : ' justify-center'
      )}
      onClick={handleClick}
    >
      <img
        src={logoSrc}
        alt="Takamul تكامل Logo"
        style={{ height: '50px', width: '150px', objectFit: 'cover', margin: showText ? '40px' : '0' }}
      />
    </div>
  );
}

