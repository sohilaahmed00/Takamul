import React, { useState } from "react";
import { Home, X, Grid, RefreshCw, User, LayoutGrid, Calendar, Printer, Plus, Minus, Search, Trash2, Edit } from "lucide-react";

// --- البيانات الوهمية (Mock Data) بناءً على الصورة ---
const categories = ["بروست", "بطاطس", "مشروبات", "مطعم"];

const products = [
  { id: 1, nameAr: "جمبري", nameEn: "JUMBIRI", price: "23.00", image: "https://cdn-icons-png.flaticon.com/512/3143/3143642.png" },
  { id: 2, nameAr: "دجاج برجر", nameEn: "DAJAJ BIRJAR", price: "6.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: 3, nameAr: "دجاج برجر دبل", nameEn: "DAJAJ BIRJAR DUBL", price: "12.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: 4, nameAr: "دجاج فيليه", nameEn: "DAJAJ FILIH", price: "17.00", image: "https://cdn-icons-png.flaticon.com/512/1061/1061466.png" },
  { id: 5, nameAr: "دجاج مسحب", nameEn: "DAJAJ MASHAB", price: "17.00", image: "https://cdn-icons-png.flaticon.com/512/1061/1061466.png" },
  { id: 6, nameAr: "زنجر برجر", nameEn: "ZINJAR BIRJAR", price: "8.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: 7, nameAr: "زنجر ساندوتش", nameEn: "ZINJAR SANDUTSH", price: "6.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: 8, nameAr: "سمك فيليه", nameEn: "SAMAK FILIH", price: "17.00", image: "https://cdn-icons-png.flaticon.com/512/3143/3143642.png" },
  { id: 9, nameAr: "كباب ساندوتش", nameEn: "KABAB SANDUTSH", price: "5.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: 10, nameAr: "مسحب ساندوتش", nameEn: "MASHAB SANDUTSH", price: "4.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: 11, nameAr: "مليس ساندوتش", nameEn: "MALIS SANDUTSH", price: "4.00", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
];

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState("مطعم");

  return (
    <div  className="flex flex-col h-screen w-full bg-[#Eef1f5] font-sans overflow-hidden">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between bg-[#f8fafc] border-b-2 border-gray-300 p-2 shadow-sm shrink-0">
        {/* الجزء الأيمن (اللوجو والاسم) */}
        <div className="flex items-center gap-3">
          <div className="text-emerald-700 font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">⋮⋮</span>
            
            <br />
            <span className="text-xs text-gray-500 block -mt-1">DEQA</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800 border-r-2 border-gray-300 pr-3 mr-3">تكامل</h1>
        </div>

        {/* الجزء الأوسط (التاريخ والوقت) */}
        {/* <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
          <span>22:25 02/12/2025</span>
          <Calendar size={18} />
          <RefreshCw size={18} className="cursor-pointer mx-2" />
        </div> */}

        {/* الجزء الأيسر (أزرار التحكم والمستخدم) */}
        <div className="flex items-center gap-1.5">
          <button className="bg-[#005a32] text-white p-2 rounded hover:bg-emerald-800">
            <LayoutGrid size={18} />
          </button>
          <button className="bg-[#005a32] text-white p-2 rounded hover:bg-emerald-800">
            <User size={18} />
          </button>
          <button className="bg-[#005a32] text-white p-2 rounded hover:bg-emerald-800">
            <RefreshCw size={18} />
          </button>
          <button className="bg-[#eab308] text-white p-2 rounded hover:bg-yellow-600">
            <Grid size={18} />
          </button>
          <button className="bg-[#005a32] text-white p-2 rounded hover:bg-emerald-800">
            <X size={18} />
          </button>
          <button className="bg-[#005a32] text-white p-2 rounded hover:bg-emerald-800">
            <Home size={18} />
          </button>
          <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
            <Edit size={18} />
          </button>

          <div className="flex items-center bg-white border border-gray-300 rounded px-3 py-1 ml-2">
            <User size={18} className="text-gray-500 ml-2" />
            <span className="font-bold">1</span>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex flex-1 overflow-hidden">
          <aside className="w-[380px] lg:w-[450px] bg-white border-r-2 border-gray-300 flex flex-col shrink-0 z-10">
          <div className="p-2 space-y-2 border-b border-gray-300 bg-gray-50">
            <div className="flex gap-2">
              <select className="flex-1 border border-gray-300 rounded p-1.5 text-sm bg-white focus:outline-none focus:border-emerald-500">
                <option>محلي</option>
                <option>سفري</option>
              </select>
              <button className="flex-1 bg-[#4a6cf7] text-white rounded p-1.5 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                آخر فاتورة (F4) <Printer size={16} />
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1 flex border border-gray-300 rounded bg-white overflow-hidden">
                <input type="text" placeholder="شخص عام(عميل افتراضي)" className="w-full p-1.5 text-sm focus:outline-none" />
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100">
                  <Edit size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100">
                  <Search size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100">
                  <Plus size={16} className="text-emerald-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1 flex border border-gray-300 rounded bg-white overflow-hidden">
                <input type="text" placeholder="قراءة الباركود / ابحث عن طريق اسم أو الباركود" className="w-full p-1.5 text-sm focus:outline-none" />
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100">
                  <Plus size={16} className="text-emerald-600" />
                </button>
                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100">
                  <Minus size={16} className="text-red-600" />
                </button>
                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 text-xl font-bold leading-none text-gray-600">*</button>
              </div>
            </div>
          </div>

          {/* جدول الفاتورة */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="flex bg-[#005a32] text-white text-sm font-bold p-2 items-center">
              <div className="flex-[3] text-center">صنف</div>
              <div className="flex-1 text-center">السعر</div>
              <div className="flex-1 text-center">الكمية</div>
              <div className="flex-1 text-center leading-tight">
                إجمالي
                <br />
                الصنف
              </div>
              <div className="w-8 flex justify-center">
                <Trash2 size={16} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-2">
              {/* هنا سيتم عرض الأصناف المضافة */}
              <div className="h-full flex items-center justify-center text-gray-300 text-sm">السلة فارغة</div>
            </div>
          </div>

          {/* ملخص الفاتورة وأزرار الدفع */}
          <div className="bg-white border-t border-gray-300 shrink-0">
            {/* التفاصيل المالية */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 p-3 text-sm font-bold text-gray-700 bg-gray-50">
              <div className="flex justify-between">
                <span>0</span>
                <span>الاصناف</span>
              </div>
              <div className="flex justify-between">
                <span>0.00</span>
                <span>المجموع</span>
              </div>
              <div className="flex justify-between">
                <span>0.00</span>
                <span>بدون ضريبة</span>
              </div>
              <div className="flex justify-between items-center">
                <span>0.00</span>
                <span className="flex items-center gap-1">
                  خصم <Edit size={14} className="text-emerald-600 cursor-pointer" />
                </span>
              </div>
            </div>

            {/* الإجمالي النهائي */}
            <div className="bg-[#333333] text-white flex justify-between items-center p-4">
              <span className="text-3xl font-bold">0.00</span>
              <span className="text-xl font-bold">: إجمالي الفاتورة</span>
            </div>

            <div className="flex h-[70px]">
              <button className="flex-[1.5] bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-xl flex items-center justify-center gap-2 transition-colors">دفع (F9)</button>
              <div className="flex-1 flex flex-col">
                <button className="flex-1 bg-[#f0ad4e] hover:bg-[#ec971f] text-white font-bold transition-colors">تعليق الفاتورة (F7)</button>
                <button className="flex-1 bg-[#d9534f] hover:bg-[#c9302c] text-white font-bold transition-colors">إلغاء (F11)</button>
              </div>
            </div>
          </div>
        </aside>    
        <section className="flex-1 flex flex-col h-full overflow-hidden p-3 gap-3">
          {/* التصنيفات (Categories) */}
          <div className="flex gap-2 shrink-0 border border-emerald-800 p-1.5 rounded-lg bg-white">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-1 py-3 px-4 rounded-md font-bold text-lg transition-colors ${activeCategory === cat ? "bg-[#005a32] text-white shadow-md" : "bg-white text-emerald-900 hover:bg-emerald-50"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-white border border-gray-300 rounded-lg p-3">
          
          </div>
        </section>

      
      </main>
    </div>
  );
}
