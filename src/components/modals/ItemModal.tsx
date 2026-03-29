import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";
import type { Item } from "@/features/items/types/items.types";
import useCreateItem from "@/features/items/hooks/useCreateItem";
import useUpdateItem from "@/features/items/hooks/useUpdateItem";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Item | null;
}

export default function ItemModal({ isOpen, onClose, item = null }: ItemModalProps) {
  const { direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();
  const isEdit = !!item;

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { mutateAsync: createItemMutation, isPending: isCreating } = useCreateItem();
  const { mutateAsync: updateItemMutation, isPending: isUpdating } = useUpdateItem();

  useEffect(() => {
    if (!isOpen) return;
    if (item) {
      setName(item.name || "");
      setIsActive(item.isActive);
    } else {
      setName("");
      setIsActive(true);
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const isPending = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { notifyError("اسم البند مطلوب"); return; }

    try {
      if (isEdit && item) {
        await updateItemMutation({ id: item.id, data: { name: name.trim(), isActive } });
        notifySuccess("تم تعديل البند بنجاح");
      } else {
        await createItemMutation({ name: name.trim() });
        notifySuccess("تم إضافة البند بنجاح");
      }
      onClose();
    } catch {
      notifyError("حدث خطأ ما، حاول مرة أخرى");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div dir={direction} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">{isEdit ? "تعديل بند" : "إضافة بند"}</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">اسم البند</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم البند"
              className="h-10 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {isEdit && (
            <div className="flex items-center gap-3">
              <input
                id="item-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <label htmlFor="item-active" className="text-sm font-medium">نشط</label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 size={15} className="animate-spin mr-1" />}
              {isPending ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}