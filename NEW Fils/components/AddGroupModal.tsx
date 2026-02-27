import React, { useState, useRef } from 'react';
import { PlusCircle, Upload, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useGroups } from '@/context/GroupsContext';
import { motion } from 'framer-motion';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose }) => {
  const { t, direction } = useLanguage();
  const { addGroup } = useGroups();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState('');
  const [groupNameSecondary, setGroupNameSecondary] = useState('');
  const [fileName, setFileName] = useState('');

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      alert(direction === 'rtl' ? 'يرجى إدخال اسم المجموعة' : 'Please enter group name');
      return;
    }

    addGroup(groupName);
    alert(direction === 'rtl' ? 'تم الحفظ بنجاح' : 'Saved successfully');
    onClose();
    setGroupName('');
    setFileName('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
        dir={direction}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PlusCircle size={20} className="text-primary" />
            {t('add_new_group')}
          </h1>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('group_name')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('group_name_secondary_lang')}
              </label>
              <input 
                type="text" 
                value={groupNameSecondary}
                onChange={(e) => setGroupNameSecondary(e.target.value)}
                className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('group_image')}</label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  {t('browse')}
                </button>
                <input 
                  type="text" 
                  value={fileName}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-gray-50" 
                  readOnly 
                  placeholder={direction === 'rtl' ? 'لم يتم اختيار ملف' : 'No file selected'}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors shadow-sm"
              >
                  {t('add_new_group')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddGroupModal;
