import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

interface Report {
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface ReportsDashboardBaseProps {
  title: string;
  reports: Report[];
}

const ReportsDashboardBase: React.FC<ReportsDashboardBaseProps> = ({ title, reports }) => {
  const { t, direction } = useLanguage();

  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)]" dir={direction}>
      {/* Top Header */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <BarChart3 size={18} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">{title}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.map((report, index) => (
            <div 
              key={index}
              className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden flex flex-col items-center p-6 transition-all hover:shadow-md hover:border-[var(--primary)] dark:hover:border-[var(--primary)] group"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className="w-1 h-4 bg-[var(--primary)] rounded-full"></div>
                <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  {report.title}
                </span>
              </div>
              
              <div className="flex-1 flex items-center justify-center py-6 text-[var(--primary)] group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(report.icon as React.ReactElement<any>, { className: "w-12 h-12" })}
              </div>

              <Link 
                to={report.path}
                className="mt-4 w-full bg-[var(--primary)] hover:opacity-90 text-white py-2.5 rounded-lg text-sm font-bold transition-all transform active:scale-95 text-center shadow-sm hover:shadow-md"
              >
                {t('view_report')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboardBase;
