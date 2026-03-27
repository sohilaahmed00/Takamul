import React, { useEffect } from "react";
import { X, FileText, Package, Receipt } from "lucide-react";
import { useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  control: Control<any>;
  customers?: { id: number; customerName: string }[];
  products?: { id: number; productNameAr: string; taxAmount?: number }[];
  units?: { id: number; name: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ─── Component ────────────────────────────────────────────────────────────────

const QuoteSummaryDrawer: React.FC<DrawerProps> = ({ open, onClose, control, customers = [], products = [], units = [] }) => {
  // Watch all relevant form fields
  const customerId = useWatch({ control, name: "customerId" });
  const quotationDate = useWatch({ control, name: "quotationDate" });
  const validUntil = useWatch({ control, name: "validUntil" });
  const notes = useWatch({ control, name: "notes" });
  const shippingCost = useWatch({ control, name: "shippingCost" }) || 0;
  const discountAmount = useWatch({ control, name: "discountAmount" }) || 0;
  const quotationDiscountType = useWatch({ control, name: "quotationDiscountType" }) || "fixed";
  const quotationDiscountValue = useWatch({ control, name: "quotationDiscountValue" }) || 0;
  const items: any[] = useWatch({ control, name: "items" }) || [];

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lookups
  const customerName = customers.find((c) => c.id === Number(customerId))?.customerName || "—";

  const formatDate = (d?: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  // ── Per-item calculations ──
  const calcItem = (item: any) => {
    const product = products.find((p) => p.id === Number(item.productId));
    const unitName = units.find((u) => u.id === Number(item.unitId))?.name || "—";
    const productName = product?.productNameAr || "—";
    const taxRate = (product?.taxAmount || 0) / 100;

    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const discType = item.discountType || "fixed";
    const discVal = Number(item.discountValue) || 0;

    const beforeDiscount = qty * price;
    const discountAmt = discType === "fixed" ? discVal : beforeDiscount * (discVal / 100);
    const beforeTax = Math.max(0, beforeDiscount - discountAmt);
    const taxAmt = beforeTax * taxRate;
    const total = beforeTax + taxAmt;

    return { productName, unitName, qty, price, discountAmt, beforeTax, taxAmt, total };
  };

  const calcedItems = items.map(calcItem);

  // ── Totals ──
  const subtotal = calcedItems.reduce((s, i) => s + i.beforeTax, 0);
  const totalTax = calcedItems.reduce((s, i) => s + i.taxAmt, 0);

  const globalDiscount = quotationDiscountType === "fixed" ? Number(quotationDiscountValue) : subtotal * (Number(quotationDiscountValue) / 100);

  const grandTotal = subtotal + totalTax - globalDiscount - Number(discountAmount) + Number(shippingCost);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        dir="rtl"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100dvh",
          width: "min(480px, 100vw)",
          background: "var(--color-background-primary)",
          borderLeft: "0.5px solid var(--color-border-tertiary)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-background-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={16} strokeWidth={1.5} style={{ color: "var(--color-text-secondary)" }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>معاينة عرض السعر</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>البيانات تتحدث تلقائياً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-md)",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* Customer & Dates */}
          <div
            style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-lg)",
              padding: "16px",
              marginBottom: 16,
            }}
          >
            <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>بيانات العرض</p>
            <Row label="العميل" value={customerName} highlight />
            <Row label="تاريخ الإصدار" value={formatDate(quotationDate)} />
            <Row label="صالح حتى" value={formatDate(validUntil)} />
          </div>

          {/* Items */}
          <div
            style={{
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-lg)",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Package size={14} strokeWidth={1.5} style={{ color: "var(--color-text-secondary)" }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>الأصناف ({calcedItems.length})</p>
            </div>

            {calcedItems.length === 0 ? (
              <p style={{ margin: 0, padding: "16px", fontSize: 13, color: "var(--color-text-secondary)", textAlign: "center" }}>لا توجد أصناف بعد</p>
            ) : (
              calcedItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    borderBottom: i < calcedItems.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{item.productName}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{fmt(item.total)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <MiniStat label="الكمية" value={String(item.qty)} />
                    <MiniStat label="السعر" value={fmt(item.price)} />
                    {item.unitName !== "—" && <MiniStat label="الوحدة" value={item.unitName} />}
                    {item.discountAmt > 0 && <MiniStat label="الخصم" value={`- ${fmt(item.discountAmt)}`} colored="success" />}
                    {item.taxAmt > 0 && <MiniStat label="الضريبة" value={`+ ${fmt(item.taxAmt)}`} colored="warning" />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div
            style={{
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-lg)",
              padding: "16px",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Receipt size={14} strokeWidth={1.5} style={{ color: "var(--color-text-secondary)" }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>ملخص المبالغ</p>
            </div>

            <TotalRow label="المجموع" value={fmt(subtotal)} />
            {totalTax > 0 && <TotalRow label="الضريبة" value={`+ ${fmt(totalTax)}`} color="var(--color-text-warning)" />}
            {globalDiscount > 0 && <TotalRow label="الخصم الإجمالي" value={`- ${fmt(globalDiscount)}`} color="var(--color-text-success)" />}
            {Number(discountAmount) > 0 && <TotalRow label="خصم إضافي" value={`- ${fmt(Number(discountAmount))}`} color="var(--color-text-success)" />}
            {Number(shippingCost) > 0 && <TotalRow label="التوصيل" value={`+ ${fmt(Number(shippingCost))}`} />}

            <div
              style={{
                borderTop: "0.5px solid var(--color-border-tertiary)",
                marginTop: 12,
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>الإجمالي النهائي</span>
              <span style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>{fmt(Math.max(0, grandTotal))}</span>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div
              style={{
                background: "var(--color-background-secondary)",
                borderRadius: "var(--border-radius-md)",
                padding: "12px 16px",
              }}
            >
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--color-text-secondary)" }}>ملاحظات</p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Row: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 0",
    }}
  >
    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
    <span
      style={{
        fontSize: 13,
        fontWeight: highlight ? 500 : 400,
        color: "var(--color-text-primary)",
      }}
    >
      {value}
    </span>
  </div>
);

const MiniStat: React.FC<{ label: string; value: string; colored?: "success" | "warning" }> = ({ label, value, colored }) => (
  <span style={{ fontSize: 12, color: colored ? `var(--color-text-${colored})` : "var(--color-text-secondary)" }}>
    {label}: <strong style={{ fontWeight: 500 }}>{value}</strong>
  </span>
);

const TotalRow: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "5px 0",
    }}
  >
    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, color: color || "var(--color-text-primary)" }}>{value}</span>
  </div>
);

export default QuoteSummaryDrawer;
