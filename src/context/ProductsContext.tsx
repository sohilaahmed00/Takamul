import React, { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

type ApiResult<T = any> = {
  ok: boolean;
  status: number;
  data?: T;
  message?: string;
};

export interface Product {
  id: number;
  image: string;
  code: string;
  name: string;
  brand: string;
  agent: string;
  category: string;
  categoryId?: number;
  cost: string;
  price: string;
  quantity: string;
  unit: string;
  unitId?: number;
  alertQuantity: string;
  description?: string;
  productType?: string;
  parentProductId?: number;
  nameAr?: string;
  nameEn?: string;
  nameUr?: string;
}

export interface ProductCategoryOption {
  id: number;
  name: string;
}

export interface UnitOption {
  id: number;
  name: string;
}

interface AddProductParams extends Omit<Product, 'id'> {
  nameAr?: string;
  nameEn?: string;
  nameUr?: string;
  description?: string;
  productType?: string;
}

interface UpdateProductParams {
  name?: string;
  nameAr?: string;
  nameEn?: string;
  nameUr?: string;
  code?: string;
  category?: string;
  categoryId?: number;
  unit?: string;
  unitId?: number;
  cost?: string | number;
  price?: string | number;
  quantity?: string | number;
  alertQuantity?: string | number;
  productType?: string;
  description?: string;
  parentProductId?: number;
  imageFile?: File | null;
}

const extractApiErrorMessage = (data: any) => {
  console.log('updateProduct API error response:', data);

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }

  if (typeof data?.title === 'string' && data.title.trim()) {
    return data.title.trim();
  }

  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data?.errors && typeof data.errors === 'object') {
    const lines: string[] = [];
    for (const key of Object.keys(data.errors)) {
      const arr = data.errors[key];
      if (Array.isArray(arr)) {
        for (const msg of arr) {
          if (typeof msg === 'string' && msg.trim()) lines.push(msg.trim());
        }
      }
    }
    if (lines.length) return lines.join(' | ');
  }

  return 'فشل العملية';
};

const toUserMessage = (raw?: string) => {
  if (!raw) return 'حدث خطأ، حاول مرة أخرى';

  const clean = raw.trim();
  if (clean) return clean;

  return 'حدث خطأ، حاول مرة أخرى';
};

interface ProductsContextType {
  products: Product[];
  addProduct: (product: AddProductParams) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteMultipleProducts: (ids: number[]) => Promise<void>;
  updateProduct: (id: number, updates: UpdateProductParams) => Promise<ApiResult>;
  fetchCategories: () => Promise<ProductCategoryOption[]>;
  fetchUnits: () => Promise<UnitOption[]>;
  reloadProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const normalizeProductType = (value: any): string => {
  const v = String(value ?? '').trim().toLowerCase();

  if (v === 'prepared' || v === '1') return 'prepared';
  if (v === 'branched' || v === '2') return 'branched';
  if (v === 'direct' || v === '3') return 'direct';

  return 'prepared';
};

const mapApiProduct = (p: any): Product => {
  const realId = Number(p?.id ?? p?.productId ?? 0);

  return {
    id: realId,
    image: String(p?.imageUrl ?? p?.image ?? ''),
    code: String(p?.barcode ?? p?.productCode ?? ''),
    name: String(p?.productNameAr || p?.productNameEn || p?.productNameUr || ''),
    nameAr: String(p?.productNameAr ?? ''),
    nameEn: String(p?.productNameEn ?? ''),
    nameUr: String(p?.productNameUr ?? ''),
    brand: String(p?.brand ?? ''),
    agent: String(p?.agent ?? ''),
    category: String(p?.categoryName ?? ''),
    categoryId: p?.categoryId ?? undefined,
    cost: String(p?.costPrice ?? p?.cost ?? ''),
    price: String(p?.sellingPrice ?? p?.price ?? ''),
    quantity: String(p?.quantity ?? ''),
    unit: String(p?.unitName ?? p?.unit ?? ''),
    unitId: p?.unitId ?? undefined,
    alertQuantity: String(p?.minStockLevel ?? p?.alertQuantity ?? ''),
    description: String(p?.description ?? ''),
    productType: normalizeProductType(p?.productType),
    parentProductId: Number(p?.parentProductId ?? 0),
  };
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('takamul_token');
    return {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadFromApi = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/Products`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data.map((p: any) => mapApiProduct(p)).filter((p) => p.id > 0));
      } else if (Array.isArray(data?.items)) {
        setProducts(data.items.map((p: any) => mapApiProduct(p)).filter((p: Product) => p.id > 0));
      }
    } catch (err) {
      console.error('Error loading products from API', err);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const fetchCategories = async (): Promise<ProductCategoryOption[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/ProductCategories`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) return [];

      const data = await res.json();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

      return arr
        .map((item: any, index: number) => ({
          id: Number(item?.id ?? item ?? index + 1),
          name: String(item?.categoryNameAr ?? item?.name ?? item?.productCategoryName ?? '').trim(),
        }))
        .filter((item: ProductCategoryOption) => item.name);
    } catch (err) {
      console.error('Error loading categories', err);
      return [];
    }
  };

  const fetchUnits = async (): Promise<UnitOption[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/UnitOfMeasure`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) return [];

      const data = await res.json();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

      return arr
        .map((item: any, index: number) => ({
          id: Number(item?.id ?? item?.unitId ?? index + 1),
          name: String(item?.unitName ?? item?.name ?? '').trim(),
        }))
        .filter((item: UnitOption) => item.name);
    } catch (err) {
      console.error('Error loading units', err);
      return [];
    }
  };

  const addProduct = async (product: AddProductParams) => {
    const payload: any = {
      Barcode: product.code,
      ProductNameAr: product.nameAr ?? product.name,
      ProductNameEn: product.nameEn ?? product.name,
      ProductNameUr: product.nameUr ?? product.name,
      Description: product.description ?? '',
      CategoryName: product.category || '',
      CostPrice: Number(product.cost || '0'),
      SellingPrice: Number(product.price || '0'),
      MinStockLevel: Number(product.alertQuantity || '0'),
      ParentProductId: 0,
      ProductType: normalizeProductType(product.productType),
      Image: '',
    };

    try {
      const token = localStorage.getItem('takamul_token');
      const res = await fetch(`${API_BASE}/api/Products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('Failed to add product via API, status:', res.status);
      }

      await loadFromApi();
    } catch (err) {
      console.error('Failed to add product via API', err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem('takamul_token');
      const res = await fetch(`${API_BASE}/api/Products/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!res.ok) console.error('Failed to delete product via API, status:', res.status);

      await loadFromApi();
    } catch (err) {
      console.error('Failed to delete product via API', err);
    }
  };

  const deleteMultipleProducts = async (ids: number[]) => {
    try {
      const token = localStorage.getItem('takamul_token');
      await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE}/api/Products/${id}`, {
            method: 'DELETE',
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          })
        )
      );
      await loadFromApi();
    } catch (err) {
      console.error('Failed to delete products via API', err);
    }
  };

  const urlToFile = async (url: string, fallbackName = 'current-image.jpg'): Promise<File | null> => {
    if (!url) return null;

    try {
      const res = await fetch(url);
      if (!res.ok) return null;

      const blob = await res.blob();
      const type = blob.type || 'image/jpeg';

      return new File([blob], fallbackName, { type });
    } catch (error) {
      console.error('Failed converting image url to file', error);
      return null;
    }
  };

  const updateProduct = async (id: number, updates: UpdateProductParams): Promise<ApiResult> => {
    try {
      const token = localStorage.getItem('takamul_token');
      const currentProduct = products.find((p) => p.id === id);

      if (!currentProduct) {
        return { ok: false, status: 404, message: 'الصنف غير موجود' };
      }

      const nameAr = String(updates.nameAr ?? currentProduct.nameAr ?? updates.name ?? currentProduct.name ?? '').trim();
      const nameEn = String(updates.nameEn ?? currentProduct.nameEn ?? updates.name ?? currentProduct.name ?? '').trim();
      const nameUr = String(updates.nameUr ?? currentProduct.nameUr ?? updates.name ?? currentProduct.name ?? '').trim();
      const categoryName = String(updates.category ?? currentProduct.category ?? '').trim();
      const barcode = String(updates.code ?? currentProduct.code ?? '').trim();
      const productType = normalizeProductType(updates.productType ?? currentProduct.productType ?? 'prepared');

      const sellingPrice = Number(updates.price ?? currentProduct.price ?? 0);
      const costPrice = Number(updates.cost ?? currentProduct.cost ?? 0);
      const minStockLevel = Number(updates.alertQuantity ?? currentProduct.alertQuantity ?? 0);
      const parentProductId = Number(updates.parentProductId ?? currentProduct.parentProductId ?? 0);

      if (!nameAr || !nameEn || !nameUr) {
        return { ok: false, status: 400, message: 'من فضلك اكتب اسم الصنف' };
      }

      if (!categoryName) {
        return { ok: false, status: 400, message: 'من فضلك اختر التصنيف الرئيسي' };
      }

      if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
        return { ok: false, status: 400, message: 'من فضلك اكتب سعر بيع صحيح' };
      }

      if (!Number.isFinite(costPrice) || costPrice < 0) {
        return { ok: false, status: 400, message: 'من فضلك اكتب تكلفة صحيحة' };
      }

      if (!Number.isFinite(minStockLevel) || minStockLevel < 0) {
        return { ok: false, status: 400, message: 'من فضلك اكتب حد تنبيه صحيح' };
      }

      let imageFile: File | null = updates.imageFile ?? null;

      if (!imageFile && currentProduct.image) {
        imageFile = await urlToFile(currentProduct.image);
      }

      if (!imageFile) {
        return {
          ok: false,
          status: 400,
          message: 'الصورة الحالية لا يمكن إرسالها تلقائيًا، من فضلك اختر الصورة مرة أخرى',
        };
      }

      const form = new FormData();

      form.append('Id', String(id));
      form.append('ProductNameAr', nameAr);
      form.append('ProductNameEn', nameEn);
      form.append('ProductNameUr', nameUr);
      form.append('CategoryName', categoryName);
      form.append('Barcode', barcode);
      form.append('CostPrice', String(costPrice));
      form.append('SellingPrice', String(sellingPrice));
      form.append('MinStockLevel', String(minStockLevel));
      form.append('ProductType', productType);
      form.append('ParentProductId', String(parentProductId));
      form.append('ImageUrl', imageFile);

      const res = await fetch(`${API_BASE}/api/Products/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      let data: any = null;

      try {
        data = await res.json();
        console.log('updateProduct success/error json:', data);
      } catch {
        try {
          data = await res.text();
          console.log('updateProduct success/error text:', data);
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        const raw = extractApiErrorMessage(data);

        return {
          ok: false,
          status: res.status,
          data,
          message: toUserMessage(raw),
        };
      }

      await loadFromApi();

      return {
        ok: true,
        status: res.status,
        data,
        message: 'تم حفظ تعديلات الصنف بنجاح',
      };
    } catch (err) {
      console.error('updateProduct error', err);
      return {
        ok: false,
        status: 0,
        message: 'حدث خطأ أثناء حفظ التعديلات',
      };
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        deleteMultipleProducts,
        updateProduct,
        fetchCategories,
        fetchUnits,
        reloadProducts: loadFromApi,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};