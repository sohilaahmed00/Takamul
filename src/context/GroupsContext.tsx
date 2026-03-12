import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface ModulePermissions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  extra?: Record<string, boolean>;
}

export const defaultPermissions: Record<string, ModulePermissions> = {
  products: {
    view: true,
    add: false,
    edit: false,
    delete: false,
    extra: {
      cost: false,
      price: false,
      quantity_adj: false,
      damage: false,
      barcode: false,
      branch_stock: false,
      branch_prices: false,
    },
  },
  sales: {
    view: true,
    add: false,
    edit: false,
    delete: false,
    extra: {
      email: false,
      pdf: false,
      pos: false,
      payments: false,
      returns: false,
      all_sales: false,
      reprint: false,
      close_shift: false,
      link_reps: false,
    },
  },
  shipping: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: { pdf: false },
  },
  gift_cards: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  quotes: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: { email: false, pdf: false },
  },
  purchases: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: {
      email: false,
      pdf: false,
      payments: false,
      expenses: false,
      returns: false,
    },
  },
  transfers: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: { email: false, pdf: false },
  },
  customers: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: { deposits: false, delete_deposit: false },
  },
  suppliers: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  banks: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: {
      external: false,
      add_external: false,
      internal: false,
      add_internal: false,
      edit_transfer: false,
      delete_transfer: false,
    },
  },
  reports: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: {
      reorder_alert: false,
      expiry_alert: false,
      items: false,
      daily_sales: false,
      monthly_sales: false,
      sales: false,
      payments: false,
      taxes: false,
      expenses: false,
      daily_purchases: false,
      monthly_purchases: false,
      purchases: false,
      customers: false,
      suppliers: false,
      staff: false,
      till: false,
      item_sales_invoice: false,
    },
  },
  misc: {
    view: false,
    add: false,
    edit: false,
    delete: false,
    extra: {
      bulk: false,
      edit_price_sale: false,
      add_delivery: false,
      view_profit: false,
      general_accounts: false,
      bonds: false,
    },
  },
};

export interface Group {
  id: number;
  code: string;
  name: string;
  description?: string;
  permissions: Record<string, ModulePermissions>;
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (
    name: string,
    nameSecondary?: string,
    description?: string,
    nameUr?: string,
    imageFile?: File
  ) => Promise<void>;
  updateGroup: (id: number, updates: Partial<Group>) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  duplicateGroup: (id: number) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('takamul_groups');
    return saved ? JSON.parse(saved) : [];
  });

  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  useEffect(() => {
    localStorage.setItem('takamul_groups', JSON.stringify(groups));
  }, [groups]);

  const cloneDefaultPermissions = (): Record<string, ModulePermissions> =>
    JSON.parse(JSON.stringify(defaultPermissions));

  // helper to refresh group list from server
  const loadFromApi = async () => {
    try {
      const token = localStorage.getItem('takamul_token');
      const url = `${API_BASE}/api/ProductCategories`;

      console.debug('GroupsContext.loadFromApi calling GET', url);

      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        console.warn('Failed to fetch product categories from API, status:', res.status);
        return;
      }

      const data = await res.json();
      console.debug('GroupsContext.loadFromApi received', data.length, 'items:', data);

      if (Array.isArray(data)) {
        const mapped: Group[] = data.map((c: any, idx: number) => {
          const id = Number(c?.id ?? c?.categoryId ?? idx + 1);

          const name = String(
            c?.categoryName ||
              c?.categoryNameAr ||
              c?.categoryNameEn ||
              c?.categoryNameUr ||
              c?.description ||
              ''
          );

          const description = String(c?.description ?? '');

          return {
            id,
            code: String(c?.code ?? `CAT-${String(id).padStart(3, '0')}`),
            name,
            description,
            permissions: cloneDefaultPermissions(),
          };
        });

        console.debug('GroupsContext.loadFromApi mapped to', mapped.length, 'items');
        setGroups(mapped);
      } else {
        console.warn('loadFromApi: response not array', data);
      }
    } catch (err) {
      console.error('Error loading product categories from API', err);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const addGroup = async (
    name: string,
    nameSecondary?: string,
    description?: string,
    nameUr?: string,
    imageFile?: File
  ) => {
    const token = localStorage.getItem('takamul_token');
    const form = new FormData();

    form.append('CategoryNameAr', name || '');
    form.append('CategoryNameEn', nameSecondary || name);
    form.append('CategoryNameUr', nameUr || nameSecondary || name);
    form.append('Description', description || '');
    form.append('parentCategoryId', '0');
    form.append('IsActive', '1');

    if (imageFile) {
      form.append('ImageUrl', imageFile);
    } else {
      form.append('ImageUrl', new Blob(), 'image.png');
    }

    const url = `${API_BASE}/api/ProductCategories/CREATE`.replace(/\/+$/, '');

    console.debug('GroupsContext.addGroup submitting form data:');
    for (const pair of form.entries()) {
      console.debug(' -', pair[0], '=', pair[1]);
    }
    console.debug('GroupsContext.addGroup additional params', {
      name,
      nameSecondary,
      nameUr,
      description,
      imageFile,
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });

    let createdItem: any = null;
    if (res.ok) {
      try {
        createdItem = await res.json();
        console.debug('addGroup API response body', createdItem);
      } catch {
        // no json response
      }
    }

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}`;
      try {
        const text = await res.text();
        console.error('addGroup API error response text', text);
        if (text) errorMsg += `: ${text}`;
      } catch (e) {
        console.error('failed reading error body', e);
      }
      throw new Error(errorMsg);
    }

    if (createdItem && typeof createdItem === 'object') {
      const id = Number(createdItem?.id ?? createdItem?.categoryId ?? Date.now());
      const nameStr = String(
        createdItem?.categoryName ||
          createdItem?.categoryNameAr ||
          createdItem?.categoryNameEn ||
          createdItem?.categoryNameUr ||
          createdItem?.description ||
          ''
      );

      setGroups((prev) => [
        ...prev,
        {
          id,
          code: String(createdItem?.code ?? `CAT-${String(id).padStart(3, '0')}`),
          name: nameStr,
          description: String(createdItem?.description ?? description ?? ''),
          permissions: cloneDefaultPermissions(),
        },
      ]);
    }

    await loadFromApi();
  };

  const updateGroup = async (id: number, updates: Partial<Group>) => {
    // حاليًا update محلي فقط لأن API update endpoint غير موجود في الكود الحالي
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              ...updates,
              permissions: updates.permissions
                ? JSON.parse(JSON.stringify(updates.permissions))
                : g.permissions,
            }
          : g
      )
    );
  };

  const deleteGroup = async (id: number) => {
    const token = localStorage.getItem('takamul_token');
    const url = `${API_BASE}/api/ProductCategories/${id}`;

    console.debug('deleteGroup calling DELETE', url);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.debug('deleteGroup response status:', res.status, res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      const errorMsg = `HTTP ${res.status}: ${errorText}`;
      console.error('deleteGroup failed:', errorMsg);
      throw new Error(errorMsg);
    }

    console.debug('deleteGroup succeeded for id:', id);
    await loadFromApi();
  };

  const duplicateGroup = async (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (!group) throw new Error('Group not found');

    await addGroup(
      `${group.name} (نسخة)`,
      `${group.name} (Copy)`,
      group.description || '',
      `${group.name} (نسخة)`,
      undefined
    );

    // بعد الإضافة من الـ API، نحدّث آخر عنصر محليًا بالصلاحيات المنسوخة إن احتجت استخدامها داخل الواجهة
    setGroups((prev) => {
      if (prev.length === 0) return prev;

      const copiedPermissions = JSON.parse(JSON.stringify(group.permissions));
      const lastIndex = prev.length - 1;

      return prev.map((item, index) =>
        index === lastIndex
          ? {
              ...item,
              permissions: copiedPermissions,
              description: group.description || '',
            }
          : item
      );
    });
  };

  return (
    <GroupsContext.Provider
      value={{ groups, addGroup, updateGroup, deleteGroup, duplicateGroup }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};