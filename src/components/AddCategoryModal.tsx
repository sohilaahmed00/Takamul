import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCategories, Category } from '@/context/CategoriesContext';
import ResponsiveModal from './ResponsiveModal';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, category }) => {
  const { direction, t } = useLanguage();
  const { addCategory, updateCategory } = useCategories();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    slug: '',
    description: '',
    mainCategory: '',
    showInPOS: true,
    branchAvailability: [
      { branchName: 'تجريبي', status: true }
    ]
  });

  const [imageName, setImageName] = useState('');
  const [bannerName, setBannerName] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        code: category.code,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        mainCategory: category.mainCategory || '',
        showInPOS: category.showInPOS ?? true,
        branchAvailability: category.branchAvailability || [
          { branchName: 'تجريبي', status: true }
        ]
      });
      setImageName(category.image || '');
    } else {
      setFormData({
        code: '',
        name: '',
        slug: '',
        description: '',
        mainCategory: '',
        showInPOS: true,
        branchAvailability: [
          { branchName: 'تجريبي', status: true }
        ]
      });
      setImageName('');
      setBannerName('');
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      updateCategory(category.id, {
        ...formData,
        image: imageName,
      });
      alert(t('category_updated'));
    } else {
      addCategory({
        ...formData,
        image: imageName,
      });
      alert(t('category_added'));
    }
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? t('edit_category') : t('add_category')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-6" dir={direction}>
        <div className="text-[var(--text-muted)] text-sm text-center">
          {t('mandatory_fields')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="takamol-label">
              {t('category_code')} *
            </label>
            <input 
              type="text" 
              required
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="takamol-input"
            />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('category_name')} *
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="takamol-input"
            />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('slug')} *
            </label>
            <input 
              type="text" 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="takamol-input"
            />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('description')} *
            </label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="takamol-input min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('category_image')}
            </label>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="btn-primary !px-4 !py-2 !text-sm whitespace-nowrap"
              >
                <Upload size={16} />
                {t('browse')}
              </button>
              <input 
                type="text" 
                readOnly 
                value={imageName}
                className="takamol-input !py-2 !bg-[var(--bg-main)]"
              />
              <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                onChange={(e) => setImageName(e.target.files?.[0]?.name || '')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('category_banner')}
            </label>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="btn-primary !px-4 !py-2 !text-sm whitespace-nowrap"
              >
                <Upload size={16} />
                {t('browse')}
              </button>
              <input 
                type="text" 
                readOnly 
                value={bannerName}
                className="takamol-input !py-2 !bg-[var(--bg-main)]"
              />
              <input 
                type="file" 
                ref={bannerInputRef} 
                className="hidden" 
                onChange={(e) => setBannerName(e.target.files?.[0]?.name || '')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('main_category')}
            </label>
            <select 
              value={formData.mainCategory}
              onChange={(e) => setFormData({...formData, mainCategory: e.target.value})}
              className="takamol-input"
            >
              <option value="">{t('main_category_select')}</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input 
              type="checkbox" 
              id="showInPOS"
              checked={formData.showInPOS}
              onChange={(e) => setFormData({...formData, showInPOS: e.target.checked})}
              className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
            <label htmlFor="showInPOS" className="text-sm font-bold text-[var(--text-main)] cursor-pointer">
              {t('show_in_pos')}
            </label>
          </div>
        </div>

        <div className="takamol-card overflow-hidden">
          <div className="bg-[var(--primary)] p-3 text-white text-center font-bold text-sm">
            {t('category_availability')}
          </div>
          <div className="overflow-x-auto">
            <table className="takamol-table">
              <thead>
                <tr>
                  <th>{t('branch_name')}</th>
                  <th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {formData.branchAvailability.map((branch, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{branch.branchName}</td>
                    <td>
                      <select 
                        value={branch.status ? 'yes' : 'no'}
                        onChange={(e) => {
                          const newBranches = [...formData.branchAvailability];
                          newBranches[idx].status = e.target.value === 'yes';
                          setFormData({...formData, branchAvailability: newBranches});
                        }}
                        className="takamol-input !py-1 !px-2 !text-xs w-24 mx-auto"
                      >
                        <option value="yes">{t('yes')}</option>
                        <option value="no">{t('no')}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <button 
            type="submit"
            className="btn-primary w-full py-3 text-lg"
          >
            {category ? t('save') : t('add_category')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default AddCategoryModal;
