// src/pages/AddProduct.tsx
import React, { useState, useRef, ChangeEvent, FormEvent, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PlusCircle, Upload, Barcode, Save, Box, Package,
  Layers, X, FolderPlus, Search, Check, Trash2, ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Toast } from "primereact/toast";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const REAL_API  = "http://takamulerp.runasp.net"; // categories endpoint

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductNature = "basic" | "prepared" | "sub" | "materials";

type NormalizedCategory = {
  id: number | string;
  nameAr: string;
  nameEn: string;
  nameUr: string;
};

type ProductLite = {
  id: string;
  code: string;
  name: string;
  cost?: number;
  image?: string;
};

interface MaterialItem {
  materialId:   string;
  materialName: string;
  quantity:     number;
  unitId?:      string;
  unitName?:    string;
  cost?:        number;
}

interface Unit {
  id:   string;
  code: string;
  name: string;
}

// Tax comes from /api/Taxes — shape: { id, name, amount }
interface TaxOption {
  id:     number;
  name:   string;
  amount: number; // percentage e.g. 0, 10, 20
}

// id=1 "شامل الضريبه" amount=0  → used as the "no-tax / inclusive" default
const NO_TAX_ID = 1;

type FormErrors = Partial<Record<string, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const UNITS_LIST: Unit[] = [
  { id: "1", code: "U-001", name: "قطعة"   },
  { id: "2", code: "U-002", name: "كيلو"   },
  { id: "3", code: "U-003", name: "جرام"   },
  { id: "4", code: "U-004", name: "لتر"    },
  { id: "5", code: "U-005", name: "علبة"   },
  { id: "6", code: "U-006", name: "كرتونة" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("takamul_token");
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  // ── Always read raw text first so we never lose the body ──
  const rawText = await res.text();

  console.groupCollapsed(`[API] ${init?.method || "GET"} ${url} → ${res.status}`);
  console.log("Status:",      res.status, res.statusText);
  console.log("Content-Type:", res.headers.get("content-type"));
  console.log("Raw response body:", rawText);
  console.groupEnd();

  if (!res.ok) {
    // Try to parse as JSON for a nicer message, fall back to raw text
    let msg = rawText || `Request failed (${res.status})`;
    try {
      const d: any = JSON.parse(rawText);
      const extracted =
        d?.message ||
        d?.Message ||
        d?.title   ||
        d?.Title   ||
        d?.error   ||
        d?.Error   ||
        (d?.errors
          ? Object.entries(d.errors)
              .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join(" | ")
          : null);
      if (extracted) msg = extracted;
    } catch {
      // rawText is already set above
    }
    console.error(`[API ERROR] ${url}:`, msg);
    throw new Error(msg);
  }

  // Success — parse JSON if applicable
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { return JSON.parse(rawText) as T; } catch { return rawText as unknown as T; }
  }
  return rawText as unknown as T;
}

function normalizeCategory(item: any): NormalizedCategory {
  const id     = item?.id ?? item?.Id ?? item?.categoryId ?? item?.CategoryId ?? "";
  const nameAr = (item?.categoryNameAr ?? item?.CategoryNameAr ?? item?.nameAr ?? "").toString();
  const nameEn = (item?.categoryNameEn ?? item?.CategoryNameEn ?? item?.nameEn ?? "").toString();
  const nameUr = (item?.categoryNameUr ?? item?.CategoryNameUr ?? item?.nameUr ?? "").toString();
  const gen    = (item?.name ?? item?.Name ?? item?.categoryName ?? "").toString();
  return { id, nameAr: nameAr||gen, nameEn: nameEn||gen, nameUr: nameUr||gen };
}

function getDisplayName(c: NormalizedCategory, dir: string): string {
  return dir === "rtl" ? (c.nameAr||c.nameEn||c.nameUr) : (c.nameEn||c.nameAr||c.nameUr);
}

function mapProductLite(item: any): ProductLite {
  return {
    id:    String(item?.id ?? item?.productId ?? ""),
    code:  String(item?.barcode ?? item?.productCode ?? ""),
    name:  String(item?.productNameAr || item?.productNameEn || item?.name || ""),
    cost:  Number(item?.costPrice ?? item?.cost ?? 0),
    image: String(item?.imageUrl ?? item?.image ?? ""),
  };
}

function natureToEndpoint(n: ProductNature): string {
  switch (n) {
    case "basic":     return "/api/Products/direct";
    case "materials": return "/api/Products/raw-material";
    case "sub":       return "/api/Products/branched";
    case "prepared":  return "/api/Products/prepared";
  }
}
function getNatureLabel(n: ProductNature): string {
  switch (n) {
    case "basic":     return "الصنف المباشر";
    case "prepared":  return "الصنف المجهز";
    case "sub":       return "الصنف المتفرع";
    case "materials": return "الخامة";
  }
}
function getNatureIcon(n: ProductNature) {
  switch (n) {
    case "basic":     return <Box        size={20} />;
    case "prepared":  return <Package    size={20} />;
    case "sub":       return <Layers     size={20} />;
    case "materials": return <FolderPlus size={20} />;
  }
}

// ─── API fns ──────────────────────────────────────────────────────────────────

const apiFetchMainCats   = ():             Promise<any[]> => fetchJson(`${REAL_API}/api/ProductCategories/MainCategory`,                            { method:"GET" });
const apiFetchSubCats    = (id:string):    Promise<any[]> => fetchJson(`${REAL_API}/api/ProductCategories/SubCategory/${encodeURIComponent(id)}`,   { method:"GET" });
const apiFetchDirect     = ():             Promise<any[]> => fetchJson(`${REAL_API}/api/Products/direct`,                                           { method:"GET" }).catch(()=>[]);
const apiFetchRaw        = ():             Promise<any[]> => fetchJson(`${REAL_API}/api/Products/raw-material`,                                     { method:"GET" }).catch(()=>[]);
const apiFetchTaxes      = ():             Promise<TaxOption[]> => fetchJson<TaxOption[]>(`${REAL_API}/api/Taxes`, { method:"GET" }).catch(()=>[]);
const apiPostProduct     = (n:ProductNature, fd:FormData): Promise<any> => fetchJson(`${REAL_API}${natureToEndpoint(n)}`,                           { method:"POST", body:fd });

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddProduct() {
  const { t, direction }     = useLanguage();
  const { systemSettings }   = useSettings();
  const navigate             = useNavigate();
  const location             = useLocation();
  const toastRef             = useRef<Toast>(null);
  const fileInputRef         = useRef<HTMLInputElement>(null);
  const queryClient          = useQueryClient();

  const toast = (severity:"success"|"error"|"warn"|"info", summary:string, detail?:string) =>
    toastRef.current?.show({ severity, summary, detail, life: 4500 });

  // ── state ─────────────────────────────────────────────────────────────────

  const [fileName,  setFileName]  = useState("");
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [errors,    setErrors]    = useState<FormErrors>({});

  const [showMatSearch,    setShowMatSearch]    = useState(false);
  const [showUnitSearch,   setShowUnitSearch]   = useState(false);
  const [showParentSearch, setShowParentSearch] = useState(false);

  const [matSearch,     setMatSearch]     = useState("");
  const [matQty,        setMatQty]        = useState("1");
  const [unitSearch,    setUnitSearch]    = useState("");
  const [parentSearch,  setParentSearch]  = useState("");

  // VAT
  // vatIncluded=true  → price already has VAT → send TaxCalculation=Inclusive, TaxId=0, price unchanged
  // vatIncluded=false → price is net          → send TaxCalculation=Exclusive, TaxId=selectedVat.id, price = base*(1+rate/100)
  // vatIncluded=true  → price already includes tax → TaxCalculation=Includestax, TaxId=NO_TAX_ID(1)
  // vatIncluded=false → price is net, add tax on top → TaxCalculation=Excludestax, TaxId=selectedVat.id
  const [vatIncluded, setVatIncluded] = useState<boolean>(true);
  const [selectedVat, setSelectedVat] = useState<TaxOption|null>(null);

  const [form, setForm] = useState({
    productNature:      (location.state?.productNature || "basic") as ProductNature,
    name:               "",
    nameLang2:          "",
    nameLang3:          "",
    code:               "",
    cost:               "",
    sellingPrice:       "",
    categoryId:         "",
    subCategoryId:      "",
    alertQuantity:      "0",
    hideInPos:          false,
    details:            "",
    parentProductIds:   [] as string[],
    parentProductNames: [] as string[],
    materials:          [] as MaterialItem[],
    baseUnitId:         "",
    purchaseUnitId:     "",
    conversionFactor:   "1",
  });

  // ── derived ───────────────────────────────────────────────────────────────

  /**
   * The selling price that will actually be sent to the API:
   * - vatIncluded=true  → same as input (no change)
   * - vatIncluded=false + rate chosen → base * (1 + rate/100)
   */
  const finalSellingPrice = useMemo<number>(() => {
    const base = parseFloat(form.sellingPrice) || 0;
    if (vatIncluded || !selectedVat) return base;
    return parseFloat((base * (1 + selectedVat.amount / 100)).toFixed(4));
  }, [form.sellingPrice, vatIncluded, selectedVat]);

  const taxRateToSend = useMemo<number>(
    () => (vatIncluded || !selectedVat ? 0 : selectedVat.amount),
    [vatIncluded, selectedVat],
  );

  const preparedCost = useMemo(
    () => form.materials.reduce((s,m) => s + Number(m.cost||0)*Number(m.quantity||0), 0),
    [form.materials],
  );

  // ── queries ───────────────────────────────────────────────────────────────

  const { data: mainCatRaw=[], isLoading: loadingMain } = useQuery({
    queryKey: ["mainCategories"],
    queryFn:  apiFetchMainCats,
    staleTime: 5*60*1000,
  });
  const mainCats: NormalizedCategory[] = useMemo(
    () => (Array.isArray(mainCatRaw)?mainCatRaw:[]).map(normalizeCategory).filter(c=>String(c.id)!==""),
    [mainCatRaw],
  );

  const { data: subCatRaw=[], isLoading: loadingSub } = useQuery({
    queryKey: ["subCategories", form.categoryId],
    queryFn:  () => apiFetchSubCats(form.categoryId),
    enabled:  Boolean(form.categoryId),
    staleTime: 5*60*1000,
  });
  const subCats: NormalizedCategory[] = useMemo(
    () => (Array.isArray(subCatRaw)?subCatRaw:[]).map(normalizeCategory).filter(c=>String(c.id)!==""),
    [subCatRaw],
  );

  const { data: directRaw=[] } = useQuery({ queryKey:["directProducts"], queryFn:apiFetchDirect, staleTime:2*60*1000 });
  const directList: ProductLite[] = useMemo(()=>(Array.isArray(directRaw)?directRaw:[]).map(mapProductLite),[directRaw]);

  const { data: rawMatsRaw=[] } = useQuery({ queryKey:["rawMaterials"], queryFn:apiFetchRaw, staleTime:2*60*1000 });

  const { data: taxesRaw=[] } = useQuery({ queryKey:["taxes"], queryFn:apiFetchTaxes, staleTime:10*60*1000 });
  // Filter out id=1 (no-tax entry) from the selectable options shown to user
  const taxOptions: TaxOption[] = useMemo(
    ()=>(Array.isArray(taxesRaw)?taxesRaw:[]).filter(t=>t.id!==NO_TAX_ID),
    [taxesRaw],
  );
  const matList: ProductLite[] = useMemo(()=>(Array.isArray(rawMatsRaw)?rawMatsRaw:[]).map(mapProductLite),[rawMatsRaw]);

  // ── mutation ──────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: ({nature,fd}:{nature:ProductNature;fd:FormData}) => apiPostProduct(nature,fd),
    onSuccess: () => {
      toast("success", "تم الحفظ بنجاح", "تم إضافة الصنف بنجاح");
      queryClient.invalidateQueries({ queryKey:["directProducts"] });
      queryClient.invalidateQueries({ queryKey:["rawMaterials"] });
      setTimeout(()=>navigate("/products",{state:{productNature:form.productNature,refreshed:true}}),1200);
    },
    onError: (err:any) => toast("error","فشل الحفظ", err?.message||"Unknown error"),
  });

  // ── filtered lists ────────────────────────────────────────────────────────

  const filteredParents = useMemo(()=>
    directList.filter(p=>p.name.toLowerCase().includes(parentSearch.toLowerCase())||p.code.toLowerCase().includes(parentSearch.toLowerCase())),
    [directList,parentSearch],
  );
  const filteredMats = useMemo(()=>
    matList.filter(m=>m.name.toLowerCase().includes(matSearch.toLowerCase())||m.code.toLowerCase().includes(matSearch.toLowerCase())),
    [matList,matSearch],
  );
  const filteredUnits = useMemo(()=>
    UNITS_LIST.filter(u=>u.name.toLowerCase().includes(unitSearch.toLowerCase())||u.code.toLowerCase().includes(unitSearch.toLowerCase())),
    [unitSearch],
  );

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const {name,value,type} = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev=>({...prev,[name]:type==="checkbox"?checked:value}));
    if (errors[name]) setErrors(prev=>({...prev,[name]:undefined}));
  };

  const handleAddMat = () => {
    const sel = matList.find(m=>m.name===matSearch);
    if (!sel) { toast("warn","تحذير","يرجى اختيار خامة صحيحة من القائمة"); return; }
    if (form.materials.some(m=>String(m.materialId)===String(sel.id))) { toast("warn","تحذير","الخامة مضافة بالفعل"); return; }
    const unit = UNITS_LIST.find(u=>u.id===unitSearch);
    setForm(prev=>({...prev, materials:[...prev.materials,{
      materialId:String(sel.id), materialName:sel.name,
      quantity:parseFloat(matQty)||1, unitId:unit?.id, unitName:unit?.name, cost:Number(sel.cost??0),
    }]}));
    setMatSearch(""); setMatQty("1"); setUnitSearch(""); setShowMatSearch(false); setShowUnitSearch(false);
  };

  const removeMat     = (i:number) => setForm(prev=>({...prev,materials:prev.materials.filter((_,idx)=>idx!==i)}));
  const toggleParent  = (p:ProductLite) => setForm(prev=>{
    const sel = prev.parentProductIds.includes(String(p.id));
    return sel
      ? {...prev, parentProductIds:prev.parentProductIds.filter(x=>x!==String(p.id)), parentProductNames:prev.parentProductNames.filter(x=>x!==p.name)}
      : {...prev, parentProductIds:[...prev.parentProductIds,String(p.id)], parentProductNames:[...prev.parentProductNames,p.name]};
  });
  const removeParent  = (i:number) => setForm(prev=>({...prev,
    parentProductIds:prev.parentProductIds.filter((_,idx)=>idx!==i),
    parentProductNames:prev.parentProductNames.filter((_,idx)=>idx!==i),
  }));

  // ── category name ─────────────────────────────────────────────────────────

  const resolveCatName = (): string => {
    const sub  = subCats.find(c=>String(c.id)===String(form.subCategoryId));
    const main = mainCats.find(c=>String(c.id)===String(form.categoryId));
    const ch   = sub||main;
    return (ch?.nameAr||ch?.nameEn||ch?.nameUr||"").trim();
  };

  // ── validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.name.trim())     e.name     = "اسم الصنف (عربي) مطلوب";
    if (!form.nameLang2.trim()) e.nameLang2 = "الاسم بالإنجليزية مطلوب";
    if (!form.nameLang3.trim()) e.nameLang3 = "الاسم باللغة الثالثة مطلوب";
    if (!form.categoryId)      e.categoryId = "يرجى اختيار التصنيف الرئيسي";

    if (["basic","prepared"].includes(form.productNature) && !form.code.trim())
      e.code = "الكود مطلوب";

    if (["basic","materials","sub"].includes(form.productNature) && (!form.cost||isNaN(Number(form.cost))))
      e.cost = "التكلفة غير صحيحة";

    if (["basic","prepared","sub"].includes(form.productNature)) {
      if (!form.sellingPrice||isNaN(Number(form.sellingPrice)))
        e.sellingPrice = "سعر البيع غير صحيح";
      else if (!vatIncluded && !selectedVat)
        e.sellingPrice = "يرجى اختيار نسبة الضريبة أو تغيير الخيار إلى شامل الضريبة";
    }

    if (form.productNature==="materials" && (!form.alertQuantity||isNaN(Number(form.alertQuantity))))
      e.alertQuantity = "حد التنبيه غير صحيح";

    if (imageFile && !["image/png","image/jpeg","image/jpg","image/webp"].includes(imageFile.type))
      e.image = "صيغة الصورة غير مدعومة (PNG, JPG, WEBP فقط)";

    setErrors(e);

    if (form.productNature==="sub" && form.parentProductIds.length===0) {
      toast("warn","تنبيه","يرجى اختيار صنف مباشر واحد على الأقل"); return false;
    }
    if (form.productNature==="prepared" && form.materials.length===0) {
      toast("warn","تنبيه","يرجى إضافة خامة واحدة على الأقل"); return false;
    }

    return Object.keys(e).length===0;
  };

  // ── build FormData ────────────────────────────────────────────────────────

  const buildFD = (): FormData => {
    const fd          = new FormData();
    const catName     = resolveCatName();
    // TaxId: when inclusive/no-tax → use NO_TAX_ID(1); when exclusive → use selectedVat.id
    const taxId   = (!vatIncluded && selectedVat) ? selectedVat.id : NO_TAX_ID;
    const taxCalc = (!vatIncluded && selectedVat) ? "Excludestax" : "Includestax";
    const priceToSend = String(finalSellingPrice);

    switch (form.productNature) {
      case "basic":
        fd.append("Barcode",        form.code.trim());
        fd.append("ProductNameAr",  form.name.trim());
        fd.append("ProductNameEn",  form.nameLang2.trim());
        fd.append("ProductNameUr",  form.nameLang3.trim());
        fd.append("Description",    form.details.trim());
        fd.append("CategoryName",   catName);
        fd.append("CostPrice",      form.cost);
        fd.append("SellingPrice",   priceToSend);
        fd.append("MinStockLevel",  form.alertQuantity||"0");
        fd.append("TaxId",          String(taxId));
        fd.append("TaxCalculation", taxCalc);
        if (imageFile) fd.append("Image", imageFile);
        break;

      case "materials":
        fd.append("ProductNameAr",  form.name.trim());
        fd.append("ProductNameEn",  form.nameLang2.trim());
        fd.append("ProductNameUr",  form.nameLang3.trim());
        fd.append("CategoryName",   catName);
        fd.append("CostPrice",      form.cost);
        fd.append("MinStockLevel",  form.alertQuantity||"0");
        fd.append("Description",    form.details.trim());
        fd.append("TaxId",          String(taxId));
        if (form.baseUnitId)        fd.append("BaseUnitId",       form.baseUnitId);
        if (form.purchaseUnitId)    fd.append("PurchaseUnitId",   form.purchaseUnitId);
        if (form.conversionFactor)  fd.append("ConversionFactor", form.conversionFactor);
        break;

      case "sub":
        fd.append("ProductNameAr", form.name.trim());
        fd.append("ProductNameEn", form.nameLang2.trim());
        fd.append("ProductNameUr", form.nameLang3.trim());
        fd.append("CategoryName",  catName);
        fd.append("Description",   form.details.trim());
        form.parentProductIds.forEach(pid => fd.append("ChildrenIds", pid));
        if (imageFile) fd.append("Image", imageFile);
        break;

      case "prepared":
        fd.append("Barcode",        form.code.trim());
        fd.append("ProductNameAr",  form.name.trim());
        fd.append("ProductNameEn",  form.nameLang2.trim());
        fd.append("ProductNameUr",  form.nameLang3.trim());
        fd.append("Description",    form.details.trim());
        fd.append("CategoryId",     form.categoryId);        // prepared uses integer CategoryId
        fd.append("SellingPrice",   priceToSend);
        fd.append("TaxId",          String(taxId));
        fd.append("TaxCalculation", taxCalc);
        if (imageFile) fd.append("Image", imageFile);
        fd.append("Components", JSON.stringify(
          form.materials.map(m=>({ materialId:Number(m.materialId), quantity:Number(m.quantity), unitId:m.unitId?Number(m.unitId):null }))
        ));
        break;
    }
    return fd;
  };

  // ── submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ nature:form.productNature, fd:buildFD() });
  };

  // ── close dropdowns on outside click ─────────────────────────────────────

  useEffect(()=>{
    const h = (e:MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dp-wrap")) {
        setShowMatSearch(false); setShowUnitSearch(false); setShowParentSearch(false);
      }
    };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  // ── helpers ───────────────────────────────────────────────────────────────

  const isSubmitting = mutation.isPending;
  const ErrMsg = ({field}:{field:string}) =>
    errors[field] ? <p className="mt-1 text-xs text-red-600">⚠ {errors[field]}</p> : null;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 pb-24" dir={direction}>
      <Toast ref={toastRef} position={direction==="rtl"?"top-left":"top-right"} />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={()=>navigate("/")}>{t("home")}</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={()=>navigate("/products")}>{t("products")}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">إضافة {getNatureLabel(form.productNature)}</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <PlusCircle size={22} className="text-[var(--primary)]" />
        <h1 className="text-xl font-bold text-gray-800">إضافة {getNatureLabel(form.productNature)}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" noValidate>
        <div className="p-6 md:p-8 space-y-8">

          {/* ── Nature ── */}
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <label className="block text-base font-bold text-blue-900 mb-4">
              طبيعة الصنف المضاف <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {(["basic","sub","prepared","materials"] as const).map(nature=>(
                <label key={nature} className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer min-w-[180px]",
                  form.productNature===nature
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                    : "bg-white border-gray-200 hover:border-[var(--primary)]",
                )}>
                  <input type="radio" name="productNature" value={nature}
                    checked={form.productNature===nature}
                    onChange={()=>setForm(prev=>({...prev,productNature:nature,parentProductIds:[],parentProductNames:[],materials:[],sellingPrice:"",cost:""}))}
                    className="w-5 h-5 accent-white" />
                  {getNatureIcon(nature)}
                  <span className="font-bold">{getNatureLabel(nature)}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">

            {/* ─ LEFT ──────────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Name AR */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  اسم {getNatureLabel(form.productNature)} (عربي) <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className={cn("takamol-input",errors.name&&"border-red-400")} placeholder="أدخل الاسم بالعربية..." />
                <ErrMsg field="name" />
              </div>

              {/* Name EN */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم بالإنجليزية <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nameLang2" value={form.nameLang2} onChange={handleChange}
                  className={cn("takamol-input",errors.nameLang2&&"border-red-400")} placeholder="Enter English name..." />
                <ErrMsg field="nameLang2" />
              </div>

              {/* Name Lang3 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم باللغة الثالثة <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nameLang3" value={form.nameLang3} onChange={handleChange}
                  className={cn("takamol-input",errors.nameLang3&&"border-red-400")} placeholder="نام به زبان سوم..." />
                <ErrMsg field="nameLang3" />
              </div>

              {/* Code */}
              {["basic","prepared"].includes(form.productNature) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الكود / الباركود <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="text" name="code" value={form.code} onChange={handleChange}
                      className={cn("takamol-input font-mono",errors.code&&"border-red-400")} placeholder="PRD-001" />
                    <button type="button" title="توليد كود تلقائي"
                      onClick={()=>setForm(prev=>({...prev,code:`${systemSettings?.prefixes?.product||"PRD"}${Math.floor(Math.random()*10_000_000).toString().padStart(6,"0")}`}))}
                      className="bg-gray-100 border border-gray-300 p-2.5 rounded-lg hover:bg-gray-200 transition-colors">
                      <Barcode size={20} />
                    </button>
                  </div>
                  <ErrMsg field="code" />
                </div>
              )}

              {/* Cost */}
              {["basic","materials","sub"].includes(form.productNature) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    التكلفة <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="cost" value={form.cost} onChange={handleChange}
                    className={cn("takamol-input font-bold text-[var(--primary)]",errors.cost&&"border-red-400")}
                    step="0.01" min="0" placeholder="0.00" />
                  <ErrMsg field="cost" />
                </div>
              )}

              {/* Prepared cost (read-only) */}
              {form.productNature==="prepared" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تكلفة الصنف المجهز (محسوبة تلقائياً)</label>
                  <input type="number" value={preparedCost.toFixed(2)} readOnly
                    className="takamol-input font-bold text-[var(--primary)] bg-gray-50 cursor-not-allowed" />
                </div>
              )}

              {/* ── Selling price + VAT ── */}
              {["basic","prepared","sub"].includes(form.productNature) && (
                <div className="space-y-3 p-4 rounded-xl border border-gray-200 bg-gray-50/40">

                  <label className="block text-sm font-bold text-gray-700">
                    سعر البيع <span className="text-red-500">*</span>
                  </label>

                  {/* price input */}
                  <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange}
                    className={cn("takamol-input",errors.sellingPrice&&"border-red-400")}
                    step="0.01" min="0" placeholder="0.00" />
                  <ErrMsg field="sellingPrice" />

                  {/* VAT toggle */}
                  <div className="flex gap-2 pt-1">
                    {[
                      { val:true,  label:"✔ شامل ضريبة القيمة المضافة"     },
                      { val:false, label:"＋ غير شامل ضريبة القيمة المضافة" },
                    ].map(opt=>(
                      <button key={String(opt.val)} type="button"
                        onClick={()=>{ setVatIncluded(opt.val); if(opt.val) setSelectedVat(null); }}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all text-center",
                          vatIncluded===opt.val
                            ? "bg-emerald-600 text-white border-emerald-600 shadow"
                            : "bg-white border-gray-200 text-gray-700 hover:border-emerald-400",
                        )}>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Rate buttons */}
                  {!vatIncluded && (
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">اختر نسبة الضريبة:</p>
                      <div className="flex gap-2 flex-wrap">
                        {taxOptions.length===0
                          ? <p className="text-xs text-gray-400">لا توجد ضرائب متاحة</p>
                          : taxOptions.map(opt=>(
                          <button key={opt.id} type="button"
                            onClick={()=>setSelectedVat(prev=>prev?.id===opt.id?null:opt)}
                            className={cn(
                              "px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all",
                              selectedVat?.id===opt.id
                                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                : "bg-white border-gray-200 hover:border-amber-400",
                            )}>
                            {opt.name} ({opt.amount}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price preview — only show when exclusive + tax chosen */}
                  {!vatIncluded && selectedVat && form.sellingPrice && Number(form.sellingPrice)>0 && (
                    <div className="rounded-lg p-3 text-sm border bg-amber-50 border-amber-200 space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>السعر قبل الضريبة</span>
                        <span>{parseFloat(form.sellingPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-amber-700">
                        <span>ضريبة {selectedVat.name} ({selectedVat.amount}%)</span>
                        <span>+ {((parseFloat(form.sellingPrice)||0)*selectedVat.amount/100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-900 border-t border-amber-200 pt-1 mt-1">
                        <span>السعر النهائي</span>
                        <span>{finalSellingPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Alert qty — materials */}
              {form.productNature==="materials" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    حد التنبيه من نفاذ الكمية <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="alertQuantity" value={form.alertQuantity} onChange={handleChange}
                    className={cn("takamol-input",errors.alertQuantity&&"border-red-400")} min="0" placeholder="0" />
                  <ErrMsg field="alertQuantity" />
                </div>
              )}

              {/* Raw-material extras */}
              {form.productNature==="materials" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">وحدة الأساس</label>
                    <select name="baseUnitId" value={form.baseUnitId} onChange={handleChange} className="takamol-input">
                      <option value="">اختياري</option>
                      {UNITS_LIST.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">وحدة الشراء</label>
                    <select name="purchaseUnitId" value={form.purchaseUnitId} onChange={handleChange} className="takamol-input">
                      <option value="">اختياري</option>
                      {UNITS_LIST.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">معامل التحويل</label>
                    <input type="number" name="conversionFactor" value={form.conversionFactor} onChange={handleChange}
                      className="takamol-input" step="0.001" min="0" placeholder="1" />
                  </div>
                </>
              )}

              {/* Sub: parent selector */}
              {form.productNature==="sub" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الأصناف المباشرة الأم <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {form.parentProductNames.length>0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {form.parentProductNames.map((name,i)=>(
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {name}
                            <button type="button" onClick={()=>removeParent(i)} className="hover:text-red-600"><X size={13}/></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="dp-wrap relative">
                      <div className="relative">
                        <input type="text" value={parentSearch}
                          onChange={e=>{setParentSearch(e.target.value);setShowParentSearch(true);}}
                          onFocus={()=>setShowParentSearch(true)}
                          className="takamol-input w-full pr-10" placeholder="ابحث عن صنف مباشر..." />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      </div>
                      {showParentSearch && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {filteredParents.length===0
                            ? <div className="p-3 text-center text-gray-500 text-sm">لا توجد أصناف مطابقة</div>
                            : filteredParents.map(p=>{
                                const isSel=form.parentProductIds.includes(String(p.id));
                                return (
                                  <div key={p.id} onClick={()=>toggleParent(p)}
                                    className={cn("p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center justify-between",isSel&&"bg-green-50")}>
                                    <div>
                                      <div className="font-bold text-sm">{p.name}</div>
                                      <div className="text-xs text-gray-500">الكود: {p.code}</div>
                                    </div>
                                    {isSel && <Check size={16} className="text-green-600"/>}
                                  </div>
                                );
                              })
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Prepared: materials */}
              {form.productNature==="prepared" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الخامات المستخدمة <span className="text-red-500">*</span>
                  </label>

                  {/* add row */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-3">
                    <div className="grid grid-cols-12 gap-2">

                      {/* search */}
                      <div className="col-span-5 dp-wrap relative">
                        <label className="block text-xs font-bold text-gray-600 mb-1">بحث في الخامات</label>
                        <div className="relative">
                          <input type="text" value={matSearch}
                            onChange={e=>{setMatSearch(e.target.value);setShowMatSearch(true);}}
                            onFocus={()=>setShowMatSearch(true)}
                            className="takamol-input w-full pr-8 text-sm" placeholder="ابحث..." />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={13}/>
                        </div>
                        {showMatSearch && matSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                            {filteredMats.length===0
                              ? <div className="p-2 text-center text-gray-500 text-xs">لا توجد خامات</div>
                              : filteredMats.map(m=>(
                                  <div key={m.id} onClick={()=>{setMatSearch(m.name);setShowMatSearch(false);}}
                                    className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                    <div className="font-bold text-sm">{m.name}</div>
                                    <div className="text-xs text-gray-500">{m.code}</div>
                                  </div>
                                ))
                            }
                          </div>
                        )}
                      </div>

                      {/* qty */}
                      <div className="col-span-3">
                        <label className="block text-xs font-bold text-gray-600 mb-1">الكمية</label>
                        <input type="number" value={matQty} onChange={e=>setMatQty(e.target.value)}
                          className="takamol-input w-full text-center text-sm" min="0.01" step="0.01" placeholder="1" />
                      </div>

                      {/* unit */}
                      <div className="col-span-2 dp-wrap relative">
                        <label className="block text-xs font-bold text-gray-600 mb-1">الوحدة</label>
                        <input type="text"
                          value={UNITS_LIST.find(u=>u.id===unitSearch)?.name||""}
                          onFocus={()=>setShowUnitSearch(true)} onClick={()=>setShowUnitSearch(true)}
                          className="takamol-input w-full text-sm" placeholder="وحدة" readOnly />
                        {showUnitSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                            {UNITS_LIST.map(u=>(
                              <div key={u.id} onClick={()=>{setUnitSearch(u.id);setShowUnitSearch(false);}}
                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 text-sm font-bold">
                                {u.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* add btn */}
                      <div className="col-span-2 flex items-end">
                        <button type="button" onClick={handleAddMat} disabled={!matSearch}
                          className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-bold text-sm transition-colors">
                          <PlusCircle size={15}/> إضافة
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* table */}
                  {form.materials.length>0 && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-right font-bold text-gray-700">الخامة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-20">الكمية</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-20">الوحدة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-24">التكلفة</th>
                            <th className="p-3 w-12"/>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {form.materials.map((m,i)=>(
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="p-3 font-bold text-gray-800">{m.materialName}</td>
                              <td className="p-3 text-center">{m.quantity}</td>
                              <td className="p-3 text-center text-gray-600">{m.unitName||"—"}</td>
                              <td className="p-3 text-center text-gray-600">
                                {(Number(m.cost||0)*Number(m.quantity||0)).toFixed(2)}
                              </td>
                              <td className="p-3 text-center">
                                <button type="button" onClick={()=>removeMat(i)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                  <Trash2 size={15}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td className="p-3" colSpan={3}>الإجمالي</td>
                            <td className="p-3 text-center text-[var(--primary)]">{preparedCost.toFixed(2)}</td>
                            <td/>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>{/* end LEFT */}

            {/* ─ RIGHT ──────────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Main category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  التصنيف الرئيسي <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select name="categoryId" value={form.categoryId} onChange={handleChange}
                    className={cn("takamol-input appearance-none pr-10",errors.categoryId&&"border-red-400")}
                    disabled={loadingMain}>
                    <option value="">
                      {loadingMain ? "⏳ جاري تحميل التصنيفات..." : "اختر التصنيف الرئيسي"}
                    </option>
                    {mainCats.map(c=>(
                      <option key={String(c.id)} value={String(c.id)}>{getDisplayName(c,direction)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                </div>
                {loadingMain && (
                  <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block"/>
                    يتم تحميل التصنيفات من الـ API...
                  </p>
                )}
                <ErrMsg field="categoryId"/>
              </div>

              {/* Sub category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف الفرعي</label>
                <div className="relative">
                  <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange}
                    className="takamol-input appearance-none pr-10"
                    disabled={!form.categoryId||loadingSub}>
                    <option value="">
                      {!form.categoryId ? "اختر التصنيف الرئيسي أولًا"
                        : loadingSub ? "⏳ جاري التحميل..."
                        : "اختياري — اختر تصنيفاً فرعياً"}
                    </option>
                    {subCats.map(c=>(
                      <option key={String(c.id)} value={String(c.id)}>{getDisplayName(c,direction)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                </div>
                {loadingSub && (
                  <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block"/>
                    يتم تحميل التصنيفات الفرعية...
                  </p>
                )}
              </div>

              {/* Hide in POS */}
              {form.productNature!=="materials" && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input type="checkbox" id="hideInPos" name="hideInPos"
                    checked={form.hideInPos} onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[var(--primary)]"/>
                  <label htmlFor="hideInPos" className="text-sm font-bold text-gray-700 cursor-pointer">
                    إخفاء في نقاط البيع
                  </label>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <textarea name="details" value={form.details} onChange={handleChange}
                  className={cn("takamol-input w-full min-h-[120px] resize-y",errors.details&&"border-red-400")}
                  placeholder="أدخل الوصف..." />
                <ErrMsg field="details"/>
              </div>

              {/* Image */}
              {form.productNature!=="materials" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    صورة {getNatureLabel(form.productNature)}
                  </label>
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} className="hidden"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={e=>{const f=e.target.files?.[0]||null;setImageFile(f);setFileName(f?.name||"");}}/>
                    <button type="button" onClick={()=>fileInputRef.current?.click()}
                      className="bg-gray-100 border border-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2 transition-colors whitespace-nowrap">
                      <Upload size={16}/> استعراض
                    </button>
                    <input type="text" value={fileName} readOnly
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 min-w-0"
                      placeholder="لم يتم اختيار ملف"/>
                    {imageFile && (
                      <button type="button"
                        onClick={()=>{setImageFile(null);setFileName("");if(fileInputRef.current)fileInputRef.current.value="";}}
                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={16}/>
                      </button>
                    )}
                  </div>
                  <ErrMsg field="image"/>
                  <p className="mt-1 text-xs text-gray-400">الصيغ المقبولة: PNG, JPG, WEBP</p>
                </div>
              )}



            </div>{/* end RIGHT */}
          </div>{/* end grid */}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={()=>navigate("/products")} disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50">
            <X size={18}/> إلغاء
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-8 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-[150px] justify-center">
            {isSubmitting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> جاري الحفظ...</>
              : <><Save size={20}/> حفظ البيانات</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}