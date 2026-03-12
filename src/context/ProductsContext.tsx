import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

type ApiResult<T = any> = {
  ok: boolean;
  status: number;
  data?: T;
  message?: string;
};

export interface Product {
  id: number | string;

  image: string;
  code: string;
  name: string;

  brand: string;
  agent: string;
  category: string;
  categoryId?: number;

  cost: string | number;
  price: string | number;
  quantity: string | number;

  unit: string;
  unitId?: number;
  alertQuantity: string | number;

  description?: string;
  productType?: string;
  parentProductId?: number;

  nameAr?: string;
  nameEn?: string;
  nameUr?: string;

  // legacy/local fields
  status?: 'active' | 'inactive';
  productNature?: 'basic' | 'prepared' | 'sub';
  selectedAddons?: string[];
  parentProductName?: string;
  createdAt?: string;
  updatedAt?: string;
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

  // legacy support
  image?: string;
  brand?: string;
  agent?: string;
  status?: 'active' | 'inactive';
  productNature?: 'basic' | 'prepared' | 'sub';
  selectedAddons?: string[];
  parentProductName?: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;

  addProduct: (product: AddProductParams) => Promise<any>;
  updateProduct: (id: number | string, updates: UpdateProductParams | Product) => Promise<any>;
  deleteProduct: (id: number | string) => Promise<any>;

  deleteMultipleProducts: (ids: (number | string)[]) => Promise<void>;
  fetchCategories: () => Promise<ProductCategoryOption[]>;
  fetchUnits: () => Promise<UnitOption[]>;
  reloadProducts: () => Promise<void>;
  getProductById: (id: number | string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

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

  if (raw.includes('ImageUrl') || raw.includes('Image')) return 'من فضلك اختر صورة صحيحة للصنف';
  if (raw.includes('CategoryName') || raw.includes('Category')) return 'من فضلك اختر التصنيف الرئيسي';
  if (raw.includes('ProductNameAr') || raw.includes('ProductNameEn') || raw.includes('ProductNameUr'))
    return 'من فضلك اكتب اسم الصنف';
  if (raw.includes('Description')) return 'من فضلك اكتب وصف الصنف';
  if (raw.includes('SellingPrice')) return 'من فضلك اكتب سعر البيع بشكل صحيح';
  if (raw.includes('ProductType')) return 'من فضلك اختر نوع الصنف';
  if (raw.includes('Id')) return 'تعذر تحديد الصنف المطلوب تعديله';

  return 'من فضلك راجع البيانات المطلوبة';
};

const normalizeProductType = (value: any): string => {
  const v = String(value ?? '').trim().toLowerCase();

  if (v === 'prepared' || v === '1') return 'prepared';
  if (v === 'branched' || v === '2' || v === 'sub') return 'branched';

  return 'prepared';
};

const normalizeProductNature = (value: any): 'basic' | 'prepared' | 'sub' => {
  const v = String(value ?? '').trim().toLowerCase();

  if (v === 'sub' || v === 'branched' || v === '2') return 'sub';
  if (v === 'prepared' || v === '1') return 'prepared';
  return 'basic';
};

const mapApiProduct = (p: any): Product => {
  const realId = Number(p?.id ?? p?.productId ?? 0);
  const productType = normalizeProductType(p?.productType);

  return {
    id: realId,
    image: String(p?.imageUrl ?? p?.image ?? ''),
    code: String(p?.barcode ?? p?.productCode ?? ''),
    name: String(p?.productNameAr || p?.productNameEn || p?.productNameUr || p?.name || ''),
    nameAr: String(p?.productNameAr ?? ''),
    nameEn: String(p?.productNameEn ?? ''),
    nameUr: String(p?.productNameUr ?? ''),
    brand: String(p?.brand ?? ''),
    agent: String(p?.agent ?? ''),
    category: String(p?.categoryName ?? p?.category ?? ''),
    categoryId: p?.categoryId ?? undefined,
    cost: String(p?.costPrice ?? p?.cost ?? 0),
    price: String(p?.sellingPrice ?? p?.price ?? 0),
    quantity: String(p?.quantity ?? 0),
    unit: String(p?.unitName ?? p?.unit ?? ''),
    unitId: p?.unitId ?? undefined,
    alertQuantity: String(p?.minStockLevel ?? p?.alertQuantity ?? 0),
    description: String(p?.description ?? ''),
    productType,
    parentProductId: Number(p?.parentProductId ?? 0),

    // legacy compatibility
    status: p?.isActive === false ? 'inactive' : 'active',
    productNature:
      productType === 'branched' ? 'sub' : productType === 'prepared' ? 'prepared' : 'basic',
    selectedAddons: Array.isArray(p?.selectedAddons) ? p.selectedAddons : [],
    parentProductName: String(p?.parentProductName ?? ''),
    createdAt: p?.createdAt ? String(p.createdAt) : undefined,
    updatedAt: p?.updatedAt ? String(p.updatedAt) : undefined,
  };
};

const mapLocalProduct = (p: any): Product => {
  const idValue =
    typeof p?.id === 'number'
      ? p.id
      : Number.isFinite(Number(p?.id))
      ? Number(p.id)
      : String(p?.id ?? Date.now());

  return {
    id: idValue,
    image: String(p?.image ?? ''),
    code: String(p?.code ?? ''),
    name: String(p?.name ?? ''),
    nameAr: String(p?.nameAr ?? p?.name ?? ''),
    nameEn: String(p?.nameEn ?? p?.name ?? ''),
    nameUr: String(p?.nameUr ?? p?.name ?? ''),
    brand: String(p?.brand ?? ''),
    agent: String(p?.agent ?? ''),
    category: String(p?.category ?? ''),
    categoryId: p?.categoryId ?? undefined,
    cost: p?.cost ?? 0,
    price: p?.price ?? 0,
    quantity: p?.quantity ?? 0,
    unit: String(p?.unit ?? ''),
    unitId: p?.unitId ?? undefined,
    alertQuantity: p?.alertQuantity ?? 0,
    description: String(p?.description ?? ''),
    productType:
      p?.productType ??
      (p?.productNature === 'sub'
        ? 'branched'
        : p?.productNature === 'prepared'
        ? 'prepared'
        : 'prepared'),
    parentProductId: Number(p?.parentProductId ?? 0),
    status: p?.status ?? 'active',
    productNature: normalizeProductNature(p?.productNature ?? p?.productType),
    selectedAddons: Array.isArray(p?.selectedAddons) ? p.selectedAddons : [],
    parentProductName: String(p?.parentProductName ?? ''),
    createdAt: p?.createdAt,
    updatedAt: p?.updatedAt,
  };
};

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('takamul_token');
    return {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const saveLocalProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
    window.dispatchEvent(new Event('products-updated'));
  }, []);

  const loadLocalProducts = useCallback((): Product[] => {
    try {
      const stored = localStorage.getItem('products');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(mapLocalProduct) : [];
    } catch (err) {
      console.error('Error loading products from localStorage:', err);
      return [];
    }
  }, []);

  const loadFromApi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/Products`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const local = loadLocalProducts();
        setProducts(local);
        return;
      }

      const data = await res.json();

      let mapped: Product[] = [];
      if (Array.isArray(data)) {
        mapped = data.map((p: any) => mapApiProduct(p)).filter((p) => Number(p.id) > 0);
      } else if (Array.isArray(data?.items)) {
        mapped = data.items.map((p: any) => mapApiProduct(p)).filter((p: Product) => Number(p.id) > 0);
      }

      setProducts(mapped);
      localStorage.setItem('products', JSON.stringify(mapped));
    } catch (err) {
      console.error('Error loading products from API', err);
      setError('فشل تحميل البيانات');

      const local = loadLocalProducts();
      setProducts(local);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, loadLocalProducts]);

  useEffect(() => {
    const local = loadLocalProducts();
    if (local.length) {
      setProducts(local);
      setLoading(false);
    }
    loadFromApi();
  }, [loadFromApi, loadLocalProducts]);

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
          name: String(
            item?.categoryNameAr ?? item?.name ?? item?.productCategoryName ?? ''
          ).trim(),
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
      ParentProductId: Number(product.parentProductId ?? 0),
      ProductType: normalizeProductType(product.productType ?? product.productNature),
      Image: product.image ?? '',
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
        const fallbackProduct: Product = mapLocalProduct({
          ...product,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        });
        saveLocalProducts([...products, fallbackProduct]);
        return fallbackProduct;
      }

      await loadFromApi();
      return { ok: true };
    } catch (err) {
      console.error('Failed to add product via API', err);

      const fallbackProduct: Product = mapLocalProduct({
        ...product,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      });
      saveLocalProducts([...products, fallbackProduct]);
      return fallbackProduct;
    }
  };

  const deleteProduct = async (id: number | string) => {
    try {
      const numericId = Number(id);
      const token = localStorage.getItem('takamul_token');

      if (Number.isFinite(numericId) && numericId > 0) {
        const res = await fetch(`${API_BASE}/api/Products/${numericId}`, {
          method: 'DELETE',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });

        if (!res.ok) {
          console.error('Failed to delete product via API, status:', res.status);
        } else {
          await loadFromApi();
          return;
        }
      }

      const newProducts = products.filter((p) => String(p.id) !== String(id));
      saveLocalProducts(newProducts);
    } catch (err) {
      console.error('Failed to delete product via API', err);
      const newProducts = products.filter((p) => String(p.id) !== String(id));
      saveLocalProducts(newProducts);
    }
  };

  const deleteMultipleProducts = async (ids: (number | string)[]) => {
    try {
      const token = localStorage.getItem('takamul_token');

      await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE}/api/Products/${Number(id)}`, {
            method: 'DELETE',
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          }).catch(() => null)
        )
      );

      await loadFromApi();
    } catch (err) {
      console.error('Failed to delete products via API', err);
      const newProducts = products.filter((p) => !ids.some((id) => String(id) === String(p.id)));
      saveLocalProducts(newProducts);
    }
  };

  const urlToFile = async (
    url: string,
    fallbackName = 'current-image.jpg'
  ): Promise<File | null> => {
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

  const updateProduct = async (
    id: number | string,
    updates: UpdateProductParams | Product
  ): Promise<any> => {
    try {
      const currentProduct = products.find((p) => String(p.id) === String(id));

      if (!currentProduct) {
        return { ok: false, status: 404, message: 'الصنف غير موجود' };
      }

      const rawUpdates = updates as any;

      const nameAr = String(
        rawUpdates.nameAr ?? currentProduct.nameAr ?? rawUpdates.name ?? currentProduct.name ?? ''
      ).trim();
      const nameEn = String(
        rawUpdates.nameEn ?? currentProduct.nameEn ?? rawUpdates.name ?? currentProduct.name ?? ''
      ).trim();
      const nameUr = String(
        rawUpdates.nameUr ?? currentProduct.nameUr ?? rawUpdates.name ?? currentProduct.name ?? ''
      ).trim();

      const categoryName = String(rawUpdates.category ?? currentProduct.category ?? '').trim();
      const unitName = String(rawUpdates.unit ?? currentProduct.unit ?? '').trim();
      const barcode = String(rawUpdates.code ?? currentProduct.code ?? '').trim();
      const description = String(rawUpdates.description ?? currentProduct.description ?? '').trim();

      const productType = normalizeProductType(
        rawUpdates.productType ?? rawUpdates.productNature ?? currentProduct.productType ?? 'prepared'
      );

      const sellingPrice = Number(rawUpdates.price ?? currentProduct.price ?? 0);
      const costPrice = Number(rawUpdates.cost ?? currentProduct.cost ?? 0);
      const minStockLevel = Number(rawUpdates.alertQuantity ?? currentProduct.alertQuantity ?? 0);
      const quantity = Number(rawUpdates.quantity ?? currentProduct.quantity ?? 0);
      const parentProductId = Number(
        rawUpdates.parentProductId ?? currentProduct.parentProductId ?? 0
      );

      if (!nameAr || !nameEn || !nameUr) {
        return { ok: false, status: 400, message: 'من فضلك اكتب اسم الصنف' };
      }

      if (!categoryName) {
        return { ok: false, status: 400, message: 'من فضلك اختر التصنيف الرئيسي' };
      }

      if (!unitName) {
        return { ok: false, status: 400, message: 'من فضلك اختر الوحدة' };
      }

      if (!description) {
        return { ok: false, status: 400, message: 'من فضلك اكتب وصف الصنف' };
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

      if (!Number.isFinite(quantity) || quantity < 0) {
        return { ok: false, status: 400, message: 'من فضلك اكتب كمية صحيحة' };
      }

      const numericId = Number(id);
      if (!Number.isFinite(numericId) || numericId <= 0) {
        const mergedLocal: Product = {
          ...currentProduct,
          ...rawUpdates,
          name: rawUpdates.name ?? currentProduct.name,
          nameAr,
          nameEn,
          nameUr,
          category: categoryName,
          unit: unitName,
          code: barcode,
          description,
          productType,
          parentProductId,
          price: sellingPrice,
          cost: costPrice,
          quantity,
          alertQuantity: minStockLevel,
          productNature:
            productType === 'branched' ? 'sub' : productType === 'prepared' ? 'prepared' : 'basic',
          updatedAt: new Date().toISOString(),
        };

        const newProducts = products.map((p) =>
          String(p.id) === String(id) ? mergedLocal : p
        );
        saveLocalProducts(newProducts);
        return mergedLocal;
      }

      let imageFile: File | null = rawUpdates.imageFile ?? null;

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

      const token = localStorage.getItem('takamul_token');
      const form = new FormData();

      form.append('Id', String(numericId));
      form.append('ProductNameAr', nameAr);
      form.append('ProductNameEn', nameEn);
      form.append('ProductNameUr', nameUr);
      form.append('Description', description);
      form.append('CategoryName', categoryName);
      form.append('UnitName', unitName);
      form.append('Barcode', barcode);
      form.append('CostPrice', String(costPrice));
      form.append('SellingPrice', String(sellingPrice));
      form.append('Quantity', String(quantity));
      form.append('MinStockLevel', String(minStockLevel));
      form.append('ProductType', productType);
      form.append('ParentProductId', String(parentProductId));
      form.append('ImageUrl', imageFile);

      const res = await fetch(`${API_BASE}/api/Products/${numericId}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        try {
          data = await res.text();
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

  const getProductById = useCallback(
    (id: number | string): Product | undefined => {
      return products.find((p) => String(p.id) === String(id));
    },
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteMultipleProducts,
        fetchCategories,
        fetchUnits,
        reloadProducts: loadFromApi,
        getProductById,
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