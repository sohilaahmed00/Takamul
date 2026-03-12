import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Edit, 
  Trash2, 
  Link as LinkIcon,
  Plus,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useExpenses } from '@/context/ExpensesContext';
import AddExpenseModal from '@/components/AddExpenseModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import MobileDataCard from '@/components/MobileDataCard';
import { Expense } from '@/types';

export default function Expenses() {
  const { t, direction } = useLanguage();
  const { expenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExpenseToDelete(id);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  const filteredExpenses = expenses.filter(expense => 
    expense.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-main)]">{t('expenses_list')}</h1>
            <p className="text-sm text-[var(--text-muted)]">{t('products_table_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors shadow-sm font-bold"
          >
            <Plus size={20} />
            <span>{t('add_expense')}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">{t('show')}</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-[var(--bg-main)] border border-[var(--border)] rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-[var(--text-muted)]">{t('records')}</span>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="takamol-table">
            <thead>
              <tr>
                <th className="w-12">
                  <input type="checkbox" className="rounded border-white/20 text-[var(--primary)] focus:ring-[var(--primary)]" />
                </th>
                <th>{t('date')}</th>
                <th>{t('ref_no')}</th>
                <th>{t('expense_categories')}</th>
                <th>{t('paid')}</th>
                <th>{t('description')}</th>
                <th>{t('data_entry')}</th>
                <th className="text-center">
                   <LinkIcon size={16} className="mx-auto" />
                </th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={`desktop-${expense.id}`} className="hover:bg-[var(--table-row-hover)] transition-colors group">
                    <td className="p-4 text-sm">
                      <input type="checkbox" className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">{expense.date}</td>
                    <td className="p-4 text-sm font-medium text-[var(--primary)]">{expense.reference}</td>
                    <td className="p-4 text-sm">{expense.category}</td>
                    <td className="p-4 text-sm font-bold">{(expense.amount || 0).toFixed(2)}</td>
                    <td className="p-4 text-sm max-w-xs truncate">{expense.description}</td>
                    <td className="p-4 text-sm">{expense.createdBy}</td>
                    <td className="p-4 text-sm text-center">
                      {expense.hasAttachment && (
                        <LinkIcon size={16} className="mx-auto text-[var(--primary)] cursor-pointer hover:text-[var(--primary-hover)]" />
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(expense)}
                          className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors" 
                          title={t('edit')}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors" 
                          title={t('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="opacity-20" />
                      <p>{t('no_data_in_table')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {filteredExpenses.map((expense) => (
            <MobileDataCard
              key={`mobile-${expense.id}`}
              title={expense.reference}
              subtitle={expense.date}
              fields={[
                { label: t('expense_categories'), value: expense.category },
                { label: t('paid'), value: (expense.amount || 0).toFixed(2), isBold: true },
                { label: t('description'), value: expense.description },
                { label: t('data_entry'), value: expense.createdBy },
              ]}
              actions={
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              }
            />
          ))}
          {filteredExpenses.length === 0 && (
            <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">
              <div className="flex flex-col items-center gap-2">
                <FileText size={48} className="opacity-20" />
                <p>{t('no_data_in_table')}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            {t('showing_records')} 1 {t('to')} {filteredExpenses.length} {t('of')} {filteredExpenses.length} {t('records')}
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors">
              {direction === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg text-sm font-bold">
              1
            </button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors">
              {direction === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }} 
        expense={selectedExpense}
      />

      <DeleteConfirmationModal
        isOpen={expenseToDelete !== null}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={confirmDelete}
        itemName={expenses.find(e => e.id === expenseToDelete)?.category}
      />
    </div>
  );
}
