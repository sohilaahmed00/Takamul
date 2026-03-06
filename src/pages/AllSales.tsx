import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Edit2,
  RotateCcw,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Filter,
  Download,
  Printer,
  ChevronDown,
  Menu,
  LayoutGrid,
  List as ListIcon,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  DollarSign,
  FileCheck,
  Truck,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  X,
  Copy,
  Info,
  FileJson,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AUTH_API_BASE, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type SalesOrderStatus = string;

interface SalesOrderDTO {
  id: number;
  orderNumber: string;
  customerName: string;
  warehouseName: string;
  orderDate: string; // ISO string
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  orderStatus: SalesOrderStatus;
}

interface SaleRecord {
  id: string;

  // موجود في الديزاين الحالي (هنملاه بما يناسب)
  invoiceNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  saleStatus: 'completed' | 'returned';
  grandTotal: number;
  paid: number;
  remaining: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentType: 'mada' | 'cash' | 'bank_transfer';

  // حقول إضافية مفيدة للـ UI (مش بتغير الديزاين)
  apiOrderStatus?: string;
  subTotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  warehouseName?: string;
  orderNumber?: string;
  orderDateISO?: string;
}

interface Payment {
  id: string;
  date: string;
  refNo: string;
  amount: number;
  type: string;
}

function formatDateTimeFromISO(iso: string) {
  // يعرض "DD/MM/YYYY HH:mm:ss" زي الداتا اللي عندك
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${day}/${month}/${year} ${hh}:${mm}:${ss}`;
}

function safeNumber(n: any) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export default function AllSales() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  // ✅ غيّرها لو عندك base url مختلف
  // الأفضل تستخدم env: VITE_API_BASE_URL=http://takamulerp.runasp.net
  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>('');

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Modal States
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<SaleRecord | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showPayments, setShowPayments] = useState<SaleRecord | null>(null);
  const [showEditPayment, setShowEditPayment] = useState<Payment | null>(null);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState<Payment | null>(null);
  const [salePayments, setSalePayments] = useState<Payment[]>([]);
  const [showStoreBond, setShowStoreBond] = useState<SaleRecord | null>(null);
  const [showClaimBond, setShowClaimBond] = useState<SaleRecord | null>(null);
  const [showAddDelivery, setShowAddDelivery] = useState<SaleRecord | null>(null);

  const [filters, setFilters] = useState({
    refNo: '',
    invoiceNo: '',
    customer: '',
    branch: '',
    fromDate: '',
    toDate: '',
    grandTotal: '',
    deliveryCompany: 'all',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  React.useEffect(() => {
    if (showPayments) {
      // مافيش Payments endpoint عندك هنا، فسيبناه demo زي ما كان
      setSalePayments([
        { id: '1', date: '11/02/2026 19:31:51', refNo: 'IPAY2026/02/0609', amount: 250.0, type: 'mada' },
      ]);
    }
  }, [showPayments]);

  function mapApiToSaleRecord(o: SalesOrderDTO): SaleRecord {
    const orderNumber = o.orderNumber ?? String(o.id);

    return {
      id: String(o.id),

      // نحافظ على نفس الديزاين: invoiceNo/refNo/date/cashier/customer...
      invoiceNo: orderNumber, // هنعتبر رقم الطلب هو رقم الفاتورة في الجدول
      refNo: orderNumber, // نفس الفكرة
      date: formatDateTimeFromISO(o.orderDate),
      cashier: o.warehouseName || '--',
      customer: o.customerName || '--',

      // مش موجودين في API: نخليهم افتراضي بدون ما نغير الديزاين
      saleStatus: 'completed',
      grandTotal: safeNumber(o.grandTotal),
      paid: 0,
      remaining: safeNumber(o.grandTotal),
      paymentStatus: 'unpaid',
      paymentType: 'mada',

      // إضافات داخلية (مش بتغير UI)
      apiOrderStatus: o.orderStatus,
      subTotal: safeNumber(o.subTotal),
      taxAmount: safeNumber(o.taxAmount),
      discountAmount: safeNumber(o.discountAmount),
      warehouseName: o.warehouseName,
      orderNumber: o.orderNumber,
      orderDateISO: o.orderDate,
    };
  }

  async function fetchSalesOrders() {
    setLoading(true);
    setLoadError('');
    try {
      const controller = new AbortController();
      const res = await fetch(`${API_BASE}/api/SalesOrders`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API Error (${res.status}): ${text || res.statusText}`);
      }

      const data = (await res.json()) as SalesOrderDTO[];
      const mapped = Array.isArray(data) ? data.map(mapApiToSaleRecord) : [];
      setSales(mapped);
    } catch (e: any) {
      setLoadError(e?.message || 'Failed to load sales orders');
      setSales([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSalesOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ زر "إكمال العملية" لازم يطبّق الفلاتر مش يضيف عملية وهمية
  const handleFilter = () => {
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    const initialFilters = {
      refNo: '',
      invoiceNo: '',
      customer: '',
      branch: '',
      fromDate: '',
      toDate: '',
      grandTotal: '',
      deliveryCompany: 'all',
    };
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSearchTerm('');
  };

  const filteredSales = sales
    .filter((sale) => {
      return (
        (appliedFilters.refNo ? sale.refNo.toLowerCase().includes(appliedFilters.refNo.toLowerCase()) : true) &&
        (appliedFilters.invoiceNo ? sale.invoiceNo.includes(appliedFilters.invoiceNo) : true) &&
        (appliedFilters.customer ? sale.customer.toLowerCase().includes(appliedFilters.customer.toLowerCase()) : true) &&
        (appliedFilters.branch ? sale.cashier.toLowerCase().includes(appliedFilters.branch.toLowerCase()) : true) &&
        (appliedFilters.fromDate
          ? new Date(sale.orderDateISO || sale.date.split(' ')[0].split('/').reverse().join('-')) >= new Date(appliedFilters.fromDate)
          : true) &&
        (appliedFilters.toDate
          ? new Date(sale.orderDateISO || sale.date.split(' ')[0].split('/').reverse().join('-')) <= new Date(appliedFilters.toDate)
          : true) &&
        (appliedFilters.grandTotal ? sale.grandTotal >= parseFloat(appliedFilters.grandTotal) : true) &&
        (searchTerm
          ? sale.invoiceNo.includes(searchTerm) ||
            sale.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customer.includes(searchTerm)
          : true)
      );
    })
    .slice(0, showCount);

  const duplicateSale = (sale: SaleRecord) => {
    // ملاحظة: مافيش POST endpoint هنا، فهتفضل duplicate للـ UI فقط (زي ما كان)
    const newSale = {
      ...sale,
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: sale.invoiceNo + '_copy',
      refNo: sale.refNo + '_copy',
      date: new Date().toLocaleString('en-GB'),
    };
    setSales((prevSales) => [newSale, ...prevSales]);
    setActiveActionMenu(null);
  };

  const totals = filteredSales.reduce(
    (acc, sale) => ({
      grandTotal: acc.grandTotal + sale.grandTotal,
      paid: acc.paid + sale.paid,
      remaining: acc.remaining + sale.remaining,
    }),
    { grandTotal: 0, paid: 0, remaining: 0 }
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('sales')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-primary">{t('sales_all_branches')}</h1>

          {/* ✅ زر Refresh صغير بدون تغيير ديزاين كبير */}
          <button
            onClick={fetchSalesOrders}
            className="ms-2 p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            title="Reload"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Arrow Up/Down Icon - Toggle Filters */}
          <button
            className="p-1.5 bg-white text-primary hover:bg-primary/10 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
            onClick={() => setShowFilters(!showFilters)}
            title={t('filter_results')}
          >
            {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
          </button>

          {/* List Icon with Dropdown */}
          <div className="relative action-menu-container">
            <button
              className="p-1.5 bg-white text-gray-600 hover:bg-gray-100 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
              onClick={() => setActiveActionMenu(activeActionMenu === 'actions' ? null : 'actions')}
            >
              <ListIcon size={18} />
            </button>
            {activeActionMenu === 'actions' && (
              <div className="absolute z-50 top-full end-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[220px] overflow-hidden">
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      navigate('/sales/create');
                      setActiveActionMenu(null);
                    }}
                    className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-800">{t('add_sale_operation')}</span>
                    <PlusCircle size={18} className="text-gray-600" />
                  </button>
                  <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors">
                    <span className="text-gray-700">تصدير إلى ملف Excel</span>
                    <FileSpreadsheet size={18} className="text-green-600" />
                  </button>
                  <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors">
                    <span className="text-gray-700">تصدير إلى ملف pdf</span>
                    <FileText size={18} className="text-primary" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-primary mb-6 text-right font-medium">{t('sales_table_desc')}</p>

        {/* ✅ Loading / Error (خفيف جداً بدون تغيير ديزاين) */}
        {loading && (
          <div className="mb-4 text-sm text-gray-600 text-right">
            {direction === 'rtl' ? 'جاري تحميل البيانات...' : 'Loading...'}
          </div>
        )}
        {loadError && (
          <div className="mb-4 text-sm text-red-600 text-right">
            {direction === 'rtl' ? 'خطأ في تحميل البيانات: ' : 'Load error: '}
            {loadError}
          </div>
        )}

        {/* Table Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6" dir={direction}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('show')}</span>
            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="relative w-full md:w-80 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right"
              />
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-100 rounded-md my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="ref_no" className="block text-sm font-medium text-gray-700 text-right">
                  {t('ref_no')}
                </label>
                <input
                  type="text"
                  id="ref_no"
                  value={filters.refNo}
                  onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="invoice_no" className="block text-sm font-medium text-gray-700 text-right">
                  {t('invoice_no')}
                </label>
                <input
                  type="text"
                  id="invoice_no"
                  value={filters.invoiceNo}
                  onChange={(e) => setFilters({ ...filters, invoiceNo: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 text-right">
                  {t('customer')}
                </label>
                <input
                  type="text"
                  id="customer"
                  value={filters.customer}
                  onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={direction === 'rtl' ? 'اسم العميل' : 'Customer name'}
                />
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 text-right">
                  {t('branch')}
                </label>
                <input
                  type="text"
                  id="branch"
                  value={filters.branch}
                  onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={direction === 'rtl' ? 'المستودع' : 'Warehouse'}
                />
              </div>

              <div>
                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 text-right">
                  {t('from_date')}
                </label>
                <input
                  type="date"
                  id="from_date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700 text-right">
                  {t('to_date')}
                </label>
                <input
                  type="date"
                  id="to_date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="grand_total" className="block text-sm font-medium text-gray-700 text-right">
                  {t('grand_total')}
                </label>
                <input
                  type="text"
                  id="grand_total"
                  value={filters.grandTotal}
                  onChange={(e) => setFilters({ ...filters, grandTotal: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="delivery_companies" className="block text-sm font-medium text-gray-700 text-right">
                  {t('delivery_companies')}
                </label>
                <select
                  id="delivery_companies"
                  value={filters.deliveryCompany}
                  onChange={(e) => setFilters({ ...filters, deliveryCompany: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">{t('all')}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={handleReset}>
                {t('reset_form')}
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={handleFilter}>
                {t('complete_process')}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto pb-64">
          <table className="w-full min-w-[1200px] text-sm text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary-hover w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('invoice_no')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('date')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('ref_no')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('cashier')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('customer')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('sale_status')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('grand_total')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('paid')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('remaining_amount')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('payment_status')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('payment_type')}</th>
                <th className="p-3 border border-[#a52a2a] whitespace-nowrap w-24 text-center">{t('actions')}</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale, index) => (
                <tr key={`${sale.id}-${index}`} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                  <td className="p-3 text-center border-x border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>

                  <td className="p-3 border-x border-gray-200 font-medium">{sale.invoiceNo}</td>
                  <td className="p-3 border-x border-gray-200 text-gray-600">{sale.date}</td>
                  <td className="p-3 border-x border-gray-200 text-gray-600">{sale.refNo}</td>
                  <td className="p-3 border-x border-gray-200">{sale.cashier}</td>
                  <td className="p-3 border-x border-gray-200">{sale.customer}</td>

                  <td className="p-3 border-x border-gray-200">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium text-white',
                        sale.saleStatus === 'completed' ? 'bg-green-600' : 'bg-red-500'
                      )}
                      title={sale.apiOrderStatus || ''}
                    >
                      {t(sale.saleStatus)}
                    </span>
                  </td>

                  <td className="p-3 border-x border-gray-200 font-bold">{sale.grandTotal.toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{sale.paid.toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{sale.remaining.toFixed(2)}</td>

                  <td className="p-3 border-x border-gray-200">
                    <span className={cn('text-white px-2 py-1 rounded text-xs', sale.paymentStatus === 'paid' ? 'bg-green-600' : sale.paymentStatus === 'partial' ? 'bg-yellow-600' : 'bg-gray-500')}>
                      {t(sale.paymentStatus)}
                    </span>
                  </td>

                  <td className="p-3 border-x border-gray-200">
                    {sale.paymentType === 'mada' && (
                      <div className="flex items-center gap-1">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mada_Logo.svg/1200px-Mada_Logo.svg.png"
                          alt="mada"
                          className="h-4"
                        />
                        <span className="text-xs text-gray-500">{t('mada')}</span>
                      </div>
                    )}
                  </td>

                  <td className={cn('p-3 border-x border-gray-200 text-center relative action-menu-container', activeActionMenu === sale.id && 'z-[60]')}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id);
                      }}
                      className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-primary-hover transition-colors"
                    >
                      {t('actions')}
                      <ChevronDown size={14} />
                    </button>

                    {activeActionMenu === sale.id && (
                      <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right">
                        <button
                          onClick={() => {
                            setShowInvoiceDetails(sale);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('invoice_details')}
                          <FileText size={16} />
                        </button>

                        <button
                          onClick={() => duplicateSale(sale)}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('duplicate_sale')}
                          <PlusCircle size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setShowPayments(sale);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('view_payments')}
                          <DollarSign size={16} />
                        </button>

                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('add_payment')}
                          <DollarSign size={16} />
                        </button>

                        <button
                          onClick={() => {
                            navigate(`/sales/return/${sale.id}`);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('return_sale')}
                          <RotateCcw size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setShowStoreBond(sale);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('store_bond')}
                          <FileCheck size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setShowClaimBond(sale);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('claim_bond')}
                          <Info size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setShowAddDelivery(sale);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                        >
                          {t('add_delivery')}
                          <Truck size={16} />
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('download_pdf')}
                          <FileText size={16} />
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('download_excel')}
                          <FileSpreadsheet size={16} />
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('download_csv')}
                          <FileSpreadsheet size={16} />
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('send_email')}
                          <Mail size={16} />
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('send_whatsapp')}
                          <MessageCircle size={16} />
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('release_bond')}
                          <Truck size={16} />
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          {t('edit_delegate')}
                          <Truck size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!loading && !loadError && filteredSales.length === 0 && (
                <tr>
                  <td colSpan={13} className="p-6 text-center text-gray-500">
                    {direction === 'rtl' ? 'لا توجد بيانات' : 'No data'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (UI ثابت زي ما هو) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6" dir={direction}>
          <div className="text-sm text-gray-600">
            {t('showing_records')} 1 {t('to')} {filteredSales.length} {t('of')} {sales.length} {t('records')}
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">{t('previous')}</button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">{t('next')}</button>
          </div>
        </div>
      </div>

      {/* Modals (زي ما هي) */}
      <AnimatePresence>
       

        {/* باقي المودالات زي ما هي في كودك — بدون تغيير */}
        {showPayments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPayments(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-bold text-primary">
                  {t('payment_view_title').replace('{ref}', showPayments.refNo)}
                </h2>
                <button onClick={() => setShowPayments(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <table className="w-full text-sm text-right border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-3 border border-primary-hover">{t('date')}</th>
                      <th className="p-3 border border-primary-hover">{t('ref_no')}</th>
                      <th className="p-3 border border-primary-hover">{t('paid')}</th>
                      <th className="p-3 border border-primary-hover">{t('payment_type')}</th>
                      <th className="p-3 border border-primary-hover">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salePayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-200">
                        <td className="p-3 border-x border-gray-200">{payment.date}</td>
                        <td className="p-3 border-x border-gray-200">{payment.refNo}</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{payment.amount.toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{t(payment.type)}</td>
                        <td className="p-3 border-x border-gray-200 flex justify-center gap-2">
                          <button
                            onClick={() => setSalePayments(salePayments.filter((p) => p.id !== payment.id))}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button onClick={() => setShowEditPayment(payment)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => alert(t('email_sent_success'))} className="text-gray-600 hover:bg-gray-50 p-1 rounded">
                            <Mail size={16} />
                          </button>
                          <button onClick={() => setShowPaymentReceipt(payment)} className="text-gray-600 hover:bg-gray-50 p-1 rounded">
                            <FileText size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
              {showEditPayment && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowEditPayment(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-bold text-primary">{t('edit_payment')}</h2>
                <button onClick={() => setShowEditPayment(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6 text-right" dir={direction}>
                <p className="text-sm text-red-600">{t('edit_payment_desc')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('date')} *</label>
                    <input type="text"
                      defaultValue={showEditPayment.date}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('payment_ref')} *</label>
                    <input type="text"
                      defaultValue={showEditPayment.refNo}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('paid')}</label>
                    <input type="number"
                      defaultValue={showEditPayment.amount}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('paid_by')}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option value="mada">{t('mada')}</option>
                      <option value="cash">{t('cash')}</option>
                      <option value="bank_transfer">{t('bank_transfer')}</option>
                    </select>
                  </div>

                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => setShowEditPayment(null)}
                    className="bg-[#8b0000] text-white px-8 py-2 rounded-md font-bold hover:bg-[#a52a2a] transition-colors"
                  >
                    {t('edit_payment')}
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}



        {showPaymentReceipt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPaymentReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">

                <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                  <Printer size={16}/> {t('print')}
                </button>

                <button onClick={() => setShowPaymentReceipt(null)}
                  className="text-gray-400 hover:text-gray-600">
                  <X size={24}/>
                </button>

              </div>

              <div className="p-10 space-y-8 text-right" dir={direction}>

                <div className="flex justify-between items-start">

                  <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                    <LayoutGrid size={48} className="text-gray-300"/>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">{t('test_company')}</h2>
                    <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                    <p className="text-sm text-gray-600">السجل التجاري: 1234123123</p>
                    <p className="text-sm text-gray-600">هاتف: 0146580073</p>
                  </div>

                </div>


                <div className="bg-gray-200 p-3 rounded-lg text-center font-bold text-lg">
                  {t('receipt_bond')}
                </div>


                <div className="flex justify-between font-bold">
                  <p>{t('date')} : {showPaymentReceipt.date.split(' ')[0]}</p>
                  <p>{t('payment_ref')} : {showPaymentReceipt.refNo}</p>
                </div>


                <div className="space-y-6 border border-gray-200 p-6 rounded-xl">

                  <div className="flex items-center gap-4">
                    <span className="font-bold whitespace-nowrap">{t('received_from')} :</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">
                      عميل افتراضي
                    </span>
                  </div>


                  <div className="flex items-center gap-4">
                    <span className="font-bold whitespace-nowrap">{t('amount_of')} :</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">
                      {showPaymentReceipt.amount.toFixed(2)}
                    </span>
                  </div>


                  <div className="flex items-center gap-4">
                    <span className="font-bold whitespace-nowrap">{t('payment_type')} :</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">
                      {t(showPaymentReceipt.type)}
                    </span>
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
        {/* باقي مودالاتك موجودة عندك — سيبها زي ما هي (لو حابب أبعتها كاملة مع باقي الملف قولّي) */}
      </AnimatePresence>
    </div>
  );
}