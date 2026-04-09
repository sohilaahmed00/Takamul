import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Loader2, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useCreateInternalTreasuryTransfer } from "@/features/internal-treasury-transfers/hooks/useCreateInternalTreasuryTransfer";
import ComboboxField from "@/components/ui/ComboboxField";

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddInternalTreasuryTransferModal({
  isOpen,
  onClose,
}: Props) {
  const { direction, t } = useLanguage();
  const { notifySuccess, notifyError } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { mutateAsync: createTransfer, isPending } =
    useCreateInternalTreasuryTransfer();

  const [date, setDate] = useState("");
  const [fromTreasuryId, setFromTreasuryId] = useState<number | undefined>();
  const [toTreasuryId, setToTreasuryId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().slice(0, 10));
      setFromTreasuryId(undefined);
      setToTreasuryId(undefined);
      setAmount("");
      setNotes("");
    }
  }, [isOpen]);

  const fromTreasury = useMemo(
    () => treasurys?.find((item) => item.id === fromTreasuryId),
    [treasurys, fromTreasuryId]
  );

  const toTreasury = useMemo(
    () => treasurys?.find((item) => item.id === toTreasuryId),
    [treasurys, toTreasuryId]
  );

  const formatNumber = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromTreasuryId) {
      notifyError(t("select_from_treasury"));
      return;
    }

    if (!toTreasuryId) {
      notifyError(t("select_to_treasury"));
      return;
    }

    if (fromTreasuryId === toTreasuryId) {
      notifyError(t("cannot_transfer_same_treasury"));
      return;
    }

    if (!amount || Number(amount) <= 0) {
      notifyError(t("valid_transfer_amount"));
      return;
    }

    try {
      await createTransfer({
        fromTreasuryId,
        toTreasuryId,
        amount: Number(amount),
        date,
        notes,
      });

      notifySuccess(t("internal_transfer_saved_successfully"));
      onClose();
    } catch (error: any) {
      notifyError(error?.message || t("save_transfer_error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent
        dir={direction}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-[750px] p-0 overflow-hidden rounded-2xl"
      >
        <DialogHeader className="px-6 py-2 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-lg font-semibold">
            <ArrowLeftRight size={18} />
            {t("add_internal_transfer")}
          </DialogTitle>
        </DialogHeader>

        <form
          id="addInternalTransferForm"
          onSubmit={handleSubmit}
          className="px-6 space-y-2"
        >
          <Field>
            <FieldLabel>{t("movement_date")}</FieldLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10"
            />
          </Field>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">
                {t("from_treasury")}
              </h3>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field>
                <FieldLabel>{t("select_treasury")}</FieldLabel>
                <ComboboxField
                  value={fromTreasuryId}
                  onValueChange={(val) => setFromTreasuryId(val ? Number(val) : undefined)}
                  items={treasurys ?? []}
                  valueKey="id"
                  labelKey="name"
                  placeholder={t("select_treasury")}
                />
              </Field>

              <Field>
                <FieldLabel>{t("current_balance")}</FieldLabel>
                <Input
                  readOnly
                  value={formatNumber(fromTreasury?.currentBalance)}
                  className="h-10 bg-gray-50 text-center"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">
                {t("to_treasury")}
              </h3>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field>
                <FieldLabel>{t("select_treasury")}</FieldLabel>
                <ComboboxField
                  value={toTreasuryId}
                  onValueChange={(val) => setToTreasuryId(val ? Number(val) : undefined)}
                  items={treasurys ?? []}
                  valueKey="id"
                  labelKey="name"
                  placeholder={t("select_treasury")}
                />
              </Field>

              <Field>
                <FieldLabel>{t("current_balance")}</FieldLabel>
                <Input
                  readOnly
                  value={formatNumber(toTreasury?.currentBalance)}
                  className="h-10 bg-gray-50 text-center"
                />
              </Field>
            </div>
          </div>

          <Field>
            <FieldLabel>{t("transfer_amount")}</FieldLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-10"
            />
          </Field>

          <Field>
            <FieldLabel>{t("statement")}</FieldLabel>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("transfer_statement_placeholder")}
              className="h-10"
            />
          </Field>
        </form>

        <DialogFooter className="px-6 py-8 border-t border-gray-100">
          <div className="flex justify-end gap-3 w-full px-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-6"
            >
              {t("cancel")}
            </Button>

            <Button
              form="addInternalTransferForm"
              type="submit"
              disabled={isPending}
              className="min-w-[150px] h-10 px-6"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? t("saving") : t("save_transfer")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}