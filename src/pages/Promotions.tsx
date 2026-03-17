import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePromotions } from '../context/PromotionsContext';
import { Plus, Search, Trash2, Edit2,  LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';
import MobileDataCard from '@/components/MobileDataCard';

const Promotions: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { 
    specialPromotions, 
    generalPromotions, 
    addSpecialPromotion, 
    updateSpecialPromotion,
    deleteSpecialPromotion,
    addGeneralPromotion,
    deleteGeneralPromotion
  } = usePromotions();

  const [activeTab, setActiveTab] = useState<'special' | 'general'>('special');
  const [showAddSpecial, setShowAddSpecial] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for Special Promotion
  const [specialForm, setSpecialForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    basicItem: '',
    basicItemQty: 1,
    freeItem: '',
    freeItemQty: 1,
    discount: 100,
    policy: 'option1',
    details: ''
  });

  // Form states for General Promotion
  const [generalForm, setGeneralForm] = useState({
    startDate: '2021-06-01',
    endDate: '2021-07-01',
    discount: 0,
    branch: 'تجريبي'
  });

  const handleAddSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromotion) {
      updateSpecialPromotion({ ...specialForm, id: editingPromotion });
    } else {
      addSpecialPromotion(specialForm);
    }
    setShowAddSpecial(false);
    setEditingPromotion(null);
    setSpecialForm({
      name: '',
      startDate: '',
      endDate: '',
      basicItem: '',
      basicItemQty: 1,
      freeItem: '',
      freeItemQty: 1,
      discount: 100,
      policy: 'option1',
      details: ''
    });
  };

  const handleEditSpecial = (promotion: any) => {
    setEditingPromotion(promotion.id);
    setSpecialForm({
      name: promotion.name,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      basicItem: promotion.basicItem,
      basicItemQty: promotion.basicItemQty,
      freeItem: promotion.freeItem,
      freeItemQty: promotion.freeItemQty,
      discount: promotion.discount,
      policy: promotion.policy,
      details: promotion.details
    });
    setShowAddSpecial(true);
  };

  const handleAddGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    addGeneralPromotion(generalForm);
    // Reset or keep? The image shows it as a persistent form
  };

  const filteredSpecial = specialPromotions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.basicItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
            <button
              onClick={() => { setActiveTab('special'); setShowAddSpecial(false); setEditingPromotion(null); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                activeTab === 'special' ? "bg-white dark:bg-gray-600 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              )}
            >
              {t('special_promotions')}
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                activeTab === 'general' ? "bg-white dark:bg-gray-600 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              )}
            >
              {t('general_promotions')}
            </button>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('promotions')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('customize_report_below')}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 space-y-4">
          {activeTab === 'special' ? (
            <div className="space-y-4">
              {!showAddSpecial ? (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full md:w-64 order-2 md:order-1">
                      <input
                        type="text"
                        placeholder={t('search_placeholder') || "اكتب ما تريد ان تبحث عنه"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                          "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-primary text-sm",
                          direction === 'rtl' ? "pr-10" : "pl-10"
                        )}
                      />
                      <Search className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-gray-400",
                        direction === 'rtl' ? "right-3" : "left-3"
                      )} size={18} />
                    </div>

                    {/* Add Button */}
                    <div className="flex items-center gap-2 order-1 md:order-2">
                      <button 
                        onClick={() => { setShowAddSpecial(true); setEditingPromotion(null); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-sm"
                      >
                        <Plus size={18} />
                        {t('add_special_promotion')}
                      </button>
                    </div>
                  </div>

                  {/* Table - Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className={cn(
                      "w-full border-collapse",
                      direction === 'rtl' ? "text-right" : "text-left"
                    )}>
                      <thead>
                        <tr className="bg-[var(--table-header)] text-white">
                          <th className="p-3 font-bold text-sm border-r border-white/10">{t('promotion_name')}</th>
                          <th className="p-3 font-bold text-sm border-r border-white/10">{t('basic_item')}</th>
                          <th className="p-3 font-bold text-sm border-r border-white/10">{t('free_item')}</th>
                          <th className="p-3 font-bold text-sm border-r border-white/10">{t('promotion_start_date')}</th>
                          <th className="p-3 font-bold text-sm border-r border-white/10">{t('promotion_end_date')}</th>
                          <th className="p-3 font-bold text-sm border-r border-white/10 text-center">{t('promotion_actions')}</th>
                          <th className="p-3 w-10 text-center">
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredSpecial.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                              {t('no_promotions_found')}
                            </td>
                          </tr>
                        ) : (
                          filteredSpecial.map((p) => (
                            <tr key={`desktop-${p.id}`} className="hover:bg-primary/5 transition-colors border-b border-gray-100 dark:border-gray-700">
                              <td className="p-3 border-r border-gray-100 dark:border-gray-700 font-bold text-sm">{p.name}</td>
                              <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm">{p.basicItem}</td>
                              <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm">{p.freeItem}</td>
                              <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm font-mono">{p.startDate}</td>
                              <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm font-mono">{p.endDate}</td>
                              <td className="p-3 border-r border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 justify-center">
                                  <button 
                                    onClick={() => handleEditSpecial(p)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => deleteSpecialPromotion(p.id)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <input type="checkbox" className="w-4 h-4 accent-primary" />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-4">
                    {filteredSpecial.map((p) => (
                      <MobileDataCard
                        key={`mobile-${p.id}`}
                        title={p.name}
                        subtitle={`${t('promotion_start_date')}: ${p.startDate}`}
                        fields={[
                          { label: t('basic_item'), value: p.basicItem },
                          { label: t('free_item'), value: p.freeItem },
                          { label: t('promotion_end_date'), value: p.endDate },
                        ]}
                        actions={
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => deleteSpecialPromotion(p.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleEditSpecial(p)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                        }
                      />
                    ))}
                  </div>

                  {/* Pagination Section */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>{t('showing')}</span>
                      <span className="font-bold text-gray-900 dark:text-white">1</span>
                      <span>{t('to')}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{filteredSpecial.length}</span>
                      <span>{t('of')}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{filteredSpecial.length}</span>
                      <span>{t('records')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                        {t('previous')}
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                        1
                      </button>
                      <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                        {t('next')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                      {editingPromotion ? <Edit2 size={18} className="text-primary" /> : <Plus size={18} className="text-primary" />}
                      <span className="font-bold text-gray-900 dark:text-white">
                        {editingPromotion ? t('edit_special_promotion') : t('add_special_promotion')}
                      </span>
                    </div>
                    <button 
                      onClick={() => { setShowAddSpecial(false); setEditingPromotion(null); }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
                    >
                      &times;
                    </button>
                  </div>
                  <form onSubmit={handleAddSpecial} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-primary mb-1">{t('promotion_name')} *</label>
                        <input
                          type="text"
                          required
                          value={specialForm.name}
                          onChange={(e) => setSpecialForm({ ...specialForm, name: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary mb-1">{t('promotion_start_date')}</label>
                        <input
                          type="date"
                          value={specialForm.startDate}
                          onChange={(e) => setSpecialForm({ ...specialForm, startDate: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary mb-1">{t('promotion_end_date')}</label>
                        <input
                          type="date"
                          value={specialForm.endDate}
                          onChange={(e) => setSpecialForm({ ...specialForm, endDate: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary mb-1">{t('basic_item')} *</label>
                        <input
                          type="text"
                          required
                          value={specialForm.basicItem}
                          onChange={(e) => setSpecialForm({ ...specialForm, basicItem: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary mb-1">{t('basic_item_qty')}</label>
                        <input
                          type="number"
                          value={specialForm.basicItemQty}
                          onChange={(e) => setSpecialForm({ ...specialForm, basicItemQty: Number(e.target.value) })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary mb-1">{t('free_item')} *</label>
                        <input
                          type="text"
                          required
                          value={specialForm.freeItem}
                          onChange={(e) => setSpecialForm({ ...specialForm, freeItem: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-primary mb-1">{t('free_item_qty')}</label>
                          <input
                            type="number"
                            value={specialForm.freeItemQty}
                            onChange={(e) => setSpecialForm({ ...specialForm, freeItemQty: Number(e.target.value) })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-primary mb-1">{t('promotion_discount')}</label>
                          <input
                            type="number"
                            value={specialForm.discount}
                            onChange={(e) => setSpecialForm({ ...specialForm, discount: Number(e.target.value) })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-primary mb-1">{t('promotion_policy')}</label>
                        <select
                          value={specialForm.policy}
                          onChange={(e) => setSpecialForm({ ...specialForm, policy: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        >
                          <option value="option1">{t('promotion_policy_option1')}</option>
                          <option value="option2">{t('promotion_policy_option2')}</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-primary mb-1">{t('promotion_details')}</label>
                        <textarea
                          rows={4}
                          value={specialForm.details}
                          onChange={(e) => setSpecialForm({ ...specialForm, details: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-white px-8 py-2 rounded-lg hover:bg-primary/90 transition-all font-bold shadow-sm"
                      >
                        {editingPromotion ? t('save_changes') : t('promotion_save')}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={20} className="text-primary" />
                  <span className="font-bold text-gray-900 dark:text-white">{t('general_promotions')}</span>
                </div>
              </div>
              <form onSubmit={handleAddGeneral} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">{t('promotion_start_date')}</label>
                    <input
                      type="date"
                      value={generalForm.startDate}
                      onChange={(e) => setGeneralForm({ ...generalForm, startDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">{t('promotion_end_date')}</label>
                    <input
                      type="date"
                      value={generalForm.endDate}
                      onChange={(e) => setGeneralForm({ ...generalForm, endDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">{t('promotion_discount')}</label>
                    <input
                      type="number"
                      value={generalForm.discount}
                      onChange={(e) => setGeneralForm({ ...generalForm, discount: Number(e.target.value) })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">{t('promotion_branch')}</label>
                    <select
                      value={generalForm.branch}
                      onChange={(e) => setGeneralForm({ ...generalForm, branch: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="تجريبي">تجريبي</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white px-8 py-2 rounded-lg hover:bg-primary/90 transition-all font-bold shadow-sm"
                  >
                    {t('promotion_save')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
