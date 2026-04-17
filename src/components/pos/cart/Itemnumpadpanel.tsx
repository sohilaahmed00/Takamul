import { CartItem } from "@/constants/data";
import { useState, useCallback, useEffect } from "react";
import { Numpad } from "../cashier/CashierPanel";
import { Button } from "@/components/ui/button";
import { usePos } from "@/context/PosContext";

interface ItemNumPadPanelProps {
  item: CartItem;
  onQtyChange: (qty: number) => void;
  onDiscountChange: (discount: { type: "pct" | "flat"; value: number } | null) => void;
  onClose: () => void;
}

export function ItemNumPadPanel({ item, onQtyChange, onDiscountChange, onClose }: ItemNumPadPanelProps) {
  const [activeTab, setActiveTab] = useState<"qty" | "disc">("qty");
  const [inputBuffer, setInputBuffer] = useState(String(item.qty));
  const [discType, setDiscType] = useState<"pct" | "flat">(item.itemDiscount?.type ?? "pct");
  const [isFirstInput, setIsFirstInput] = useState(true);
  const currentValue = parseInt(inputBuffer) || 0;

  const handleKey = useCallback(
    (key: string) => {
      if (key === "cancel") {
        onClose?.();
        return;
      }

      setInputBuffer((prev) => {
        if (isFirstInput && key !== "⌫" && key !== "del") {
          setIsFirstInput(false);

          if (key === "00") return "0";
          if (key === ".") return "0.";
          return key;
        }

        const transform = (prev: string) => {
          if (key === "⌫" || key === "del") {
            return prev.length > 1 ? prev.slice(0, -1) : "0";
          }

          if (key === "00") {
            return prev === "0" ? "0" : prev + "00";
          }

          if (key === ".") {
            return prev.includes(".") ? prev : prev + ".";
          }

          return prev === "0" ? key : prev + key;
        };

        return transform(prev);
      });
    },
    [onClose, isFirstInput],
  );

  useEffect(() => {
    setInputBuffer(activeTab === "qty" ? String(item.qty) : String(item.itemDiscount?.value ?? 0));

    setIsFirstInput(true);
  }, [item]);
  const clearInput = () => setInputBuffer("0");

  const switchTab = (tab: "qty" | "disc") => {
    setActiveTab(tab);
    setInputBuffer(tab === "qty" ? String(item.qty) : String(item.itemDiscount?.value ?? 0));
  };

  const handleDone = () => {
    if (activeTab === "qty") {
      onQtyChange(Math.max(1, currentValue));
    } else {
      onDiscountChange(currentValue === 0 ? null : { type: discType, value: currentValue });
    }
  };

  const applyShortcut = (val: number) => {
    setDiscType("pct");
    setInputBuffer(String(val));
  };

  // ── shared styles ──────────────────────────────────────────────────────────

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex" }}>
        {(["qty", "disc"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              style={{
                flex: 1,
                padding: "12px 0",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                cursor: "pointer",

                background: isActive ? "var(--color-background-secondary)" : "var(--color-background-primary)",

                color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",

                transition: "all 0.15s",
              }}
            >
              {tab === "qty" ? "الكمية" : "الخصم"}
            </button>
          );
        })}
      </div>

      {/* ── Qty Display ── */}
      {activeTab === "qty" && (
        <div
          style={{
            background: "var(--color-background-secondary)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>الكمية:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{inputBuffer}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>قطعة</span>
            <ClearButton onClick={clearInput} />
          </div>
        </div>
      )}

      {/* ── Disc Display ── */}
      {activeTab === "disc" && (
        <>
          <div
            style={{
              background: "var(--color-background-secondary)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Toggle */}
            <button
              onClick={() => setDiscType((t) => (t === "pct" ? "flat" : "pct"))}
              style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 20,
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 11, color: discType === "flat" ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: discType === "flat" ? 500 : 400 }}>$</span>
              <div
                style={{
                  width: 16,
                  height: 16,
                  background: "var(--color-text-primary)",
                  borderRadius: "50%",
                  transform: discType === "pct" ? "translateX(4px)" : "translateX(-4px)",
                  transition: "transform 0.2s",
                }}
              />
              <span style={{ fontSize: 11, color: discType === "pct" ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: discType === "pct" ? 500 : 400 }}>%</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{inputBuffer}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{discType === "pct" ? "%" : "ج.م"}</span>
              <ClearButton onClick={clearInput} />
            </div>
          </div>

          {/* Shortcuts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
              padding: "8px 12px",
              background: "var(--color-background-secondary)",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
            }}
          >
            {[5, 10, 15].map((v) => (
              <button
                key={v}
                onClick={() => applyShortcut(v)}
                className="
      rounded-xl
      border border-gray-100
      bg-gray-100
      hover:bg-gray-200
      active:scale-95
      transition-all
      text-sm
      font-semibold
      text-gray-800
    "
                style={{ minHeight: 42 }}
              >
                {v}%
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── NumPad ── */}
      <div style={{ padding: "10px 12px", background: "var(--color-background-primary)" }}>
        <Numpad onKey={handleKey} />
      </div>

      {/* ── Done ── */}
      {/* <button
          onClick={handleDone}
          style={{
            width: "100%",
            padding: 13,
            background: "var(--color-text-primary)",
            border: "none",
            borderRadius: 8,
            color: "var(--color-background-primary)",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          تم
        </button> */}
      <Button onClick={handleDone} variant="outline" className="w-full" size="2xl">
        تم
      </Button>
    </div>
  );
}

// ── helper component ───────────────────────────────────────────────────────────
function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: "0.5px solid var(--color-border-secondary)",
        background: "transparent",
        color: "var(--color-text-secondary)",
        fontSize: 16,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      ×
    </button>
  );
}
