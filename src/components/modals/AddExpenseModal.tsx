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
  const [itemSearch, setItemSearch] = useState("");
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const treasuryRows = useMemo(() => {
    if (Array.isArray(treasurys)) return treasurys;
    return (treasurys as any)?.items ?? [];
  }, [treasurys]);

  const { data: itemsData } = useGetItems({ pageSize: 100 });
  const allItems = useMemo(() => itemsData?.items ?? [], [itemsData]);

  const filteredItems = useMemo(() => {
    const term = itemSearch.trim().toLowerCase();
    if (!term) return allItems;
    return allItems.filter((i) => i.name.toLowerCase().includes(term));
  }, [allItems, itemSearch]);

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
      setItemSearch(editData.itemName || "");
      setAmount(String(editData.amount ?? ""));
      setNotes(editData.notes ?? "");
      return;
    }

    setDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setItemId(null);
    setItemSearch("");
    setAmount("");
    setNotes("");
    setIsItemDropdownOpen(false);
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

  const handleSelectItem = (id: number, name: string) => {
    setItemId(id);
    setItemSearch(name);
    setIsItemDropdownOpen(false);
  };

  const handleClearItem = () => {
    setItemId(null);
    setItemSearch("");
  };

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
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
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

          <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet size={15} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">
                {t("treasury")}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>{t("treasury")}</FieldLabel>
                <select
                  value={treasuryId ?? ""}
                  onChange={(e) =>
                    setTreasuryId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 bg-white outline-none focus:border-[#2ecc71] text-sm"
                >
                  <option value="">{t("select_treasury")}</option>
                  {treasuryRows.map((tRow: any) => (
                    <option key={tRow.id} value={tRow.id}>
                      {tRow.name}
                    </option>
                  ))}
                </select>
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
            <div className="relative">
              <div
                className={`w-full h-10 rounded-xl border px-3 bg-white flex items-center justify-between cursor-pointer text-sm transition-colors ${isItemDropdownOpen ? "border-[#2ecc71]" : "border-gray-200"
                  }`}
                onClick={() => setIsItemDropdownOpen((v) => !v)}
              >
                <span className={selectedItem ? "text-gray-800" : "text-gray-400"}>
                  {selectedItem ? selectedItem.name : t("select_item")}
                </span>

                <div className="flex items-center gap-1">
                  {selectedItem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearItem();
                      }}
                      className="p-0.5 rounded hover:bg-gray-100"
                    >
                      <X size={13} className="text-gray-400" />
                    </button>
                  )}
                  <ChevronDown
                    size={15}
                    className={`text-gray-400 transition-transform ${isItemDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>

              {isItemDropdownOpen && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute top-1/2 -translate-y-1/2 right-2.5 text-gray-400"
                      />
                      <input
                        type="text"
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder={t("search_item_placeholder")}
                        autoFocus
                        className="w-full h-8 rounded-lg border border-gray-200 pr-8 pl-3 text-sm outline-none focus:border-[#2ecc71]"
                      />
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {filteredItems.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-gray-400">
                        {t("no_items")}
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item.id, item.name)}
                          className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-[#2ecc71]/5 transition-colors flex items-center justify-between ${itemId === item.id
                              ? "bg-[#2ecc71]/10 text-[#2ecc71] font-medium"
                              : "text-gray-700"
                            }`}
                        >
                          {item.name}
                          {itemId === item.id && (
                            <span className="text-[#2ecc71] text-xs">✓</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
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