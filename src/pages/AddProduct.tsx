import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  PlusCircle,
  Upload,
  Barcode,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

type ApiCategory = {
  id?: number | string;
  Id?: number | string;
  categoryId?: number | string;
  CategoryId?: number | string;
  categoryNameAr?: string;
  CategoryNameAr?: string;
  categoryNameEn?: string;
  CategoryNameEn?: string;
  categoryNameUr?: string;
  CategoryNameUr?: string;
  name?: string;
  Name?: string;
};

type NormalizedCategory = {
  id: number | string;
  nameAr: string;
  nameEn: string;
  nameUr: string;
};

type ApiUnit = {
  id?: number | string;
  Id?: number | string;
  unitId?: number | string;
  UnitId?: number | string;
  unitNameAr?: string;
  UnitNameAr?: string;
  unitNameEn?: string;
  UnitNameEn?: string;
  unitNameUr?: string;
  UnitNameUr?: string;
  nameAr?: string;
  NameAr?: string;
  nameEn?: string;
  NameEn?: string;
  nameUr?: string;
  NameUr?: string;
  name?: string;
  Name?: string;
};

type NormalizedUnit = {
  id: number | string;
  nameAr: string;
  nameEn: string;
  nameUr: string;
};

type FormErrors = Partial<{
  name: string;
  nameEn: string;
  nameUr: string;
  categoryId: string;
  productType: string;
  price: string;
  cost: string;
  alertQuantity: string;
  defaultSaleUnitId: string;
  image: string;
}>;

const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (process as any)?.env?.REACT_APP_API_BASE_URL ||
  'http://takamulerp.runasp.net';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;

    if (isJson) {
      try {
        const data: any = await res.json();
        msg =
          data?.message ||
          data?.error ||
          data?.title ||
          (typeof data?.errors === 'object'
            ? Object.values(data.errors).flat().join(', ')
            : msg);
      } catch {
        //
      }
    } else {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {
        //
      }
    }

    throw new Error(msg);
  }

  if (isJson) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

function normalizeCategory(item: any): NormalizedCategory {
  const id = item?.id ?? item?.Id ?? item?.categoryId ?? item?.CategoryId ?? '';
  const nameAr =
    (item?.categoryNameAr ?? item?.CategoryNameAr ?? item?.nameAr ?? item?.NameAr ?? '').toString();
  const nameEn =
    (item?.categoryNameEn ?? item?.CategoryNameEn ?? item?.nameEn ?? item?.NameEn ?? '').toString();
  const nameUr =
    (item?.categoryNameUr ?? item?.CategoryNameUr ?? item?.nameUr ?? item?.NameUr ?? '').toString();
  const genericName = (item?.name ?? item?.Name ?? '').toString();

  return {
    id,
    nameAr: nameAr || genericName,
    nameEn: nameEn || genericName,
    nameUr: nameUr || genericName
  };
}

function normalizeUnit(item: any): NormalizedUnit {
  const id = item?.id ?? item?.Id ?? item?.unitId ?? item?.UnitId ?? '';
  const nameAr =
    (item?.unitNameAr ??
      item?.UnitNameAr ??
      item?.nameAr ??
      item?.NameAr ??
      '').toString();
  const nameEn =
    (item?.unitNameEn ??
      item?.UnitNameEn ??
      item?.nameEn ??
      item?.NameEn ??
      '').toString();
  const nameUr =
    (item?.unitNameUr ??
      item?.UnitNameUr ??
      item?.nameUr ??
      item?.NameUr ??
      '').toString();
  const genericName = (item?.name ?? item?.Name ?? '').toString();

  return {
    id,
    nameAr: nameAr || genericName,
    nameEn: nameEn || genericName,
    nameUr: nameUr || genericName
  };
}

function getDisplayName(
  item: { nameAr: string; nameEn: string; nameUr: string },
  direction: string
) {
  if (direction === 'rtl') return item.nameAr || item.nameEn || item.nameUr || '';
  return item.nameEn || item.nameAr || item.nameUr || '';
}

function getCategoryNameToSend(c?: NormalizedCategory) {
  return (c?.nameAr || c?.nameEn || c?.nameUr || '').trim();
}

function isValidNumber(value: string) {
  if (!value.trim()) return false;
  const num = Number(value);
  return !Number.isNaN(num) && Number.isFinite(num) && num >= 0;
}

function isValidInteger(value: string) {
  if (!value.trim()) return false;
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
      <XCircle size={14} />
      <span>{error}</span>
    </p>
  );
}

export default function AddProduct() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mainCategories, setMainCategories] = useState<NormalizedCategory[]>([]);
  const [subCategories, setSubCategories] = useState<NormalizedCategory[]>([]);
  const [units, setUnits] = useState<NormalizedUnit[]>([]);

  const [isLoadingMainCategories, setIsLoadingMainCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const [formData, setFormData] = useState({
    productType: 'Direct',
    name: '',
    nameEn: '',
    nameUr: '',
    description: '',
    alertQuantity: '',
    code: '',
    cost: '',
    price: '',
    categoryId: '',
    subCategoryId: '',
    defaultSaleUnitId: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const inputClass = (hasError?: string) =>
    `w-full rounded-md px-3 py-2 text-sm outline-none transition-colors ${
      hasError
        ? 'border border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10'
    }`;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setSubmitError('');
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoadingMainCategories(true);

        const data = await fetchJson<any>(
          `${API_BASE}/api/ProductCategories/MainCategory`,
          {
            method: 'GET',
            headers: { accept: '*/*' }
          }
        );

        const list = Array.isArray(data) ? data : data?.items ?? [];
        const normalized = list
          .map(normalizeCategory)
          .filter((c: NormalizedCategory) => String(c.id) !== '' && (c.nameAr || c.nameEn || c.nameUr));

        if (mounted) setMainCategories(normalized);
      } catch (error) {
        console.error(error);
        if (mounted) setMainCategories([]);
      } finally {
        if (mounted) setIsLoadingMainCategories(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoadingUnits(true);

        const data = await fetchJson<any>(`${API_BASE}/api/UnitOfMeasure`, {
          method: 'GET',
          headers: { accept: '*/*' }
        });

        const list = Array.isArray(data) ? data : data?.items ?? [];
        const normalized = list
          .map(normalizeUnit)
          .filter((u: NormalizedUnit) => String(u.id) !== '' && (u.nameAr || u.nameEn || u.nameUr));

        if (mounted) setUnits(normalized);
      } catch (error) {
        console.error(error);
        if (mounted) setUnits([]);
      } finally {
        if (mounted) setIsLoadingUnits(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!formData.categoryId) {
        setSubCategories([]);
        setFormData(prev => ({ ...prev, subCategoryId: '' }));
        return;
      }

      try {
        setIsLoadingSubCategories(true);

        const data = await fetchJson<any>(
          `${API_BASE}/api/ProductCategories/SubCategory/${encodeURIComponent(formData.categoryId)}`,
          {
            method: 'GET',
            headers: { accept: '*/*' }
          }
        );

        const list = Array.isArray(data) ? data : data?.items ?? [];
        const normalized = list
          .map(normalizeCategory)
          .filter((c: NormalizedCategory) => String(c.id) !== '' && (c.nameAr || c.nameEn || c.nameUr));

        if (mounted) {
          setSubCategories(normalized);
          setFormData(prev => ({ ...prev, subCategoryId: '' }));
        }
      } catch (error) {
        console.error(error);
        if (mounted) setSubCategories([]);
      } finally {
        if (mounted) setIsLoadingSubCategories(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [formData.categoryId]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.productType.trim()) {
      newErrors.productType =
        direction === 'rtl' ? 'نوع الصنف مطلوب' : 'Product type is required';
    }

    if (!formData.name.trim()) {
      newErrors.name =
        direction === 'rtl' ? 'اسم الصنف بالعربية مطلوب' : 'Arabic name is required';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn =
        direction === 'rtl' ? 'اسم الصنف بالإنجليزية مطلوب' : 'English name is required';
    }

    if (!formData.nameUr.trim()) {
      newErrors.nameUr =
        direction === 'rtl' ? 'اسم الصنف بالأوردو مطلوب' : 'Urdu name is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId =
        direction === 'rtl' ? 'التصنيف الرئيسي مطلوب' : 'Main category is required';
    }

    if (!formData.price.trim()) {
      newErrors.price =
        direction === 'rtl' ? 'سعر الصنف مطلوب' : 'Selling price is required';
    } else if (!isValidNumber(formData.price)) {
      newErrors.price =
        direction === 'rtl'
          ? 'سعر الصنف يجب أن يكون رقمًا صحيحًا'
          : 'Selling price must be a valid number';
    }

    if (formData.cost.trim() && !isValidNumber(formData.cost)) {
      newErrors.cost =
        direction === 'rtl'
          ? 'تكلفة الصنف يجب أن تكون رقمًا صحيحًا'
          : 'Cost price must be a valid number';
    }

    if (formData.alertQuantity.trim() && !isValidInteger(formData.alertQuantity)) {
      newErrors.alertQuantity =
        direction === 'rtl'
          ? 'حد الطلب يجب أن يكون رقمًا صحيحًا'
          : 'Min stock level must be a valid integer';
    }

    if (!formData.defaultSaleUnitId) {
      newErrors.defaultSaleUnitId =
        direction === 'rtl'
          ? 'وحدة البيع الافتراضية مطلوبة'
          : 'Default sale unit is required';
    }

    if (imageFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        newErrors.image =
          direction === 'rtl'
            ? 'نوع الصورة غير مدعوم'
            : 'Unsupported image format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    const mainCategory = mainCategories.find(c => String(c.id) === String(formData.categoryId));
    const subCategory = subCategories.find(c => String(c.id) === String(formData.subCategoryId));
    const categoryName = getCategoryNameToSend(subCategory || mainCategory);

    if (!categoryName) {
      setErrors(prev => ({
        ...prev,
        categoryId:
          direction === 'rtl'
            ? 'تعذر تحديد اسم التصنيف'
            : 'Could not resolve category name'
      }));
      return;
    }

    try {
      setIsSubmitting(true);

      const fd = new FormData();

      if (formData.code.trim()) {
        fd.append('Barcode', formData.code.trim());
      }

      fd.append('ProductNameAr', formData.name.trim());
      fd.append('ProductNameEn', formData.nameEn.trim());
      fd.append('ProductNameUr', formData.nameUr.trim());

      if (formData.description.trim()) {
        fd.append('Description', formData.description.trim());
      }

      fd.append('CategoryName', categoryName);

      if (formData.cost.trim()) {
        fd.append('CostPrice', String(Number(formData.cost)));
      }

      fd.append('SellingPrice', String(Number(formData.price)));

      if (formData.alertQuantity.trim()) {
        fd.append('MinStockLevel', String(parseInt(formData.alertQuantity, 10)));
      }

      fd.append('producttype', formData.productType);

      if (imageFile) {
        fd.append('Image', imageFile);
      }

      // ملحوظة:
      // defaultSaleUnitId اتعمله fetch واختيار في الواجهة بناءً على طلبك
      // لكنه لا يتم إرساله لأن الـ API الحالي لا يحتوي field له

      await fetchJson(`${API_BASE}/api/Products/add`, {
        method: 'POST',
        body: fd
      });

      setSuccessMessage(
        direction === 'rtl' ? 'تمت إضافة الصنف بنجاح' : 'Product added successfully'
      );

      setTimeout(() => {
        navigate('/products');
      }, 700);
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        (direction === 'rtl' ? 'فشل إضافة الصنف. ' : 'Failed to add product. ') +
          (err?.message || '')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('add_product_title')}</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <PlusCircle size={20} className="text-primary" />
          {t('add_product_title')}
        </h1>
        <p className="text-sm text-gray-500 mt-2">{t('add_product_desc')}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6"
      >
        {(submitError || successMessage) && (
          <div className="mb-6 space-y-3">
            {submitError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">
                    {direction === 'rtl' ? 'حدث خطأ' : 'Something went wrong'}
                  </p>
                  <p className="text-sm mt-1">{submitError}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">
                    {direction === 'rtl' ? 'تم بنجاح' : 'Success'}
                  </p>
                  <p className="text-sm mt-1">{successMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product_type')} <span className="text-red-500">*</span>
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className={inputClass(errors.productType)}
              >
                <option value="Direct">Direct</option>
                <option value="Prepared">Prepared</option>
                <option value="Branched">Branched</option>
              </select>
              <FieldError error={errors.productType} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product_name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputClass(errors.name)}
                placeholder={direction === 'rtl' ? 'اكتب الاسم بالعربية' : 'Enter Arabic name'}
              />
              <FieldError error={errors.name} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product_name_second_lang')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleInputChange}
                className={inputClass(errors.nameEn)}
                placeholder={direction === 'rtl' ? 'اكتب الاسم بالإنجليزية' : 'Enter English name'}
              />
              <FieldError error={errors.nameEn} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product_name_third_lang')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameUr"
                value={formData.nameUr}
                onChange={handleInputChange}
                className={inputClass(errors.nameUr)}
                placeholder={direction === 'rtl' ? 'اكتب الاسم بالأوردو' : 'Enter Urdu name'}
              />
              <FieldError error={errors.nameUr} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={inputClass()}
                rows={4}
                placeholder={direction === 'rtl' ? 'الوصف اختياري' : 'Description is optional'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حد الطلب
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="alertQuantity"
                value={formData.alertQuantity}
                onChange={handleInputChange}
                className={inputClass(errors.alertQuantity)}
                placeholder="0"
              />
              <FieldError error={errors.alertQuantity} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كود الصنف
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={inputClass()}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      code: Math.floor(Math.random() * 100000000).toString()
                    }))
                  }
                  className="bg-gray-100 border border-gray-300 p-2 rounded-md hover:bg-gray-200 text-gray-600"
                  title="Generate Barcode"
                >
                  <Barcode size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">يمكن استخدام قارئ الباركود أيضًا</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تكلفة الصنف
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className={inputClass(errors.cost)}
                placeholder="0.00"
              />
              <FieldError error={errors.cost} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر الصنف <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={inputClass(errors.price)}
                placeholder="0.00"
              />
              <FieldError error={errors.price} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التصنيفات الرئيسية <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={inputClass(errors.categoryId)}
                disabled={isLoadingMainCategories}
              >
                <option value="">
                  {isLoadingMainCategories
                    ? direction === 'rtl'
                      ? 'جاري التحميل...'
                      : 'Loading...'
                    : direction === 'rtl'
                      ? 'اختر التصنيف الرئيسي'
                      : 'Select main category'}
                </option>

                {mainCategories.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {getDisplayName(c, direction)}
                  </option>
                ))}
              </select>
              <FieldError error={errors.categoryId} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التصنيف الفرعي
              </label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleInputChange}
                className={inputClass()}
                disabled={!formData.categoryId || isLoadingSubCategories || subCategories.length === 0}
              >
                <option value="">
                  {!formData.categoryId
                    ? direction === 'rtl'
                      ? 'اختر التصنيف الرئيسي أولًا'
                      : 'Select main category first'
                    : isLoadingSubCategories
                      ? direction === 'rtl'
                        ? 'جاري التحميل...'
                        : 'Loading...'
                      : subCategories.length === 0
                        ? direction === 'rtl'
                          ? 'لا توجد تصنيفات فرعية'
                          : 'No sub categories'
                        : direction === 'rtl'
                          ? 'اختياري'
                          : 'Optional'}
                </option>

                {subCategories.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {getDisplayName(c, direction)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وحدة البيع الافتراضية <span className="text-red-500">*</span>
              </label>
              <select
                name="defaultSaleUnitId"
                value={formData.defaultSaleUnitId}
                onChange={handleInputChange}
                className={inputClass(errors.defaultSaleUnitId)}
                disabled={isLoadingUnits}
              >
                <option value="">
                  {isLoadingUnits
                    ? direction === 'rtl'
                      ? 'جاري تحميل الوحدات...'
                      : 'Loading units...'
                    : direction === 'rtl'
                      ? 'اختر وحدة البيع الافتراضية'
                      : 'Select default sale unit'}
                </option>

                {units.map((u) => (
                  <option key={String(u.id)} value={String(u.id)}>
                    {getDisplayName(u, direction)}
                  </option>
                ))}
              </select>
              <FieldError error={errors.defaultSaleUnitId} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة الصنف
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    setFileName(file?.name || '');
                    setErrors(prev => ({ ...prev, image: undefined }));
                    setSubmitError('');
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#054C28] text-white px-4 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  استعراض
                </button>
                <input
                  type="text"
                  value={fileName}
                  className={inputClass(errors.image)}
                  readOnly
                  placeholder={direction === 'rtl' ? 'لم يتم اختيار صورة' : 'No file selected'}
                />
              </div>
              <FieldError error={errors.image} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#054C28] disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-2 rounded-md font-medium hover:bg-[#043b1f] transition-colors shadow-sm"
          >
            {isSubmitting
              ? direction === 'rtl'
                ? 'جاري الحفظ...'
                : 'Saving...'
              : t('add_product_title')}
          </button>
        </div>
      </form>
    </div>
  );
}