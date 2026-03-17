import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useWarehouses } from "@/context/WarehousesContext";
import { useProducts, type Product } from "@/context/ProductsContext";
import { useCustomers } from "@/context/CustomersContext";
import { Search, Trash2, X, LayoutGrid, Save, Printer, User, Clock, Calendar, Building, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  code: string;
  price: number;
  qty: number;
  vat: number;
  total: number;
}

const CreateA4Invoice: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { warehouses } = useWarehouses();
  const { products: allProducts } = useProducts();
  const { customers } = useCustomers();

  const [selectedBranchId, setSelectedBranchId] = useState<string>(warehouses[0]?.id || "");
  const selectedBranch = warehouses.find((w) => w.id === selectedBranchId);

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // For Screen 1 (Touch Screen)
  const [activeCategory, setActiveCategory] = useState("الكل");
  const categories = ["الكل", "مشروبات", "الوجبات المقلية", "برجر دجاج", "بروست", "بطاطس", "سندوتشات", "مأكولات خفيفة", "مطعم"];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddItem = (product: Product) => {
    const existing = items.find((item) => item.productId === product.id);
    if (existing) {
      setItems(items.map((item) => (item.productId === product.id ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.price * 1.15 } : item)));
    } else {
      const price = parseFloat(product.price);
      setItems([
        ...items,
        {
          id: Math.random().toString(36).slice(2, 11),
          productId: product.id,
          name: product.name,
          code: product.code,
          price: price,
          qty: 1,
          vat: price * 0.15,
          total: price * 1.15,
        },
      ]);
    }
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(items.map((item) => (item.id === id ? { ...item, qty, total: qty * item.price * 1.15 } : item)));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalVat = subtotal * 0.15;
  const grandTotal = subtotal + totalVat;

  // --- Screen 1: Touch Screen Layout (Green) ---
  const TouchScreenLayout = () => (
    <div className="flex h-[calc(100vh-120px)] gap-4 overflow-hidden" dir="rtl">
      {/* Left Side: Product Selection */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("px-6 py-2 rounded-lg font-bold whitespace-nowrap transition-all", activeCategory === cat ? "bg-emerald-800 text-white shadow-md" : "bg-white text-emerald-800 border border-emerald-100 hover:bg-emerald-50")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
          {allProducts.map((product) => (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={product.id} onClick={() => handleAddItem(product)} className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="aspect-square bg-gray-50 relative overflow-hidden group">
                <img src={`https://picsum.photos/seed/${product.id}/200/200`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{product.price} ر.س</div>
              </div>
              <div className="p-3 text-right">
                <p className="text-xs font-bold text-emerald-900 truncate">{product.name}</p>
                <p className="text-[10px] text-emerald-600 truncate mt-0.5">{product.code}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right Side: Invoice Details */}
      <div className="w-[400px] bg-white rounded-2xl border border-emerald-100 shadow-lg flex flex-col overflow-hidden">
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} />
            <span className="font-bold">فاتورة مبيعات</span>
          </div>
          <div className="text-xs opacity-80">F4</div>
        </div>

        {/* Barcode Search */}
        <div className="p-4 border-b border-emerald-50">
          <div className="relative">
            <input type="text" placeholder="قراءة الباركود / ابحث عن طريق اسم أو الباركود" className="w-full bg-gray-50 border border-emerald-100 rounded-lg px-4 py-2.5 text-sm text-right outline-none focus:ring-2 focus:ring-emerald-100" />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[var(--table-header)] text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 text-center">×</th>
                <th className="p-2">إجمالي</th>
                <th className="p-2 text-center">الكمية</th>
                <th className="p-2">السعر</th>
                <th className="p-2">صنف</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-emerald-50 hover:bg-emerald-50/30">
                  <td className="p-2 text-center">
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 size={14} />
                    </button>
                  </td>
                  <td className="p-2 font-bold text-emerald-900">{item.total.toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <input type="number" value={item.qty} onChange={(e) => handleUpdateQty(item.id, parseInt(e.target.value) || 1)} className="w-12 border border-emerald-100 rounded px-1 py-0.5 text-center outline-none focus:border-emerald-500" />
                  </td>
                  <td className="p-2">{item.price.toFixed(2)}</td>
                  <td className="p-2 font-medium text-emerald-800">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-4 bg-emerald-50/50 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">الاصناف</span>
            <span className="font-bold text-emerald-900">
              {items.length} ({items.reduce((s, i) => s + i.qty, 0)})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">بدون ضريبة</span>
            <span className="font-bold text-emerald-900">{subtotal.toFixed(2)}</span>
          </div>
          <div className="bg-emerald-900 text-white p-4 rounded-xl flex flex-col items-center gap-1 shadow-lg">
            <span className="text-xs opacity-80 uppercase tracking-wider">إجمالي الفاتورة</span>
            <span className="text-3xl font-black">{grandTotal.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-all active:scale-95">دفع (F9)</button>
            <button className="bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-md transition-all active:scale-95">تعليق الفاتورة (F7)</button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Screen 2: Traditional Layout (Blue) ---
  const TraditionalLayout = () => (
    <div className="space-y-6" dir="rtl">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Building size={18} />
              <span className="text-sm font-bold">الفرع: {selectedBranch?.name}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <CreditCard size={18} />
              <span className="text-sm font-bold">خزينة: MainTreasury</span>
            </div>
          </div>
          <div className="bg-white text-blue-600 px-6 py-1.5 rounded-lg font-black text-lg shadow-inner">فاتورة مبيعات</div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString("en-GB")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{currentTime.toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex items-center gap-4 mr-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payType" defaultChecked className="w-4 h-4 accent-blue-600" />
                <span>نقدي</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payType" className="w-4 h-4 accent-blue-600" />
                <span>آجل</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/30">
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-blue-800 block">الاسم / التليفون / الكود</label>
            <div className="relative">
              <input type="text" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="ابحث عن عميل..." className="w-full border border-blue-200 rounded-xl px-4 py-2.5 text-right outline-none focus:ring-2 focus:ring-blue-100 shadow-sm" />
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            </div>
            {customerSearch && !selectedCustomer && (
              <div className="absolute top-full left-0 right-0 bg-white border border-blue-100 shadow-xl z-50 max-h-48 overflow-y-auto rounded-b-xl mt-1">
                {customers
                  .filter((c) => c.name.includes(customerSearch) || c.phone.includes(customerSearch))
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearch(c.name);
                      }}
                      className="w-full p-3 text-right hover:bg-blue-50 border-b border-blue-50 last:border-0"
                    >
                      <p className="font-bold text-blue-900">{c.name}</p>
                      <p className="text-xs text-blue-500">{c.phone}</p>
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-800 block">الرصيد الحالي</label>
            <div className="flex">
              <input type="text" readOnly value="0" className="w-full border border-blue-200 rounded-r-xl px-4 py-2.5 text-center bg-gray-50 font-bold" />
              <span className="bg-blue-600 text-white px-4 py-2.5 rounded-l-xl flex items-center justify-center font-bold">مدين</span>
            </div>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">الحساب</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-[var(--table-header)] text-white">
            <tr>
              <th className="p-3 border-l border-blue-800/50 w-16 text-center">بالاسم</th>
              <th className="p-3 border-l border-blue-800/50">الوحدة</th>
              <th className="p-3 border-l border-blue-800/50">سعر الشراء</th>
              <th className="p-3 border-l border-blue-800/50">العدد | الكمية</th>
              <th className="p-3 border-l border-blue-800/50">سعر الشراء</th>
              <th className="p-3 border-l border-blue-800/50">ضريبة القيمة المضافة</th>
              <th className="p-3">الاجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-blue-50 hover:bg-blue-50/30">
                <td className="p-3 border-l border-blue-50 text-center">
                  <button onClick={() => handleRemoveItem(item.id)} className="text-red-500">
                    ×
                  </button>
                </td>
                <td className="p-3 border-l border-blue-50">قطعة</td>
                <td className="p-3 border-l border-blue-50">{item.price.toFixed(2)}</td>
                <td className="p-3 border-l border-blue-50">
                  <input type="number" value={item.qty} onChange={(e) => handleUpdateQty(item.id, parseInt(e.target.value) || 1)} className="w-20 border border-blue-100 rounded px-2 py-1 text-center outline-none focus:border-blue-500" />
                </td>
                <td className="p-3 border-l border-blue-50">{item.price.toFixed(2)}</td>
                <td className="p-3 border-l border-blue-50">{item.vat.toFixed(2)}</td>
                <td className="p-3 font-bold text-blue-900">{item.total.toFixed(2)}</td>
              </tr>
            ))}
            {/* New Item Row */}
            <tr className="bg-blue-50/50">
              <td className="p-3 border-l border-blue-100 text-center text-emerald-600 font-bold">جديد</td>
              <td colSpan={6} className="p-0">
                <div className="relative">
                  <input type="text" placeholder="ابحث عن صنف..." className="w-full bg-transparent p-3 text-right outline-none placeholder:text-blue-300 pr-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  {searchTerm && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-blue-100 shadow-xl z-50 max-h-60 overflow-y-auto rounded-b-xl">
                      {allProducts
                        .filter((p) => p.name.includes(searchTerm))
                        .map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              handleAddItem(p);
                              setSearchTerm("");
                            }}
                            className="w-full p-3 text-right hover:bg-blue-50 border-b border-blue-50 last:border-0 flex justify-between items-center"
                          >
                            <span className="text-blue-600 font-bold">{p.price} ر.س</span>
                            <span>{p.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
            <span className="text-xs text-blue-600 font-bold mb-1">اجمالي الفاتورة</span>
            <span className="text-2xl font-black text-blue-900">{grandTotal.toFixed(2)}</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
            <span className="text-xs text-blue-600 font-bold mb-1">ضريبة !</span>
            <span className="text-2xl font-black text-blue-900">{totalVat.toFixed(2)}</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
            <span className="text-xs text-blue-600 font-bold mb-1">خصم !</span>
            <span className="text-2xl font-black text-blue-900">0.00</span>
          </div>
          <div className="bg-blue-900 p-4 rounded-xl border border-blue-800 flex flex-col items-center text-white shadow-lg">
            <span className="text-xs opacity-80 font-bold mb-1">المطلوب سدادة</span>
            <span className="text-2xl font-black">{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-blue-50">
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center gap-2">
              <Save size={20} />
              مبيعات
            </button>
            <label className="flex items-center gap-2 cursor-pointer text-blue-800 font-bold">
              <input type="checkbox" className="w-5 h-5 accent-blue-600" defaultChecked />
              <span>طباعة</span>
            </label>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Printer size={24} />
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Save size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2 mb-4" dir={direction}>
        <span>{t("home")}</span>
        <span>/</span>
        <span>{t("sales")}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">فاتورة مبيعات</span>
      </div>

      {/* Branch Selection (Hidden in production if auto-detected) */}
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-gray-600">اختر الفرع لتغيير التصميم:</label>
          <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100">
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => navigate("/sales/a4-invoices")} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      {selectedBranch?.showTouchScreen ? (
        <TouchScreenLayout />
      ) : selectedBranch?.showScreen2 ? (
        <TraditionalLayout />
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 gap-4">
          <Building size={64} className="opacity-20" />
          <p className="text-lg font-bold">يرجى تفعيل "إظهار شاشة اللمس" أو "إظهار شاشة 2" في إعدادات الفرع لرؤية التصميم الجديد.</p>
          <button onClick={() => navigate("/settings/branches")} className="bg-emerald-800 text-white px-6 py-2 rounded-lg font-bold">
            الذهاب لإعدادات الفروع
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateA4Invoice;
