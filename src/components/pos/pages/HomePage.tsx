import { useEffect, useState, useCallback, useRef } from "react";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";
import { Product, ProductBranch } from "@/features/products/types/products.types";
import { useGetProductBranchedById } from "@/features/products/hooks/useGetProductBranchedById";
import { ChevronLeft, ChevronRight, SaudiRiyal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { setCart, cart, search } = usePos();
  const [currentCat, setCurrentCat] = useState<number | null>(null);
  const [currentSubCat, setCurrentSubCat] = useState<number | null>(null);
  const [childrenModal, setChildrenModal] = useState<ProductBranch["children"] | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const { data: products } = useGetAllProducts({ page: 1, limit: 10000, SearchTerm: search });
  const { data: mainCategories } = useGetAllMainCategories();
  const { data: productPranched } = useGetProductBranchedById(selectedProductId);

  const activeCat = mainCategories?.find((c) => c.id === currentCat);

  const filteredProducts = products?.items.filter((item) => {
    return item.productType !== "RawMatrial" && !(item.productType === "Direct" && item.parentProductId) && (!currentSubCat || item.categoryId === currentSubCat) && (!currentCat || item.categoryId === currentCat);
  });

  const getCategoryName = useCallback(
    (item: any) => {
      if (language === "en") return item.categoryNameEn || item.categoryNameAr;
      if (language === "ur") return item.categoryNameUr || item.categoryNameAr;
      return item.categoryNameAr;
    },
    [language],
  );

  const getProductName = useCallback(
    (item: any) => {
      if (language === "en") return item.productNameEn || item.productNameAr;
      if (language === "ur") return item.productNameUr || item.productNameAr;
      return item.productNameAr;
    },
    [language],
  );

  const addToCart = (item: { id: number; productNameAr: string; sellingPrice: number; taxAmount: number; taxCalculation: number; productNameEn?: string; productNameUr?: string }) => {
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
          price: item.sellingPrice,
          qty: 1,
          note: "",
          op: null,
          taxamount: item.taxAmount,
          productId: item.id,
          taxCalculation: item.taxCalculation,
        },
      ];
    });
  };

  const handleMenuClick = (item: Product) => {
    if (item.productType == "Branched") {
      setSelectedProductId(null);
      setTimeout(() => setSelectedProductId(item?.id), 0);
    } else {
      addToCart({
        id: item.id,
        productNameAr: item.productNameAr,
        sellingPrice: item.taxCalculation == 3 ? item?.priceBeforeTax : item?.sellingPrice,
        taxAmount: item.taxAmount,
        taxCalculation: item.taxCalculation,
        productNameEn: item.productNameEn,
        productNameUr: item.productNameUr,
      });
    }
  };
  useEffect(() => {
    if (productPranched?.children) {
      setModalTitle(getProductName(productPranched));
      setChildrenModal(productPranched.children);
      setSelectedProductId(null);
    }
  }, [productPranched, language, getProductName]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "right" | "left") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? 150 : -150, behavior: "smooth" });
  };
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const handleBarcodeScanned = useCallback(
    (barcode: string) => {
      const product = products?.items?.find((p) => p.barcode === barcode);
      if (!product) {
        console.warn("المنتج مش موجود:", barcode);
        return;
      }
      setCart((prev) => {
        const exists = prev.findIndex((i) => i.productId === product.id);
        if (exists !== -1) {
          return prev.map((i, idx) => (idx === exists ? { ...i, qty: i.qty + 1 } : i));
        }
        return [
          ...prev,
          {
            name: product.productNameAr,
            productNameEn: product.productNameEn,
            productNameUr: product.productNameUr,
            price: product.sellingPrice,
            qty: 1,
            note: "",
            op: null,
            taxamount: product.taxAmount,
            productId: product.id,
            taxCalculation: product.taxCalculation,
          },
        ];
      });
    },
    [products],
  );

  useEffect(() => {
    let buffer = "";
    let timer: ReturnType<typeof setTimeout>;
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement || activeEl instanceof HTMLSelectElement;

      const now = Date.now();
      const timeDiff = now - lastKeyTime;
      lastKeyTime = now;

      if (e.key === "Enter") {
        if (buffer.length > 2 && !isTyping) handleBarcodeScanned(buffer);
        buffer = "";
        clearTimeout(timer);
        return;
      }

      const isPartOfScan = timeDiff < 50 || buffer.length > 0;
      if (!isPartOfScan) {
        buffer = e.key;
      } else {
        buffer += e.key;
      }

      clearTimeout(timer);
      timer = setTimeout(() => {
        if (buffer.length > 2 && !isTyping) handleBarcodeScanned(buffer);
        buffer = "";
      }, 300);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBarcodeScanned]);
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft > 0);
    setCanScrollLeft(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [mainCategories]);

  return (
    <div className="flex-1 overflow-y-auto h-full">
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} className="shrink-0 w-8 h-8 rounded-full border border-border bg-card hover:border-primary/40 flex items-center justify-center transition-all">
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>

          <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
            {mainCategories?.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentCat(c.id === currentCat ? null : c.id);
                  setCurrentSubCat(null);
                }}
                className={`px-9.5 py-3 rounded-full text-sm border transition-colors shrink-0
              ${c.id === currentCat ? "bg-primary text-primary-foreground border-primary font-semibold" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
              >
                {getCategoryName(c)}
              </button>
            ))}
          </div>

          <button onClick={() => scroll("right")} className="shrink-0 w-8 h-8 rounded-full border border-border bg-card hover:border-primary/40 flex items-center justify-center transition-all">
            <ChevronLeft size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Menu grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 p-3 py-2.5">
        {filteredProducts?.map((item, i) => (
          <div key={i} onClick={() => handleMenuClick(item)} className="bg-card rounded-xl overflow-hidden pt-1 pb-2.5 px-0 text-center border border-primary/40 cursor-pointer hover:shadow-sm transition-all">
            <div className="w-full px-2 max-w-full h-16 rounded-lg mx-auto mb-2 flex items-center justify-center overflow-hidden">{item.imageUrl ? <img src={item.imageUrl} alt={getProductName(item)} className="w-full h-full object-contain" /> : <span className="text-2xl"></span>}</div>
            <div className="text-xs font-semibold text-foreground mb-0.5 leading-tight">{getProductName(item)}</div>
            <div className="text-xs font-bold text-primary flex items-center justify-center flex-row-reverse gap-x-1">
              <SaudiRiyal size={14} />
              {item?.taxCalculation == 3 ? item.priceBeforeTax : item.sellingPrice}.00
            </div>
          </div>
        ))}
      </div>
      {/* Children variant modal */}
      <Dialog modal={false} open={!!childrenModal} onOpenChange={(open) => !open && setChildrenModal(null)}>
        <DialogContent className="w-80 rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
            <DialogTitle className="text-sm font-black text-foreground">{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="px-4 py-3 space-y-2 max-h-80 overflow-y-auto">
            {childrenModal?.map((child: any, i: number) => (
              <button
                key={i}
                onClick={() => {
                  addToCart({
                    id: child?.id,
                    productNameAr: child?.productNameAr,
                    sellingPrice: child?.sellingPrice,
                    taxAmount: 0,
                    taxCalculation: 1,
                    productNameEn: child?.productNameEn,
                    productNameUr: child?.productNameUr,
                  });
                }}
                className="w-full flex justify-between items-center px-3 py-2.5 border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] transition-all duration-150"
              >
                <span className="text-sm font-semibold text-foreground">{getProductName(child)}</span>
                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{child.sellingPrice}.00</span>
              </button>
            ))}
          </div>

          <div className="px-4 pb-4 pt-2">
            <button onClick={() => setChildrenModal(null)} className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              {t("cancel") || "إلغاء"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
