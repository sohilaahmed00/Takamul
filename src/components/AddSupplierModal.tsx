import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuppliers } from '@/context/SuppliersContext';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any; // Optional supplier for editing
}

export default function AddSupplierModal({ isOpen, onClose, supplier }: AddSupplierModalProps) {
  const { t } = useLanguage();
  const { addSupplier, updateSupplier } = useSuppliers();
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    taxNumber: supplier?.taxNumber || '',
    commercialRegistration: supplier?.commercialRegistration || '',
    openingBalance: supplier?.openingBalance || 0,
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || ''
  });

  // Update form data when supplier prop changes
  React.useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        taxNumber: supplier.taxNumber || '',
        commercialRegistration: supplier.commercialRegistration || '',
        openingBalance: supplier.openingBalance || 0,
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || ''
      });
    } else {
      setFormData({
        name: '',
        taxNumber: '',
        commercialRegistration: '',
        openingBalance: 0,
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert(t('please_enter_supplier_name') || 'الرجاء إدخال اسم المورد');
      return;
    }

    if (supplier) {
      updateSupplier(supplier.id, formData);
      alert(t('supplier_updated_successfully') || 'تم تحديث بيانات المورد بنجاح');
    } else {
      addSupplier(formData);
      alert(t('supplier_added_successfully') || 'تم إضافة المورد بنجاح');
    }
    
    onClose();
    if (!supplier) {
      setFormData({
        name: '',
        taxNumber: '',
        commercialRegistration: '',
        openingBalance: 0,
        email: '',
        phone: '',
        address: ''
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {supplier ? (t('edit_supplier') || 'تعديل مورد') : (t('add_supplier') || 'إضافة مورد')}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <CloseIcon size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-500 mb-6 text-center">
                {t('please_enter_info_below') || 'برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .'}
              </p>

              <form id="supplier-form-modal" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('supplier_name') || 'اسم المورد'} *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('tax_number') || 'الرقم الضريبي'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('commercial_registration') || 'السجل التجاري'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.commercialRegistration}
                    onChange={(e) => setFormData({...formData, commercialRegistration: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('opening_balance') || 'رصيد افتتاحي'} * ({t('amount_due_to_supplier') || 'المبلغ المستحق للمورد'})
                  </label>
                  <input 
                    type="number" 
                    required
                    value={formData.openingBalance}
                    onChange={(e) => setFormData({...formData, openingBalance: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('email_address') || 'عنوان البريد الإلكتروني'}
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('phone') || 'هاتف'} (ex:966568101255)
                  </label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">
                    {t('address') || 'العنوان'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                type="submit"
                form="supplier-form-modal"
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-all shadow-md"
              >
                {supplier ? (t('update') || 'تحديث') : (t('add_supplier') || 'إضافة مورد')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
