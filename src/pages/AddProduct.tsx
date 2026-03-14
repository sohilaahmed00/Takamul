// src/pages/AddProduct.tsx
import { cn } from "@/lib/utils";
import React, { useState, useRef, ChangeEvent, FormEvent, useEffect, useMemo } from "react";
import { PlusCircle, Upload, Barcode, Save, Edit2, Box, Package, Layers, X, FolderPlus, Search, Check, Trash2 } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type ProductNature = "basic" | "prepared" | "sub" | "materials";

type ApiCategory = {
  id?: number | string;
  Id?: number | string;
  categoryId?: number | string;
  CategoryId?: number | string;
  categoryNameAr?: string;
  CategoryNameAr?: string;
  categoryNameEn?: string;
  CategoryNameEn?: string;
  categoryNameUr?: string;
  CategoryNameUr?: string;
  name?: string;
  Name?: string;
};

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

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;

    if (isJson) {
      try {
        const data: any = await res.json();
        msg =
          data?.message ||
          data?.title ||
          (data?.errors
            ? Object.entries(data.errors)
                .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                .join(" | ")
            : msg);
      } catch {
        //
      }
    } else {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {
        //
      }
    }

    throw new Error(msg);
  }

  if (isJson) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

function normalizeCategory(item: any): NormalizedCategory {
  const id = item?.id ?? item?.Id ?? item?.categoryId ?? item?.CategoryId ?? "";
  const nameAr = (item?.categoryNameAr ?? item?.CategoryNameAr ?? item?.nameAr ?? item?.NameAr ?? "").toString();
  const nameEn = (item?.categoryNameEn ?? item?.CategoryNameEn ?? item?.nameEn ?? item?.NameEn ?? "").toString();
  const nameUr = (item?.categoryNameUr ?? item?.CategoryNameUr ?? item?.nameUr ?? item?.NameUr ?? "").toString();
  // const genericName = (item?.name ?? item?.Name ?? '').toString();

  const genericName = (item?.name ?? item?.Name ?? item?.categoryName ?? item?.CategoryName ?? item?.title ?? "").toString();

  return {
    id,
    nameAr: nameAr || genericName,
    nameEn: nameEn || genericName,
    nameUr: nameUr || genericName,
  };
}

function getDisplayCategoryName(c: NormalizedCategory, direction: string) {
  if (direction === "rtl") return c.nameAr || c.nameEn || c.nameUr || "";
  return c.nameEn || c.nameAr || c.nameUr || "";
}

function getCategoryNameToSend(c: NormalizedCategory | undefined) {
  return (c?.nameAr || c?.nameEn || c?.nameUr || "").trim();
}

function natureToEndpoint(nature: ProductNature) {
  switch (nature) {
    case "basic":
      return "/api/Products/direct";
    case "materials":
      return "/api/Products/raw-material";
    case "sub":
      return "/api/Products/branched";
    case "prepared":
      return "/api/Products/prepared";
    default:
      return "/api/Products/direct";
  }
}

function getProductNatureLabel(nature: ProductNature) {
  switch (nature) {
    case "basic":
      return "الصنف المباشر";
    case "prepared":
      return "الصنف المجهز";
    case "sub":
      return "الصنف المتفرع";
    case "materials":
      return "الخامة";
    default:
      return "الصنف";
  }
}

function getProductNatureIcon(nature: ProductNature) {
  switch (nature) {
    case "basic":
      return <Box size={20} />;
    case "prepared":
      return <Package size={20} />;
    case "sub":
      return <Layers size={20} />;
    case "materials":
      return <FolderPlus size={20} />;
    default:
      return <Box size={20} />;
  }
}

function mapApiProductLite(item: any): ProductLite {
  return {
    id: String(item?.id ?? item?.productId ?? ""),
    code: String(item?.barcode ?? item?.productCode ?? ""),
    name: String(item?.productNameAr || item?.productNameEn || item?.productNameUr || item?.name || ""),
    cost: Number(item?.costPrice ?? item?.cost ?? 0),
    image: String(item?.imageUrl ?? item?.image ?? ""),
  };
}

export default function AddProduct() {
  const { t, direction } = useLanguage();
  const { systemSettings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [mainCategories, setMainCategories] = useState<NormalizedCategory[]>([]);
  const [subCategories, setSubCategories] = useState<NormalizedCategory[]>([]);

  const [isLoadingMainCategories, setIsLoadingMainCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [allProducts, setAllProducts] = useState<ProductLite[]>([]);
  const [directProductsList, setDirectProductsList] = useState<ProductLite[]>([]);
  const [materialsProductsList, setMaterialsProductsList] = useState<ProductLite[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [showMaterialSearch, setShowMaterialSearch] = useState(false);
  const [showUnitSearch, setShowUnitSearch] = useState(false);
  const [showParentSearch, setShowParentSearch] = useState(false);

  const [materialSearch, setMaterialSearch] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState("1");
  const [unitSearch, setUnitSearch] = useState("");
  const [parentProductSearch, setParentProductSearch] = useState("");

  const unitsList: Unit[] = [
    { id: "1", code: "U-001", name: "قطعة" },
    { id: "2", code: "U-002", name: "كيلو" },
    { id: "3", code: "U-003", name: "جرام" },
    { id: "4", code: "U-004", name: "لتر" },
    { id: "5", code: "U-005", name: "علبة" },
    { id: "6", code: "U-006", name: "كرتونة" },
  ];

  const [formData, setFormData] = useState({
    productNature: (location.state?.productNature || "basic") as ProductNature,
    parentProductIds: [] as string[],
    parentProductNames: [] as string[],
    name: "",
    nameLang2: "",
    nameLang3: "",
    alertQuantity: "0",
    code: "",
    cost: "0",
    sellingPrice: "0",
    category: "",
    categoryId: "",
    subCategoryId: "",
    subCategory: "",
    hideInPos: false,
    details: "",
    materials: [] as MaterialItem[],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    nameLang2?: string;
    nameLang3?: string;
    code?: string;
    cost?: string;
    sellingPrice?: string;
    categoryId?: string;
    details?: string;
  }>({});

  const preparedCost = useMemo(() => {
    return formData.materials.reduce((sum, item) => {
      return sum + Number(item.cost || 0) * Number(item.quantity || 0);
    }, 0);
  }, [formData.materials]);

  const filteredParentProducts = useMemo(() => {
    return directProductsList.filter((p) => p.name.toLowerCase().includes(parentProductSearch.toLowerCase()) || p.code.toLowerCase().includes(parentProductSearch.toLowerCase()));
  }, [directProductsList, parentProductSearch]);

  const filteredMaterials = useMemo(() => {
    return materialsProductsList.filter((m) => m.name.toLowerCase().includes(materialSearch.toLowerCase()) || m.code.toLowerCase().includes(materialSearch.toLowerCase()));
  }, [materialsProductsList, materialSearch]);

  const filteredUnits = useMemo(() => {
    return unitsList.filter((u) => u.name.toLowerCase().includes(unitSearch.toLowerCase()) || u.code.toLowerCase().includes(unitSearch.toLowerCase()));
  }, [unitsList, unitSearch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadMainCategories = async () => {
    try {
      setIsLoadingMainCategories(true);

      const data = await fetchJson<ApiCategory[]>(`${API_BASE}/api/ProductCategories/MainCategory`, {
        method: "GET",
        headers: { accept: "*/*" },
      });

      const normalized = (Array.isArray(data) ? data : []).map(normalizeCategory).filter((c) => String(c.id) !== "" && (c.nameAr || c.nameEn || c.nameUr));

      setMainCategories(normalized);
    } catch (e) {
      console.error(e);
      setMainCategories([]);
    } finally {
      setIsLoadingMainCategories(false);
    }
  };

  const loadSubCategories = async (mainCategoryId: string) => {
    if (!mainCategoryId) {
      setSubCategories([]);
      return;
    }

    try {
      setIsLoadingSubCategories(true);

      const data = await fetchJson<ApiCategory[]>(`${API_BASE}/api/ProductCategories/SubCategory/${encodeURIComponent(mainCategoryId)}`, {
        method: "GET",
        headers: { accept: "*/*" },
      });

      const normalized = (Array.isArray(data) ? data : []).map(normalizeCategory).filter((c) => String(c.id) !== "" && (c.nameAr || c.nameEn || c.nameUr));

      setSubCategories(normalized);
    } catch (e) {
      console.error(e);
      setSubCategories([]);
    } finally {
      setIsLoadingSubCategories(false);
    }
  };

  const loadProductsLists = async () => {
    try {
      setIsLoadingProducts(true);

      const [directData, rawData, allData] = await Promise.all([
        fetchJson<any[]>(`${API_BASE}/api/Products/direct`, {
          method: "GET",
          headers: { accept: "*/*" },
        }).catch(() => []),
        fetchJson<any[]>(`${API_BASE}/api/Products/raw-material`, {
          method: "GET",
          headers: { accept: "*/*" },
        }).catch(() => []),
        fetchJson<any[]>(`${API_BASE}/api/Products`, {
          method: "GET",
          headers: { accept: "*/*" },
        }).catch(() => []),
      ]);

      const directMapped = (Array.isArray(directData) ? directData : []).map(mapApiProductLite);
      const rawMapped = (Array.isArray(rawData) ? rawData : []).map(mapApiProductLite);
      const allMapped = (Array.isArray(allData) ? allData : []).map(mapApiProductLite);

      setDirectProductsList(directMapped);
      setMaterialsProductsList(rawMapped);
      setAllProducts(allMapped);
    } catch (e) {
      console.error(e);
      setDirectProductsList([]);
      setMaterialsProductsList([]);
      setAllProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadProductForEdit = async (productId: string) => {
    try {
      const data = await fetchJson<any>(`${API_BASE}/api/Products/${productId}`, {
        method: "GET",
        headers: { accept: "*/*" },
      });

      const productName = data?.productNameAr || data?.productNameEn || data?.productNameUr || "";

      setFormData((prev) => ({
        ...prev,
        name: String(data?.productNameAr ?? ""),
        nameLang2: String(data?.productNameEn ?? ""),
        nameLang3: String(data?.productNameUr ?? ""),
        code: String(data?.barcode ?? ""),
        cost: String(data?.costPrice ?? 0),
        sellingPrice: String(data?.sellingPrice ?? 0),
        alertQuantity: String(data?.minStockLevel ?? 0),
        details: String(data?.description ?? ""),
        category: String(data?.categoryName ?? ""),
        subCategory: "",
        categoryId: "",
        subCategoryId: "",
        productNature: location.state?.productNature || (String(data?.productType || "").toLowerCase() === "prepared" ? "prepared" : String(data?.productType || "").toLowerCase() === "branched" ? "sub" : "basic"),
        parentProductIds: Array.isArray(data?.parentProductIds) ? data.parentProductIds.map(String) : data?.parentProductId ? [String(data.parentProductId)] : [],
        parentProductNames: Array.isArray(data?.parentProductNames) ? data.parentProductNames.map(String) : data?.parentProductName ? [String(data.parentProductName)] : [],
        materials: Array.isArray(data?.materials)
          ? data.materials.map((m: any) => ({
              materialId: String(m?.materialId ?? ""),
              materialName: String(m?.materialName ?? ""),
              quantity: Number(m?.quantity ?? 1),
              unitId: m?.unitId ? String(m.unitId) : undefined,
              unitName: m?.unitName ? String(m.unitName) : undefined,
              cost: Number(m?.cost ?? 0),
            }))
          : [],
      }));

      setParentProductSearch(productName);
      setFileName("");
      setImageFile(null);
    } catch (e) {
      console.error(e);
      alert(direction === "rtl" ? "فشل تحميل بيانات الصنف" : "Failed to load product");
    }
  };

  useEffect(() => {
    loadMainCategories();
    loadProductsLists();
  }, []);

  useEffect(() => {
    if (!formData.categoryId) {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
      return;
    }

    loadSubCategories(formData.categoryId);
  }, [formData.categoryId]);

  useEffect(() => {
    if (isEditMode && id) {
      loadProductForEdit(id);
    }
  }, [isEditMode, id]);

  const handleAddMaterial = () => {
    if (!materialSearch.trim()) return;

    const selectedMaterial = materialsProductsList.find((m) => m.id === materialSearch || m.name === materialSearch);

    if (!selectedMaterial) return;

    const alreadyExists = formData.materials.some((m) => String(m.materialId) === String(selectedMaterial.id));

    if (alreadyExists) {
      alert(direction === "rtl" ? "الخامة مضافة بالفعل" : "Material already added");
      return;
    }

    const selectedUnit = unitsList.find((u) => u.id === unitSearch);

    const newMaterial: MaterialItem = {
      materialId: String(selectedMaterial.id),
      materialName: selectedMaterial.name,
      quantity: parseFloat(materialQuantity) || 1,
      unitId: selectedUnit?.id,
      unitName: selectedUnit?.name,
      cost: Number(selectedMaterial.cost ?? 0),
    };

    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));

    setMaterialSearch("");
    setMaterialQuantity("1");
    setUnitSearch("");
    setShowMaterialSearch(false);
    setShowUnitSearch(false);
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleToggleParentProduct = (product: ProductLite) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.parentProductIds.includes(String(product.id));

      if (isAlreadySelected) {
        return {
          ...prev,
          parentProductIds: prev.parentProductIds.filter((pid) => pid !== String(product.id)),
          parentProductNames: prev.parentProductNames.filter((name) => name !== product.name),
        };
      }

      return {
        ...prev,
        parentProductIds: [...prev.parentProductIds, String(product.id)],
        parentProductNames: [...prev.parentProductNames, product.name],
      };
    });
  };

  const handleRemoveParentProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      parentProductIds: prev.parentProductIds.filter((_, i) => i !== index),
      parentProductNames: prev.parentProductNames.filter((_, i) => i !== index),
    }));
  };

  const handleSelectUnit = (unit: Unit) => {
    setUnitSearch(unit.id);
    setShowUnitSearch(false);
  };

  const buildFormDataForCreate = () => {
    const fd = new FormData();

    const main = mainCategories.find((c) => String(c.id) === String(formData.categoryId));
    const sub = subCategories.find((c) => String(c.id) === String(formData.subCategoryId));
    const categoryNameToSend = getCategoryNameToSend(sub || main);

    fd.append("Barcode", formData.code.trim());
    fd.append("ProductNameAr", formData.name.trim());
    fd.append("ProductNameEn", formData.nameLang2.trim());
    fd.append("ProductNameUr", formData.nameLang3.trim());
    fd.append("Description", formData.details.trim());
    fd.append("CategoryName", categoryNameToSend);

    if (formData.productNature === "prepared") {
      fd.append("CostPrice", String(Number(preparedCost || 0)));
      fd.append("SellingPrice", String(Number(formData.sellingPrice || 0)));
    } else if (formData.productNature === "sub") {
      fd.append("CostPrice", String(Number(formData.cost || 0)));
      fd.append("SellingPrice", String(Number(formData.sellingPrice || 0)));
    } else {
      fd.append("CostPrice", String(Number(formData.cost || 0)));
      fd.append("SellingPrice", String(Number(formData.sellingPrice || 0)));
    }

    fd.append("MinStockLevel", String(parseInt(formData.alertQuantity || "0", 10) || 0));

    if (imageFile) {
      fd.append("Image", imageFile);
    }

    // branched
    if (formData.productNature === "sub") {
      formData.parentProductIds.forEach((pid) => {
        fd.append("ParentProductIds", pid);
      });
    }

    // prepared
    if (formData.productNature === "prepared") {
      fd.append(
        "MaterialsJson",
        JSON.stringify(
          formData.materials.map((m) => ({
            materialId: Number(m.materialId),
            quantity: Number(m.quantity),
            unitId: m.unitId ? Number(m.unitId) : null,
          })),
        ),
      );
    }

    return fd;
  };

  const buildFormDataForUpdate = () => {
    const fd = new FormData();

    const main = mainCategories.find((c) => String(c.id) === String(formData.categoryId));
    const sub = subCategories.find((c) => String(c.id) === String(formData.subCategoryId));
    const categoryNameToSend = getCategoryNameToSend(sub || main) || formData.category || "";

    fd.append("Id", String(id));
    fd.append("Barcode", formData.code.trim());
    fd.append("ProductNameAr", formData.name.trim());
    fd.append("ProductNameEn", formData.nameLang2.trim());
    fd.append("ProductNameUr", formData.nameLang3.trim());
    fd.append("Description", formData.details.trim());
    fd.append("CategoryName", categoryNameToSend);
    fd.append("CostPrice", String(Number(formData.productNature === "prepared" ? preparedCost : formData.cost || 0)));
    fd.append("SellingPrice", String(Number(formData.sellingPrice || 0)));
    fd.append("Quantity", "0");
    fd.append("MinStockLevel", String(parseInt(formData.alertQuantity || "0", 10) || 0));
    fd.append("ProductType", formData.productNature === "prepared" ? "Prepared" : formData.productNature === "sub" ? "Branched" : "Direct");
    fd.append("ParentProductId", formData.productNature === "sub" && formData.parentProductIds.length > 0 ? String(formData.parentProductIds[0]) : "0");

    if (imageFile) {
      fd.append("ImageUrl", imageFile);
    }

    if (formData.productNature === "sub") {
      formData.parentProductIds.forEach((pid) => {
        fd.append("ParentProductIds", pid);
      });
    }

    if (formData.productNature === "prepared") {
      fd.append(
        "MaterialsJson",
        JSON.stringify(
          formData.materials.map((m) => ({
            materialId: Number(m.materialId),
            quantity: Number(m.quantity),
            unitId: m.unitId ? Number(m.unitId) : null,
          })),
        ),
      );
    }

    return fd;
  };

  // const validateForm = () => {
  //   const newErrors: FormErrors = {};

  //   if (!formData.productType.trim()) {
  //     newErrors.productType = direction === "rtl" ? "نوع الصنف مطلوب" : "Product type is required";
  //   }

  //   if (!formData.name.trim()) {
  //     newErrors.name = direction === "rtl" ? "يرجى إدخال الاسم" : "Please enter name";
  //   }

  //   if (!formData.nameLang2.trim()) {
  //     newErrors.nameLang2 = direction === "rtl" ? "الاسم باللغة الثانية مطلوب" : "Second language name is required";
  //   }

  //   if (!formData.nameLang3.trim()) {
  //     newErrors.nameLang3 = direction === "rtl" ? "الاسم باللغة الثالثة مطلوب" : "Third language name is required";
  //   }

  //   if ((formData.productNature === "basic" || formData.productNature === "prepared") && !formData.code.trim()) {
  //     newErrors.code = direction === "rtl" ? "يرجى إدخال الكود" : "Please enter code";
  //   }

  //   if (!formData.categoryId) {
  //     newErrors.categoryId = direction === "rtl" ? "يرجى اختيار التصنيف الرئيسي" : "Please select category";
  //   }

  //   if (!formData.details.trim()) {
  //     newErrors.details = direction === "rtl" ? "يرجى إدخال الوصف" : "Please enter description";
  //   }

  //   if ((formData.productNature === "basic" || formData.productNature === "materials" || formData.productNature === "sub") && (formData.cost.trim() === "" || isNaN(Number(formData.cost)))) {
  //     newErrors.cost = direction === "rtl" ? "التكلفة غير صحيحة" : "Invalid cost";
  //   }

  //   if (formData.sellingPrice.trim() === "" || isNaN(Number(formData.sellingPrice))) {
  //     newErrors.sellingPrice = direction === "rtl" ? "سعر البيع غير صحيح" : "Invalid selling price";
  //   }

  //   if (formData.productNature === "sub" && formData.parentProductIds.length === 0) {
  //     alert(direction === "rtl" ? "يرجى اختيار صنف مباشر واحد على الأقل" : "Please select at least one parent product");
  //     return;
  //   }

  //   if (formData.productNature === "prepared" && formData.materials.length === 0) {
  //     alert(direction === "rtl" ? "يرجى إضافة خامة واحدة على الأقل" : "Please add at least one material");
  //     return;
  //   }

  //   if (!formData.defaultSaleUnitId) {
  //     newErrors.defaultSaleUnitId = direction === "rtl" ? "وحدة البيع الافتراضية مطلوبة" : "Default sale unit is required";
  //   }

  //   if (imageFile) {
  //     const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  //     if (!allowedTypes.includes(imageFile.type)) {
  //       newErrors.image = direction === "rtl" ? "نوع الصورة غير مدعوم" : "Unsupported image format";
  //     }
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    try {
      if (isEditMode && id) {
        const fd = buildFormDataForUpdate();

        await fetchJson(`${API_BASE}/api/Products/${id}`, {
          method: "PUT",
          body: fd,
        });
      } else {
        const fd = buildFormDataForCreate();

        await fetchJson(`${API_BASE}${natureToEndpoint(formData.productNature)}`, {
          method: "POST",
          body: fd,
        });
      }

      navigate("/products", {
        state: {
          productNature: formData.productNature,
          refreshed: true,
          message: isEditMode ? "تم التعديل بنجاح" : "تم الحفظ بنجاح",
        },
      });
    } catch (err: any) {
      console.error(err);
      alert((direction === "rtl" ? "فشل حفظ الصنف: " : "Failed to save product: ") + (err?.message || ""));
    }
  };

  return (
    <div className="space-y-4 pb-24" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>
          {t("home")}
        </span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/products")}>
          {t("products")}
        </span>
        <span>/</span>
        <span className="text-gray-800 font-medium">
          {isEditMode ? "تعديل" : "إضافة"} {getProductNatureLabel(formData.productNature)}
        </span>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          {isEditMode ? <Edit2 size={22} className="text-blue-600" /> : <PlusCircle size={22} className="text-[var(--primary)]" />}
          {isEditMode ? `تعديل ${getProductNatureLabel(formData.productNature)}` : `إضافة ${getProductNatureLabel(formData.productNature)}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <label className="block text-base font-bold text-blue-900 mb-4">
              طبيعة الصنف المضاف <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-4">
              {(["basic", "sub", "prepared", "materials"] as const).map((nature) => (
                <label key={nature} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer min-w-[180px] ${formData.productNature === nature ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" : "bg-white border-gray-200 hover:border-[var(--primary)]"} ${isEditMode ? "opacity-60 cursor-not-allowed" : ""}`}>
                  <input
                    type="radio"
                    name="productNature"
                    value={nature}
                    checked={formData.productNature === nature}
                    onChange={() =>
                      !isEditMode &&
                      setFormData((prev) => ({
                        ...prev,
                        productNature: nature,
                      }))
                    }
                    disabled={isEditMode}
                    className="w-5 h-5 accent-white"
                  />
                  {getProductNatureIcon(nature)}
                  <span className="font-bold">{getProductNatureLabel(nature)}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  اسم {getProductNatureLabel(formData.productNature)} <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="takamol-input" placeholder="أدخل الاسم..." required />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم باللغة الثانية <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nameLang2" value={formData.nameLang2} onChange={handleInputChange} className="takamol-input" />
                {errors.nameLang2 && <p className="mt-1 text-xs text-red-600">{errors.nameLang2}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم باللغة الثالثة <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nameLang3" value={formData.nameLang3} onChange={handleInputChange} className="takamol-input" />
                {errors.nameLang3 && <p className="mt-1 text-xs text-red-600">{errors.nameLang3}</p>}
              </div>

              {(formData.productNature === "basic" || formData.productNature === "prepared") && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الكود <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="takamol-input font-mono" placeholder="PRD-001" required />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          code: `${systemSettings?.prefixes?.product || "PRD"}${Math.floor(Math.random() * 10000000)
                            .toString()
                            .padStart(6, "0")}`,
                        }))
                      }
                      className="bg-gray-100 border border-gray-300 p-2.5 rounded-lg hover:bg-gray-200"
                    >
                      <Barcode size={20} />
                    </button>
                  </div>
                  {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
                </div>
              )}

              {(formData.productNature === "basic" || formData.productNature === "materials" || formData.productNature === "sub") && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    التكلفة <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} className="takamol-input font-bold text-[var(--primary)]" step="0.01" min="0" required />
                  {errors.cost && <p className="mt-1 text-xs text-red-600">{errors.cost}</p>}
                </div>
              )}

              {formData.productNature === "prepared" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تكلفة الصنف المجهز</label>
                  <input type="number" value={preparedCost} className="takamol-input font-bold text-[var(--primary)] bg-gray-50" readOnly />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  سعر البيع <span className="text-red-500">*</span>
                </label>
                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} className="takamol-input" step="0.01" min="0" required />
                {errors.sellingPrice && <p className="mt-1 text-xs text-red-600">{errors.sellingPrice}</p>}
              </div>

              {formData.productNature === "materials" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">حد التنبيه من نفاذ الكمية</label>
                  <input type="number" name="alertQuantity" value={formData.alertQuantity} onChange={handleInputChange} className="takamol-input" min="0" placeholder="أدخل الحد الأدنى" />
                </div>
              )}

              {formData.productNature === "sub" && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الأصناف المباشرة التابعة لها <span className="text-red-500">*</span>
                  </label>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {formData.parentProductNames.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {formData.parentProductNames.map((name, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {name}
                            <button type="button" onClick={() => handleRemoveParentProduct(index)} className="hover:text-red-600 transition-colors">
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-3 flex items-end">
                        <button type="button" onClick={() => setShowParentSearch(!showParentSearch)} className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] flex items-center justify-center gap-2 font-bold">
                          <Search size={18} />
                          اختيار
                        </button>
                      </div>

                      <div className="col-span-9">
                        <label className="block text-xs font-bold text-gray-600 mb-1">البحث في الأصناف المباشرة</label>

                        <div className="relative">
                          <input
                            type="text"
                            value={parentProductSearch}
                            onChange={(e) => {
                              setParentProductSearch(e.target.value);
                              setShowParentSearch(true);
                            }}
                            onFocus={() => setShowParentSearch(true)}
                            className="takamol-input w-full pr-10"
                            placeholder="ابحث عن صنف مباشر..."
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>

                        {showParentSearch && parentProductSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {filteredParentProducts.map((product) => {
                              const isSelected = formData.parentProductIds.includes(String(product.id));

                              return (
                                <div key={product.id} onClick={() => handleToggleParentProduct(product)} className={`p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center justify-between ${isSelected ? "bg-green-50" : ""}`}>
                                  <div>
                                    <div className="font-bold text-sm">{product.name}</div>
                                    <div className="text-xs text-gray-500">الكود: {product.code}</div>
                                  </div>
                                  {isSelected && <Check size={16} className="text-green-600" />}
                                </div>
                              );
                            })}

                            {filteredParentProducts.length === 0 && <div className="p-3 text-center text-gray-500 text-sm">لا توجد أصناف مطابقة</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.productNature === "prepared" && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">الخامات المستخدمة في التجهيز</label>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-2 flex items-end">
                        <button type="button" onClick={handleAddMaterial} disabled={!materialSearch} className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-bold text-sm">
                          <PlusCircle size={16} />
                          إضافة
                        </button>
                      </div>

                      <div className="col-span-3">
                        <label className="block text-xs font-bold text-gray-600 mb-1">الوحدة</label>
                        <div className="relative">
                          <input type="text" value={unitsList.find((u) => u.id === unitSearch)?.name || ""} onFocus={() => setShowUnitSearch(true)} onClick={() => setShowUnitSearch(true)} className="takamol-input w-full pr-8 text-sm" placeholder="اختر وحدة..." readOnly />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>

                        {showUnitSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {filteredUnits.map((unit) => (
                              <div key={unit.id} onClick={() => handleSelectUnit(unit)} className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                <div className="font-bold text-sm">{unit.name}</div>
                                <div className="text-xs text-gray-500">الكود: {unit.code}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="col-span-3">
                        <label className="block text-xs font-bold text-gray-600 mb-1">الكمية</label>
                        <input type="number" value={materialQuantity} onChange={(e) => setMaterialQuantity(e.target.value)} className="takamol-input w-full text-center text-sm" min="0.01" step="0.01" placeholder="1" />
                      </div>

                      <div className="col-span-4">
                        <label className="block text-xs font-bold text-gray-600 mb-1">البحث في الخامات</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={materialSearch}
                            onChange={(e) => {
                              setMaterialSearch(e.target.value);
                              setShowMaterialSearch(true);
                            }}
                            onFocus={() => setShowMaterialSearch(true)}
                            className="takamol-input w-full pr-8 text-sm"
                            placeholder="ابحث عن خامة..."
                          />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>

                        {showMaterialSearch && materialSearch && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {filteredMaterials.map((material) => (
                              <div
                                key={material.id}
                                onClick={() => {
                                  setMaterialSearch(material.name);
                                  setShowMaterialSearch(false);
                                }}
                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                              >
                                <div className="font-bold text-sm">{material.name}</div>
                                <div className="text-xs text-gray-500">الكود: {material.code}</div>
                              </div>
                            ))}

                            {filteredMaterials.length === 0 && <div className="p-3 text-center text-gray-500 text-sm">لا توجد خامات مطابقة</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {formData.materials.length > 0 && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-right font-bold text-gray-700">الخامة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-24">الكمية</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-24">الوحدة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-24">التكلفة</th>
                            <th className="p-3 text-center font-bold text-gray-700 w-20">حذف</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {formData.materials.map((material, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 font-bold text-gray-800">{material.materialName}</td>
                              <td className="p-3 text-center">{material.quantity}</td>
                              <td className="p-3 text-center text-gray-600">{material.unitName || "-"}</td>
                              <td className="p-3 text-center text-gray-600">{Number(material.cost || 0) * Number(material.quantity || 0)}</td>
                              <td className="p-3 text-center">
                                <button type="button" onClick={() => handleRemoveMaterial(index)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  التصنيف الرئيسي <span className="text-red-500">*</span>
                </label>
                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="takamol-input" required disabled={isLoadingMainCategories}>
                  <option value="">{isLoadingMainCategories ? (direction === "rtl" ? "جاري التحميل..." : "Loading...") : "اختر التصنيف"}</option>

                  {mainCategories.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {getDisplayCategoryName(c, direction)}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف الفرعي</label>
                <select name="subCategoryId" value={formData.subCategoryId} onChange={handleInputChange} className="takamol-input" disabled={!formData.categoryId || isLoadingSubCategories}>
                  <option value="">{!formData.categoryId ? "اختر التصنيف الرئيسي أولًا" : isLoadingSubCategories ? "جاري التحميل..." : "اختياري"}</option>

                  {subCategories.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {getDisplayCategoryName(c, direction)}
                    </option>
                  ))}
                </select>
              </div>

              {formData.productNature !== "materials" && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input type="checkbox" id="hideInPos" name="hideInPos" checked={formData.hideInPos} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-300 text-[var(--primary)]" />
                  <label htmlFor="hideInPos" className="text-sm font-bold text-gray-700 cursor-pointer flex-1">
                    إخفاء في نقاط البيع
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <textarea name="details" value={formData.details} onChange={handleInputChange} className="takamol-input w-full min-h-[120px]" placeholder="أدخل الوصف..." required />
                {errors.details && <p className="mt-1 text-xs text-red-600">{errors.details}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">صورة {getProductNatureLabel(formData.productNature)}</label>

                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      setFileName(file?.name || "");
                    }}
                    accept="image/*"
                  />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-100 border border-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2">
                    <Upload size={16} /> استعراض
                  </button>
                  <input type="text" value={fileName} className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50" readOnly placeholder={fileName || "لم يتم اختيار ملف"} />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                <div className="font-bold text-gray-800 mb-2">مربوط على الـ APIs الجديدة:</div>
                <ul className="space-y-1">
                  <li>basic → /api/Products/direct</li>
                  <li>materials → /api/Products/raw-material</li>
                  <li>sub → /api/Products/branched</li>
                  <li>prepared → /api/Products/prepared</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="text-xs text-gray-500">{isLoadingProducts ? "جاري تحميل الأصناف المرتبطة..." : `عدد الأصناف المحملة: ${allProducts.length}`}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => navigate("/products")} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <X size={18} /> إلغاء
          </button>

          <button type="submit" className={cn("px-8 py-2.5 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm", isEditMode ? "bg-blue-600 hover:bg-blue-700" : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]")}>
            <Save size={20} /> {isEditMode ? "حفظ التعديلات" : "حفظ البيانات"}
          </button>
        </div>
      </form>
    </div>
  );
}
