import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import { useLanguage } from "@/context/LanguageContext";
import type { Item } from "@/features/items/types/items.types";
import useCreateItem from "@/features/items/hooks/useCreateItem";
import useUpdateItem from "@/features/items/hooks/useUpdateItem";

import { Input } from "@/components/ui/input";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Item | null;
}

export default function ItemModal({
  isOpen,
  onClose,
  item = null,
}: ItemModalProps) {
  const { direction, t } = useLanguage();
  const { notifySuccess, notifyError } = useToast();
  const isEdit = !!item;

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { mutateAsync: createItemMutation, isPending: isCreating } =
    useCreateItem();
  const { mutateAsync: updateItemMutation, isPending: isUpdating } =
    useUpdateItem();

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

    if (!name.trim()) {
      notifyError(t("item_name_required"));
      return;
    }

    try {
      if (isEdit && item) {
        await updateItemMutation({
          id: item.id,
          data: { name: name.trim(), isActive },
        });
        notifySuccess(t("edit_item_success"));
      } else {
        await createItemMutation({ name: name.trim() });
        notifySuccess(t("add_item_success"));
      }

      onClose();
    } catch {
      notifyError(t("generic_try_again"));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div
        dir={direction}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl transition-colors duration-300"
      >
        <div className="flex items-center justify-between border-b dark:border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-bold">
            {isEdit ? t("edit_item") : t("add_item")}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t("item_name")}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enter_item_name")}
              className="h-10 w-full rounded-xl border dark:border-zinc-800 px-3 outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>

          {isEdit && (
            <div className="flex items-center gap-3">
              <Input
                id="item-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <label htmlFor="item-active" className="text-sm font-medium">
                {t("active")}
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 size={15} className="animate-spin mr-1" />}
              {isPending
                ? t("saving")
                : isEdit
                  ? t("save_changes")
                  : t("add_item")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}