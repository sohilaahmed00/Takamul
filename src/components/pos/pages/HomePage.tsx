import { useState } from "react";
import { MENU_DATA, CATS } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { CartItem } from "@/constants/data";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";

export default function HomePage() {
  const { setCart } = usePos();
  const [currentCat, setCurrentCat] = useState("Lunch");
  const [currentSubCat, setCurrentSubCat] = useState<string | null>(null);
  const [childrenModal, setChildrenModal] = useState<{ item: any } | null>(null);
  const { data: products } = useGetAllProducts({ page: 1, limit: 10000 });

  const activeCat = CATS.find((c) => c.id === currentCat);

  const addToCart = (item: { productNameAr: string; sellingPrice: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.productNameAr);
      if (existing) return prev.map((i) => (i.name === item.productNameAr ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { name: item.productNameAr, price: item.sellingPrice, qty: 1, note: "", op: null }];
    });
  };

  const handleMenuClick = (item: any) => {
    if (item.children?.length) {
      setChildrenModal({ item });
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gray-50 h-full">
      {/* Main category pills */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCurrentCat(c.id);
              setCurrentSubCat(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs border transition-colors
              ${c.id === currentCat ? "bg-primary text-white border-primary font-semibold" : "bg-white text-gray-500 border-gray-200 hover:border-primary/40"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sub-category pills */}
      {activeCat?.children?.length ? (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {activeCat.children.map((sub) => (
            <button
              key={sub}
              onClick={() => setCurrentSubCat(currentSubCat === sub ? null : sub)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors
                ${currentSubCat === sub ? "bg-primary/10 text-primary border-primary/30 font-semibold" : "bg-white text-gray-400 border-gray-200 hover:border-primary/30"}`}
            >
              {sub}
            </button>
          ))}
        </div>
      ) : null}

      {/* Menu grid */}
      <div className="grid grid-cols-5 gap-2">
        {products?.items.map((item, i) => (
          <div key={i} onClick={() => handleMenuClick(item)} className="bg-white rounded-xl p-2.5 text-center border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all">
            <div className="w-16 h-16 rounded-full bg-primary/5 mx-auto mb-2 flex items-center justify-center text-3xl">{/* <img src={item?.imageUrl} alt="" /> */}</div>
            <div className="text-xs font-semibold text-gray-700 mb-0.5 leading-tight">{item.productNameAr}</div>
            <div className="text-xs font-bold text-primary">${item.sellingPrice}.00</div>
          </div>
        ))}
      </div>

      {/* Children variant modal */}
      {childrenModal && (
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center z-50 rounded-xl">
          <div className="bg-white rounded-2xl p-5 w-72">
            <div className="text-sm font-black text-gray-800 mb-4">{childrenModal.item.name}</div>
            <div className="space-y-2">
              {childrenModal.item.children.map((child: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    addToCart(child);
                    setChildrenModal(null);
                  }}
                  className="w-full flex justify-between items-center px-3 py-2.5 border border-gray-200 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-700">{child.name}</span>
                  <span className="text-sm font-bold text-primary">${child.price}.00</span>
                </button>
              ))}
            </div>
            <button onClick={() => setChildrenModal(null)} className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600">
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
