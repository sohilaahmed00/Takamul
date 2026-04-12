import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Product, ProductCategoryOption, useProducts } from "@/context/ProductsContext";
import Toast from "../Toast";

import { Input } from "@/components/ui/input";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

type FormErrors = Partial<Record<"nameAr" | "nameEn" | "nameUr" | "code" | "category" | "cost" | "price" | "alertQuantity" | "productType" | "image", string>>;

type FormState = {
  nameAr: string;
  nameEn: string;
  nameUr: string;
  code: string;
  category: string;
  cost: string;
  price: string;
  alertQuantity: string;
  productType: "prepared" | "branched" | "direct";
  imageUrl: string;
};

const PRODUCT_TYPE_OPTIONS = [
  { value: "prepared", label: "Prepared" },
  { value: "branched", label: "Branched" },
  { value: "direct", label: "Direct" },
];

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { direction } = useLanguage();
  const { updateProduct, fetchCategories } = useProducts();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormState>({
    nameAr: "",
    nameEn: "",
    nameUr: "",
    code: "",
    category: "",
    cost: "",
    price: "",
    alertQuantity: "",
    productType: "prepared",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return formData.imageUrl || "";
  }, [imageFile, formData.imageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageFile, previewUrl]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const loadLookups = async () => {
      try {
        setLoadingLookups(true);
        const cats = await fetchCategories();

        if (!mounted) return;
        setCategories(cats);
      } finally {
        if (mounted) setLoadingLookups(false);
      }
    };

    loadLookups();

    return () => {
      mounted = false;
    };
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (!product || !isOpen) return;

    setImageFile(null);
    setErrors({});

    setFormData({
      nameAr: product.nameAr ?? product.name ?? "",
      nameEn: product.nameEn ?? product.name ?? "",
      nameUr: product.nameUr ?? product.name ?? "",
      code: product.code ?? "",
      category: product.category ?? "",
      cost: String(product.cost ?? ""),
      price: String(product.price ?? ""),
      alertQuantity: String(product.alertQuantity ?? ""),
      productType: product.productType === "branched" ? "branched" : product.productType === "direct" ? "direct" : "prepared",
      imageUrl: product.image ?? "",
    });
  }, [product, isOpen]);

  const setField = (key: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "من فضلك اختر ملف صورة صحيح" }));
      showToast("error", "من فضلك اختر ملف صورة صحيح");
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(f);
  };

  const isValidNumberString = (value: string) => value.trim() !== "" && !Number.isNaN(Number(value));

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.nameAr.trim()) nextErrors.nameAr = "الاسم العربي مطلوب";
    if (!formData.nameEn.trim()) nextErrors.nameEn = "الاسم الإنجليزي مطلوب";
    if (!formData.nameUr.trim()) nextErrors.nameUr = "الاسم الثالث مطلوب";

    if (!formData.category.trim()) nextErrors.category = "التصنيف الرئيسي مطلوب";

    if (!formData.productType.trim()) nextErrors.productType = "نوع الصنف مطلوب";

    if (!isValidNumberString(formData.cost) || Number(formData.cost) < 0) {
      nextErrors.cost = "التكلفة يجب أن تكون رقمًا صحيحًا أو صفر";
    }

    if (!isValidNumberString(formData.price) || Number(formData.price) < 0) {
      nextErrors.price = "سعر البيع يجب أن يكون رقمًا صحيحًا أو صفر";
    }

    if (!isValidNumberString(formData.alertQuantity) || Number(formData.alertQuantity) < 0) {
      nextErrors.alertQuantity = "حد التنبيه يجب أن يكون رقمًا صحيحًا أو صفر";
    }

    if (!formData.imageUrl && !imageFile) {
      nextErrors.image = "صورة الصنف مطلوبة";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || submitting) return;

    if (!validate()) {
      showToast("error", "من فضلك راجع البيانات المطلوبة");
      return;
    }

    setSubmitting(true);

    const res = await updateProduct(product.id, {
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn.trim(),
      nameUr: formData.nameUr.trim(),
      code: formData.code.trim(),
      category: formData.category.trim(),
      cost: formData.cost.trim(),
      price: formData.price.trim(),
      alertQuantity: formData.alertQuantity.trim(),
      productType: formData.productType,
      imageFile: imageFile ?? null,
      parentProductId: product.parentProductId ?? 0,
    });

    if (res.ok) {
      showToast("success", res.message || "تم حفظ تعديلات الصنف بنجاح");
      setTimeout(() => onClose(), 500);
    } else {
      showToast("error", res.message || "فشل حفظ التعديلات");
    }

    setSubmitting(false);
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md" dir={direction}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>

            <div className="flex items-center gap-2 text-[#2ecc71]">
              <h2 className="text-xl font-bold">تعديل الصنف</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">برجاء إدخال بيانات الصنف. الحقول التي تحمل علامة * هي حقول إجبارية.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="اسم الصنف بالعربي *" error={errors.nameAr}>
                  <Input type="text" className={inputClass(errors.nameAr)} value={formData.nameAr} onChange={(e) => setField("nameAr", e.target.value)} />
                </Field>

                <Field label="اسم الصنف بالإنجليزي *" error={errors.nameEn}>
                  <Input type="text" className={inputClass(errors.nameEn)} value={formData.nameEn} onChange={(e) => setField("nameEn", e.target.value)} />
                </Field>

                <Field label="اسم الصنف الثالث *" error={errors.nameUr}>
                  <Input type="text" className={inputClass(errors.nameUr)} value={formData.nameUr} onChange={(e) => setField("nameUr", e.target.value)} />
                </Field>

                <Field label="باركود الصنف" error={errors.code}>
                  <Input type="text" className={inputClass(errors.code)} value={formData.code} onChange={(e) => setField("code", e.target.value)} />
                </Field>

                <Field label="التصنيف الرئيسي *" error={errors.category}>
                  <select className={inputClass(errors.category)} value={formData.category} onChange={(e) => setField("category", e.target.value)}>
                    <option value="">اختر التصنيف الرئيسي</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="نوع الصنف *" error={errors.productType}>
                  <select className={inputClass(errors.productType)} value={formData.productType} onChange={(e) => setField("productType", e.target.value as "prepared" | "branched" | "direct")}>
                    {PRODUCT_TYPE_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="التكلفة *" error={errors.cost}>
                  <Input type="number" className={inputClass(errors.cost)} value={formData.cost} onChange={(e) => setField("cost", e.target.value)} placeholder="أدخل التكلفة" />
                </Field>

                <Field label="سعر البيع *" error={errors.price}>
                  <Input type="number" className={inputClass(errors.price)} value={formData.price} onChange={(e) => setField("price", e.target.value)} placeholder="أدخل سعر البيع" />
                </Field>

                <Field label="حد تنبيه المخزون *" error={errors.alertQuantity}>
                  <Input type="number" className={inputClass(errors.alertQuantity)} value={formData.alertQuantity} onChange={(e) => setField("alertQuantity", e.target.value)} placeholder="أدخل حد التنبيه" />
                </Field>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#2ecc71] text-right">صورة الصنف *</label>

                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                    <div className={`w-full h-44 rounded-lg bg-white border flex items-center justify-center overflow-hidden ${errors.image ? "border-red-400" : "border-gray-200"}`}>{previewUrl ? <img src={previewUrl} alt="preview" className="w-full h-full object-contain" /> : <span className="text-gray-400 text-sm">لا توجد صورة</span>}</div>

                    <div className="flex justify-between items-center mt-3 gap-3">
                      <span className="text-xs text-gray-500">{imageFile ? imageFile.name : "سيتم استخدام الصورة الحالية إذا لم يتم تغييرها"}</span>

                      <button type="button" onClick={onPickImage} className="bg-[#00a65a] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#008d4c] transition-colors">
                        تغيير الصورة
                      </button>
                    </div>

                    {errors.image && <p className="text-red-500 text-xs mt-2 text-right">{errors.image}</p>}

                    <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                  </div>
                </div>
              </div>
            </div>

            {loadingLookups && <div className="text-center text-sm text-gray-500">جارٍ تحميل التصنيفات...</div>}

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={submitting} className="bg-[#00a65a] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md disabled:opacity-60">
                {submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>
          </form>
        </motion.div>

        <Toast isOpen={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
      </div>
    </AnimatePresence>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-[#2ecc71] text-right">{label}</label>
      {children}
      {error ? <p className="text-red-500 text-xs text-right">{error}</p> : null}
    </div>
  );
}

function inputClass(hasError?: string) {
  return `w-full border rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] ${hasError ? "border-red-400" : "border-gray-200"}`;
}
