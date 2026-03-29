import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";

import { useCreateTreasury } from "@/features/treasurys/hooks/useCreateTreasury";
import { useGetTreasuryById } from "@/features/treasurys/hooks/useGetTreasuryById";
import { useUpdateTreasury } from "@/features/treasurys/hooks/useUpdateTreasury";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  treasuryId?: number;
};

export default function TreasuryModal({
  isOpen,
  onClose,
  treasuryId,
}: Props) {
<<<<<<< HEAD
  const { direction, t } = useLanguage();
=======
  const { direction } = useLanguage();
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
  const { notifySuccess, notifyError } = useToast();

  const isEdit = !!treasuryId;

  const { data: treasury, isLoading: isTreasuryLoading } =
    useGetTreasuryById(treasuryId);
  const { mutateAsync: createTreasury, isPending: isCreating } =
    useCreateTreasury();
  const { mutateAsync: updateTreasury, isPending: isUpdating } =
    useUpdateTreasury();

  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("0");

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && treasury) {
      setName(treasury.name ?? "");
      setOpeningBalance(String(treasury.openingBalance ?? 0));
    } else {
      setName("");
      setOpeningBalance("0");
    }
  }, [isOpen, isEdit, treasury]);

  const isSubmitting = useMemo(
    () => isCreating || isUpdating,
    [isCreating, isUpdating]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
<<<<<<< HEAD
      notifyError(t('treasury_name_required') || "اسم الخزينة مطلوب");
=======
      notifyError("اسم الخزينة مطلوب");
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
      return;
    }

    try {
      if (isEdit) {
        await updateTreasury({
          id: treasuryId!,
          name: name.trim(),
          openingBalance: Number(openingBalance || 0),
        });
        notifySuccess("تم تعديل الخزينة بنجاح");
      } else {
        await createTreasury({
          name: name.trim(),
          openingBalance: Number(openingBalance || 0),
        });
        notifySuccess("تمت إضافة الخزينة بنجاح");
      }

      onClose();
    } catch (error: any) {
      notifyError(error?.message || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent
        dir={direction}
        className="sm:max-w-[620px] lg:max-w-[680px] p-0 overflow-hidden"
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-xl">
            <Wallet size={20} />
<<<<<<< HEAD
            {isEdit ? t('treasury_modal_title_edit') || "تعديل خزينة" : t('treasury_modal_title_add') || "إضافة خزينة"}
=======
            {isEdit ? "تعديل خزينة" : "إضافة خزينة"}
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
          </DialogTitle>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "يمكنك تعديل اسم الخزينة والرصيد الافتتاحي"
              : "أدخل بيانات الخزينة الجديدة"}
          </p>
        </DialogHeader>

        <form
          id="treasuryForm"
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto px-6 py-5"
        >
          {isEdit && isTreasuryLoading ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className="animate-spin text-[var(--primary)]" size={26} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              <Field>
                <FieldLabel>
<<<<<<< HEAD
                  {t('treasury_name_label') || 'اسم الخزينة'} <span className="text-red-500">*</span>
=======
                  اسم الخزينة <span className="text-red-500">*</span>
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
                </FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسم الخزينة"
                />
              </Field>

              <Field>
<<<<<<< HEAD
                <FieldLabel>{t('treasury_opening_balance') || 'الرصيد الافتتاحي'}</FieldLabel>
=======
                <FieldLabel>الرصيد الافتتاحي</FieldLabel>
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
                <Input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0"
                />
              </Field>
            </div>
          )}
        </form>

        <DialogFooter className="px-8 py-8 border-t border-gray-100">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
<<<<<<< HEAD
              {t('cancel') || 'إلغاء'}
=======
              إلغاء
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
            </Button>

            <Button
              form="treasuryForm"
              type="submit"
              disabled={isSubmitting || (isEdit && isTreasuryLoading)}
              className="min-w-[160px]"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting
                ? "جارٍ الحفظ..."
                : isEdit
<<<<<<< HEAD
                  ? "حفظ التعديلات"
                  : "إضافة خزينة"}
=======
                ? "حفظ التعديلات"
                : "إضافة خزينة"}
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}