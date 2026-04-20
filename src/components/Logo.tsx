import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  showText?: boolean;
  onClick?: () => void;
}

export default function Logo({ className = "", style, onClick }: LogoProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const lang = language === 'ar' ? 'ar' : 'en';
  const shade = theme === 'dark' ? 'dark' : 'light';
  const logoSrc = `/logo_${lang}_${shade}.png`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate('/dashboard');
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 w-auto h-10",
        className
      )}
      style={style}
    >
      <img
        src={logoSrc}
        alt="Takamul logo"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
