import React, { useState } from "react";
import { Landmark, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useBanks } from "@/context/BanksContext";
import type { ExternalTransfer } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

interface AddExternalTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transfer: Omit<ExternalTransfer, "id" | "date">) => void;
}

export default function AddExternalTransferModal({
  isOpen,
  onClose,
  onSave,
}: AddExternalTransferModalProps) {
  const { direction, t } = useLanguage();
  const { banks } = useBanks();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<ExternalTransfer, "id" | "date">>({
    bankId: "",
    amount: 0,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      onSave(formData);
      setFormData({
        bankId: "",
        amount: 0,
        notes: "",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
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
            <Landmark size={20} />
            {t("add_external_transfer") || "إضافة تحويل خارجي"}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            {t("please_enter_transfer_info") || "أدخل بيانات التحويل الخارجي"}
          </p>
        </DialogHeader>

        <form
          id="addExternalTransferForm"
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-5">
            <Field>
              <FieldLabel>{t("select_bank") || "اختر البنك"} *</FieldLabel>
              <select
                value={formData.bankId}
                onChange={(e) =>
                  setFormData({ ...formData, bankId: e.target.value })
                }
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-[#2ecc71]"
                required
              >
                <option value="">{t("select_bank") || "اختر البنك"}</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel>{t("paid_amount") || "المبلغ"} *</FieldLabel>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: Number(e.target.value),
                  })
                }
                required
              />
            </Field>

            <Field>
              <FieldLabel>{t("notes") || "ملاحظات"}</FieldLabel>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#2ecc71] resize-none"
              />
            </Field>
          </div>
        </form>

        <DialogFooter className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>

            <Button
              form="addExternalTransferForm"
              type="submit"
              disabled={isSubmitting}
              className="min-w-[170px]"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting
                ? "جارٍ الحفظ..."
                : t("add_external_transfer") || "إضافة تحويل خارجي"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}