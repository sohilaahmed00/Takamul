// src/pages/EditProduct.tsx
import React, { useState, useRef, ChangeEvent, FormEvent, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Upload, Save, Edit2, Box, Package,
  Layers, X, FolderPlus, Search, Check, Trash2,
  PlusCircle, ChevronDown,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Toast } from "primereact/toast";
import { cn } from "@/lib/utils";

const REAL_API = "http://takamulerp.runasp.net";

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
  materialId: string;
  materialName: string;
  quantity: number;
  unitId?: string;
  unitName?: string;
  cost?: number;
}

interface Unit {
  id: string;
  code: string;
  name: string;
}

interface TaxOption {
  id: number;
  name: string;
  amount: number;
}

const NO_TAX_ID = 1;

type FormErrors = Partial<Record<string, string>>;

const UNITS_LIST: Unit[] = [
  { id: "1", code: "U-001", name: "قطعة" },
  { id: "2", code: "U-002", name: "كيلو" },
  { id: "3", code: "U-003", name: "جرام" },
  { id: "4", code: "U-004", name: "لتر" },
  { id: "5", code: "U-005", name: "علبة" },
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
  const rawText = await res.text();
  if (!res.ok) {
    let msg = rawText || `Request failed (${res.status})`;
    try {
      const d: any = JSON.parse(rawText);
      console.error(`[API FULL ERROR] ${url}:`, JSON.stringify(d, null, 2));
      const extracted =
        d?.message || d?.Message || d?.title || d?.Title || d?.error || d?.Error ||
        (d?.errors ? Object.entries(d.errors).map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ") : null);
      if (extracted) msg = extracted;
    } catch { }
    throw new Error(msg);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { return JSON.parse(rawText) as T; } catch { return rawText as unknown as T; }
  }
  return rawText as unknown as T;
}

function normalizeCategory(item: any): NormalizedCategory {
  const id = item?.id ?? item?.Id ?? item?.categoryId ?? item?.CategoryId ?? "";
  const nameAr = (item?.categoryNameAr ?? item?.CategoryNameAr ?? item?.nameAr ?? item?.categoryName ?? item?.name ?? "").toString();
  const nameEn = (item?.categoryNameEn ?? item?.CategoryNameEn ?? item?.nameEn ?? item?.categoryName ?? item?.name ?? "").toString();
  const nameUr = (item?.categoryNameUr ?? item?.CategoryNameUr ?? item?.nameUr ?? item?.categoryName ?? item?.name ?? "").toString();
  return { id, nameAr, nameEn, nameUr };
}

function getDisplayName(c: NormalizedCategory, dir: string): string {
  return dir === "rtl" ? (c.nameAr || c.nameEn || c.nameUr) : (c.nameEn || c.nameAr || c.nameUr);
}

function mapProductLite(item: any): ProductLite {
  return {
    id: String(item?.id ?? item?.productId ?? ""),
    code: String(item?.barcode ?? item?.productCode ?? ""),
    name: String(item?.productNameAr || item?.productNameEn || item?.name || ""),
    cost: Number(item?.costPrice ?? item?.cost ?? 0),
    image: String(item?.imageUrl ?? item?.image ?? ""),
  };
}

function getNatureLabel(n: ProductNature, t: (key: string) => string): string {
  switch (n) {
    case "basic": return t("direct_product_type");
    case "prepared": return t("prepared_product_type");
    case "sub": return t("branched_product_type");
    case "materials": return t("raw_material_type");
  }
}

function getNatureIcon(n: ProductNature) {
  switch (n) {
    case "basic": return <Box size={20} />;
    case "prepared": return <Package size={20} />;
    case "sub": return <Layers size={20} />;
    case "materials": return <FolderPlus size={20} />;
  }
}

// Determine nature from API product data
function detectNature(item: any): ProductNature {
  // Check every possible field the API might use
  const t = [
    item?.productType, item?.ProductType,
    item?.type, item?.Type,
    item?.nature, item?.Nature,
    item?.productNature, item?.ProductNature,
    item?.category, item?.categoryName,
  ].map(v => (v ?? "").toString().toLowerCase()).join("|");

  if (t.includes("prepared") || t.includes("مجهز")) return "prepared";
  if (t.includes("branch") || t.includes("sub") || t.includes("متفرع")) return "sub";
  if (t.includes("raw") || t.includes("material") || t.includes("خامة") || t.includes("rawmaterial")) return "materials";
  return "basic";
}

function natureToUpdateEndpoint(n: ProductNature, id: string): string {
  switch (n) {
    case "basic": return `/api/Products/direct/${id}`;
    case "materials": return `/api/Products/raw-material/${id}`;
    case "sub": return `/api/Products/branched/${id}`;
    case "prepared": return `/api/Products/prepared/${id}`;
  }
}

// ─── API fns ──────────────────────────────────────────────────────────────────

const apiFetchProduct = (id: string): Promise<any> =>
  fetchJson(`${REAL_API}/api/Products/${id}`, { method: "GET" });

// Try each type-specific endpoint to determine product nature
const apiFetchProductByType = async (id: string): Promise<{ nature: ProductNature; data: any }> => {
  const endpoints: Array<{ nature: ProductNature; path: string }> = [
    { nature: "basic", path: `/api/Products/direct/${id}` },
    { nature: "sub", path: `/api/Products/branched/${id}` },
    { nature: "prepared", path: `/api/Products/prepared/${id}` },
    { nature: "materials", path: `/api/Products/raw-material/${id}` },
  ];
  for (const ep of endpoints) {
    try {
      const data = await fetchJson<any>(`${REAL_API}${ep.path}`, { method: "GET" });
      if (data && !data?.message) return { nature: ep.nature, data };
    } catch { /* try next */ }
  }
  return { nature: "basic", data: null };
};

const apiFetchMainCats = (): Promise<any[]> =>
  (fetchJson(`${REAL_API}/api/ProductCategories/MainCategory`, { method: "GET" }) as Promise<any>).catch(() => []);

const apiFetchSubCats = (id: string): Promise<any[]> =>
  (fetchJson(`${REAL_API}/api/ProductCategories/SubCategory/${encodeURIComponent(id)}`, { method: "GET" }) as Promise<any>).catch(() => []);

const apiFetchAllProducts = (): Promise<any[]> =>
  (fetchJson(`${REAL_API}/api/Products`, { method: "GET" }) as Promise<any>).catch(() => []);

const apiFetchRaw = (): Promise<any[]> =>
  (fetchJson(`${REAL_API}/api/Products/raw-material`, { method: "GET" }) as Promise<any>).catch(() => []);

const apiFetchTaxes = (): Promise<TaxOption[]> =>
  fetchJson<TaxOption[]>(`${REAL_API}/api/Taxes`, { method: "GET" }).catch(() => []);

const apiFetchUnits = (): Promise<Unit[]> =>
  fetchJson<any[]>(`${REAL_API}/api/UnitOfMeasure`, { method: "GET" })
    .then((arr: any[]) => (Array.isArray(arr) ? arr : []).map((u: any) => ({
      id: String(u?.id ?? u?.unitId ?? ""),
      code: String(u?.code ?? ""),
      name: String(u?.unitName ?? u?.name ?? ""),
    }))).catch(() => UNITS_LIST);

const apiPutProduct = (n: ProductNature, id: string, body: FormData): Promise<any> =>
  fetchJson(`${REAL_API}${natureToUpdateEndpoint(n, id)}`, { method: "PUT", body });

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditProduct() {
  const { t, direction } = useLanguage();
  const { systemSettings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const toastRef = useRef<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const toast = (severity: "success" | "error" | "warn" | "info", summary: string, detail?: string) =>
    toastRef.current?.show({ severity, summary, detail, life: 4500 });

  // ── state ──────────────────────────────────────────────────────────────────

  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [productNature, setProductNature] = useState<ProductNature>("basic");

  const [showMatSearch, setShowMatSearch] = useState(false);
  const [showUnitSearch, setShowUnitSearch] = useState(false);
  const [showParentSearch, setShowParentSearch] = useState(false);

  const [matSearch, setMatSearch] = useState("");
  const [matQty, setMatQty] = useState("1");
  const [unitSearch, setUnitSearch] = useState("");
  const [parentSearch, setParentSearch] = useState("");

  const [vatIncluded, setVatIncluded] = useState<boolean>(true);
  const [selectedVat, setSelectedVat] = useState<TaxOption | null>(null);

  const [form, setForm] = useState({
    name: "",
    nameLang2: "",
    nameLang3: "",
    code: "",
    cost: "",
    sellingPrice: "",
    categoryId: "",
    subCategoryId: "",
    alertQuantity: "0",
    hideInPos: false,
    details: "",
    parentProductIds: [] as string[],
    parentProductNames: [] as string[],
    materials: [] as MaterialItem[],
    baseUnitId: "",
    purchaseUnitId: "",
    conversionFactor: "1",
  });

  // ── queries ────────────────────────────────────────────────────────────────

  const { data: productRaw, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiFetchProduct(id!),
    enabled: Boolean(id),
    staleTime: 0,
  });

  // Always fetch from type-specific endpoint to get full data (childrenIds, components, etc.)
  const stateNature = (location.state as any)?.productNature as ProductNature | undefined;

  // Fetch type-specific data to get childrenIds/components
  // NOTE: GET endpoints may differ from PUT — use same paths that work for GET
  const apiFetchSpecific = async (): Promise<{ nature: ProductNature; data: any }> => {
    if (stateNature) {
      // Try the type-specific GET endpoint
      const getEndpoints: Record<ProductNature, string> = {
        basic: `/api/Products/direct/${id}`,
        sub: `/api/Products/branched/${id}`,
        prepared: `/api/Products/prepared/${id}`,
        materials: `/api/Products/raw-material/${id}`,
      };
      try {
        const path = getEndpoints[stateNature];
        const data = await fetchJson<any>(`${REAL_API}${path}`, { method: "GET" });
        if (data && !data?.message) return { nature: stateNature, data };
      } catch { /* endpoint doesn't exist, use generic */ }
      // Fallback: use generic endpoint data with known nature
      return { nature: stateNature, data: null };
    }
    return apiFetchProductByType(id!);
  };

  const { data: typeData, isLoading: loadingType } = useQuery({
    queryKey: ["productByType", id, stateNature],
    queryFn: apiFetchSpecific,
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  const { data: mainCatRaw = [], isLoading: loadingMain } = useQuery({
    queryKey: ["mainCategories"],
    queryFn: apiFetchMainCats,
    staleTime: 5 * 60 * 1000,
  });

  const mainCats: NormalizedCategory[] = useMemo(
    () => (Array.isArray(mainCatRaw) ? mainCatRaw : []).map(normalizeCategory).filter(c => String(c.id) !== ""),
    [mainCatRaw],
  );

  const { data: subCatRaw = [], isLoading: loadingSub } = useQuery({
    queryKey: ["subCategories", form.categoryId],
    queryFn: () => apiFetchSubCats(form.categoryId),
    enabled: Boolean(form.categoryId),
    staleTime: 5 * 60 * 1000,
  });

  const subCats: NormalizedCategory[] = useMemo(
    () => (Array.isArray(subCatRaw) ? subCatRaw : []).map(normalizeCategory).filter(c => String(c.id) !== ""),
    [subCatRaw],
  );

  const { data: allProductsRaw = [] } = useQuery({
    queryKey: ["allProducts"],
    queryFn: apiFetchAllProducts,
    staleTime: 2 * 60 * 1000,
  });
  const allProductsList: ProductLite[] = useMemo(
    () => (Array.isArray(allProductsRaw) ? allProductsRaw : []).map(mapProductLite),
    [allProductsRaw],
  );

  const { data: rawMatsRaw = [] } = useQuery({ queryKey: ["rawMaterials"], queryFn: apiFetchRaw, staleTime: 2 * 60 * 1000 });
  const matList: ProductLite[] = useMemo(() => (Array.isArray(rawMatsRaw) ? rawMatsRaw : []).map(mapProductLite), [rawMatsRaw]);
  // For display purposes in prepared edit — include all products so existing components show correctly
  const matListForDisplay: ProductLite[] = useMemo(() => {
    const rawIds = new Set((Array.isArray(rawMatsRaw) ? rawMatsRaw : []).map((p: any) => String(p?.id ?? "")));
    const all = (Array.isArray(allProductsRaw) ? allProductsRaw : []).map(mapProductLite);
    return all; // show all for display, but warn if non-raw-material is selected
  }, [rawMatsRaw, allProductsRaw]);

  const { data: taxesRaw = [] } = useQuery({ queryKey: ["taxes"], queryFn: apiFetchTaxes, staleTime: 10 * 60 * 1000 });
  const taxOptions: TaxOption[] = useMemo(
    () => (Array.isArray(taxesRaw) ? taxesRaw : []).filter(t => t.id !== NO_TAX_ID),
    [taxesRaw],
  );

  const { data: apiUnits = UNITS_LIST } = useQuery({ queryKey: ["units"], queryFn: apiFetchUnits, staleTime: 5 * 60 * 1000 });
  const unitsForPrepared: Unit[] = useMemo(
    () => (Array.isArray(apiUnits) && apiUnits.length > 0 ? apiUnits : UNITS_LIST),
    [apiUnits],
  );

  // ── populate form from API ─────────────────────────────────────────────────

  // ── Populate form from API data ────────────────────────────────────────────
  // Use useMemo-style derived state + useEffect to handle async data arrival
  // All data sources (productRaw, typeData, mainCats, unitsForPrepared) might arrive at different times
  useEffect(() => {
    if (!productRaw) return;
    const p = productRaw as any;

    // ── Determine nature ──
    const resolvedNature: ProductNature = stateNature ?? typeData?.nature ?? detectNature(p);
    setProductNature(resolvedNature);

    // ── Use type-specific data if available ──
    const specific = (typeData?.data && !typeData.data?.message) ? typeData.data : p;

    // ── Resolve categoryId ──
    const directCategoryId = specific?.categoryId ?? specific?.CategoryId ?? p?.categoryId ?? null;
    const catNameFromApi = (specific?.categoryName ?? p?.categoryName ?? "").toString().trim();
    const matchedByName = mainCats.find(c =>
      c.nameAr === catNameFromApi || c.nameEn === catNameFromApi || c.nameUr === catNameFromApi
    );
    const resolvedCatId = directCategoryId
      ? String(directCategoryId)
      : matchedByName ? String(matchedByName.id) : "";

    // ── Parse children (for sub/branched) ──
    const childrenIds: string[] = (() => {
      const raw = specific?.childrenIds ?? specific?.ChildrenIds ?? p?.childrenIds;
      if (Array.isArray(raw) && raw.length > 0) return raw.map(String);
      const children = specific?.children ?? p?.children;
      if (Array.isArray(children)) return children.map((c: any) => String(c?.id ?? "")).filter(Boolean);
      return [];
    })();
    const childrenNames: string[] = (() => {
      const children = specific?.children ?? p?.children;
      if (Array.isArray(children)) return children.map((c: any) => String(c?.productNameAr ?? c?.name ?? "")).filter(Boolean);
      return [];
    })();

    // ── Parse components (for prepared) ──
    const components: MaterialItem[] = (() => {
      const raw = specific?.components ?? specific?.Components ?? p?.components ?? [];
      if (!Array.isArray(raw)) return [];
      return raw.map((c: any) => {
        const matId = c?.componentProductId ?? c?.rawMaterialId ?? c?.productId ?? c?.materialId ?? c?.id ?? "";
        const matName = c?.componentNameAr ?? c?.productNameAr ?? c?.rawMaterialNameAr ?? c?.name ?? c?.materialName ?? "";
        const unitIdStr = c?.unitId ? String(c.unitId) : undefined;
        const unitNameResolved = c?.unitName ?? c?.unitNameAr ??
          (unitIdStr ? (unitsForPrepared.find(u => u.id === unitIdStr)?.name ?? UNITS_LIST.find(u => u.id === unitIdStr)?.name) : undefined);
        return {
          materialId: String(matId),
          materialName: String(matName),
          quantity: Number(c?.quantity ?? 1),
          unitId: unitIdStr,
          unitName: unitNameResolved,
          cost: Number(c?.unitCost ?? c?.costPrice ?? c?.cost ?? 0),
        };
      });
    })();

    const parsePrice = (v: any) => v != null && Number(v) !== 0 ? String(Number(v)) : "";

    setForm(prev => ({
      ...prev,
      name: String(specific?.productNameAr ?? p?.productNameAr ?? ""),
      nameLang2: String(specific?.productNameEn ?? p?.productNameEn ?? ""),
      nameLang3: String(specific?.productNameUr ?? p?.productNameUr ?? ""),
      code: String(specific?.barcode ?? specific?.productCode ?? p?.barcode ?? ""),
      cost: parsePrice(specific?.costPrice ?? p?.costPrice),
      sellingPrice: parsePrice(specific?.sellingPrice ?? p?.sellingPrice),
      categoryId: resolvedCatId,
      alertQuantity: String(specific?.minStockLevel ?? p?.minStockLevel ?? "0"),
      details: String(specific?.description ?? p?.description ?? ""),
      conversionFactor: String(specific?.conversionFactor ?? p?.conversionFactor ?? "1"),
      baseUnitId: specific?.baseUnitId ? String(specific.baseUnitId) : "",
      purchaseUnitId: specific?.purchaseUnitId ? String(specific.purchaseUnitId) : "",
      parentProductIds: childrenIds,
      parentProductNames: childrenNames,
      materials: components,
    }));

    const imgUrl = specific?.imageUrl ?? p?.imageUrl;
    if (imgUrl) setFileName(imgUrl);
  }, [productRaw, typeData, mainCats, unitsForPrepared]);

  // ── derived ────────────────────────────────────────────────────────────────

  const finalSellingPrice = useMemo<number>(() => {
    const base = parseFloat(form.sellingPrice) || 0;
    if (vatIncluded || !selectedVat) return base;
    return parseFloat((base * (1 + selectedVat.amount / 100)).toFixed(4));
  }, [form.sellingPrice, vatIncluded, selectedVat]);

  const preparedCost = useMemo(
    () => form.materials.reduce((s, m) => s + Number(m.cost || 0) * Number(m.quantity || 0), 0),
    [form.materials],
  );

  // ── filtered lists ─────────────────────────────────────────────────────────

  const filteredParents = useMemo(() =>
    allProductsList.filter(p =>
      p.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(parentSearch.toLowerCase())
    ),
    [allProductsList, parentSearch],
  );

  const filteredMats = useMemo(() =>
    matList.filter(m =>
      m.name.toLowerCase().includes(matSearch.toLowerCase()) ||
      m.code.toLowerCase().includes(matSearch.toLowerCase())
    ),
    [matList, matSearch],
  );

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleAddMat = () => {
    const sel = matList.find(m => m.name === matSearch);
    if (!sel) { toast("warn", "تحذير", "يرجى اختيار خامة صحيحة من القائمة"); return; }
    if (form.materials.some(m => String(m.materialId) === String(sel.id))) { toast("warn", "تحذير", "الخامة مضافة بالفعل"); return; }
    const unit = unitsForPrepared.find(u => u.id === unitSearch) || unitsForPrepared[0];
    setForm(prev => ({
      ...prev, materials: [...prev.materials, {
        materialId: String(sel.id), materialName: sel.name,
        quantity: parseFloat(matQty) || 1, unitId: unit?.id, unitName: unit?.name, cost: Number(sel.cost ?? 0),
      }]
    }));
    setMatSearch(""); setMatQty("1"); setUnitSearch(""); setShowMatSearch(false); setShowUnitSearch(false);
  };

  const removeMat = (i: number) => setForm(prev => ({ ...prev, materials: prev.materials.filter((_, idx) => idx !== i) }));

  const toggleParent = (p: ProductLite) => setForm(prev => {
    const sel = prev.parentProductIds.includes(String(p.id));
    return sel
      ? { ...prev, parentProductIds: prev.parentProductIds.filter(x => x !== String(p.id)), parentProductNames: prev.parentProductNames.filter(x => x !== p.name) }
      : { ...prev, parentProductIds: [...prev.parentProductIds, String(p.id)], parentProductNames: [...prev.parentProductNames, p.name] };
  });

  const removeParent = (i: number) => setForm(prev => ({
    ...prev,
    parentProductIds: prev.parentProductIds.filter((_, idx) => idx !== i),
    parentProductNames: prev.parentProductNames.filter((_, idx) => idx !== i),
  }));

  // ── category helpers ───────────────────────────────────────────────────────

  const resolvedCategoryId = (): string => form.subCategoryId || form.categoryId;

  const resolveCatName = (): string => {
    const effectiveId = form.subCategoryId || form.categoryId;
    const allCats = [...mainCats, ...subCats];
    const found = allCats.find(c => String(c.id) === String(effectiveId));
    return (found?.nameAr || found?.nameEn || found?.nameUr || "").trim();
  };

  // ── mutation ───────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async ({ fd }: { fd: FormData }) => {
      console.group(`[EditProduct] PUT ${productNature}/${id}`);
      fd.forEach((v, k) => console.log(k, ":", v));
      console.groupEnd();
      try {
        return await apiPutProduct(productNature, id!, fd);
      } catch (err: any) {
        const msg = err?.message ?? "";
        // If 404: endpoint missing in backend — show Arabic message
        if (msg.includes("404") || msg.includes("Not Found")) {
          throw new Error(`تعديل ${getNatureLabel(productNature as ProductNature, t)} غير متاح حالياً — يرجى التواصل مع المطور لإضافة endpoint التعديل`);
        }
        throw err;
      }
    },
    onSuccess: () => {
      toast("success", "تم الحفظ بنجاح", "تم تعديل الصنف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      queryClient.invalidateQueries({ queryKey: ["directProducts"] });
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] });
      setTimeout(() => navigate("/products", { state: { productNature, refreshed: true } }), 1200);
    },
    onError: (err: any) => {
      const msg = err?.message ?? String(err);
      toast("error", "فشل الحفظ", msg.length > 120 ? msg.slice(0, 120) + "…" : msg);
    },
  });

  // ── validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.name.trim()) e.name = "اسم الصنف (عربي) مطلوب";
    if (!form.nameLang2.trim()) e.nameLang2 = "الاسم بالإنجليزية مطلوب";
    if (!form.nameLang3.trim()) e.nameLang3 = "الاسم باللغة الثالثة مطلوب";

    if (productNature !== "materials" && !form.categoryId)
      e.categoryId = "يرجى اختيار التصنيف الرئيسي";

    if (["basic", "prepared", "sub"].includes(productNature) && !String(form.code || "").trim())
      e.code = "الكود مطلوب";

    if (["basic", "materials"].includes(productNature) && (!form.cost || isNaN(Number(form.cost))))
      e.cost = "التكلفة غير صحيحة";

    if (["basic", "prepared"].includes(productNature)) {
      if (!form.sellingPrice || isNaN(Number(form.sellingPrice)))
        e.sellingPrice = "سعر البيع غير صحيح";
      else if (!vatIncluded && !selectedVat)
        e.sellingPrice = "يرجى اختيار نسبة الضريبة أو تغيير الخيار إلى شامل الضريبة";
    }

    if (imageFile && !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(imageFile.type))
      e.image = "صيغة الصورة غير مدعومة (PNG, JPG, WEBP فقط)";

    setErrors(e);

    if (productNature === "sub" && form.parentProductIds.length === 0) {
      toast("warn", "تنبيه", "يرجى اختيار صنف مباشر واحد على الأقل"); return false;
    }
    if (productNature === "prepared" && form.materials.length === 0) {
      toast("warn", "تنبيه", "يرجى إضافة خامة واحدة على الأقل"); return false;
    }

    return Object.keys(e).length === 0;
  };

  // ── build request body ────────────────────────────────────────────────────────
  // NOTE: raw-material PUT uses application/json; others use multipart/form-data

  const buildFD = (): FormData => {
    const taxId = (!vatIncluded && selectedVat) ? selectedVat.id : NO_TAX_ID;
    const taxCalc = (!vatIncluded && selectedVat) ? "Excludestax" : "Includestax";
    const priceToSend = String(finalSellingPrice);
    const catId = resolvedCategoryId();

    switch (productNature) {

      // ── PUT /api/Products/direct/:id  (multipart/form-data) ──────────────
      // Swagger required: ProductNameAr*, CostPrice*, SellingPrice*, TaxCalculation*
      // Optional: Barcode, ProductNameEn/Ur, Description, MinStockLevel, TaxId, CategoryId, Image
      case "basic": {
        const fd = new FormData();
        fd.append("ProductNameAr", form.name.trim());
        fd.append("ProductNameEn", form.nameLang2.trim());
        fd.append("ProductNameUr", form.nameLang3.trim());
        if (String(form.code || "").trim()) fd.append("Barcode", String(form.code).trim());
        if (form.details.trim()) fd.append("Description", form.details.trim());
        const catNum = Number(catId);
        if (catNum > 0) fd.append("CategoryId", String(catNum));
        fd.append("CostPrice", form.cost);
        fd.append("SellingPrice", priceToSend);
        fd.append("MinStockLevel", form.alertQuantity || "0");
        fd.append("TaxId", String(taxId));
        fd.append("TaxCalculation", taxCalc);
        if (imageFile) fd.append("Image", imageFile);
        return fd;
      }

      // ── PUT /api/Products/raw-material/:id  (multipart/form-data) ──────────
      // Swagger: ProductNameAr*, CostPrice*, BaseUnitId(int), PurchaseUnitId(int), ConversionFactor
      case "materials": {
        const fd = new FormData();
        fd.append("ProductNameAr", form.name.trim());
        fd.append("CostPrice", String(Number(form.cost) || 0));
        if (form.baseUnitId) fd.append("BaseUnitId", String(Number(form.baseUnitId)));
        if (form.purchaseUnitId) fd.append("PurchaseUnitId", String(Number(form.purchaseUnitId)));
        if (form.conversionFactor) fd.append("ConversionFactor", form.conversionFactor);
        return fd;
      }

      // ── PUT /api/Products/branched/:id  (multipart/form-data) ──────────────
      // Swagger: ProductNameAr*, ProductNameEn, ProductNameUr, Description, Image, CategoryId, ChildrenIds
      // NO Barcode in Swagger
      case "sub": {
        const fd = new FormData();
        fd.append("ProductNameAr", form.name.trim());
        fd.append("ProductNameEn", form.nameLang2.trim());
        fd.append("ProductNameUr", form.nameLang3.trim());
        fd.append("Description", form.details.trim());
        // Don't send CategoryId — causes 500 DB constraint error in branched PUT
        form.parentProductIds.forEach(pid => fd.append("ChildrenIds", pid));
        if (imageFile) fd.append("Image", imageFile);
        return fd;
      }

      // ── PUT /api/Products/prepared/:id  (multipart/form-data) ────────────
      // Swagger required: ProductNameAr*, SellingPrice*, TaxId*
      // Optional: ProductNameEn, ProductNameUr, Barcode, Description, CategoryId, TaxCalculation, Image, Components
      case "prepared": {
        const fd = new FormData();
        fd.append("ProductNameAr", form.name.trim());
        fd.append("ProductNameEn", form.nameLang2.trim());
        fd.append("ProductNameUr", form.nameLang3.trim());
        if (String(form.code || "").trim()) fd.append("Barcode", String(form.code).trim());
        if (form.details.trim()) fd.append("Description", form.details.trim());
        const catNum = Number(catId);
        if (catNum > 0) fd.append("CategoryId", String(catNum));
        fd.append("SellingPrice", priceToSend);
        fd.append("TaxId", String(taxId));
        fd.append("TaxCalculation", taxCalc);
        if (imageFile) fd.append("Image", imageFile);
        if (form.materials.length > 0) {
          fd.append("Components", JSON.stringify(
            form.materials.map(m => ({
              componentProductId: Number(m.materialId),
              quantity: Number(m.quantity),
              unitId: Number(m.unitId) || 1,
            }))
          ));
        }
        return fd;
      }

      default:
        return new FormData();
    }
  };
  // ── submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ fd: buildFD() });
  };

  // ── close dropdowns on outside click ──────────────────────────────────────

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dp-wrap")) {
        setShowMatSearch(false); setShowUnitSearch(false); setShowParentSearch(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── helpers ────────────────────────────────────────────────────────────────

  const isSubmitting = mutation.isPending;
  const ErrMsg = ({ field }: { field: string }) =>
    errors[field] ? <p className="mt-1 text-xs text-red-600">⚠ {errors[field]}</p> : null;

  if (loadingProduct || (!stateNature && loadingType)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" dir={direction}>
        <span className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 pb-24" dir={direction}>
      <Toast ref={toastRef} position={direction === "rtl" ? "top-left" : "top-right"} />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>{t("home")}</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/products")}>{t("products")}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">تعديل {getNatureLabel(productNature, t)}</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Edit2 size={22} className="text-[var(--primary)]" />
        <h1 className="text-xl font-bold text-gray-800">تعديل {getNatureLabel(productNature, t)}: {form.name || "…"}</h1>
      </div>

      {/* Notice for prepared — components must be raw-materials */}
      {productNature === "prepared" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-600 text-lg">⚠️</span>
          <div>
            <p className="font-bold text-amber-800">تنبيه: الخامات في الصنف المجهز</p>
            <p className="text-sm text-amber-700 mt-1">
              الـ API يقبل فقط الخامات من نوع <strong>خامة</strong> (raw-material) كمكونات للصنف المجهز.
              إذا ظهر خطأ "الخامة غير موجودة"، فهذا يعني أن المنتج المضاف كخامة ليس من نوع "خامة" في النظام.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" noValidate>
        <div className="p-6 md:p-8 space-y-8">

          {/* ── Nature (read-only) ── */}
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <label className="block text-base font-bold text-blue-900 mb-4">طبيعة الصنف</label>
            <div className="flex flex-wrap gap-4">
              {(["basic", "sub", "prepared", "materials"] as const).map(nature => (
                <label key={nature} className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 cursor-not-allowed opacity-70 min-w-[180px]",
                  productNature === nature
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                    : "bg-white border-gray-200",
                )}>
                  <input type="radio" disabled checked={productNature === nature} className="w-5 h-5 accent-white" />
                  {getNatureIcon(nature)}
                  <span className="font-bold">{getNatureLabel(nature, t)}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3">لا يمكن تغيير نوع الصنف بعد الإنشاء</p>
          </div>

          <hr className="border-gray-100" />

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">

            {/* ─ LEFT ─ */}
            <div className="space-y-5">

              {/* Name AR */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  اسم {getNatureLabel(productNature, t)} (عربي) <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className={cn("takamol-input", errors.name && "border-red-400")} placeholder="أدخل الاسم بالعربية..." />
                <ErrMsg field="name" />
              </div>

              {/* Name EN */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم بالإنجليزية <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nameLang2" value={form.nameLang2} onChange={handleChange}
                  className={cn("takamol-input", errors.nameLang2 && "border-red-400")} placeholder="Enter English name..." />
                <ErrMsg field="nameLang2" />
              </div>

              {/* Name Lang3 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم باللغة الثالثة <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nameLang3" value={form.nameLang3} onChange={handleChange}
                  className={cn("takamol-input", errors.nameLang3 && "border-red-400")} placeholder="نام به زبان سوم..." />
                <ErrMsg field="nameLang3" />
              </div>

              {/* Code */}
              {["basic", "prepared", "sub"].includes(productNature) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الكود / الباركود <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="code" value={form.code} onChange={handleChange}
                    className={cn("takamol-input font-mono", errors.code && "border-red-400")} />
                  <ErrMsg field="code" />
                </div>
              )}

              {/* Cost */}
              {["basic", "materials"].includes(productNature) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    التكلفة <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="cost" value={form.cost} onChange={handleChange}
                    className={cn("takamol-input font-bold text-[var(--primary)]", errors.cost && "border-red-400")}
                    step="0.01" min="0" />
                  <ErrMsg field="cost" />
                </div>
              )}

              {/* Prepared cost */}
              {productNature === "prepared" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تكلفة الصنف المجهز (محسوبة تلقائياً)</label>
                  <input type="number" value={preparedCost.toFixed(2)} readOnly
                    className="takamol-input font-bold text-[var(--primary)] bg-gray-50 cursor-not-allowed" />
                </div>
              )}

              {/* Selling price + VAT */}
              {["basic", "prepared"].includes(productNature) && (
                <div className="space-y-3 p-4 rounded-xl border border-gray-200 bg-gray-50/40">
                  <label className="block text-sm font-bold text-gray-700">
                    سعر البيع <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange}
                    className={cn("takamol-input", errors.sellingPrice && "border-red-400")}
                    step="0.01" min="0" />
                  <ErrMsg field="sellingPrice" />
                  <div className="flex gap-2 pt-1">
                    {[
                      { val: true, label: "✔ شامل ضريبة القيمة المضافة" },
                      { val: false, label: "＋ غير شامل ضريبة القيمة المضافة" },
                    ].map(opt => (
                      <button key={String(opt.val)} type="button"
                        onClick={() => { setVatIncluded(opt.val); if (opt.val) setSelectedVat(null); }}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all text-center",
                          vatIncluded === opt.val
                            ? "bg-emerald-600 text-white border-emerald-600 shadow"
                            : "bg-white border-gray-200 text-gray-700 hover:border-emerald-400",
                        )}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {!vatIncluded && (
                    <div className="flex gap-2 flex-wrap">
                      {taxOptions.map(opt => (
                        <button key={opt.id} type="button"
                          onClick={() => setSelectedVat(prev => prev?.id === opt.id ? null : opt)}
                          className={cn("px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all",
                            selectedVat?.id === opt.id ? "bg-amber-500 text-white border-amber-500" : "bg-white border-gray-200 hover:border-amber-400")}>
                          {opt.name} ({opt.amount}%)
                        </button>
                      ))}
                    </div>
                  )}
                  {!vatIncluded && selectedVat && form.sellingPrice && Number(form.sellingPrice) > 0 && (
                    <div className="rounded-lg p-3 text-sm border bg-amber-50 border-amber-200 space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>السعر قبل الضريبة</span><span>{parseFloat(form.sellingPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-900 border-t border-amber-200 pt-1 mt-1">
                        <span>السعر النهائي</span><span>{finalSellingPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Alert qty */}
              {productNature === "materials" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">حد التنبيه من نفاذ الكمية</label>
                  <input type="number" name="alertQuantity" value={form.alertQuantity} onChange={handleChange}
                    className="takamol-input" min="0" />
                </div>
              )}

              {/* Raw-material extras */}
              {productNature === "materials" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">وحدة الأساس</label>
                    <select name="baseUnitId" value={form.baseUnitId} onChange={handleChange} className="takamol-input">
                      <option value="">اختياري</option>
                      {unitsForPrepared.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">وحدة الشراء</label>
                    <select name="purchaseUnitId" value={form.purchaseUnitId} onChange={handleChange} className="takamol-input">
                      <option value="">اختياري</option>
                      {unitsForPrepared.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">معامل التحويل</label>
                    <input type="number" name="conversionFactor" value={form.conversionFactor} onChange={handleChange}
                      className="takamol-input" step="0.001" min="0" />
                  </div>
                </>
              )}

              {/* Sub: parent selector */}
              {productNature === "sub" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الأصناف المباشرة الأم <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {form.parentProductNames.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {form.parentProductNames.map((name, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {name}
                            <button type="button" onClick={() => removeParent(i)} className="hover:text-red-600"><X size={13} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="dp-wrap relative">
                      <div className="relative">
                        <input type="text" value={parentSearch}
                          onChange={e => { setParentSearch(e.target.value); setShowParentSearch(true); }}
                          onFocus={() => setShowParentSearch(true)}
                          className="takamol-input w-full pr-10" placeholder="ابحث عن صنف..." />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      {showParentSearch && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {filteredParents.length === 0
                            ? <div className="p-3 text-center text-gray-500 text-sm">لا توجد أصناف مطابقة</div>
                            : filteredParents.map(p => {
                              const isSel = form.parentProductIds.includes(String(p.id));
                              return (
                                <div key={p.id} onClick={() => toggleParent(p)}
                                  className={cn("p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center justify-between", isSel && "bg-green-50")}>
                                  <div>
                                    <div className="font-bold text-sm">{p.name}</div>
                                    <div className="text-xs text-gray-500">الكود: {p.code}</div>
                                  </div>
                                  {isSel && <Check size={16} className="text-green-600" />}
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
              {productNature === "prepared" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الخامات المستخدمة <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-3">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5 dp-wrap relative">
                        <label className="block text-xs font-bold text-gray-600 mb-1">بحث في الخامات</label>
                        <div className="relative">
                          <input type="text" value={matSearch}
                            onChange={e => { setMatSearch(e.target.value); setShowMatSearch(true); }}
                            onFocus={() => setShowMatSearch(true)}
                            className="takamol-input w-full pr-8 text-sm" placeholder="ابحث..." />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        </div>
                        {showMatSearch && matSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                            {filteredMats.length === 0
                              ? <div className="p-2 text-center text-gray-500 text-xs">لا توجد خامات</div>
                              : filteredMats.map(m => (
                                <div key={m.id} onClick={() => { setMatSearch(m.name); setShowMatSearch(false); }}
                                  className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                  <div className="font-bold text-sm">{m.name}</div>
                                  <div className="text-xs text-gray-500">{m.code}</div>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs font-bold text-gray-600 mb-1">الكمية</label>
                        <input type="number" value={matQty} onChange={e => setMatQty(e.target.value)}
                          className="takamol-input w-full text-center text-sm" min="0.01" step="0.01" />
                      </div>
                      <div className="col-span-2 dp-wrap relative">
                        <label className="block text-xs font-bold text-gray-600 mb-1">الوحدة</label>
                        <input type="text"
                          value={unitsForPrepared.find(u => u.id === unitSearch)?.name || ""}
                          onFocus={() => setShowUnitSearch(true)} onClick={() => setShowUnitSearch(true)}
                          className="takamol-input w-full text-sm" placeholder="وحدة" readOnly />
                        {showUnitSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                            {unitsForPrepared.map(u => (
                              <div key={u.id} onClick={() => { setUnitSearch(u.id); setShowUnitSearch(false); }}
                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 text-sm font-bold">
                                {u.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 flex items-end">
                        <button type="button" onClick={handleAddMat} disabled={!matSearch}
                          className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-40 flex items-center justify-center gap-1 font-bold text-sm">
                          <PlusCircle size={15} /> إضافة
                        </button>
                      </div>
                    </div>
                  </div>
                  {form.materials.length > 0 && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-right font-bold text-gray-700">الخامة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-20">الكمية</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-20">الوحدة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-24">التكلفة</th>
                            <th className="p-3 w-12" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {form.materials.map((m, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-bold text-gray-800">{m.materialName}</td>
                              <td className="p-3 text-center">{m.quantity}</td>
                              <td className="p-3 text-center text-gray-600">
                                {m.unitName ||
                                  (m.unitId ? (unitsForPrepared.find(u => u.id === m.unitId)?.name || UNITS_LIST.find(u => u.id === m.unitId)?.name || m.unitId) : "—")
                                }
                              </td>
                              <td className="p-3 text-center text-gray-600">
                                {(Number(m.cost || 0) * Number(m.quantity || 0)).toFixed(2)}
                              </td>
                              <td className="p-3 text-center">
                                <button type="button" onClick={() => removeMat(i)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg">
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td className="p-3" colSpan={3}>الإجمالي</td>
                            <td className="p-3 text-center text-[var(--primary)]">{preparedCost.toFixed(2)}</td>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>{/* end LEFT */}

            {/* ─ RIGHT ─ */}
            <div className="space-y-5">

              {/* Main category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  التصنيف الرئيسي {productNature !== "materials" && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <select name="categoryId" value={form.categoryId} onChange={handleChange}
                    className={cn("takamol-input appearance-none pr-10", errors.categoryId && "border-red-400")}
                    disabled={loadingMain}>
                    <option value="">{loadingMain ? "⏳ جاري التحميل..." : "اختر التصنيف الرئيسي"}</option>
                    {mainCats.map(c => (
                      <option key={String(c.id)} value={String(c.id)}>{getDisplayName(c, direction)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                <ErrMsg field="categoryId" />
              </div>

              {/* Sub category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف الفرعي</label>
                <div className="relative">
                  <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange}
                    className="takamol-input appearance-none pr-10"
                    disabled={!form.categoryId || loadingSub}>
                    <option value="">
                      {!form.categoryId ? "اختر التصنيف الرئيسي أولًا"
                        : loadingSub ? "⏳ جاري التحميل..."
                          : "اختياري — اختر تصنيفاً فرعياً"}
                    </option>
                    {subCats.map(c => (
                      <option key={String(c.id)} value={String(c.id)}>{getDisplayName(c, direction)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Hide in POS */}
              {productNature !== "materials" && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input type="checkbox" id="hideInPos" name="hideInPos"
                    checked={form.hideInPos} onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[var(--primary)]" />
                  <label htmlFor="hideInPos" className="text-sm font-bold text-gray-700 cursor-pointer">
                    إخفاء في نقاط البيع
                  </label>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <textarea name="details" value={form.details} onChange={handleChange}
                  className="takamol-input w-full min-h-[120px] resize-y"
                  placeholder="أدخل الوصف..." />
              </div>

              {/* Image */}
              {productNature !== "materials" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    صورة {getNatureLabel(productNature, t)}
                  </label>
                  {fileName && !imageFile && (
                    <div className="mb-2">
                      <img src={fileName.startsWith("http") ? fileName : `${REAL_API}/${fileName}`}
                        alt="current" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                      <p className="text-xs text-gray-400 mt-1">الصورة الحالية — اختر صورة جديدة للتغيير</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} className="hidden"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={e => { const f = e.target.files?.[0] || null; setImageFile(f); if (f) setFileName(f.name); }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 border border-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2 transition-colors whitespace-nowrap">
                      <Upload size={16} /> {imageFile ? "تغيير الصورة" : "استعراض"}
                    </button>
                    <input type="text" value={imageFile ? imageFile.name : ""} readOnly
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 min-w-0"
                      placeholder="لم يتم اختيار صورة جديدة" />
                    {imageFile && (
                      <button type="button"
                        onClick={() => { setImageFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <ErrMsg field="image" />
                  <p className="mt-1 text-xs text-gray-400">الصيغ المقبولة: PNG, JPG, WEBP</p>
                </div>
              )}

            </div>{/* end RIGHT */}
          </div>{/* end grid */}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={() => navigate("/products")} disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50">
            <X size={18} /> إلغاء
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-8 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-[150px] justify-center">
            {isSubmitting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري الحفظ...</>
              : <><Save size={20} /> حفظ التعديلات</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}