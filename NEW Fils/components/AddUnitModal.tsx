import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unitName: string) => void;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose, onAddUnit }) => {
  const { t, direction } = useLanguage();
  const [unitName, setUnitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim()) {
      alert(direction === 'rtl' ? 'يرجى إدخال اسم الوحدة' : 'Please enter unit name');
      return;
    }
    onAddUnit(unitName);
    setUnitName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        dir={direction}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PlusCircle size={20} className="text-primary" />
            {t('add_new_unit')}
          </h1>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('unit_name')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
                required
              />
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors shadow-sm"
              >
                  {t('add_new_unit')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddUnitModal;
