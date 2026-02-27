import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomers } from '@/context/CustomersContext';
import { useLanguage } from '@/context/LanguageContext';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const { t, direction } = useLanguage();
  const { addCustomer } = useCustomers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pricingGroup: 'عام',
    customerGroup: 'عام',
    taxNumber: '',
    actualBalance: 0,
    commercialRegister: '',
    creditLimit: 0,
    stopSellingOverdue: false,
    isTaxable: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      ...formData,
      totalPoints: 0
    });
    onClose();
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      pricingGroup: 'عام',
      customerGroup: 'عام',
      taxNumber: '',
      actualBalance: 0,
      commercialRegister: '',
      creditLimit: 0,
      stopSellingOverdue: false,
      isTaxable: false
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md" dir={direction}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 text-[#2ecc71]">
              <h2 className="text-xl font-bold">اضافة عميل</h2>
              <UserPlus size={24} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">
              برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
            </p>

            {/* Customer Type Selection */}
            <div className="bg-[#fff9e6] p-4 rounded-xl border border-[#ffeeba] space-y-3">
              <p className="text-center font-bold text-[#856404]">برجاء تحديد نوع العميل</p>
              <div className="flex justify-center gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="isTaxable" 
                    checked={!formData.isTaxable} 
                    onChange={() => setFormData({...formData, isTaxable: false})}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                  <span className="text-sm font-medium text-gray-700">فرد / شركة (غير مسجل بالضريبة)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="isTaxable" 
                    checked={formData.isTaxable} 
                    onChange={() => setFormData({...formData, isTaxable: true})}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                  <span className="text-sm font-medium text-gray-700">شركة (مسجل بالضريبة)</span>
                </label>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row 1 */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">مجموعة العملاء *</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                  value={formData.customerGroup}
                  onChange={(e) => setFormData({...formData, customerGroup: e.target.value})}
                >
                  <option value="عام">عام</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">مجموعة التسعيرة</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                  value={formData.pricingGroup}
                  onChange={(e) => setFormData({...formData, pricingGroup: e.target.value})}
                >
                  <option value="عام">عام</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">اسم العميل *</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Row 2 */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">هاتف</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">عنوان البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">السجل التجاري</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.commercialRegister}
                  onChange={(e) => setFormData({...formData, commercialRegister: e.target.value})}
                />
              </div>

              {/* Row 3 */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">رصيد افتتاحي *( المديونية بالسالب)</label>
                <input 
                  type="number" 
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                  value={formData.actualBalance}
                  onChange={(e) => setFormData({...formData, actualBalance: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">الحد الائتماني *</label>
                <input 
                  type="number" 
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({...formData, creditLimit: Number(e.target.value)})}
                />
              </div>
              {formData.isTaxable && (
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-[#2ecc71] text-right">الرقم الضريبي *</label>
                  <input 
                    type="text" 
                    required={formData.isTaxable}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                  />
                </div>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-bold text-[#2ecc71]">ايقاف البيع في حالة وجود مبالغ مستحقة</span>
              <input 
                type="checkbox" 
                checked={formData.stopSellingOverdue}
                onChange={(e) => setFormData({...formData, stopSellingOverdue: e.target.checked})}
                className="w-4 h-4 accent-[#2ecc71]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-[#00a65a] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md"
              >
                اضافة عميل
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
