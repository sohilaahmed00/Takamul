import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useProducts, Product } from "@/context/ProductsContext";
import Toast from "./Toast";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { t, direction } = useLanguage();

  // ✅ لازم تكون موجودة في ProductsContext
  // لو مش موجودة عندك، هقولك تحت تعملها ازاي
  const { updateProduct } = useProducts() as any;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    cost: 0,
    price: 0,
    quantity: 0,
    unit: "",
    alertQuantity: 0,
    image: "",
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  useEffect(() => {
    if (!product || !isOpen) return;

    setFormData({
      name: product.name ?? "",
      code: product.code ?? "",
      category: (product as any).category ?? "",
      cost: Number(product.cost ?? 0),
      price: Number(product.price ?? 0),
      quantity: Number(product.quantity ?? 0),
      unit: product.unit ?? "",
      alertQuantity: Number((product as any).alertQuantity ?? 0),
      image: (product as any).image ?? "",
    });
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || submitting) return;

    if (!updateProduct) {
      showToast("error", "updateProduct غير موجودة في ProductsContext");
      return;
    }

    // ✅ validation بسيط من غير تغيير لوجيك
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("error", "اسم الصنف + كود الصنف حقول إجبارية");
      return;
    }

    setSubmitting(true);

    // ✅ payload للتعديل (عدّل أسماء المفاتيح لو API عندك مختلف)
    const updates = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      category: formData.category,
      cost: Number(formData.cost),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      unit: formData.unit,
      alertQuantity: Number(formData.alertQuantity),
      image: formData.image,
    };

    try {
      const res = await updateProduct(product.id, updates);

      if (res?.ok || res === true) {
        showToast("success", t("operation_completed_successfully") || "تم التعديل بنجاح");
        setTimeout(() => onClose(), 400);
      } else {
        showToast("error", res?.message || "فشل التعديل");
      }
    } catch (err) {
      showToast("error", "فشل التعديل");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
        dir={direction}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 text-[#2ecc71]">
              <h2 className="text-xl font-bold">{t("edit_product") || "تعديل الصنف"}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">
              برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="اسم الصنف *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>

                <Field label="كود الصنف *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </Field>

                <Field label="التصنيف الرئيسي">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </Field>

                <Field label="وحدة">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </Field>
              </div>

              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="التكلفة">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  />
                </Field>

                <Field label="سعر البيع">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </Field>

                <Field label="الكمية">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </Field>

                <Field label="تنبيهات بكميات المخزون">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.alertQuantity}
                    onChange={(e) => setFormData({ ...formData, alertQuantity: Number(e.target.value) })}
                  />
                </Field>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#00a65a] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md disabled:opacity-60"
              >
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-[#2ecc71] text-right">{label}</label>
      {children}
    </div>
  );
}