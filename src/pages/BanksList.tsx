import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useBanks } from "@/context/BanksContext";
import { Edit2, Trash2, Search, Plus, Building2 } from "lucide-react";
import EditBankModal from "@/components/modals/EditBankModal";
import AddBankModal from "@/components/modals/AddBankModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import MobileDataCard from "@/components/MobileDataCard";
import type { Bank } from "@/types";

export default function BanksList() {
  const { t, direction } = useLanguage();
  const { banks, addBank, updateBank, deleteBank } = useBanks();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const filteredBanks = banks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()) || bank.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsEditModalOpen(true);
  };

  const handleDelete = (bank: Bank) => {
    setSelectedBank(bank);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBank) {
      deleteBank(selectedBank.id);
      setIsDeleteModalOpen(false);
      setSelectedBank(null);
    }
  };

  const handleSaveEdit = (id: string, updatedBank: Partial<Bank>) => {
    updateBank(id, updatedBank);
  };

  const handleAddBank = (newBank: Omit<Bank, "id" | "currentBalance">) => {
    addBank(newBank);
  };

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">{t("banks")}</span>
      </div>

      {/* Page Header */}
      <div className="bg-[var(--bg-card)] p-4 rounded-t-2xl border border-[var(--border)] border-b-0 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Building2 size={20} className="text-[var(--primary)]" />
            {t("banks")}
          </h1>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus size={20} />
            {t("add_bank")}
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBank(null);
        }}
        onConfirm={confirmDelete}
        itemName={selectedBank?.name}
      />

      {/* Table Container */}
      <div className="bg-[var(--bg-card)] rounded-b-2xl shadow-sm border border-[var(--border)] p-4 min-h-[400px]">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
              <span>{t("show")}</span>
              <select className="border border-[var(--border)] bg-[var(--input-bg)] rounded-lg px-3 py-1.5 outline-none focus:border-[var(--primary)] transition-all">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <input type="text" placeholder={t("search_placeholder")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--primary)] transition-all ${direction === "rtl" ? "pr-10" : "pl-10"}`} />
              <Search className={`absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] ${direction === "rtl" ? "right-3" : "left-3"}`} size={18} />
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="takamol-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox" className="rounded w-4 h-4 accent-white" />
                  </th>
                  <th>{t("bank_code")}</th>
                  <th>{t("bank_name")}</th>
                  <th>{t("bank_opening_balance")}</th>
                  <th>{t("current_balance")}</th>
                  <th className="w-24 text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--text-muted)] italic">
                      {t("no_data_in_table")}
                    </td>
                  </tr>
                ) : (
                  filteredBanks.map((bank) => (
                    <tr key={`desktop-${bank.id}`}>
                      <td className="text-center">
                        <input type="checkbox" className="w-4 h-4 accent-[var(--primary)]" />
                      </td>
                      <td className="font-mono text-xs">{bank.code}</td>
                      <td className="font-bold text-[var(--text-main)]">{bank.name}</td>
                      <td>{bank.openingBalance}</td>
                      <td className="font-bold text-[var(--text-main)]">{bank.currentBalance}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(bank)} className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all" title={t("edit")}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(bank)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title={t("delete")}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredBanks.map((bank) => (
              <MobileDataCard
                key={`mobile-${bank.id}`}
                title={bank.name}
                subtitle={bank.code}
                fields={[
                  { label: t("bank_opening_balance"), value: bank.openingBalance },
                  { label: t("current_balance"), value: bank.currentBalance, isBold: true },
                ]}
                actions={
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(bank)} className="btn-secondary flex-1 !text-xs">
                      <Edit2 size={14} />
                      {t("edit")}
                    </button>
                    <button onClick={() => handleDelete(bank)} className="btn-danger flex-1 !text-xs">
                      <Trash2 size={14} />
                      {t("delete")}
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>

      <AddBankModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddBank} />

      <EditBankModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBank(null);
        }}
        bank={selectedBank}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
