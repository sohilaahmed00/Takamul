import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Users,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const EmployeesReport = () => {
  const { dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on the image
  const employees = [
    { id: 1, firstName: 'clothes', nickname: 'clothes', email: 'ff.cok@25', company: 'tt', group: 'sales', status: 'نشط' },
    { id: 2, firstName: 'نظارات', nickname: '.', email: 'ff.com@41154', company: '2', group: 'sales', status: 'نشط' },
    { id: 3, firstName: 'حجوزات', nickname: '.', email: 'tt.cim@65', company: '55', group: 'sales', status: 'نشط' },
    { id: 4, firstName: 'admin', nickname: '.', email: 'ds@hotmail.com', company: 'ds', group: 'owner', status: 'نشط' },
    { id: 5, firstName: 'salon', nickname: 'salon', email: 'info11@posit2030.com', company: 'salon', group: 'sales', status: 'نشط' },
    { id: 6, firstName: 'cofe', nickname: 'cofe', email: 'mmmmm11m@gmail.com', company: 'Tkamul1', group: 'sales', status: 'نشط' },
    { id: 7, firstName: 'rest', nickname: 'rest', email: 'mmmmmm@gmail.com', company: 'Tkamul', group: 'sales', status: 'نشط' },
    { id: 8, firstName: 'market', nickname: 'market', email: 'mtawfik12b@gmail.com', company: 'Tkamul', group: 'sales', status: 'نشط' },
    { id: 9, firstName: 'car', nickname: 'car', email: 'mtawssss12b@gmail.com', company: 'Tkamul', group: 'eeee', status: 'نشط' },
    { id: 10, firstName: 'saad', nickname: 'mansor', email: 'saad_ena2@hotmail.com', company: 'POSIT', group: 'owner', status: 'نشط' }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>البداية</span>
        <span>/</span>
        <span>التقارير</span>
        <span>/</span>
        <span className="text-[var(--primary)] font-medium">تقرير الموظفين</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-t-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Users className="w-5 h-5" />
            <h1 className="text-xl font-bold">المستخدمين</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-[var(--primary)] font-bold mb-6 text-center">الرجاء الضغط التقرير بغية التحقق من تقرير الخبراء.</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث"
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--primary)] font-bold">اظهار</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-right border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[var(--table-header)] text-white">
                <th className="p-3 border border-white/10 text-center">الاسم الأول</th>
                <th className="p-3 border border-white/10 text-center">اللقب</th>
                <th className="p-3 border border-white/10 text-center">البريد الإلكتروني</th>
                <th className="p-3 border border-white/10 text-center">الشركة</th>
                <th className="p-3 border border-white/10 text-center">مجموعة</th>
                <th className="p-3 border border-white/10 text-center">الحالة</th>
                <th className="p-3 border border-white/10 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{emp.firstName}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{emp.nickname}</td>
                  <td className="p-3 border border-gray-200 text-sm">{emp.email}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{emp.company}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{emp.group}</td>
                  <td className="p-3 border border-gray-200 text-sm">
                    <span className="bg-[var(--primary)] text-white px-2 py-0.5 rounded text-xs flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> {emp.status}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-200 text-sm">
                    <button className="bg-[var(--primary)] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors">
                      عرض التقرير
                    </button>
                  </td>
                </tr>
              ))}
              {/* Footer Row */}
              <tr className="bg-gray-100 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs">[الاسم الأول]</td>
                <td className="p-3 border border-gray-200 text-xs">[اللقب]</td>
                <td className="p-3 border border-gray-200 text-xs">[البريد الإلكتروني]</td>
                <td className="p-3 border border-gray-200 text-xs">[الشركة]</td>
                <td className="p-3 border border-gray-200 text-xs">[مجموعة]</td>
                <td className="p-3 border border-gray-200 text-xs">الحالة</td>
                <td className="p-3 border border-gray-200 text-xs">الإجراءات</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600 flex items-center gap-1">
              <ArrowRight className="w-4 h-4" /> التالي
            </button>
            <button className="px-4 py-2 bg-[var(--primary)] text-white border-l border-gray-300">1</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[var(--primary)] font-bold">
            عرض 1 إلى 10 من 10 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesReport;
