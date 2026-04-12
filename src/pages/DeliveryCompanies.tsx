import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDeliveryCompanies } from '../context/DeliveryCompaniesContext';
import { Plus, Trash2, Edit2, X, ChevronRight, ChevronLeft, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileDataCard from '../components/MobileDataCard';

import { Input } from "@/components/ui/input";

const DeliveryCompanies: React.FC = () => {
  const { t, direction } = useLanguage();
  const { deliveryCompanies, addDeliveryCompany, updateDeliveryCompany, deleteDeliveryCompany } = useDeliveryCompanies();

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '' });

  const handleOpenModal = (company?: any) => {
    if (company) {
      setEditingCompany(company.id);
      setForm({ name: company.name });
    } else {
      setEditingCompany(null);
      setForm({ name: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      updateDeliveryCompany({ ...form, id: editingCompany });
    } else {
      addDeliveryCompany(form);
    }
    setShowModal(false);
  };

  const filteredCompanies = deliveryCompanies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6" dir={direction}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('delivery_companies')}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
        >
          <Plus size={18} />
          {t('add_delivery_company')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm"
      >
        <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-main)]">{t('delivery_companies')}</span>
          </div>
          <div className="text-sm text-[var(--text-muted)] italic">
            الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">اظهار</span>
              <select className="bg-[var(--input-bg)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text-main)]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="relative flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">بحث</span>
              <div className="relative">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64 text-[var(--text-main)]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="p-3 border border-white/10 text-center">{t('actions')}</th>
                  <th className="p-3 border border-white/10">{t('name')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30">
                      {t('no_data_in_table')}
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((c) => (
                    <tr key={`desktop-${c.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-center">
                          <button 
                            onClick={() => handleOpenModal(c)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteDeliveryCompany(c.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-[var(--text-main)] font-medium">{c.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredCompanies.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30 rounded-xl">
                {t('no_data_in_table')}
              </div>
            ) : (
              filteredCompanies.map((c) => (
                <MobileDataCard
                  key={`mobile-${c.id}`}
                  title={c.name}
                  fields={[]}
                  actions={
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(c)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteDeliveryCompany(c.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="text-sm text-[var(--text-muted)]">
              عرض 1 إلى {filteredCompanies.length} من {deliveryCompanies.length} سجلات
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 text-[var(--text-main)]">
                <ChevronRight size={18} />
              </button>
              <div className="bg-[var(--primary)] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium">1</div>
              <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 text-[var(--text-main)]">
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
                <span className="font-bold text-emerald-800 text-lg">
                  {editingCompany ? t('edit_delivery_company') : t('add_delivery_company')}
                </span>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="text-sm text-emerald-800 text-right leading-relaxed font-bold">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-1.5">اسم *</label>
                    <Input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 border border-blue-400 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none text-right transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-800 text-white px-8 py-3 rounded-xl hover:bg-emerald-900 transition-all font-bold shadow-lg shadow-emerald-100 active:scale-95"
                  >
                    {editingCompany ? t('save_changes') : 'إضافة'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryCompanies;
