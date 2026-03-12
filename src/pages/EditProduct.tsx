// src/pages/EditProduct.tsx
import { cn } from '@/lib/utils';
import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import {
    Upload, Barcode, Save, Edit2, Box, Package, Layers, X, FolderPlus, Search, Check, Trash2, PlusCircle, CheckCircle, AlertCircle
} from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts, type Product } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';

// ✅ تعريف نوع للمواد في الصنف المجهز
interface MaterialItem {
    materialId: string;
    materialName: string;
    quantity: number;
    unitId?: string;
    unitName?: string;
}

// ✅ تعريف نوع للوحدة
interface Unit {
    id: string;
    code: string;
    name: string;
}

export default function EditProduct() {
    const { t, direction } = useLanguage();
    const { updateProduct, products } = useProducts();
    const { systemSettings } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();

    const { id } = useParams();
    const isEditMode = true;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState('');

    // ✅ فصل الأصناف حسب الأنواع الأربعة
    const directProductsList = products?.filter((p: Product) => p.productNature === 'basic' || !p.productNature) || [];
    const materialsProductsList = products?.filter((p: Product) => p.productNature === 'materials') || [];

    // ✅ قائمة الوحدات
    const unitsList: Unit[] = [
        { id: '1', code: 'U-001', name: 'قطعة' },
        { id: '2', code: 'U-002', name: 'كيلو' },
        { id: '3', code: 'U-003', name: 'جرام' },
        { id: '4', code: 'U-004', name: 'لتر' },
        { id: '5', code: 'U-005', name: 'علبة' },
        { id: '6', code: 'U-006', name: 'كرتونة' },
    ];

    // ==========================================
    // State - ✅ تعديل لدعم عناصر متعددة
    // ==========================================
    const [formData, setFormData] = useState({
        productNature: 'basic' as 'basic' | 'prepared' | 'sub' | 'materials',
        parentProductIds: [] as string[],          // ✅ مصفوفة بدلاً من عنصر واحد
        parentProductNames: [] as string[],        // ✅ مصفوفة للأسماء
        name: '',
        nameLang2: '',
        nameLang3: '',
        alertQuantity: '0',
        code: '',
        cost: '0',
        category: '',
        subCategory: '',
        hideInPos: false,
        details: '',
        materials: [] as MaterialItem[],
    });

    // ✅ حالة البحث عن الخامات
    const [materialSearch, setMaterialSearch] = useState('');
    const [materialQuantity, setMaterialQuantity] = useState('1');
    const [showMaterialSearch, setShowMaterialSearch] = useState(false);

    // ✅ حالة البحث عن الوحدة
    const [unitSearch, setUnitSearch] = useState('');
    const [showUnitSearch, setShowUnitSearch] = useState(false);

    // ✅ حالة البحث عن الصنف الأب
    const [parentProductSearch, setParentProductSearch] = useState('');
    const [showParentSearch, setShowParentSearch] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // ==========================================
    // ✅ سحب البيانات عند التحميل للتعديل
    // ==========================================
    useEffect(() => {
        if (!id || !products) {
            setIsLoading(false);
            return;
        }

        const productToEdit = products.find((p: Product) => String(p.id) === String(id));

        if (productToEdit) {
            // ✅ معالجة المواد بشكل صحيح مع القيم الافتراضية
            const processedMaterials: MaterialItem[] = Array.isArray(productToEdit.materials)
                ? productToEdit.materials.map((m: any) => ({
                    materialId: String(m.materialId || m.id || ''),
                    materialName: String(m.materialName || m.name || ''),
                    quantity: typeof m.quantity === 'number' ? m.quantity : parseFloat(String(m.quantity)) || 1,
                    unitId: m.unitId ? String(m.unitId) : undefined,
                    unitName: m.unitName ? String(m.unitName) : undefined,
                }))
                : [];

            // ✅ معالجة الأصناف الأب المختارة (يدعم عنصر واحد أو مصفوفة)
            const parentIds = Array.isArray(productToEdit.parentProductId)
                ? productToEdit.parentProductId
                : productToEdit.parentProductId ? [productToEdit.parentProductId] : [];

            const parentNames = Array.isArray(productToEdit.parentProductName)
                ? productToEdit.parentProductName
                : productToEdit.parentProductName ? [productToEdit.parentProductName] : [];

            setFormData({
                productNature: (productToEdit.productNature as 'basic' | 'prepared' | 'sub' | 'materials') || 'basic',
                parentProductIds: parentIds,
                parentProductNames: parentNames,
                name: productToEdit.name || '',
                nameLang2: productToEdit.nameLang2 || '',
                nameLang3: productToEdit.nameLang3 || '',
                alertQuantity: productToEdit.alertQuantity?.toString() || '0',
                code: productToEdit.code || '',
                cost: productToEdit.cost?.toString() || '0',
                category: productToEdit.category || '',
                subCategory: productToEdit.subCategory || '',
                hideInPos: productToEdit.hideInPos || false,
                details: productToEdit.details || '',
                materials: processedMaterials,
            });

            if (parentNames.length > 0) {
                setParentProductSearch(parentNames.join(', '));
            }
            if (productToEdit.image) {
                setFileName(productToEdit.image);
            }
        } else {
            setMessage({ type: 'error', text: 'لم يتم العثور على الصنف' });
        }
        setIsLoading(false);
    }, [id, products]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (message) setMessage(null);
    };

    // ✅ إضافة مادة للصنف المجهز
    const handleAddMaterial = () => {
        if (!materialSearch) return;

        const selectedMaterial = materialsProductsList.find(m =>
            m.id === materialSearch || m.name === materialSearch
        );

        if (selectedMaterial) {
            const newMaterial: MaterialItem = {
                materialId: selectedMaterial.id,
                materialName: selectedMaterial.name,
                quantity: parseFloat(materialQuantity) || 1,
                unitId: unitSearch || undefined,
                unitName: unitsList.find(u => u.id === unitSearch)?.name,
            };

            setFormData(prev => ({
                ...prev,
                materials: [...prev.materials, newMaterial]
            }));

            setMaterialSearch('');
            setMaterialQuantity('1');
            setUnitSearch('');
        }
    };

    // ✅ حذف مادة من الجدول
    const handleRemoveMaterial = (index: number) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, i) => i !== index)
        }));
    };

    // ✅ ✅ ✅ اختيار/إلغاء اختيار الصنف الأب (يدعم متعدد)
    const handleToggleParentProduct = (product: Product) => {
        setFormData(prev => {
            const isAlreadySelected = prev.parentProductIds.includes(product.id);

            if (isAlreadySelected) {
                // ✅ حذف من القائمة
                return {
                    ...prev,
                    parentProductIds: prev.parentProductIds.filter(id => id !== product.id),
                    parentProductNames: prev.parentProductNames.filter(name => name !== product.name)
                };
            } else {
                // ✅ إضافة للقائمة
                return {
                    ...prev,
                    parentProductIds: [...prev.parentProductIds, product.id],
                    parentProductNames: [...prev.parentProductNames, product.name]
                };
            }
        });
    };

    // ✅ ✅ ✅ حذف صنف أب من القائمة المختارة
    const handleRemoveParentProduct = (index: number) => {
        setFormData(prev => ({
            ...prev,
            parentProductIds: prev.parentProductIds.filter((_, i) => i !== index),
            parentProductNames: prev.parentProductNames.filter((_, i) => i !== index)
        }));
    };

    // ✅ اختيار الوحدة
    const handleSelectUnit = (unit: Unit) => {
        setUnitSearch(unit.id);
        setShowUnitSearch(false);
    };

    // ✅ تصفية الأصناف المباشرة
    const filteredParentProducts = directProductsList.filter(p =>
        p.name.toLowerCase().includes(parentProductSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(parentProductSearch.toLowerCase())
    );

    // ✅ تصفية الوحدات
    const filteredUnits = unitsList.filter(u =>
        u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.code.toLowerCase().includes(unitSearch.toLowerCase())
    );

    // ✅ دالة مساعدة للحصول على اسم نوع الصنف
    const getProductNatureLabel = (nature: string) => {
        switch (nature) {
            case 'basic': return 'الصنف المباشر';
            case 'prepared': return 'الصنف المجهز';
            case 'sub': return 'الصنف المتفرع';
            case 'materials': return 'الخامة';
            default: return 'الصنف';
        }
    };

    // ✅ دالة مساعدة للحصول على الأيقونة المناسبة
    const getProductNatureIcon = (nature: string) => {
        switch (nature) {
            case 'basic': return <Box size={20} />;
            case 'prepared': return <Package size={20} />;
            case 'sub': return <Layers size={20} />;
            case 'materials': return <FolderPlus size={20} />;
            default: return <Box size={20} />;
        }
    };

    // ✅ دالة الحفظ - للتعديل
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            alert(direction === 'rtl' ? 'يرجى إدخال الاسم' : 'Please enter name');
            return;
        }

        if ((formData.productNature === 'basic' || formData.productNature === 'prepared') && !formData.code) {
            alert(direction === 'rtl' ? 'يرجى إدخال الكود' : 'Please enter code');
            return;
        }

        // ✅ التحقق من اختيار صنف أب واحد على الأقل للصنف المتفرع
        if (formData.productNature === 'sub' && formData.parentProductIds.length === 0) {
            alert(direction === 'rtl' ? 'يرجى اختيار صنف مباشر واحد على الأقل' : 'Please select at least one parent product');
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const productPayload: Product = {
                id: id!,
                image: fileName || "",
                code: formData.productNature === 'basic' || formData.productNature === 'prepared' ? formData.code : '',
                name: formData.name,
                nameLang2: formData.nameLang2,
                nameLang3: formData.nameLang3,
                category: formData.category || "عام",
                cost: formData.productNature === 'basic' || formData.productNature === 'materials' ? formData.cost : '0',
                price: '0',
                quantity: "0.00",
                alertQuantity: formData.productNature === 'materials' ? formData.alertQuantity : '0',
                status: 'active',
                productNature: formData.productNature,
                // ✅ حفظ المصفوفات
                parentProductId: formData.productNature === 'sub' ? formData.parentProductIds : '',
                parentProductName: formData.productNature === 'sub' ? formData.parentProductNames : '',
                hideInPos: formData.hideInPos,
                details: formData.details,
                materials: formData.productNature === 'prepared' ? formData.materials : [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            console.log('💾 Updating product:', productPayload);

            if (updateProduct) {
                updateProduct(productPayload);
            }

            setMessage({ type: 'success', text: 'تم حفظ التعديلات بنجاح!' });

            setTimeout(() => {
                navigate('/products', {
                    state: {
                        productNature: formData.productNature,
                        refreshed: true,
                        message: 'تم التعديل بنجاح'
                    }
                });
            }, 1500);

        } catch (err: any) {
            console.error('❌ Error saving:', err);
            setMessage({ type: 'error', text: `خطأ: ${err?.message || 'حدث خطأ غير معروف'}` });
        } finally {
            setIsSaving(false);
        }
    };

    // ✅ تصفية الخامات للبحث
    const filteredMaterials = materialsProductsList.filter(m =>
        m.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.code.toLowerCase().includes(materialSearch.toLowerCase())
    );

    // ✅ عرض حالة التحميل
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={direction || 'rtl'}>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
            </div>
        );
    }

    // ✅ عرض رسالة الخطأ
    if (message?.type === 'error' && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={direction || 'rtl'}>
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
                    <p className="text-gray-600 mb-4">{message.text}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg font-bold hover:bg-[var(--primary-hover)]"
                    >
                        العودة للقائمة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-24" dir={direction}>
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 flex items-center gap-1">
                <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate('/')}>{t('home')}</span>
                <span>/</span>
                <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate('/products')}>{t('products')}</span>
                <span>/</span>
                <span className="text-gray-800 font-medium">
                    تعديل {getProductNatureLabel(formData.productNature)}
                </span>
            </div>

            {/* الهيدر */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Edit2 size={22} className="text-blue-600" />
                    تعديل {getProductNatureLabel(formData.productNature)}: {formData.name || 'جاري التحميل...'}
                </h1>
            </div>

            {/* الفورم */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">

                    {/* 🔹 طبيعة الصنف - للقراءة فقط في التعديل */}
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                        <label className="block text-base font-bold text-blue-900 mb-4">
                            طبيعة الصنف <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {(['basic', 'sub', 'prepared', 'materials'] as const).map((nature) => (
                                <label
                                    key={nature}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-not-allowed min-w-[180px] opacity-60 ${formData.productNature === nature
                                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="productNature"
                                        value={nature}
                                        checked={formData.productNature === nature}
                                        disabled
                                        className="w-5 h-5 accent-white"
                                    />
                                    {getProductNatureIcon(nature)}
                                    <span className="font-bold">{getProductNatureLabel(nature)}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-blue-600 mt-3">لا يمكن تغيير نوع الصنف بعد الإنشاء</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* الحقول حسب النوع */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-5">
                            {/* الاسم */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    اسم {getProductNatureLabel(formData.productNature)} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="takamol-input"
                                    placeholder={`أدخل الاسم...`}
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم باللغة الثانية</label>
                                <input
                                    type="text"
                                    name="nameLang2"
                                    value={formData.nameLang2}
                                    onChange={handleInputChange}
                                    className="takamol-input"
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم باللغة الثالثة</label>
                                <input
                                    type="text"
                                    name="nameLang3"
                                    value={formData.nameLang3}
                                    onChange={handleInputChange}
                                    className="takamol-input"
                                    disabled={isSaving}
                                />
                            </div>

                            {/* الكود - للقراءة فقط */}
                            {(formData.productNature === 'basic' || formData.productNature === 'prepared') && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الكود <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        className="takamol-input font-mono bg-gray-50"
                                        readOnly
                                        disabled={isSaving}
                                    />
                                </div>
                            )}

                            {/* التكلفة */}
                            {(formData.productNature === 'basic' || formData.productNature === 'materials') && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">التكلفة <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        className="takamol-input font-bold text-[var(--primary)]"
                                        step="0.01"
                                        min="0"
                                        required
                                        disabled={isSaving}
                                    />
                                </div>
                            )}

                            {/* حد التنبيه */}
                            {formData.productNature === 'materials' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">حد التنبيه من نفاذ الكمية</label>
                                    <input
                                        type="number"
                                        name="alertQuantity"
                                        value={formData.alertQuantity}
                                        onChange={handleInputChange}
                                        className="takamol-input"
                                        min="0"
                                        placeholder="أدخل الحد الأدنى"
                                        disabled={isSaving}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">سيظهر تنبيه عند وصول الكمية لهذا الحد</p>
                                </div>
                            )}

                            {/* ✅ ✅ ✅ حقل اختيار الأصناف الأب المتعددة - للصنف المتفرع فقط */}
                            {formData.productNature === 'sub' && (
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        الأصناف المباشرة التابعة لها <span className="text-red-500">*</span>
                                    </label>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        {/* ✅ عرض العناصر المختارة كـ Chips */}
                                        {formData.parentProductNames.length > 0 && (
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {formData.parentProductNames.map((name, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                                    >
                                                        {name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveParentProduct(index)}
                                                            className="hover:text-red-600 transition-colors"
                                                            disabled={isSaving}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-12 gap-3">
                                            {/* زر فتح البحث */}
                                            <div className="col-span-3 flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowParentSearch(!showParentSearch)}
                                                    className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] flex items-center justify-center gap-2 font-bold"
                                                    disabled={isSaving}
                                                >
                                                    <Search size={18} />
                                                    اختيار
                                                </button>
                                            </div>

                                            {/* حقل البحث */}
                                            <div className="col-span-9">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">البحث في الأصناف المباشرة</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={parentProductSearch}
                                                        onChange={(e) => {
                                                            setParentProductSearch(e.target.value);
                                                            setShowParentSearch(true);
                                                        }}
                                                        onFocus={() => setShowParentSearch(true)}
                                                        className="takamol-input w-full pr-10"
                                                        placeholder="ابحث عن صنف مباشر..."
                                                        disabled={isSaving}
                                                    />
                                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                </div>

                                                {/* ✅ قائمة النتائج - مع دعم الاختيار المتعدد */}
                                                {showParentSearch && parentProductSearch && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                                        {filteredParentProducts.map(product => {
                                                            const isSelected = formData.parentProductIds.includes(product.id);
                                                            return (
                                                                <div
                                                                    key={product.id}
                                                                    onClick={() => !isSaving && handleToggleParentProduct(product)}
                                                                    className={`p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center justify-between ${isSelected ? 'bg-green-50' : ''}`}
                                                                >
                                                                    <div>
                                                                        <div className="font-bold text-sm">{product.name}</div>
                                                                        <div className="text-xs text-gray-500">الكود: {product.code}</div>
                                                                    </div>
                                                                    {isSelected && (
                                                                        <Check size={16} className="text-green-600" />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        {filteredParentProducts.length === 0 && (
                                                            <div className="p-3 text-center text-gray-500 text-sm">لا توجد أصناف مطابقة</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* جدول الخامات - للصنف المجهز فقط */}
                            {formData.productNature === 'prepared' && (
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الخامات المستخدمة في التجهيز</label>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                                        <div className="grid grid-cols-12 gap-3">
                                            {/* زر الإضافة */}
                                            <div className="col-span-2 flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={handleAddMaterial}
                                                    disabled={!materialSearch || isSaving}
                                                    className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-bold text-sm"
                                                >
                                                    <PlusCircle size={16} />
                                                    إضافة
                                                </button>
                                            </div>

                                            {/* الوحدة */}
                                            <div className="col-span-3">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">الوحدة</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={unitsList.find(u => u.id === unitSearch)?.name || ''}
                                                        onChange={(e) => {
                                                            setUnitSearch('');
                                                            setShowUnitSearch(true);
                                                        }}
                                                        onFocus={() => setShowUnitSearch(true)}
                                                        onClick={() => setShowUnitSearch(true)}
                                                        className="takamol-input w-full pr-8 text-sm"
                                                        placeholder="اختر وحدة..."
                                                        readOnly
                                                        disabled={isSaving}
                                                    />
                                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                </div>

                                                {/* قائمة الوحدات */}
                                                {showUnitSearch && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                                        {filteredUnits.map(unit => (
                                                            <div
                                                                key={unit.id}
                                                                onClick={() => handleSelectUnit(unit)}
                                                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                                            >
                                                                <div className="font-bold text-sm">{unit.name}</div>
                                                                <div className="text-xs text-gray-500">الكود: {unit.code}</div>
                                                            </div>
                                                        ))}
                                                        {filteredUnits.length === 0 && (
                                                            <div className="p-3 text-center text-gray-500 text-sm">لا توجد وحدات</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* الكمية */}
                                            <div className="col-span-3">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">الكمية</label>
                                                <input
                                                    type="number"
                                                    value={materialQuantity}
                                                    onChange={(e) => setMaterialQuantity(e.target.value)}
                                                    className="takamol-input w-full text-center text-sm"
                                                    min="0.01"
                                                    step="0.01"
                                                    placeholder="1"
                                                    disabled={isSaving}
                                                />
                                            </div>

                                            {/* البحث في الخامات */}
                                            <div className="col-span-4">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">البحث في الخامات</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={materialSearch}
                                                        onChange={(e) => {
                                                            setMaterialSearch(e.target.value);
                                                            setShowMaterialSearch(true);
                                                        }}
                                                        onFocus={() => setShowMaterialSearch(true)}
                                                        className="takamol-input w-full pr-8 text-sm"
                                                        placeholder="ابحث عن خامة..."
                                                        disabled={isSaving}
                                                    />
                                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                </div>

                                                {/* قائمة النتائج */}
                                                {showMaterialSearch && materialSearch && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                                        {filteredMaterials.map(material => (
                                                            <div
                                                                key={material.id}
                                                                onClick={() => {
                                                                    setMaterialSearch(material.name);
                                                                    setShowMaterialSearch(false);
                                                                }}
                                                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                                            >
                                                                <div className="font-bold text-sm">{material.name}</div>
                                                                <div className="text-xs text-gray-500">الكود: {material.code}</div>
                                                            </div>
                                                        ))}
                                                        {filteredMaterials.length === 0 && (
                                                            <div className="p-3 text-center text-gray-500 text-sm">لا توجد خامات مطابقة</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* جدول الخامات المضافة */}
                                    {formData.materials.length > 0 && (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 text-right font-bold text-gray-700">الخامة</th>
                                                        <th className="p-3 text-center font-bold text-gray-700 w-24">الكمية</th>
                                                        <th className="p-3 text-center font-bold text-gray-700 w-24">الوحدة</th>
                                                        <th className="p-3 text-center font-bold text-gray-700 w-20">حذف</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {formData.materials.map((material, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="p-3 font-bold text-gray-800">{material.materialName}</td>
                                                            <td className="p-3 text-center">{material.quantity}</td>
                                                            <td className="p-3 text-center text-gray-600">{material.unitName || '-'}</td>
                                                            <td className="p-3 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveMaterial(index)}
                                                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                                                                    disabled={isSaving}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* العمود الثاني */}
                        <div className="space-y-5">
                            {/* التصنيف الرئيسي */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف الرئيسي <span className="text-red-500">*</span></label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="takamol-input"
                                    required
                                    disabled={isSaving}
                                >
                                    <option value="">اختر التصنيف</option>
                                    <option value="مشروبات">مشروبات</option>
                                    <option value="وجبات">وجبات</option>
                                    <option value="حلويات">حلويات</option>
                                    <option value="إكسسوارات">إكسسوارات</option>
                                    <option value="أخرى">أخرى</option>
                                </select>
                            </div>

                            {/* التصنيف الفرعي */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف الفرعي</label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleInputChange}
                                    className="takamol-input"
                                    disabled={isSaving}
                                >
                                    <option value="">اختر (اختياري)</option>
                                    <option value="ساخن">ساخن</option>
                                    <option value="بارد">بارد</option>
                                </select>
                            </div>

                            {/* إخفاء في نقاط البيع */}
                            {formData.productNature !== 'materials' && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <input
                                        type="checkbox"
                                        id="hideInPos"
                                        name="hideInPos"
                                        checked={formData.hideInPos}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded border-gray-300 text-[var(--primary)]"
                                        disabled={isSaving}
                                    />
                                    <label htmlFor="hideInPos" className="text-sm font-bold text-gray-700 cursor-pointer flex-1">
                                        إخفاء في نقاط البيع
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* الصورة */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">صورة {getProductNatureLabel(formData.productNature)}</label>
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                                    accept="image/*"
                                    disabled={isSaving}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-gray-100 border border-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2"
                                    disabled={isSaving}
                                >
                                    <Upload size={16} /> استعراض
                                </button>
                                <input
                                    type="text"
                                    value={fileName}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
                                    readOnly
                                    placeholder={fileName || "لم يتم اختيار ملف"}
                                />
                            </div>
                        </div>

                        {/* الملاحظات */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات</label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                className="takamol-input w-full min-h-[100px]"
                                placeholder="أدخل أي ملاحظات إضافية..."
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {/* رسائل النجاح/الخطأ */}
                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    {/* أزرار الحفظ */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
                            disabled={isSaving}
                        >
                            <X size={18} /> إلغاء
                        </button>
                        <button
                            type="submit"
                            className={cn(
                                "px-8 py-2.5 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm",
                                isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-[var(--primary-hover)]",
                                "bg-[var(--primary)]"
                            )}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الحفظ...</>
                            ) : (
                                <><Save size={20} /> حفظ التعديلات</>
                            )}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}