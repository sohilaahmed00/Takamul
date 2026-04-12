import { useState, useEffect, useRef, useCallback } from "react";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";
import { Product } from "@/features/products/types/products.types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ScanBarcode, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import ComboboxField from "@/components/ui/ComboboxField";
import { Button } from "@/components/ui/button";
import AddParnterModal from "@/components/modals/AddParnterModal";

export default function HomePage2() {
  const { language, t } = useLanguage();
  const { setCart, cart, setSelectedCustomer, selectedCustomer } = usePos();

  const [query, setQuery] = useState("");
  const [currentCat, setCurrentCat] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: products } = useGetAllProducts({ page: 1, limit: 10000, SearchTerm: "" });
  const { data: mainCategories } = useGetAllMainCategories();
  const { data: customers } = useGetAllCustomers({ page: 1, limit: 100 });

  const getProductName = useCallback(
    (item: any) => {
      if (language === "en") return item.productNameEn || item.productNameAr;
      if (language === "ur") return item.productNameUr || item.productNameAr;
      return item.productNameAr;
    },
    [language],
  );

  const getCategoryName = useCallback(
    (item: any) => {
      if (language === "en") return item.categoryNameEn || item.categoryNameAr;
      if (language === "ur") return item.categoryNameUr || item.categoryNameAr;
      return item.categoryNameAr;
    },
    [language],
  );

  const filteredProducts =
    products?.items.filter((item) => {
      if (item.productType === "RawMatrial") return false;
      if (currentCat && item.categoryId !== currentCat) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return item.productNameAr?.includes(q) || item.productNameEn?.toLowerCase().includes(q) || item.barcode?.includes(q);
    }) ?? [];

  const addToCart = useCallback(
    (item: Product) => {
      const price = item.taxCalculation === 3 ? item.priceBeforeTax : item.sellingPrice;
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === item.id);
        if (existing) {
          return prev.map((i) => (i.productId === item.id ? { ...i, qty: i.qty + 1 } : i));
        }
        return [
          ...prev,
          {
            name: item.productNameAr,
            productNameEn: item.productNameEn,
            productNameUr: item.productNameUr,
            price,
            qty: 1,
            note: "",
            op: null,
            taxamount: item.taxAmount,
            productId: item.id,
            taxCalculation: item.taxCalculation,
          },
        ];
      });
      setQuery("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [setCart],
  );

  const isInCart = (id: number) => cart.some((i) => i.productId === id);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filteredProducts.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredProducts[highlighted]) addToCart(filteredProducts[highlighted]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, highlighted, filteredProducts, addToCart]);

  // scanner: barcode gun fires fast keystrokes ending with Enter
  useEffect(() => {
    let buffer = "";
    let timer: ReturnType<typeof setTimeout>;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement !== inputRef.current) return;
      if (e.key === "Enter" && /^\d{7,13}$/.test(buffer)) {
        const found = products?.items.find((p) => p.barcode === buffer);
        if (found) {
          addToCart(found);
          buffer = "";
          return;
        }
      }
      if (/^\d$/.test(e.key)) {
        buffer += e.key;
        clearTimeout(timer);
        timer = setTimeout(() => {
          buffer = "";
        }, 100);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [products, addToCart]);

  // close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="p-4 bg-gray-50 flex flex-col gap-3">
      {/* Search + Customer row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setHighlighted(0);
              }}
              onFocus={() => setOpen(true)}
              placeholder={t("search_placeholder") || "ابحث باسم المنتج أو الباركود..."}
              className="pr-9 pl-24 h-11 text-sm w-full"
              autoFocus
              dir="rtl"
            />
            <div className="absolute left-3 flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-medium px-2.5 py-1 rounded-full pointer-events-none">
              <ScanBarcode className="h-3 w-3" />
              Scanner
            </div>
          </div>

          {/* Dropdown — جوا نفس الـ relative div عشان يتموضع صح */}
          {open && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-50 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-[11px] text-muted-foreground">{query ? `نتايج "${query}"` : "كل المنتجات"}</span>
                <span className="text-[11px] text-muted-foreground">{filteredProducts.length} منتج</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {filteredProducts.map((item, i) => {
                  const inCart = isInCart(item.id);
                  const price = item.taxCalculation === 3 ? item.priceBeforeTax : item.sellingPrice;
                  return (
                    <div key={item.id} onClick={() => addToCart(item)} className={cn("flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-gray-50 last:border-0 transition-colors", i === highlighted ? "bg-emerald-50" : "hover:bg-gray-50")} onMouseEnter={() => setHighlighted(i)} dir="rtl">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-gray-800">{getProductName(item)}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {item.barcode ?? item.id} · {item.categoryName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {inCart && (
                          <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100">
                            ✓ في الكارت
                          </Badge>
                        )}
                        <span className="text-sm font-semibold text-emerald-700">{price?.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {open && query && filteredProducts.length === 0 && <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl z-50 px-4 py-6 text-center text-sm text-muted-foreground">مفيش منتجات مطابقة لـ "{query}"</div>}
        </div>

        <div className="w-56 shrink-0">
          {!selectedCustomer ? (
            <ComboboxField
              value=""
              onChange={(val) => {
                const customer = customers?.items?.find((c) => String(c.id) === String(val));
                if (customer) setSelectedCustomer(customer);
              }}
              items={customers?.items}
              valueKey="id"
              labelKey="customerName"
              placeholder={t("choose_customer")}
            />
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-2 bg-primary/5 border border-primary/20 rounded-lg h-11">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">{selectedCustomer.customerName.slice(0, 2).toUpperCase()}</div>
              <span className="text-xs font-bold text-primary flex-1 truncate">{selectedCustomer.customerName}</span>
              <button onClick={() => setSelectedCustomer(null)} className="text-primary/60 hover:text-primary text-base leading-none">
                ×
              </button>
            </div>
          )}
        </div>

        <Button size="icon" variant="outline" className="h-11 w-11 shrink-0" onClick={() => setOpenDialog(true)}>
          <Plus size={16} />
        </Button>
      </div>
      <AddParnterModal isOpen={openDialog} onClose={() => setOpenDialog(false)} />
    </div>
  );
}
