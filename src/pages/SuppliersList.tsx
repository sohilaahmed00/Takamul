import React, { useState, useEffect, useCallback } from "react";
import { Users, Search, Edit2, Trash2, Plus, X, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { Button } from "@/components/ui/button";
import { useGetSupplierById } from "@/features/suppliers/hooks/useGetSupplierById";
import AddParnterModal from "@/components/modals/AddParnterModal";

// ===================== TYPES =====================
interface Supplier {
  id: number;
  supplierCode?: string | null;
  supplierName: string;
  email: string;
  phone: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxNumber?: string;
  paymentTerms?: number;
  isActive?: boolean;
}

// ===================== API =====================
const BASE_URL = "http://takamulerp.runasp.net/api/Suppliers";
const API = {
  getAll: BASE_URL,
  create: BASE_URL,
  update: (id: number) => `${BASE_URL}/${id}`,
  delete: (id: number) => `${BASE_URL}/${id}`,
};

const emptyForm = {
  supplierName: "",
  email: "",
  phone: "",
  mobile: "",
  taxNumber: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  paymentTerms: "30",
};

// ===================== COMPONENT =====================
export default function SuppliersList() {
  const { t, direction } = useLanguage();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { data, refetch, isFetching } = useGetAllSuppliers();
  const { data: supplierData } = useGetSupplierById(selectedSupplier);
const confirmDelete = async () => {
  if (supplierToDelete === null) return;

  try {
    setDeleteLoading(true);

    const res = await fetch(API.delete(supplierToDelete), {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    setSupplierToDelete(null);
    fetchSuppliers();
    refetch();
  } catch (err: any) {
    setError("فشل حذف المورد: " + err.message);
  } finally {
    setDeleteLoading(false);
  }
};
  // ===================== FETCH =====================
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API.getAll);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const data: Supplier[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.items) ? raw.items : raw?.id ? [raw] : [];
      setSuppliers(data);
    } catch (err: any) {
      setError("فشل تحميل البيانات: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // ===================== DERIVED =====================
  const filteredSuppliers = data?.filter((s) => (s.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || (s.phone || "").includes(searchTerm) || (s.taxNumber || "").includes(searchTerm));
  //   const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / entriesPerPage));

  // ===================== RENDER =====================
  return (
    <div className="p-4 space-y-4" dir={direction}>
      <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-medium">{t("suppliers")}</span>
      </div>

      <div className="bg-white p-4 rounded-lg   ">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Users size={20} className="text-[var(--primary)]" />
            {t("suppliers")}
          </h1>
          <div className="flex gap-2">
            <button onClick={() => refetch()} className="p-2 border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-gray-50 transition-colors" title="تحديث">
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            </button>
            <Button onClick={() => setIsModalOpen(true)} variant="default" size={"xl"}>
              <Plus size={20} />
              {t("add_supplier")}
            </Button>
          </div>

          {/* <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus size={20} />
            {t("add_customer")}
          </button> */}
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("customize_report_below")}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg    p-4 min-h-100">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t("search_placeholder") || "البحث برقم الهاتف، الكود، أو الاسم..."}
                className="w-full bg-[#f8fafc] border border-transparent hover:border-gray-200 focus:border-primary focus:bg-white text-gray-700 text-sm rounded-xl py-3 pr-11 pl-4 transition-all outline-none"
              />{" "}
            </div>

            {/* <div className="flex gap-3 shrink-0">
              <button className="flex items-center gap-2 bg-[#f8fafc] hover:bg-gray-100 text-gray-600 border border-transparent text-sm font-medium rounded-xl px-4 py-3 transition-colors">
                <SlidersHorizontal size={16} className="text-gray-400" />
                <span>{t("filters") || "الفلاتر"}</span>
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>

              <button className="flex items-center gap-2 bg-[#f8fafc] hover:bg-gray-100 text-gray-600 border border-transparent text-sm font-medium rounded-xl px-4 py-3 transition-colors">
                <span>{t("recent_customers") || "أحدث العملاء"}</span>
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
            </div> */}
          </div>
          {/* Table - Desktop */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <DataTable responsiveLayout="stack" className="custom-green-table custom-compact-table" value={filteredSuppliers} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage(e.page! + 1 )} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
              {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}

              <Column field="supplierCode" body={(supplier) => <span className="">{supplier.supplierCode ? supplier?.supplierCode : "-"}</span>} header={t("code")} sortable />

              <Column
                header={t("name")}
                sortable
                body={(supplier) => (
                  <div className="cell-data-stack">
                    {" "}
                    <span className="customer-name-main">{supplier.supplierName}</span>
                  </div>
                )}
              />

              <Column field="phone" header={t("phone")} />
              <Column field="taxNumber" header={t("tax_number")} />

              <Column
                header={t("actions")}
                body={(supplier) => (
                  <>
                    <button
                      onClick={async () => {
                        setSelectedSupplier(supplier?.id);
                        setIsModalOpen(true);
                      }}
                      className="btn-minimal-action btn-compact-action"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        // const res = await deleteCustomer(customer?.id);
                        // console.log(res);
                        // notifySuccess(res);
                      }}
                      className="btn-minimal-action btn-compact-action"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>

      {/* <div className="bg-[var(--bg-card)] rounded-b-2xl shadow-sm border border-[var(--border)] p-4 min-h-[400px]">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                            <span>{t('show')}</span>
                            <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="border border-[var(--border)] bg-[var(--input-bg)] rounded-lg px-3 py-1.5 outline-none focus:border-[var(--primary)] transition-all">
                                <option value={10}>10</option><option value={25}>25</option>
                                <option value={50}>50</option><option value={100}>100</option>
                            </select>
                        </div>
                        <div className="relative w-full md:w-80">
                            <input type="text" placeholder={t('search_placeholder')} value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className={`w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--primary)] transition-all ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`} />
                            <Search className={`absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] ${direction === 'rtl' ? 'right-3' : 'left-3'}`} size={18} />
                        </div>
                    </div>

                    {loading && <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent" /></div>}

                    {!loading && (
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
                            <table className="takamol-table">
                                <thead>
                                    <tr>
                                        <th className="w-10"><input type="checkbox" className="rounded w-4 h-4 accent-white" checked={paginatedSuppliers.length > 0 && selectedSuppliers.length === paginatedSuppliers.length} onChange={toggleSelectAll} /></th>
                                        <th>{t('name')}</th>
                                        <th>{t('email_address')}</th>
                                        <th>{t('phone')}</th>
                                        <th>موبايل</th>
                                        <th>{t('tax_number')}</th>
                                        <th>المدينة</th>
                                        <th className="w-24 text-center">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSuppliers.length === 0 ? (
                                        <tr><td colSpan={8} className="p-8 text-center text-[var(--text-muted)] italic">{t('no_data_in_table')}</td></tr>
                                    ) : paginatedSuppliers.map((s) => (
                                        <tr key={s.id}>
                                            <td className="text-center"><input type="checkbox" checked={selectedSuppliers.includes(s.id)} onChange={() => toggleSelect(s.id)} className="w-4 h-4 accent-[var(--primary)]" /></td>
                                            <td className="font-bold text-[var(--text-main)]">{s.supplierName}</td>
                                            <td className="text-blue-600">{s.email || '-'}</td>
                                            <td>{s.phone || '-'}</td>
                                            <td>{s.mobile || '-'}</td>
                                            <td>{s.taxNumber || '-'}</td>
                                            <td>{s.city || '-'}</td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEdit(s)} className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all" title={t('edit')}><Edit2 size={16} /></button>
                                                    <button onClick={() => setSupplierToDelete(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all" title={t('delete')}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && (
                        <div className="md:hidden space-y-4">
                            {paginatedSuppliers.length === 0 ? (
                                <div className="p-8 text-center text-[var(--text-muted)] italic bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">{t('no_data_in_table')}</div>
                            ) : paginatedSuppliers.map((s) => (
                                <MobileDataCard key={s.id} title={s.supplierName}
                                    fields={[
                                        { label: t('email_address'), value: s.email || '-' },
                                        { label: t('phone'), value: s.phone || '-' },
                                        { label: 'موبايل', value: s.mobile || '-' },
                                        { label: t('tax_number'), value: s.taxNumber || '-' },
                                        { label: 'المدينة', value: s.city || '-' },
                                    ]}
                                    actions={
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button onClick={() => openEdit(s)} className="btn-secondary !px-3 !py-1.5 !text-xs"><Edit2 size={14} />{t('edit')}</button>
                                            <button onClick={() => setSupplierToDelete(s.id)} className="btn-danger !px-3 !py-1.5 !text-xs"><Trash2 size={14} />{t('delete')}</button>
                                        </div>
                                    }
                                />
                            ))}
                        </div>
                    )}

                    <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSuppliers.length} itemsPerPage={entriesPerPage} onPageChange={setCurrentPage} />
                </div>
            </div> */}

      {/* ADD / EDIT MODAL */}
      <AddParnterModal
        partner={supplierData}
        isOpen={isModalOpen}
        type={"supplier"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(undefined);
        }}
      />

      {/* DELETE MODAL */}
      {supplierToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSupplierToDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={30} />
            </div>
            <h2 className="text-xl font-bold mb-2">هل أنت متأكد من الحذف؟</h2>
            <p className="text-gray-500 mb-1 text-sm font-bold">{suppliers.find((s) => s.id === supplierToDelete)?.supplierName}</p>
            <p className="text-gray-400 mb-6 text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
            <div className="flex gap-3">
              <button onClick={() => setSupplierToDelete(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">
                إلغاء
              </button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
                {deleteLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
