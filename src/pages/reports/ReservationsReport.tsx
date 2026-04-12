import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from "@/components/ui/input";

import { 
  Calendar, Search, Printer, Download, Share2, 
  Filter, ChevronRight, ChevronLeft, MoreHorizontal,
  Clock, User, Phone, CheckCircle2, XCircle
} from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  tableNumber?: string;
  notes?: string;
}

const mockReservations: Reservation[] = [
  { id: '1', customerName: 'أحمد محمد', phone: '0123456789', date: '2024-03-20', time: '19:00', guests: 4, status: 'confirmed', tableNumber: '5' },
  { id: '2', customerName: 'سارة أحمد', phone: '0111222333', date: '2024-03-20', time: '20:30', guests: 2, status: 'pending' },
  { id: '3', customerName: 'محمود علي', phone: '0155566677', date: '2024-03-21', time: '14:00', guests: 6, status: 'confirmed', tableNumber: '12' },
  { id: '4', customerName: 'ليلى يوسف', phone: '0100099988', date: '2024-03-21', time: '18:00', guests: 3, status: 'cancelled', notes: 'إلغاء من قبل العميل' },
  { id: '5', customerName: 'خالد إبراهيم', phone: '0122233344', date: '2024-03-22', time: '21:00', guests: 5, status: 'confirmed', tableNumber: '8' },
];

export default function ReservationsReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReservations = mockReservations.filter(res => {
    const matchesSearch = res.customerName.includes(searchTerm) || res.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            <CheckCircle2 size={12} />
            مؤكد
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
            <Clock size={12} />
            قيد الانتظار
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-bold">
            <XCircle size={12} />
            ملغي
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900" dir={direction}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <Calendar size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">تقرير الحجوزات</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Printer size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Download size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="بحث باسم العميل أو رقم الهاتف..."
            className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">كل الحالات</option>
          <option value="confirmed">مؤكد</option>
          <option value="pending">قيد الانتظار</option>
          <option value="cancelled">ملغي</option>
        </select>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter size={16} />
          <span>تصفية حسب التاريخ:</span>
          <Input type="date" className="px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="p-4 font-bold text-sm">اسم العميل</th>
                <th className="p-4 font-bold text-sm">رقم الهاتف</th>
                <th className="p-4 font-bold text-sm">التاريخ</th>
                <th className="p-4 font-bold text-sm">الوقت</th>
                <th className="p-4 font-bold text-sm">عدد الأفراد</th>
                <th className="p-4 font-bold text-sm">رقم الطاولة</th>
                <th className="p-4 font-bold text-sm">الحالة</th>
                <th className="p-4 font-bold text-sm">ملاحظات</th>
                <th className="p-4 font-bold text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <User size={16} />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">{res.customerName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Phone size={14} />
                    {res.phone}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{res.date}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{res.time}</td>
                  <td className="p-4 font-bold text-gray-800 dark:text-white">{res.guests}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{res.tableNumber || '-'}</td>
                  <td className="p-4">{getStatusBadge(res.status)}</td>
                  <td className="p-4 text-xs text-gray-500 dark:text-gray-500 max-w-[150px] truncate">
                    {res.notes || '-'}
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          عرض {filteredReservations.length} من {mockReservations.length} حجز
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 bg-[var(--primary)] text-white rounded text-sm font-bold">1</button>
          </div>
          <button className="p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
