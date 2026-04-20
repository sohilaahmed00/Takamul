import { useEffect, useState } from "react";
import { Trash2, Delete, Plus, X, Vault } from "lucide-react";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { Treasury } from "@/features/treasurys/types/treasurys.types";
import { usePos } from "@/context/PosContext";
import { calcTotals } from "@/constants/data";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ps } from "zod/v4/locales";
import { useLanguage } from "@/context/LanguageContext";

interface Split {
  id: string;
  vaultId: number;
  raw: string;
}

const rawToFloat = (r: string) => parseInt(r || "0") / 100;
const fmtFloat = (n: number) => "$" + n.toFixed(2);
const fmtRaw = (r: string) => fmtFloat(rawToFloat(r));

// ── Vault Chips (horizontal scroll) ─────────────────────────────────────────
function VaultChips({ value, onChange, treasurys }: { value: number; onChange: (id: number) => void; treasurys: Treasury[] }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" } as React.CSSProperties} onClick={(e) => e.stopPropagation()}>
      {treasurys.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 transition-all flex-shrink-0
    ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-border/80"}`}
          >
            <Vault size={10} className={active ? "text-primary" : "text-muted-foreground"} />
            <span className={`text-xs font-bold whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}>{v.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Numpad ───────────────────────────────────────────────────────────────────
const ROWS = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [".", "0", "del"],
];

export function Numpad({ onKey }: { onKey: (k: string) => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-1.5">
      {ROWS.map((row, ri) => (
        <div key={ri} className="grid gap-1.5" style={{ gridTemplateColumns: row.length === 2 ? "1fr 2fr" : "repeat(3,1fr)" }}>
          {row.map((k) => (
            <button key={k} onClick={() => onKey(k)} className="rounded-xl border border-border bg-muted/50 hover:bg-muted active:scale-95 transition-all text-sm font-semibold text-foreground" style={{ minHeight: 48 }}>
              {k === "del" ? <Delete size={15} className="mx-auto text-muted-foreground" /> : k === "cancel" ? t("cancel") : k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── CashierPanel ─────────────────────────────────────────────────────────────
export default function CashierPanel({ onCancel }: { onCancel?: () => void }) {
  const { t } = useLanguage();
  const { data: treasurys } = useGetAllTreasurys();
  const { selectedCustomer, setSelectedCustomer, cart, discount, setPaidAmount, setSelectedVaultId } = usePos();
  const { total } = calcTotals(cart, discount);

  const [vaultId, setVaultId] = useState<number | null>(null);
  const activeVault = vaultId ?? treasurys?.[0]?.id ?? null;

  const [npRaw, setNpRaw] = useState(() => String(Math.round(total * 100)));
  const [isSplit, setIsSplit] = useState(false);
  const [splits, setSplits] = useState<Split[]>([]);
  const [pendingClear, setPendingClear] = useState(false);
  const [activeId, _setActiveId] = useState("s1");
  const [justActivated, setJustActivated] = useState(false);

  const setActiveId = (id: string) => {
    _setActiveId(id);
    setJustActivated(true);
  };

  useEffect(() => {
    if (treasurys?.length && vaultId === null) {
      setVaultId(treasurys[0].id);
      setSelectedVaultId(treasurys[0].id);
    }
  }, [treasurys]);

  const pushKey = (k: string) => {
    if (k === "cancel") {
      onCancel?.();
      return;
    }

    const transform = (prev: string) => {
      if (k === "del") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (k === "00") return prev === "0" ? "0" : prev + "00";
      if (k === ".") return prev.includes(".") ? prev : prev + ".";
      return prev === "0" ? k : prev + k;
    };

    if (!isSplit) {
      setNpRaw((p) => transform(p));
    } else {
      setSplits((prev) => {
        const shouldClear = justActivated && k !== "del" && k !== ".";

        const updated = prev.map((s) => {
          if (s.id !== activeId) return s;
          const base = shouldClear ? "0" : s.raw;
          return { ...s, raw: transform(base) };
        });

        const otherIds = prev.map((s) => s.id).filter((id) => id !== activeId);
        if (otherIds.length === 1) {
          const activePaid = updated.find((s) => s.id === activeId)!;
          const activeAmt = rawToFloat(activePaid.raw);
          const remaining = total - activeAmt;
          const remainRaw = remaining > 0 ? String(Math.round(remaining * 100)) : "0";

          return updated.map((s) => (s.id === otherIds[0] ? { ...s, raw: remainRaw } : s));
        }

        return updated;
      });

      if (justActivated) setJustActivated(false);
    }
  };

  const toggleSplit = () => {
    setIsSplit((v) => {
      if (!v) {
        setSplits([
          { id: "s1", vaultId: treasurys?.[0]?.id ?? 0, raw: "0" },
          { id: "s2", vaultId: treasurys?.[0]?.id ?? 0, raw: "0" },
        ]);
        setActiveId("s1");
        setPendingClear(false);
      }
      return !v;
    });
  };

  const singlePaid = rawToFloat(npRaw);
  const splitPaid = splits.reduce((sum, s) => sum + rawToFloat(s.raw), 0);
  const paid = isSplit ? splitPaid : singlePaid;
  const change = parseFloat((paid - total).toFixed(2));

  useEffect(() => {
    setPaidAmount(paid);
  }, [paid]);

  return (
    <div style={{ width: 550 }} className="border-l border-border flex flex-col h-full bg-muted/20">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
        {/* Header card */}
        <Card className="bg-card shadow-xs border-0">
          <CardHeader>
            <CardTitle>
              <div className="text-xs text-muted-foreground mb-0.5">{t("payable_amount")}</div>
              <div className="text-2xl font-black text-primary">${total.toFixed(2)}</div>
            </CardTitle>
            <CardAction>
              {selectedCustomer ? (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">{selectedCustomer.customerName.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{selectedCustomer.customerName}</div>
                    <div className="text-xs text-muted-foreground">#{selectedCustomer.id}</div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground bg-muted border border-border rounded-xl px-3 py-2">{t("no_customer_selected")}</div>
              )}
            </CardAction>
          </CardHeader>
        </Card>

        {/* Payment card */}
        <Card className="bg-card border-0 shadow-xs">
          <CardHeader>
            <span className="text-xs font-semibold text-muted-foreground">{isSplit ? t("split_between_vaults") : t("destination_vault")}</span>
            <CardAction>
              <button
                onClick={toggleSplit}
                className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors
              ${isSplit ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/50"}`}
              >
                {isSplit ? t("split_on") : t("split_payment")}
              </button>
            </CardAction>
          </CardHeader>

          <CardContent className="space-y-3">
            {!isSplit && (
              <>
                <VaultChips
                  value={activeVault ?? 0}
                  onChange={(id) => {
                    setVaultId(id);
                    setSelectedVaultId(id);
                  }}
                  treasurys={treasurys ?? []}
                />
                <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{t("tendered")}</div>
                    <div className="text-2xl font-black text-foreground">{fmtFloat(singlePaid)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{change >= 0 ? t("change") : t("remaining")}</div>
                    <div className={`text-lg font-black ${change >= 0 ? "text-primary" : "text-destructive"}`}>{fmtFloat(Math.abs(change))}</div>
                  </div>
                </div>
              </>
            )}

            {isSplit && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  {splits.map((sp) => {
                    const isActive = activeId === sp.id;
                    return (
                      <div
                        key={sp.id}
                        onClick={() => setActiveId(sp.id)}
                        className={`rounded-xl border-2 p-3 cursor-pointer transition-all
                      ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-border/80"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                        ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          >
                            {isActive ? t("active") : t("tap")}
                          </span>
                        </div>
                        <VaultChips value={sp.vaultId} onChange={(vid) => setSplits((p) => p.map((s) => (s.id === sp.id ? { ...s, vaultId: vid } : s)))} treasurys={treasurys ?? []} />
                        <div
                          className={`mt-2 rounded-lg px-2 py-2 text-center text-lg font-black
                      ${isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                          {fmtRaw(sp.raw)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-muted/50 border border-border px-3 py-2.5 flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-semibold">{t("total_entered")}</span>
                    <span className="text-base font-black text-foreground">{fmtFloat(splitPaid)}</span>
                  </div>
                  <div
                    className={`rounded-xl px-3 py-2.5 flex flex-col border
                ${change >= 0 ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"}`}
                  >
                    <span className={`text-[10px] font-semibold ${change >= 0 ? "text-primary" : "text-destructive"}`}>{change >= 0 ? t("change") : t("remaining")}</span>
                    <span className={`text-base font-black ${change >= 0 ? "text-primary" : "text-destructive"}`}>{fmtFloat(Math.abs(change))}</span>
                  </div>
                </div>
              </div>
            )}
            <Numpad onKey={pushKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
