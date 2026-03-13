import React, { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Customer {
  id: number; // DB id
  customerCode?: number; // API display code
  code?: string; // legacy display code
  customerName: string;
  name?: string; // legacy alias

  email?: string;
  phone?: string;
  mobile?: string;

  address: string;
  city: string;
  state: string;
  postalCode?: string;
  taxNumber?: string;

  isActive: boolean;
  createdAt?: string;

  // UI-only / legacy fields
  pricingGroup?: string;
  customerGroup?: string;
  actualBalance?: number;
  totalPoints?: number;
  commercialRegister?: string;
  creditLimit?: number;
  stopSellingOverdue?: boolean;
  isTaxable?: boolean;
}

type ApiResult = { ok: boolean; message?: string };

interface CustomersContextType {
  customers: Customer[];
  loading: boolean;
  reload: () => Promise<void>;

  addCustomer: (
    payload: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>
  ) => Promise<ApiResult>;

  deleteCustomer: (id: number) => Promise<ApiResult>;
  updateCustomer: (id: number, updates: Partial<Customer>) => Promise<ApiResult>;

  getCustomerById: (id: number) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const normalizeCustomer = (c: Partial<Customer> & Record<string, any>): Customer => {
    const id = Number(c?.id ?? 0);
    const customerCode = Number(c?.customerCode ?? 0);
    const customerName = String(c?.customerName ?? c?.name ?? '');
    const code =
      c?.code?.toString?.() ??
      (customerCode ? String(customerCode) : id ? String(id) : '');

    return {
      id,
      customerCode,
      code,
      customerName,
      name: customerName,

      email: c?.email ? String(c.email) : '',
      phone: c?.phone ? String(c.phone) : '',
      mobile: c?.mobile ? String(c.mobile) : '',

      address: String(c?.address ?? ''),
      city: String(c?.city ?? ''),
      state: String(c?.state ?? ''),
      postalCode: c?.postalCode ? String(c.postalCode) : '',
      taxNumber: c?.taxNumber ? String(c.taxNumber) : '',

      isActive: Boolean(c?.isActive ?? true),
      createdAt: c?.createdAt ? String(c.createdAt) : '',

      pricingGroup: c?.pricingGroup ?? 'عام',
      customerGroup: c?.customerGroup ?? 'عام',
      actualBalance: Number(c?.actualBalance ?? 0),
      totalPoints: Number(c?.totalPoints ?? 0),
      commercialRegister: c?.commercialRegister ? String(c.commercialRegister) : '',
      creditLimit: Number(c?.creditLimit ?? 0),
      stopSellingOverdue: Boolean(c?.stopSellingOverdue ?? false),
      isTaxable: Boolean(c?.isTaxable ?? !!c?.taxNumber),
    };
  };

  const saveLocalBackup = (list: Customer[]) => {
    try {
      localStorage.setItem('takamul_customers', JSON.stringify(list));
    } catch {}
  };

  const loadLocalBackup = (): Customer[] => {
    try {
      const saved = localStorage.getItem('takamul_customers');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeCustomer) : [];
    } catch {
      return [];
    }
  };

  const reload = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/Customer`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        console.warn('Failed to fetch customers. status:', res.status);
        const localData = loadLocalBackup();
        setCustomers(localData);
        return;
      }

      const data = await res.json();
      const normalized = Array.isArray(data) ? data.map(normalizeCustomer) : [];
      setCustomers(normalized);
      saveLocalBackup(normalized);
    } catch (e) {
      console.error('Error fetching customers', e);
      const localData = loadLocalBackup();
      setCustomers(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localData = loadLocalBackup();
    if (localData.length) {
      setCustomers(localData);
    } else {
      setCustomers([
        normalizeCustomer({
          id: 1,
          code: '1',
          customerCode: 1,
          customerName: 'عميل افتراضي',
          name: 'عميل افتراضي',
          email: 'info@posit.sa',
          phone: '00',
          mobile: '00',
          pricingGroup: 'عام',
          customerGroup: 'عام',
          taxNumber: '',
          actualBalance: 0,
          totalPoints: 0,
          address: '',
          city: '',
          state: '',
          postalCode: '',
          isActive: true,
        }),
      ]);
    }

    reload();
  }, []);

  useEffect(() => {
    saveLocalBackup(customers);
  }, [customers]);

  const getCustomerById = (id: number) => customers.find((c) => c.id === id);

  const addCustomer = async (
    payload: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>
  ): Promise<ApiResult> => {
    try {
      const normalizedInput = normalizeCustomer({
        ...payload,
        id: 0,
        customerName: payload.customerName ?? payload.name ?? '',
        name: payload.name ?? payload.customerName ?? '',
      });

      const body = {
        customerName: normalizedInput.customerName.trim(),
        email: normalizedInput.email?.trim() ?? '',
        phone: normalizedInput.phone?.trim() ?? '',
        mobile:
          normalizedInput.mobile?.trim() ??
          normalizedInput.phone?.trim() ??
          '',
        address: normalizedInput.address?.trim() ?? '',
        city: normalizedInput.city?.trim() ?? '',
        state: normalizedInput.state?.trim() ?? '',
        postalCode: normalizedInput.postalCode?.trim() ?? '',
        taxNumber: normalizedInput.taxNumber?.trim() ?? '',
        isActive: normalizedInput.isActive ?? true,
      };

      const res = await fetch(`${API_BASE}/api/Customer`, {
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

  const deleteCustomer = async (id: number): Promise<ApiResult> => {
    try {
      const cid = Number(id);
      if (!Number.isFinite(cid) || cid <= 0) {
        return { ok: false, message: 'id غير صحيح' };
      }

      const res = await fetch(`${API_BASE}/api/Customer/${cid}`, {
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

  const updateCustomer = async (
    id: number,
    updates: Partial<Customer>
  ): Promise<ApiResult> => {
    try {
      const current = getCustomerById(id);
      if (!current) return { ok: false, message: 'العميل غير موجود في القائمة' };

      const merged = normalizeCustomer({
        ...current,
        ...updates,
        customerName:
          updates.customerName ?? updates.name ?? current.customerName ?? current.name,
      });

      const body = {
        customerName: String((merged.customerName ?? '').trim()),
        email: String((merged.email ?? '').trim()),
        phone: String((merged.phone ?? '').trim()),
        mobile: String((merged.mobile ?? merged.phone ?? '').trim()),
        address: String((merged.address ?? '').trim()),
        city: String((merged.city ?? '').trim()),
        state: String((merged.state ?? '').trim()),
        postalCode: String((merged.postalCode ?? '').trim()),
        taxNumber: String((merged.taxNumber ?? '').trim()),
        isActive: merged.isActive ?? true,
      };

      const res = await fetch(`${API_BASE}/api/Customer/${id}`, {
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

  return (
    <CustomersContext.Provider
      value={{
        customers,
        loading,
        reload,
        addCustomer,
        deleteCustomer,
        updateCustomer,
        getCustomerById,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => {
  const ctx = useContext(CustomersContext);
  if (!ctx) {
    throw new Error('useCustomers must be used within CustomersProvider');
  }
  return ctx;
};