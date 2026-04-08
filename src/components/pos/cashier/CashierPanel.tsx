import { useEffect, useState } from "react";
import { Trash2, Delete, Plus, X, Vault } from "lucide-react";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { Treasury } from "@/features/treasurys/types/treasurys.types";
import { usePos } from "@/context/PosContext";
import { calcTotals } from "@/constants/data";

interface Split {
  id: string;
  vaultId: number;
  raw: string;
}

const rawToFloat = (r: string) => parseInt(r || "0") / 100;
const fmtFloat = (n: number) => "$" + n.toFixed(2);
const fmtRaw = (r: string) => fmtFloat(rawToFloat(r));

// ── Vault Chips ──────────────────────────────────────────────────────────────
function VaultChips({ value, onChange, treasurys }: { value: number; onChange: (id: number) => void; treasurys: Treasury[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties} onClick={(e) => e.stopPropagation()}>
      {treasurys.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 transition-all duration-150 flex-shrink-0 border-1.5
              ${active ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-green-200"}`}
            style={{ border: `1.5px solid ${active ? "#16a34a" : "#e5e7eb"}` }}
          >
            <Vault size={13} className={active ? "text-green-600" : "text-gray-400"} />
            <span className={`text-xs font-bold whitespace-nowrap ${active ? "text-green-700" : "text-gray-500"}`}>{v.name}</span>
            <span className={`text-xs font-semibold ${active ? "text-green-500" : "text-gray-400"}`}>${v.currentBalance.toFixed(2)}</span>
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
  ["00", "0", "del"],
  [".", "cancel"],
];

function Numpad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      {ROWS.map((row, ri) => (
        <div key={ri} className="grid gap-1.5" style={{ gridTemplateColumns: row.length === 2 ? "1fr 2fr" : "repeat(3,1fr)" }}>
          {row.map((k) => (
            <button key={k} onClick={() => onKey(k)} className="rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-sm font-semibold text-gray-700" style={{ minHeight: 52 }}>
              {k === "del" ? <Delete size={15} className="mx-auto text-gray-500" /> : k === "cancel" ? "Cancel" : k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── CashierPanel ─────────────────────────────────────────────────────────────
export default function CashierPanel({ onCancel }: { onCancel?: () => void }) {
  const { data: treasurys } = useGetAllTreasurys();
  const { selectedCustomer, setSelectedCustomer, cart, discount, setPaidAmount, setSelectedVaultId } = usePos();
  const { total } = calcTotals(cart, discount);
  const [vaultId, setVaultId] = useState<number | null>(null);
  const activeVault = vaultId ?? treasurys?.[0]?.id ?? null;

  const [npRaw, setNpRaw] = useState(() => String(Math.round(total * 100)));
  const [isSplit, setIsSplit] = useState(false);
  const [splits, setSplits] = useState<Split[]>([]);
  const [activeId, setActiveId] = useState("s1");
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
    if (!isSplit) setNpRaw((p) => transform(p));
    else setSplits((p) => p.map((s) => (s.id === activeId ? { ...s, raw: transform(s.raw) } : s)));
  };

  const addSplit = () => {
    const id = `s${Date.now()}`;
    setSplits((p) => [...p, { id, vaultId: treasurys?.[0]?.id ?? 0, raw: "0" }]);
    setActiveId(id);
  };

  const removeSplit = (id: string) => {
    setSplits((p) => {
      const next = p.filter((s) => s.id !== id);
      if (activeId === id && next.length) setActiveId(next[0].id);
      return next;
    });
  };

  const singlePaid = rawToFloat(npRaw);
  const splitPaid = splits.reduce((sum, s) => sum + rawToFloat(s.raw), 0);
  const change = parseFloat(((isSplit ? splitPaid : singlePaid) - total).toFixed(2));
  useEffect(() => {
    setPaidAmount(isSplit ? splitPaid : singlePaid);
  }, [singlePaid, splitPaid, isSplit]);
  return (
    <div style={{ width: 550 }} className="bg-white border-l border-gray-100 p-4 flex flex-col gap-3 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Payable Amount</div>
          <div className="text-2xl font-black text-green-600">${total.toFixed(2)}</div>
        </div>
        {selectedCustomer ? (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-xs font-black text-green-700">{selectedCustomer.customerName.slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="text-xs font-bold text-gray-800">{selectedCustomer.customerName}</div>
              <div className="text-xs text-gray-400">#{selectedCustomer.id}</div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="text-gray-300 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span>No customer selected</span>
          </div>
        )}
      </div>

      {/* Tabs */}

      {/* Vault header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">{isSplit ? "Split Between Vaults" : "Destination Vault"}</span>
        <button
          onClick={() => {
            setIsSplit((v) => {
              if (!v) {
                setSplits([{ id: "s1", vaultId: treasurys?.[0]?.id ?? 0, raw: "0" }]);
                setActiveId("s1");
              }
              return !v;
            });
          }}
          className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors
            ${isSplit ? "border-green-500 text-green-600 bg-green-50" : "border-gray-200 text-gray-500 hover:border-green-300"}`}
        >
          {isSplit ? "✦ Split ON" : "Split Payment"}
        </button>
      </div>

      {/* Single vault */}
      {!isSplit && (
        <>
          {treasurys && treasurys.length > 0 ? (
            <VaultChips
              value={activeVault ?? 0}
              onChange={(id) => {
                setVaultId(id);
                setSelectedVaultId(id);
              }}
              treasurys={treasurys}
            />
          ) : (
            <div className="text-xs text-red-500">loading vaults...</div>
          )}
          {/* Amount display — replaces the empty gap */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400">Tendered</span>
              <span className="text-2xl font-black text-gray-800">{fmtFloat(singlePaid)}</span>
            </div>
            {change >= 0 ? (
              <div className="text-right">
                <div className="text-xs text-gray-400">Change</div>
                <div className="text-lg font-black text-green-600">{fmtFloat(change)}</div>
              </div>
            ) : (
              <div className="text-right">
                <div className="text-xs text-gray-400">Remaining</div>
                <div className="text-lg font-black text-red-500">{fmtFloat(Math.abs(change))}</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Split mode */}
      {isSplit && (
        <div className="flex flex-col gap-2">
          {splits.map((sp) => (
            <div
              key={sp.id}
              onClick={() => setActiveId(sp.id)}
              className={`rounded-xl border p-3 cursor-pointer transition-all
                ${activeId === sp.id ? "border-green-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 overflow-hidden">
                  <VaultChips value={sp.vaultId} onChange={(vid) => setSplits((p) => p.map((s) => (s.id === sp.id ? { ...s, vaultId: vid } : s)))} treasurys={treasurys ?? []} />
                </div>
                {splits.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSplit(sp.id);
                    }}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div
                className={`rounded-lg px-3 py-2 text-right text-xl font-black
                ${activeId === sp.id ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}`}
              >
                {fmtRaw(sp.raw)}
              </div>
            </div>
          ))}

          <button onClick={addSplit} className="flex items-center justify-center gap-2 border border-dashed border-green-300 rounded-xl py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-semibold">
            <Plus size={14} /> Add Vault
          </button>

          <div className="bg-gray-50 rounded-xl px-3 py-2 flex justify-between text-sm">
            <span className="text-gray-500 font-semibold">Total Entered</span>
            <span className="font-black text-gray-800">{fmtFloat(splitPaid)}</span>
          </div>
        </div>
      )}

      {/* Numpad */}
      <Numpad onKey={pushKey} />
    </div>
  );
}
