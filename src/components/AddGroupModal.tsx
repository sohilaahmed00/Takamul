import React, { useRef, useState } from "react";
import { PlusCircle, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useGroups } from "@/context/GroupsContext";
import ResponsiveModal from "./ResponsiveModal";
import Toast from "./Toast";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose }) => {
  const { t, direction } = useLanguage();
  const { addGroup } = useGroups();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [groupName, setGroupName] = useState("");
  const [groupNameSecondary, setGroupNameSecondary] = useState("");
  const [groupNameUr, setGroupNameUr] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setGroupName("");
    setGroupNameSecondary("");
    setGroupNameUr("");
    setDescription("");
    setFileName("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!groupName.trim()) {
      setToastMessage(
        direction === "rtl"
          ? "يرجى إدخال اسم التصنيف"
          : "Please enter category name"
      );
      setToastType("error");
      setShowToast(true);
      return;
    }

    setSubmitting(true);

    try {
      await addGroup(
        groupName.trim(),
        groupNameSecondary.trim() || undefined,
        description.trim() || undefined,
        groupNameUr.trim() || undefined,
        imageFile || undefined
      );

      setToastMessage(
        direction === "rtl"
          ? "تم إضافة التصنيف بنجاح"
          : "Category added successfully"
      );
      setToastType("success");
      setShowToast(true);

      resetForm();
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.error("addGroup error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : direction === "rtl"
          ? "فشل إضافة التصنيف"
          : "Failed to add category";

      setToastMessage(
        direction === "rtl"
          ? `فشل إضافة التصنيف: ${msg}`
          : `Failed to add category: ${msg}`
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImageFile(file);
    } else {
      setFileName("");
      setImageFile(null);
    }
  };

  const toastElement = (
    <Toast
      isOpen={showToast}
      message={toastMessage}
      type={toastType}
      onClose={() => setShowToast(false)}
    />
  );

  return (
    <>
      {toastElement}

      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        title={t("add_group") || t("add_new_group") || "إضافة تصنيف"}
        maxWidth="max-w-2xl"
      >
        <div dir={direction} className="relative">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="add-group-modal-content"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl"
              >
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <button
                    onClick={onClose}
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={t("close") || "إغلاق"}
                  >
                    <X size={22} />
                  </button>

                  <div className="flex items-center gap-2 text-[#2ecc71]">
                    <h2 className="text-lg sm:text-xl font-bold">
                      {t("add_group") || t("add_new_group") || "إضافة تصنيف"}
                    </h2>
                    <PlusCircle size={22} />
                  </div>
                </div>

                <form
                  onSubmit={handleAddGroup}
                  className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto"
                >
                  <p className="text-sm text-gray-500 text-center">
                    {t("mandatory_fields") ||
                      "برجاء إدخال البيانات المطلوبة. الحقول التي تحمل * إجبارية."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <Field label={`${t("group_name") || "اسم التصنيف"} *`}>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]/20"
                        required
                      />
                    </Field>

                    <Field
                      label={
                        t("group_name_secondary_lang") || "الاسم باللغة الثانية"
                      }
                    >
                      <input
                        type="text"
                        value={groupNameSecondary}
                        onChange={(e) => setGroupNameSecondary(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]/20"
                        placeholder="English name"
                      />
                    </Field>

                    <Field
                      label={t("product_name_third_lang") || "الاسم باللغة الثالثة"}
                    >
                      <input
                        type="text"
                        value={groupNameUr}
                        onChange={(e) => setGroupNameUr(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]/20"
                        placeholder="Urdu name"
                      />
                    </Field>

                    <div className="md:col-span-2">
                      <Field label={`${t("description") || "الوصف"}`}>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]/20 resize-none"
                          rows={4}
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-2">
                      <Field label={t("group_image") || "صورة التصنيف"}>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#00a65a] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-[#008d4c] transition-colors flex items-center justify-center gap-2"
                          >
                            <Upload size={16} />
                            {t("browse") || "استعراض"}
                          </button>

                          <input
                            type="text"
                            value={fileName}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-gray-50"
                            readOnly
                            placeholder={
                              direction === "rtl"
                                ? "لم يتم اختيار ملف"
                                : "No file selected"
                            }
                          />
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="flex justify-stretch sm:justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-[#00a65a] text-white px-6 sm:px-10 py-3 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md disabled:opacity-60"
                    >
                      {submitting
                        ? t("saving") || "جارٍ الحفظ..."
                        : t("add_group") || t("add_new_group") || "إضافة تصنيف"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ResponsiveModal>
    </>
  );
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-[#2ecc71] text-right">
        {label}
      </label>
      {children}
    </div>
  );
}

export default AddGroupModal;