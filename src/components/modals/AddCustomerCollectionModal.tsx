import React, { useEffect, useMemo, useState } from "react";
import { HandCoins, Loader2, Wallet, Pencil } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { useCreateCustomerTransaction } from "@/features/customer-transactions/hooks/useCreateCustomerTransaction";
import { useUpdateCustomerTransaction } from "@/features/customer-transactions/hooks/useUpdateCustomerTransaction";
import type { CustomerTransaction } from "@/features/customer-transactions/types/customerTransactions.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: CustomerTransaction | null;
};

export default function AddCustomerCollectionModal({ isOpen, onClose, mode = "add", editData = null }: Props) {
  const { direction, t } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { data: customers } = useGetAllCustomers({ page: 1, limit: 1000 });

  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateCustomerTransaction();

  const { mutateAsync: updateTransaction, isPending: isUpdating } = useUpdateCustomerTransaction();

  const isEditMode = mode === "edit";
  const isPending = isCreating || isUpdating;

  const [transactionDate, setTransactionDate] = useState("");
  const [treasuryId, setTreasuryId] = useState<number | undefined>();
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editData) {
      setTransactionDate(editData.transactionDate ? new Date(editData.transactionDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
      setTreasuryId(editData.treasuryId);
      setCustomerId(editData.customerId);
      setAmount(String(editData.amount ?? ""));
      setDescription(editData.description ?? "");
      return;
    }

    setTransactionDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setCustomerId(undefined);
    setAmount("");
    setDescription("");
  }, [isOpen, isEditMode, editData]);

  const selectedCustomer = useMemo(
    () => customers?.items?.find((c: any) => c.id === customerId),
    [customers, customerId]
  );
  const currentBalance = Number(selectedCustomer?.balance ?? 0);
  const amountNumber = Number(amount || 0);
  const balanceAfter = currentBalance - amountNumber;

  const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString("en-US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionDate) {
      notifyError(t("date_required"));
      return;
    }

    if (!treasuryId) {
      notifyError(t("select_treasury"));
      return;
    }

    if (!customerId) {
      notifyError(t("select_customer"));
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      notifyError(t("valid_amount_required"));
      return;
    }

    try {
      if (isEditMode && editData) {
        await updateTransaction({
          id: editData.id,
          treasuryId,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

        notifySuccess(t("edit_customer_collection_success"));
      } else {
        await createTransaction({
          customerId,
          treasuryId,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

        notifySuccess(t("add_customer_collection_success"));
      }

      onClose();
    } catch (error: any) {
      notifyError(
        error?.response?.data?.message ||
        error?.message ||
        t("save_error")
      );
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
      <DialogContent dir={direction} onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()} className="w-full sm:max-w-[720px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-5 py-2 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-lg font-semibold flex-wrap">
            {isEditMode ? <Pencil size={18} /> : <HandCoins size={18} />}
            {isEditMode ? t("edit_customer_collection") : t("add_customer_collection")}
          </DialogTitle>
        </DialogHeader>

        <form id="customerCollectionForm" onSubmit={handleSubmit} className="px-5 space-y-3">
          <Field>
            <FieldLabel>{t("date")}</FieldLabel>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="h-9"
            />
          </Field>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">{t("treasury")}</h3>
            </div>

            <Field>
              <select
                value={treasuryId ?? ""}
                onChange={(e) =>
                  setTreasuryId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full h-9 rounded-xl border border-gray-200 px-3 bg-white outline-none focus:border-[#2ecc71]"
              >
                <option value="">{t("select_treasury")}</option>
                {(treasurys ?? []).map((tRow: any) => (
                  <option key={tRow.id} value={tRow.id}>
                    {tRow.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 space-y-3">
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field>
                <FieldLabel>{t("customer_name")}</FieldLabel>
                <select
                  value={customerId ?? ""}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={isEditMode}
                  className="w-full h-9 rounded-xl border border-gray-200 px-3 bg-white outline-none focus:border-[#2ecc71] disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">{t("select_customer")}</option>
                  {(customers?.items ?? []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.customerName}
                    </option>
                  ))}
                  
                </select>
              </Field>

              <Field>
                <FieldLabel>{t("current_balance")}</FieldLabel>
                <Input
                  readOnly
                  value={formatNumber(currentBalance)}
                  className="h-9 bg-gray-50 text-center"
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
              className="h-9"
            />
          </Field>

          <Field>
            <FieldLabel>{t("balance_after")}</FieldLabel>
            <Input
              readOnly
              value={formatNumber(balanceAfter)}
              className="h-9 bg-gray-50 text-center text-[#2ecc71] font-semibold"
            />
          </Field>

          <Field>
            <FieldLabel>{t("statement")}</FieldLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("customer_collection_statement_placeholder")}
              className="h-9"
            />
          </Field>
        </form>

        <DialogFooter className="px-5 py-7 border-t border-gray-100">
          <div className="flex justify-end gap-3 w-full px-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-6"
            >
              {t("cancel")}
            </Button>

            <Button form="customerCollectionForm" type="submit" disabled={isPending} className="min-w-[150px] h-10 px-6">
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending
                ? isEditMode
                  ? t("updating")
                  : t("saving")
                : isEditMode
                  ? t("save_changes")
                  : t("save_customer_collection")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
