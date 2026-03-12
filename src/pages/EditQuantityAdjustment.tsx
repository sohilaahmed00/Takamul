import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Search,
  Save,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/context/ProductsContext';
import { useAdjustments } from '@/context/AdjustmentsContext';

const EditQuantityAdjustment = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { products } = useProducts();
  const { adjustments, updateAdjustment } = useAdjustments();

  const adjustmentId = parseInt(id || '0', 10);
  const adjustment = adjustments.find((a: any) => a.id === adjustmentId) || adjustments[0];

  const [formData, setFormData] = useState({
    date: adjustment?.date || '2026-03-06 09:30:00',
    refNo: adjustment?.refNo || 'UP0138',
    branch: adjustment?.branch || 'شركة دقة الحلول',
    note: adjustment?.note || 'تعديل على الجرد السابق',
    items: (adjustment?.items || [
      {
        id: 1,
        code: '60990980',
        name: 'عبايه كريب مع اكمام مموجه',
        availableQty: '10.00',
        type: 'إضافة',
        qty: '5',
        cost: '150',
        serial: ''
      }
    ]) as any[]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adjustment) {
      setFormData({
        date: adjustment.date || '2026-03-06 09:30:00',
        refNo: adjustment.refNo || '',
        branch: adjustment.branch || 'شركة دقة الحلول',
        note: adjustment.note || '',
        items: adjustment.items || []
      });
    }
  }, [adjustment]);

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
    (p: any) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين التعديلات؟')) {
      setFormData({
        date: adjustment?.date || '2026-03-06 09:30:00',
        refNo: adjustment?.refNo || '',
        branch: adjustment?.branch || 'شركة دقة الحلول',
        note: adjustment?.note || '',
        items: adjustment?.items || []
      });
    }
  };

  const handleSave = () => {
    if (!adjustment) {
      alert('لم يتم العثور على التعديل');
      return;
    }

    if (formData.items.length === 0) {
      alert('يرجى إضافة أصناف أولاً');
      return;
    }

    updateAdjustment(adjustment.id, {
      refNo: formData.refNo,
      note: formData.note,
      items: formData.items
    });

    alert('تم حفظ البيانات بنجاح!');
    navigate('/products/quantity-adjustments');
  };

  const handleAddItem = (product: any) => {
    const existingItem = formData.items.find((item: any) => item.id === product.id);

    if (existingItem) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item: any) =>
          item.id === product.id
            ? { ...item, qty: (parseInt(item.qty, 10) + 1).toString() }
            : item
        )
      }));
    } else {
      const newItem = {
        id: product.id,
        code: product.code,
        name: product.name,
        availableQty: product.quantity?.toString() || '10.00',
        type: 'إضافة',
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
      items: prev.items.map((item: any) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item: any) => item.id !== itemId)
    }));
  };

  return (
    <div className="space-y-4 text-black" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1 font-medium px-2">
        <span>{t('home')}</span> / <span>{t('products')}</span> /{' '}
        <span className="text-gray-800">تعديل تعديل كميات</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Edit size={20} className="text-primary" />
          تعديل التعديل الكمي
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          برجاء ادخال المعلومات أدناه. الحقول التي تحمل علامة{' '}
          <span className="text-red-500">*</span> إجبارية.
        </p>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-row-reverse">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t('date')} *
            </label>
            <input
              type="text"
              value={formData.date}
              className="takamol-input font-mono text-center bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t('ref_no')}
            </label>
            <input
              type="text"
              value={formData.refNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, refNo: e.target.value }))
              }
              className="takamol-input text-center font-bold text-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t('branch')} *
            </label>
            <select
              value={formData.branch}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, branch: e.target.value }))
              }
              className="takamol-input font-bold"
            >
              <option>شركة دقة الحلول</option>
              <option>الفرع الرئيسي</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {t('products')} *
          </label>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="الرجاء إضافة الأصناف..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="takamol-input !pr-10"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {showDropdown && searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-10 mt-1 rounded-md overflow-y-auto max-h-60">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product: any) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleAddItem(product)}
                      className="w-full p-3 text-right hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0 font-bold"
                    >
                      {product.code} - {product.name}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500 font-bold">
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
                <th className="p-3 w-12 text-center border-l border-white/20">حذف</th>
                <th className="p-3 border-l border-white/20">اسم الصنف (كود الصنف)</th>
                <th className="p-3 text-center border-l border-white/20">
                  الكمية المتاحة
                </th>
                <th className="p-3 text-center border-l border-white/20">نوع</th>
                <th className="p-3 text-center border-l border-white/20">كمية</th>
                <th className="p-3 text-center border-l border-white/20">التكلفة</th>
                <th className="p-3">رقم السيريال</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {formData.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-400 italic bg-gray-50 font-bold"
                  >
                    لا توجد أصناف مضافة
                  </td>
                </tr>
              ) : (
                formData.items.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-center border-l border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors mx-auto block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                    <td className="p-3 font-bold border-l border-gray-100">
                      {item.code} - {item.name}
                    </td>
                    <td
                      className="p-3 text-center font-mono border-l border-gray-100"
                      dir="ltr"
                    >
                      {item.availableQty}
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleItemChange(item.id, 'type', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white outline-none focus:border-[#2ecc71] font-bold"
                      >
                        <option>طرح</option>
                        <option>إضافة</option>
                      </select>
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      <input
                        type="text"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(item.id, 'qty', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-16 text-center outline-none focus:border-[#2ecc71] font-bold"
                      />
                    </td>
                    <td className="p-3 text-center font-bold border-l border-gray-100">
                      {item.cost}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.serial}
                        onChange={(e) =>
                          handleItemChange(item.id, 'serial', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full outline-none focus:border-[#2ecc71]"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {t('note')}
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div
              className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1 justify-end"
              dir="ltr"
            >
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Bold size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Italic size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Underline size={16} />
              </button>
              <div className="w-px bg-gray-300 h-5 mx-2 my-auto"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <AlignLeft size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <AlignCenter size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <AlignRight size={16} />
              </button>
              <div className="w-px bg-gray-300 h-5 mx-2 my-auto"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <List size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <LinkIcon size={16} />
              </button>
            </div>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              className="w-full p-4 h-24 outline-none text-right bg-white resize-y"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-[#00a651] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#008f45] transition-colors shadow-sm text-[15px]"
          >
            <span>حفظ البيانات</span>
            <Save size={18} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-[#e30613] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#cc0510] transition-colors shadow-sm text-[15px]"
          >
            <span>إعادة تعيين</span>
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuantityAdjustment;