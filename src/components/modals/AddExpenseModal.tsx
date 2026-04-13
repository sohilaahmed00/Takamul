import React, { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Pencil,
  Wallet,
  ReceiptText,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetItems } from "@/features/items/hooks/useGetItems";
import type { Expense } from "@/features/expenses/types/expenses.types";

type SubmitPayload = {
  id?: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  treasuryId?: number | null;
  itemId?: number | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: Expense | null;
  onSubmitData: (payload: SubmitPayload) => Promise<void>;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  mode = "add",
  editData = null,
  onSubmitData,
}: Props) {
  const { direction, t } = useLanguage();
  const { notifyError, notifySuccess } = useToast();
  const { data: treasurys } = useGetAllTreasurys();
  const isEditMode = mode === "edit";
  const [isPending, setIsPending] = useState(false);

  const [date, setDate] = useState("");
  const [treasuryId, setTreasuryId] = useState<number | undefined>();
  const [itemId, setItemId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const treasuryRows = useMemo(() => {
    if (Array.isArray(treasurys)) return treasurys;
    return (treasurys as any)?.items ?? [];
  }, [treasurys]);

  const { data: itemsData } = useGetItems({ pageSize: 100 });
  const allItems = useMemo(() => itemsData?.items ?? [], [itemsData]);

  const selectedItem = useMemo(
    () => allItems.find((i) => i.id === itemId) ?? null,
    [allItems, itemId]
  );

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editData) {
      setDate(
        editData.date
          ? new Date(editData.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setTreasuryId(editData.treasuryId ?? undefined);
      setItemId(editData.itemId ?? null);
      setAmount(String(editData.amount ?? ""));
      setNotes(editData.notes ?? "");
      return;
    }

    setDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setItemId(null);
    setAmount("");
    setNotes("");
  }, [isOpen, isEditMode, editData]);

  const selectedTreasury = useMemo(
    () => treasuryRows.find((t: any) => t.id === treasuryId),
    [treasuryRows, treasuryId]
  );

  const currentBalance = Number(
    selectedTreasury?.balance ?? selectedTreasury?.currentBalance ?? 0
  );
  const amountNumber = parseFloat(amount) || 0;
  const balanceAfter = currentBalance - amountNumber;
  const fmt = (v?: number) => Number(v ?? 0).toLocaleString("en-US");

  // Handled by ComboboxField

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      notifyError(t("date_required"));
      return;
    }

    if (!treasuryId) {
      notifyError(t("select_treasury"));
      return;
    }

    if (!itemId) {
      notifyError(t("select_item"));
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      notifyError(t("valid_amount_required"));
      return;
    }

    try {
      setIsPending(true);

      await onSubmitData({
        id: editData?.id,
        name: selectedItem?.name ?? "",
        amount: parsedAmount,
        date: new Date(date).toISOString(),
        notes: notes.trim() || "",
        treasuryId,
        itemId,
      });

      notifySuccess(
        isEditMode ? t("edit_expense_success") : t("add_expense_success")
      );
      onClose();
    } catch (error: any) {
      notifyError(error?.message || t("save_error"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          (document.activeElement as HTMLElement)?.blur();
          onClose();
        }
      }}
    >
      <DialogContent
        dir={direction}
        className="w-full sm:max-w-[750px] p-0 rounded-2xl overflow-hidden max-h-[100vh]"
      >
        <DialogHeader className="px-5 py-3 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-base font-semibold flex-wrap">
            {isEditMode ? <Pencil size={17} /> : <ReceiptText size={17} />}
            {isEditMode ? t("edit_expense") : t("add_expense")}
          </DialogTitle>
        </DialogHeader>

        <form id="expenseForm" onSubmit={handleSubmit} className="px-5 space-y-2">
          <Field>
            <FieldLabel>{t("date")}</FieldLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10"
            />
          </Field>

          <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-transparent p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet size={15} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                {t("treasury")}
              </h3>
            </div>
 
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>{t("treasury")}</FieldLabel>
                <ComboboxField
                  value={treasuryId}
                  onChange={(val) => setTreasuryId(val ? Number(val) : undefined)}
                  items={treasuryRows}
                  valueKey="id"
                  labelKey="name"
                  placeholder={t("select_treasury")}
                />
              </Field>

              <Field>
                <FieldLabel>{t("current_balance")}</FieldLabel>
                <Input
                  readOnly
                  value={fmt(currentBalance)}
                  className="h-10 bg-gray-50 text-center text-sm font-semibold text-[var(--primary)]"
                />
              </Field>
            </div>
          </div>

          <Field>
            <FieldLabel>{t("amount")}</FieldLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-10"
            />
          </Field>

          <Field>
            <FieldLabel>{t("item")}</FieldLabel>
            <ComboboxField
              value={itemId ?? ""}
              onChange={(val) => setItemId(val ? Number(val) : null)}
              items={allItems}
              valueKey="id"
              labelKey="name"
              placeholder={t("select_item")}
              showClear
            />
          </Field>

          <Field>
            <FieldLabel>{t("balance_after")}</FieldLabel>
            <Input
              readOnly
              value={fmt(balanceAfter)}
              className={`h-10 bg-gray-50 text-center font-semibold ${balanceAfter >= 0 ? "text-[#2ecc71]" : "text-red-500"
                }`}
            />
          </Field>

          <Field>
            <FieldLabel>{t("statement")}</FieldLabel>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("expense_statement_placeholder")}
              className="h-10"
            />
          </Field>
        </form>

        <DialogFooter className="px-8 py-4 border-t border-gray-100 h-25">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-6"
            >
              {t("cancel")}
            </Button>
            <Button
              form="expenseForm"
              type="submit"
              disabled={isPending}
              className="min-w-[140px] h-10 px-6"
            >
              {isPending && <Loader2 size={15} className="animate-spin mr-1" />}
              {isPending
                ? t("saving")
                : isEditMode
                  ? t("save_changes")
                  : t("save_expense")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}