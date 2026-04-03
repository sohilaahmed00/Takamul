import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Download,
  Upload,
  Calendar,
  Building,
  User,
  CheckCircle2,
  FileText,
  UserPlus,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSuppliers } from "@/context/SuppliersContext";
import AddSupplierModal from "@/components/modals/AddSupplierModal";
import { motion, AnimatePresence } from "framer-motion";

export default function AddPurchaseCSV() {
  const { t, direction } = useLanguage();
  const { suppliers } = useSuppliers();

  const csvInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    date:
      new Date().toISOString().split("T")[0] +
      " " +
      new Date().toLocaleTimeString("en-GB"),
    reference: "",
    branch: t("demo_branch"),
    status: "received",
    supplier: "",
    supplierName: "",
    csvFile: null as File | null,
    documents: null as File | null,
    moreOptions: false,
    notes: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSupplierDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.phone.includes(supplierSearch)
  );

  const handleSupplierSelect = (id: number, name: string) => {
    setFormData({ ...formData, supplier: id.toString(), supplierName: name });
    setSupplierSearch(name);
    setIsSupplierDropdownOpen(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "csvFile" | "documents"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t("operation_completed_successfully"));
  };

  return (
    <div
      className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      dir={direction}
    >
      <div className="flex items-center justify-between bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Plus size={24} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">
            {t("add_purchase_csv")}
          </h1>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden p-6">
        <p className="text-sm text-[var(--text-muted)] mb-8">
          {t("please_enter_info_below")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("date")} *
              </label>
              <div className="relative">
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.date}
                  readOnly
                  className="w-full pr-10 pl-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("ref_no")}
              </label>
              <div className="relative">
                <FileText
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  className="w-full pr-10 pl-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("branch")} *
              </label>
              <div className="relative">
                <Building
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                  size={18}
                />
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full pr-10 pl-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                >
                  <option value={t("demo_branch")}>{t("demo_branch")}</option>
                  <option value={t("main_branch")}>{t("main_branch")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("status")} *
              </label>
              <div className="relative">
                <CheckCircle2
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                  size={18}
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full pr-10 pl-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                >
                  <option value="received">{t("received")}</option>
                  <option value="pending">{t("pending")}</option>
                  <option value="ordered">{t("ordered")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("supplier")} *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(true)}
                  className="p-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors flex items-center justify-center min-w-[46px]"
                >
                  <UserPlus size={20} />
                </button>

                <div className="relative flex-1" ref={dropdownRef}>
                  <User
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder={t("choose_supplier")}
                    value={supplierSearch}
                    onChange={(e) => {
                      setSupplierSearch(e.target.value);
                      setIsSupplierDropdownOpen(true);
                      if (e.target.value === "") {
                        setFormData({ ...formData, supplier: "", supplierName: "" });
                      }
                    }}
                    onFocus={() => setIsSupplierDropdownOpen(true)}
                    className="w-full pr-10 pl-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />

                  <AnimatePresence>
                    {isSupplierDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-xl max-h-60 overflow-y-auto"
                      >
                        {filteredSuppliers.length > 0 ? (
                          filteredSuppliers.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleSupplierSelect(s.id, s.name)}
                              className="w-full text-right px-4 py-2 text-sm hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                            >
                              <span className="font-medium group-hover:text-emerald-700">
                                {s.name}
                              </span>
                              <span className="text-xs text-gray-400">{s.phone}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            {t("no_results_found")}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800 space-y-3">
            <div className="flex items-center gap-4 justify-between">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
              >
                <Download size={16} />
                <span>{t("download_sample_file")}</span>
              </button>

              <p className="text-right leading-relaxed flex-1">
                {t("csv_import_instructions")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("csv_file")} *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => csvInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
                >
                  <Upload size={16} />
                  <span>{t("browse")}</span>
                </button>
                <input
                  type="file"
                  ref={csvInputRef}
                  onChange={(e) => handleFileChange(e, "csvFile")}
                  className="hidden"
                  accept=".csv"
                />
                <div className="flex-1 p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] truncate min-h-[42px]">
                  {formData.csvFile ? formData.csvFile.name : ""}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                {t("attach_documents")}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
                >
                  <Upload size={16} />
                  <span>{t("browse")}</span>
                </button>
                <input
                  type="file"
                  ref={docInputRef}
                  onChange={(e) => handleFileChange(e, "documents")}
                  className="hidden"
                />
                <div className="flex-1 p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] truncate min-h-[42px]">
                  {formData.documents ? formData.documents.name : ""}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)]">
                {t("notes")}
              </label>
              <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                <div className="bg-[var(--bg-main)] p-2 border-b border-[var(--border)] flex flex-wrap gap-4 text-sm text-gray-600">
                  <button type="button" className="hover:text-emerald-600">B</button>
                  <button type="button" className="hover:text-emerald-600 italic">I</button>
                  <button type="button" className="hover:text-emerald-600 underline">U</button>
                  <button type="button" className="hover:text-emerald-600">List</button>
                  <button type="button" className="hover:text-emerald-600">Link</button>
                  <button type="button" className="hover:text-emerald-600">
                    {"</>"}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full p-4 bg-white text-black outline-none resize-none min-h-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 size={20} />
              <span>{t("complete_process")}</span>
            </button>
          </div>
        </form>
      </div>

      <AddSupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
      />
    </div>
  );
}