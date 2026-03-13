import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCustomerGroups, CustomerGroup } from '@/context/CustomerGroupsContext';
import CustomerGroupsModal from '@/components/CustomerGroupsModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerGroups = () => {
  const { t, direction } = useLanguage();
  const { groups, addGroup, updateGroup, deleteGroup } = useCustomerGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEdit = (group: CustomerGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleSave = (groupData: Omit<CustomerGroup, 'id'>) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 takamol-card p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('customer_groups')}</h1>
            <p className="text-sm text-[var(--text-muted)]">{t('customer_groups_table_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              <LinkIcon size={20} />
           </button>
           <button 
            onClick={handleAdd}
            className="btn-primary"
          >
            <Plus size={20} />
            {t('add_customer_group')}
          </button>
        </div>
      </div>

      {/* Table/Cards Section */}
      <div className="takamol-card overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">{t('show')}</span>
            <select className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-sm text-[var(--text-muted)]">{t('records')}</span>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pr-10 pl-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="takamol-table w-full text-right">
            <thead>
              <tr>
                <th className="px-6 py-4 font-bold text-sm border border-[var(--table-header-border)]">{t('name')}</th>
                <th className="px-6 py-4 font-bold text-sm border border-[var(--table-header-border)]">{t('percentage')}</th>
                <th className="px-6 py-4 font-bold text-sm border border-[var(--table-header-border)] text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {currentGroups.map((group) => (
                  <motion.tr 
                    key={`desktop-${group.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)] border-x border-[var(--border)]">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)] border-x border-[var(--border)]">
                      {group.percentage}
                    </td>
                    <td className="px-6 py-4 border-x border-[var(--border)]">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(group)}
                          className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteGroup(group.id)}
                          className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden p-4 space-y-4">
          {currentGroups.map((group) => (
            <div key={`mobile-${group.id}`} className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[var(--text-main)]">{group.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{t('percentage')}: {group.percentage}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(group)}
                    className="p-2 text-[var(--primary)] bg-[var(--bg-card)] rounded-lg shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteGroup(group.id)}
                    className="p-2 text-[var(--primary)] bg-[var(--bg-card)] rounded-lg shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            {t('showing_records')} {startIndex + 1} {t('to')} {Math.min(startIndex + itemsPerPage, filteredGroups.length)} {t('of')} {filteredGroups.length} {t('records')}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-50 hover:bg-[var(--table-row-hover)] transition-colors text-[var(--text-main)]"
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    currentPage === i + 1 
                      ? "bg-[var(--primary)] text-white shadow-md" 
                      : "hover:bg-[var(--table-row-hover)] text-[var(--text-muted)]"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-50 hover:bg-[var(--table-row-hover)] transition-colors text-[var(--text-main)]"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>

      <CustomerGroupsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingGroup}
      />
    </div>
  );
};

export default CustomerGroups;
