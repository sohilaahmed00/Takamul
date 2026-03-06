import React, { createContext, useContext, useState, useEffect } from 'react';
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
  alertQuantity: string;

  // optional fields (لو موجودة من API)
  description?: string;
  productType?: string;
  parentProductId?: number;
}

interface AddProductParams extends Omit<Product, 'id'> {
  nameAr?: string;
  nameEn?: string;
  nameUr?: string;
  description?: string;
  productType?: string;
}

const extractApiErrorMessage = (data: any) => {
  if (data?.errors && typeof data.errors === 'object') {
    const lines: string[] = [];
    for (const key of Object.keys(data.errors)) {
      const arr = data.errors[key];
      if (Array.isArray(arr)) {
        for (const msg of arr) lines.push(`${key}: ${msg}`);
      }
    }
    if (lines.length) return lines.join(' | ');
  }
  if (typeof data?.title === 'string') return data.title;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data === 'string') return data;
  return 'فشل العملية';
};

const toUserMessage = (raw?: string) => {
  if (!raw) return 'حدث خطأ، حاول مرة أخرى';

  // تحويل رسائل الـ API لرسائل مناسبة للمستخدم
  if (raw.includes('ImageUrl')) return 'من فضلك اختر صورة للمنتج';
  if (raw.includes('CategoryName')) return 'من فضلك اختر/اكتب التصنيف الرئيسي';
  if (raw.includes('ProductNameAr') || raw.includes('ProductNameEn') || raw.includes('ProductNameUr'))
    return 'من فضلك اكتب اسم المنتج';

  // fallback
  return 'من فضلك اكمّل البيانات المطلوبة';
};

interface ProductsContextType {
  products: Product[];
  addProduct: (product: AddProductParams) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteMultipleProducts: (ids: number[]) => Promise<void>;
  updateProduct: (
    id: number,
    updates: Partial<Product> & { imageFile?: File | null }
  ) => Promise<ApiResult>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const mapApiProduct = (p: any, index: number): Product => {
  const id = Number(p?.productCode ?? p?.id ?? p?.productId ?? index + 1);

  return {
    id,
    image: String(p?.imageUrl ?? ''),
    code: String(p?.barcode ?? p?.productCode ?? id),
    name: String(p?.productNameAr || p?.productNameEn || p?.productNameUr || ''),
    brand: String(p?.brand ?? ''),
    agent: '',
    category: String(p?.categoryName ?? ''),
    categoryId: p?.categoryId ?? undefined,
    cost: String(p?.costPrice ?? p?.cost ?? '0'),
    price: String(p?.sellingPrice ?? p?.price ?? '0'),
    quantity: String(p?.quantity ?? '0'),
    unit: String(p?.unit ?? 'وحدة'),
    alertQuantity: String(p?.minStockLevel ?? p?.alertQuantity ?? '0'),
    description: p?.description ?? '',
    productType: String(p?.productType ?? '1'),
    parentProductId: p?.parentProductId ?? 0,
  };
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  const loadFromApi = async () => {
    try {
      const token = localStorage.getItem('takamul_token');
      const res = await fetch(`${API_BASE}/api/Products`, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data.map((p: any, idx: number) => mapApiProduct(p, idx)));
      }
    } catch (err) {
      console.error('Error loading products from API', err);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const addProduct = async (product: AddProductParams) => {
    const token = localStorage.getItem('takamul_token');

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
      producttype: product.productType ?? '1',
      Image: '',
    };

    try {
      const res = await fetch(`${API_BASE}/api/Products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) console.error('Failed to add product via API, status:', res.status);
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

  // ✅ Helper: نحول رابط الصورة الحالية لملف File (عشان API بيطلب File دايمًا)
  const urlToFile = async (url: string, fallbackName = 'image.jpg'): Promise<File | null> => {
    if (!url) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      const nameFromUrl = url.split('/').pop() || fallbackName;
      const type = blob.type || 'image/jpeg';
      return new File([blob], nameFromUrl, { type });
    } catch {
      return null;
    }
  };

  // ✅ updateProduct: multipart/form-data + ImageUrl كـ File
  const updateProduct = async (
    id: number,
    updates: Partial<Product> & { imageFile?: File | null }
  ): Promise<ApiResult> => {
    try {
      const token = localStorage.getItem('takamul_token');
      const currentProduct = products.find((p) => p.id === id);

      if (!currentProduct) {
        return { ok: false, status: 404, message: 'المنتج غير موجود' };
      }

      // ✅ القيم المطلوبة لازم تبقى موجودة في الـ FormData (حتى لو المستخدم ما عدّلهاش)
      const name = (updates.name ?? currentProduct.name ?? '').toString().trim();
      const category = (updates.category ?? currentProduct.category ?? '').toString().trim();

      const price = Number(updates.price ?? currentProduct.price ?? 0);
      const cost = Number(updates.cost ?? currentProduct.cost ?? 0);
      const minStock = Number(updates.alertQuantity ?? currentProduct.alertQuantity ?? 0);

      const barcode = (updates.code ?? currentProduct.code ?? '').toString();
      const productType = (updates.productType ?? currentProduct.productType ?? '1').toString();
      const description = (updates.description ?? currentProduct.description ?? '').toString();
      const parentProductId = updates.parentProductId ?? currentProduct.parentProductId ?? 0;

      // ✅ الصورة: يا File جديد، يا نحاول نجيب الصورة الحالية ونبعتها كـ File
      let imageFile: File | null = updates.imageFile ?? null;
      if (!imageFile) {
        imageFile = await urlToFile(currentProduct.image, 'current-image.jpg');
      }

      // لو ماقدرناش نجيب الصورة كملف (CORS مثلاً) نطلب من المستخدم يختار صورة
      if (!imageFile) {
        return { ok: false, status: 400, message: 'من فضلك اختر صورة للمنتج' };
      }

      // ✅ FormData (مهم: اسم الحقل لازم يبقى ImageUrl بالظبط)
      const form = new FormData();
      form.append('Id', String(id));
      form.append('ProductNameAr', name);
      form.append('ProductNameEn', name);
      form.append('ProductNameUr', name);
      form.append('CategoryName', category);
      form.append('SellingPrice', String(price));
      form.append('Barcode', barcode);
      form.append('CostPrice', String(cost));
      form.append('MinStockLevel', String(minStock));
      form.append('ProductType', productType);
      form.append('Description', description);
      form.append('ParentProductId', String(parentProductId));

      // ✅ الصورة كملف
      form.append('ImageUrl', imageFile);

      const res = await fetch(`${API_BASE}/api/Products/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // ❌ متحطش Content-Type هنا عشان المتصفح يحط boundary
        },
        body: form,
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = await res.text().catch(() => null);
      }

      if (!res.ok) {
        const raw = extractApiErrorMessage(data);
        return { ok: false, status: res.status, data, message: toUserMessage(raw) };
      }

      await loadFromApi();
      return { ok: true, status: res.status, data, message: 'تم حفظ التعديلات بنجاح' };
    } catch (err: any) {
      return { ok: false, status: 0, message: 'حدث خطأ، حاول مرة أخرى' };
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
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};