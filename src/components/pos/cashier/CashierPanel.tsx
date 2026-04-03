"use client";
import { useState } from "react";
import { Trash2, Delete, Plus, X } from "lucide-react";

const VAULTS = [
  { id: "v1", name: "Main Safe",    emoji: "🏦", color: "#16a34a", light: "#dcfce7" },
  { id: "v2", name: "Counter A",   emoji: "🖥️", color: "#2563eb", light: "#dbeafe" },
  { id: "v3", name: "Counter B",   emoji: "🖥️", color: "#9333ea", light: "#f3e8ff" },
  { id: "v4", name: "Back Office", emoji: "🔒", color: "#ea580c", light: "#ffedd5" },
  { id: "v5", name: "Safe 2",      emoji: "💰", color: "#0891b2", light: "#cffafe" },
  { id: "v6", name: "VIP Desk",    emoji: "⭐", color: "#b45309", light: "#fef3c7" },
];

const PAYABLE = 195;
interface Split { id: string; vaultId: string; raw: string; }
const rawToFloat = (r: string) => parseInt(r || "0") / 100;
const fmtFloat   = (n: number) => "$" + n.toFixed(2);
const fmtRaw     = (r: string) => fmtFloat(rawToFloat(r));

// ── Vault Chips ──────────────────────────────────────────────────────────────
function VaultChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      onClick={(e) => e.stopPropagation()}
    >
      {VAULTS.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            style={{
              flexShrink: 0,
              border: `1.5px solid ${active ? v.color : "#e5e7eb"}`,
              backgroundColor: active ? v.light : "#fafafa",
            }}
            className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 transition-all duration-150"
          >
            <span className="text-sm leading-none">{v.emoji}</span>
            <span
              className="text-xs font-bold whitespace-nowrap"
              style={{ color: active ? v.color : "#6b7280" }}
            >
              {v.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Numpad ───────────────────────────────────────────────────────────────────
const ROWS = [
  ["1","2","3"],
  ["4","5","6"],
  ["7","8","9"],
  ["00","0","del"],
  [".","cancel"],
];

function Numpad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5 mt-auto">
      {ROWS.map((row, ri) => (
        <div
          key={ri}
          className="grid gap-1.5"
          style={{ gridTemplateColumns: row.length === 2 ? "1fr 2fr" : "repeat(3,1fr)" }}
        >
          {row.map((k) => (
            <button
              key={k}
              onClick={() => onKey(k)}
              className="rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all text-sm font-semibold text-gray-700"
              style={{ minHeight: 52 }}
            >
              {k === "del"
                ? <Delete size={15} className="mx-auto text-gray-500" />
                : k === "cancel" ? "Cancel" : k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── CashierPanel ─────────────────────────────────────────────────────────────
export default function CashierPanel({ onCancel }: { onCancel?: () => void }) {
  const [tab,     setTab]     = useState<"Cash" | "Other Modes">("Cash");
  const [vault,   setVault]   = useState("v1");
  const [npRaw,   setNpRaw]   = useState("20000");
  const [isSplit, setIsSplit] = useState(false);
  const [splits,  setSplits]  = useState<Split[]>([
    { id: "s1", vaultId: "v1", raw: "10000" },
    { id: "s2", vaultId: "v2", raw: "9500"  },
  ]);
  const [activeId, setActiveId] = useState("s1");

  const pushKey = (k: string) => {
    if (k === "cancel") { onCancel?.(); return; }
    const transform = (prev: string) => {
      if (k === "del") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (k === "00")  return prev === "0" ? "0" : prev + "00";
      if (k === ".")   return prev.includes(".") ? prev : prev + ".";
      return prev === "0" ? k : prev + k;
    };
    if (!isSplit) setNpRaw((p) => transform(p));
    else setSplits((p) => p.map((s) => s.id === activeId ? { ...s, raw: transform(s.raw) } : s));
  };

  const addSplit = () => {
    const id = `s${Date.now()}`;
    setSplits((p) => [...p, { id, vaultId: "v1", raw: "0" }]);
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
  const splitPaid  = splits.reduce((sum, s) => sum + rawToFloat(s.raw), 0);

  return (
    <div
      style={{ width: 450 }}
      className="bg-white border-l border-gray-100 p-4 flex flex-col gap-3 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Payable Amount</div>
          <div className="text-2xl font-black text-green-600">${PAYABLE.toFixed(2)}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-xs font-black text-green-700">VL</div>
          <div>
            <div className="text-xs font-bold text-gray-800">Vincent Lobo</div>
            <div className="text-xs text-gray-400">#542845</div>
          </div>
          <button className="text-gray-300 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {(["Cash","Other Modes"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm border-b-2 font-semibold transition-colors ${
              tab === t ? "border-green-500 text-green-600" : "border-transparent text-gray-400"
            }`}>{t}</button>
        ))}
      </div>

      {/* Vault header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">
          {isSplit ? "Split Between Vaults" : "Destination Vault"}
        </span>
        <button
          onClick={() => setIsSplit((v) => !v)}
          className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors ${
            isSplit
              ? "border-green-500 text-green-600 bg-green-50"
              : "border-gray-200 text-gray-500 hover:border-green-300"
          }`}
        >
          {isSplit ? "✦ Split ON" : "Split Payment"}
        </button>
      </div>

      {/* Single vault */}
      {!isSplit && (
        <>
          <VaultChips value={vault} onChange={setVault} />
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-right text-2xl font-black text-gray-800">
            {fmtFloat(singlePaid)}
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
              className={`rounded-xl border p-3 cursor-pointer transition-all ${
                activeId === sp.id ? "border-green-500 shadow-sm" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 overflow-hidden">
                  <VaultChips
                    value={sp.vaultId}
                    onChange={(vid) =>
                      setSplits((p) => p.map((s) => s.id === sp.id ? { ...s, vaultId: vid } : s))
                    }
                  />
                </div>
                {splits.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSplit(sp.id); }}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className={`rounded-lg px-3 py-2 text-right text-xl font-black ${
                activeId === sp.id ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
              }`}>
                {fmtRaw(sp.raw)}
              </div>
            </div>
          ))}

          <button
            onClick={addSplit}
            className="flex items-center justify-center gap-2 border border-dashed border-green-300 rounded-xl py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-semibold"
          >
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