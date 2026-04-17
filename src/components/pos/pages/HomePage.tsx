import { useEffect, useState, useCallback } from "react";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { useGetAllMainCategories } from "@/features/categories/hooks/useGetAllMainCategories";
import { Product, ProductBranch } from "@/features/products/types/products.types";
import { useGetProductBranchedById } from "@/features/products/hooks/useGetProductBranchedById";

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
    return item.productType !== "RawMatrial" && (!currentSubCat || item.categoryId === currentSubCat) && (!currentCat || item.categoryId === currentCat);
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

  return (
    <div className="flex-1  overflow-y-auto h-full">
      {/* Main category pills */}
      <div className="border-b border-b-gray-300 p-3  mb-10 space-y-4">
        <div className="flex gap-1.5  flex-wrap  ">
          {mainCategories?.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCurrentCat(c.id === currentCat ? null : c.id);
                setCurrentSubCat(null);
              }}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors
              ${c.id === currentCat ? "bg-primary text-white border-primary font-semibold" : "bg-white text-gray-500 border-gray-200 hover:border-primary/40"}`}
            >
              {getCategoryName(c)}
            </button>
          ))}
        </div>

        {/* Sub-category pills */}
        {activeCat?.subCategories?.length ? (
          <div className="flex gap-1.5  flex-wrap">
            {activeCat.subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setCurrentSubCat(currentSubCat === sub.id ? null : sub.id)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors
                ${currentSubCat === sub.id ? "bg-primary/10 text-primary border-primary/30 font-semibold" : "bg-white text-gray-500 border-gray-200 hover:border-primary/30"}`}
              >
                {getCategoryName(sub)}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 gap-2 p-3">
        {" "}
        {filteredProducts?.map((item, i) => (
          <div key={i} onClick={() => handleMenuClick(item)} className="bg-white rounded-xl p-2.5 text-center border border-primary/40 cursor-pointer hover:shadow-sm  transition-all">
            <div className="w-32 max-w-full h-16 rounded-lg  bg-primary/5 mx-auto mb-2 flex items-center justify-center overflow-hidden">{item.imageUrl ? <img src={item.imageUrl} alt={getProductName(item)} className="w-full h-full object-cover " /> : <span className="text-2xl"></span>}</div>
            <div className="text-xs font-semibold text-gray-700 mb-0.5 leading-tight">{getProductName(item)}</div>
            <div className="text-xs font-bold text-primary">${item?.taxCalculation == 3 ? item.priceBeforeTax : item.sellingPrice}.00</div>
          </div>
        ))}
      </div>

      {/* Children variant modal */}
      {childrenModal && (
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center z-50 rounded-xl">
          <div className="bg-white rounded-2xl p-5 w-72">
            <div className="text-sm font-black text-gray-800 mb-4">{modalTitle}</div>
            <div className="space-y-2">
              {childrenModal.map((child: ProductBranch["children"][number] | any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    const pro = {
                      id: child?.id,
                      productNameAr: child?.productNameAr,
                      sellingPrice: child?.sellingPrice,
                      taxAmount: 0,
                      taxCalculation: 1,
                      productNameEn: child?.productNameEn,
                      productNameUr: child?.productNameUr,
                    };
                    addToCart(pro);
                    setChildrenModal(null);
                  }}
                  className="w-full flex justify-between items-center px-3 py-2.5 border border-gray-200 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-700">{getProductName(child)}</span>
                  <span className="text-sm font-bold text-primary">${child.sellingPrice}.00</span>
                </button>
              ))}
            </div>
            <button onClick={() => setChildrenModal(null)} className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600">
              {t("cancel") || "إلغاء"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
