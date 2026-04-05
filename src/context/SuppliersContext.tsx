import React, { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Supplier {
  id: number;
  supplierCode?: number | null;

  supplierName: string;
  name?: string; // legacy alias

  email?: string;
  phone?: string;
  mobile: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  taxNumber?: string;
  paymentTerms?: number | null;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string | null;

  // UI-only / legacy fields
  commercialRegistration?: string;
  openingBalance?: number;
}

type ApiResult = { ok: boolean; message?: string };

interface SuppliersContextType {
  suppliers: Supplier[];
  loading: boolean;
  reload: () => Promise<void>;

  addSupplier: (payload: Partial<Supplier>) => Promise<ApiResult>;
  updateSupplier: (id: number, updates: Partial<Supplier>) => Promise<ApiResult>;
  deleteSupplier: (id: number) => Promise<ApiResult>;

  getSupplierById: (id: number) => Supplier | undefined;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const API_BASE = AUTH_API_BASE || 'https://erptakamul.runasp.net';

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem('takamul_token');
    return {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const parseApiError = async (res: Response) => {
    let msg = `status ${res.status}`;
    try {
      const j = await res.json();
      if (j?.errors) {
        const lines = Object.entries(j.errors)
          .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ');
        msg = `${msg} - ${lines}`;
      } else if (j?.title) {
        msg = `${msg} - ${j.title}`;
      } else if (j?.message) {
        msg = `${msg} - ${j.message}`;
      } else {
        msg = `${msg} - ${JSON.stringify(j)}`;
      }
    } catch {
      try {
        msg = `${msg} - ${await res.text()}`;
      } catch {
        msg = `${msg} - ${res.statusText}`;
      }
    }
    return msg;
  };

  const normalizeSupplier = (s: Partial<Supplier> & Record<string, any>): Supplier => {
    const supplierName = String(s?.supplierName ?? s?.name ?? '').trim();

    return {
      id: Number(s?.id ?? 0),
      supplierCode: s?.supplierCode ?? null,

      supplierName,
      name: supplierName,

      email: s?.email ? String(s.email) : '',
      phone: s?.phone ? String(s.phone) : '',
      mobile: String(s?.mobile ?? s?.phone ?? ''),

      address: String(s?.address ?? ''),
      city: String(s?.city ?? ''),
      state: String(s?.state ?? ''),
      country: String(s?.country ?? ''),
      postalCode: String(s?.postalCode ?? ''),

      taxNumber: s?.taxNumber ? String(s.taxNumber) : '',
      paymentTerms: s?.paymentTerms ?? 30,
      isActive: Boolean(s?.isActive ?? true),

      createdAt: s?.createdAt ? String(s.createdAt) : '',
      updatedAt: s?.updatedAt ?? null,

      commercialRegistration: s?.commercialRegistration
        ? String(s.commercialRegistration)
        : '',
      openingBalance: Number(s?.openingBalance ?? 0),
    };
  };

  const saveLocalBackup = (list: Supplier[]) => {
    try {
      localStorage.setItem('takamul_suppliers', JSON.stringify(list));
    } catch {}
  };

  const loadLocalBackup = (): Supplier[] => {
    try {
      const saved = localStorage.getItem('takamul_suppliers');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeSupplier) : [];
    } catch {
      return [];
    }
  };

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Suppliers`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        console.warn('Failed to fetch suppliers. status:', res.status);
        const localData = loadLocalBackup();
        setSuppliers(localData);
        return;
      }

      const data = await res.json();
      const normalized = Array.isArray(data) ? data.map(normalizeSupplier) : [];
      setSuppliers(normalized);
      saveLocalBackup(normalized);
    } catch (e) {
      console.error('Error fetching suppliers', e);
      const localData = loadLocalBackup();
      setSuppliers(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localData = loadLocalBackup();

    if (localData.length) {
      setSuppliers(localData);
    } else {
      setSuppliers([
        normalizeSupplier({
          id: 1,
          supplierCode: 1,
          supplierName: 'مورد عام',
          name: 'مورد عام',
          email: 'general@example.com',
          phone: '966500000000',
          mobile: '966500000000',
          taxNumber: '1234567890',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          isActive: true,
          paymentTerms: 30,
          commercialRegistration: '',
          openingBalance: 0,
        }),
      ]);
    }

    reload();
  }, []);

  useEffect(() => {
    saveLocalBackup(suppliers);
  }, [suppliers]);

  const getSupplierById = (id: number) => suppliers.find((s) => s.id === id);

  const normalizePayload = (p: Partial<Supplier>) => {
    const supplierName = String(p.supplierName ?? p.name ?? '').trim();
    const mobile = String(p.mobile ?? p.phone ?? '').trim();

    const address = String(p.address ?? '').trim();
    const city = String(p.city ?? '').trim();
    const state = String(p.state ?? '').trim();
    const country = String(p.country ?? '').trim();
    const postalCode = String(p.postalCode ?? '').trim();

    return {
      supplierName,
      email: String(p.email ?? '').trim(),
      phone: String(p.phone ?? '').trim(),
      mobile,
      address,
      city,
      state,
      country,
      postalCode,
      taxNumber: String(p.taxNumber ?? '').trim(),
      paymentTerms: p.paymentTerms ?? 30,
      isActive: p.isActive ?? true,
    };
  };

  const addSupplier = async (payload: Partial<Supplier>): Promise<ApiResult> => {
    try {
      const body = normalizePayload(payload);

      const res = await fetch(`${API_BASE}/api/Suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) return { ok: false, message: await parseApiError(res) };

      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: String(e) };
    }
  };

  const updateSupplier = async (
    id: number,
    updates: Partial<Supplier>
  ): Promise<ApiResult> => {
    try {
      const current = getSupplierById(id);
      if (!current) return { ok: false, message: 'المورد غير موجود' };

      const merged = normalizeSupplier({
        ...current,
        ...updates,
        supplierName: updates.supplierName ?? updates.name ?? current.supplierName,
      });

      const body = normalizePayload(merged);

      const res = await fetch(`${API_BASE}/api/Suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) return { ok: false, message: await parseApiError(res) };

      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: String(e) };
    }
  };

  const deleteSupplier = async (id: number): Promise<ApiResult> => {
    try {
      const res = await fetch(`${API_BASE}/api/Suppliers/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!res.ok) return { ok: false, message: await parseApiError(res) };

      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: String(e) };
    }
  };

  return (
    <SuppliersContext.Provider
      value={{
        suppliers,
        loading,
        reload,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplierById,
      }}
    >
      {children}
    </SuppliersContext.Provider>
  );
};

export const useSuppliers = () => {
  const ctx = useContext(SuppliersContext);
  if (!ctx) throw new Error('useSuppliers must be used within SuppliersProvider');
  return ctx;
};