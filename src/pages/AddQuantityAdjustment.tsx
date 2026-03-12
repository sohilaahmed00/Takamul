import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Upload,
  Search,
  Save,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdjustments } from '@/context/AdjustmentsContext';
import { useProducts } from '@/context/ProductsContext';

const AddQuantityAdjustment = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { addAdjustment } = useAdjustments();
  const { products } = useProducts();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toLocaleString('en-GB').replace(',', ''),
    refNo: '',
    branch: 'شركة دقة الحلول',
    note: '',
    items: [] as any[]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      String(p.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(p.code || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    if (
      window.confirm(
        direction === 'rtl'
          ? 'هل أنت متأكد من إعادة تعيين الصفحة؟ سيتم فقدان جميع البيانات غير المحفوظة.'
          : 'Are you sure you want to reset the page? All unsaved data will be lost.'
      )
    ) {
      setFormData({
        date: new Date().toLocaleString('en-GB').replace(',', ''),
        refNo: '',
        branch: 'شركة دقة الحلول',
        note: '',
        items: []
      });
      setSearchTerm('');
      setShowDropdown(false);
      setFileName('');
    }
  };

  const handleComplete = () => {
    if (formData.items.length === 0) {
      alert(direction === 'rtl' ? 'يرجى إضافة أصناف أولاً' : 'Please add items first');
      return;
    }

    addAdjustment({
      date: formData.date,
      refNo: formData.refNo || `ADJ-${Math.floor(Math.random() * 100000)}`,
      branch: formData.branch,
      entry: 'Admin',
      note: formData.note,
      items: formData.items
    });

    alert(direction === 'rtl' ? 'تم حفظ التعديل بنجاح!' : 'Adjustment saved successfully!');
    navigate('/products/quantity-adjustments');
  };

  const handleAddItem = (product: any) => {
    const existingItem = formData.items.find((item) => item.id === product.id);

    if (existingItem) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === product.id
            ? { ...item, qty: (parseInt(item.qty) + 1).toString() }
            : item
        )
      }));
    } else {
      const newItem = {
        id: product.id,
        code: product.code,
        name: product.name,
        availableQty: product.quantity?.toString() || '10.00',
        type: 'طرح',
        qty: '1',
        cost: product.cost?.toString() || '150',
        serial: ''
      };

      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }

    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleItemChange = (itemId: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId)
    }));
  };

  return (
    <div className="space-y-4 text-black" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">اضافة تعديل كميات</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Plus size={20} className="text-primary" />
          اضافة تعديل كميات
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          برجاء ادخال المعلومات أدناه. الحقول التي تحمل علامة * إجبارية.
        </p>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('date')} *
            </label>
            <input
              type="text"
              value={formData.date}
              className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-gray-50 text-black"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('ref_no')}
            </label>
            <input
              type="text"
              value={formData.refNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, refNo: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('branch')} *
            </label>
            <select
              value={formData.branch}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, branch: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-white text-black font-bold"
            >
              <option>شركة دقة الحلول</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t('attach_documents')}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 h-10 flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              {t('download_sample_file')}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 h-10 flex items-center justify-center rounded-md text-sm transition-colors whitespace-nowrap gap-2"
            >
              <Upload size={16} />
              {t('browse')}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
            />

            <div className="border border-gray-300 rounded-md px-3 h-10 flex items-center text-sm flex-1 text-gray-500 bg-gray-50">
              {fileName || 'لم يتم اختيار ملف'}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t('products')} *
          </label>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="الرجاء إضافة الأصناف"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm text-right pr-10 bg-white text-black"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {showDropdown && searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-10 mt-1 rounded-md overflow-y-auto max-h-60">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleAddItem(product)}
                      className="w-full p-3 text-right hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0 text-black"
                    >
                      {product.code} - {product.name}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-right text-black border-collapse">
            <thead className="bg-[#2ecc71] text-white">
              <tr>
                <th className="p-3 w-12 text-center">حذف</th>
                <th className="p-3">اسم الصنف (كود الصنف)</th>
                <th className="p-3 text-center">الكمية المتاحة</th>
                <th className="p-3 text-center">نوع</th>
                <th className="p-3 text-center">كمية</th>
                <th className="p-3 text-center">التكلفة</th>
                <th className="p-3">رقم السيريال</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {formData.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    لا توجد أصناف مضافة
                  </td>
                </tr>
              ) : (
                formData.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                    <td className="p-3 font-bold">
                      {item.code} - {item.name}
                    </td>
                    <td className="p-3 text-center font-medium">{item.availableQty}</td>
                    <td className="p-3 text-center">
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleItemChange(item.id, 'type', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                      >
                        <option>طرح</option>
                        <option>إضافة</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(item.id, 'qty', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-16 text-center font-bold"
                      />
                    </td>
                    <td className="p-3 text-center font-bold">{item.cost}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.serial}
                        onChange={(e) =>
                          handleItemChange(item.id, 'serial', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t('note')}
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b p-2 flex gap-2 text-gray-700">
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <Bold size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <Italic size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <Underline size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <List size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <AlignLeft size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <AlignCenter size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <AlignRight size={14} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded">
                <LinkIcon size={14} />
              </button>
            </div>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              className="w-full p-3 h-24 outline-none text-right bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleComplete}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md active:scale-95"
          >
            <Save size={20} /> حفظ البيانات
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
          >
            <RotateCcw size={20} /> إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuantityAdjustment;