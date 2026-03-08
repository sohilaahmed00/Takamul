import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Printer,
  Plus,
  FileSpreadsheet,
  Menu,
  X,
  PackagePlus,
  PackageMinus,
  Eye,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AUTH_API_BASE } from '../lib/utils';

type InventoryItem = {
  id?: number;
  productId: number;
  warehouseId: number;
  quantityAvailable: number;
  quantityReserved: number;
  quantityInTransit: number;
  productName?: string;
  warehouseName?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PagedResponse = {
  items: InventoryItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

type ModalType = 'details' | 'create' | 'add' | 'remove' | null;

type ProductOption = {
  id: number;
  name: string;
};

type WarehouseOption = {
  id: number;
  name: string;
};

const QuantityAdjustments = () => {
  const { t, direction } = useLanguage();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

  const [createForm, setCreateForm] = useState({
    productId: '',
    warehouseId: '',
    quantityAvailable: '',
    quantityReserved: '',
    quantityInTransit: '',
  });

  const [stockForm, setStockForm] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
  });

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const productMap = useMemo(() => {
    return new Map(products.map((item) => [item.id, item.name]));
  }, [products]);

  const warehouseMap = useMemo(() => {
    return new Map(warehouses.map((item) => [item.id, item.name]));
  }, [warehouses]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ open: true, type, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const normalizeProduct = (item: any): ProductOption | null => {
    const id = Number(item?.id ?? item?.productId ?? item?.value);
    const name =
      item?.productNameAr ||
      item?.name ||
      item?.productNameEn ||
      item?.productNameUr ||
      item?.title ||
      item?.code;

    if (!id || !name) return null;
    return { id, name: String(name) };
  };

  const normalizeWarehouse = (item: any): WarehouseOption | null => {
    const id = Number(item?.id ?? item?.warehouseId ?? item?.value);
    const name = item?.nameAr || item?.name || item?.warehouseName || item?.title || item?.code;

    if (!id || !name) return null;
    return { id, name: String(name) };
  };

  const extractArrayFromResponse = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  };

  const fetchProducts = async () => {
    const response = await fetch(`${AUTH_API_BASE}/api/Products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(direction === 'rtl' ? 'فشل في تحميل المنتجات' : 'Failed to load products');
    }

    const data = await response.json();
    console.log(data,"product");
    
    const rawItems = extractArrayFromResponse(data);
    const normalized = rawItems
      .map(normalizeProduct)
      .filter(Boolean) as ProductOption[];

    setProducts(normalized);
  };

  const fetchWarehouses = async () => {
    const response = await fetch(`${AUTH_API_BASE}/api/Warehouse`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(direction === 'rtl' ? 'فشل في تحميل المخازن' : 'Failed to load warehouses');
    }

    const data = await response.json();
    const rawItems = extractArrayFromResponse(data);
    const normalized = rawItems
      .map(normalizeWarehouse)
      .filter(Boolean) as WarehouseOption[];

    setWarehouses(normalized);
  };

  const fetchLookups = async () => {
    try {
      setLookupsLoading(true);
      await Promise.all([fetchProducts(), fetchWarehouses()]);
    } catch (error) {
      console.error(error);
      showToast(
        direction === 'rtl'
          ? 'تعذر تحميل المنتجات أو المخازن'
          : 'Failed to load products or warehouses',
        'error'
      );
    } finally {
      setLookupsLoading(false);
    }
  };

  const fetchStockInventory = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${AUTH_API_BASE}/api/StockInventory?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(direction === 'rtl' ? 'فشل في تحميل بيانات المخزون' : 'Failed to load stock inventory');
      }

      const data: PagedResponse = await response.json();

      setItems(Array.isArray(data.items) ? data.items : []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error(error);
      showToast(direction === 'rtl' ? 'تعذر تحميل بيانات المخزون' : 'Failed to load stock inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    fetchStockInventory();
  }, [pageNumber]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProductName = (item: InventoryItem | null) => {
    if (!item) return '-';
    return item.productName || productMap.get(item.productId) || `#${item.productId}`;
  };

  const getWarehouseName = (item: InventoryItem | null) => {
    if (!item) return '-';
    return item.warehouseName || warehouseMap.get(item.warehouseId) || `#${item.warehouseId}`;
  };

  const openDetailsModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalType('details');
  };

  const openCreateModal = () => {
    setCreateForm({
      productId: '',
      warehouseId: '',
      quantityAvailable: '',
      quantityReserved: '',
      quantityInTransit: '',
    });
    setModalType('create');
    setShowActionsMenu(false);
  };

  const openAddStockModal = (item?: InventoryItem) => {
    setSelectedItem(item || null);
    setStockForm({
      productId: item?.productId?.toString() || '',
      warehouseId: item?.warehouseId?.toString() || '',
      quantity: '',
    });
    setModalType('add');
    setShowActionsMenu(false);
  };

  const openRemoveStockModal = (item?: InventoryItem) => {
    setSelectedItem(item || null);
    setStockForm({
      productId: item?.productId?.toString() || '',
      warehouseId: item?.warehouseId?.toString() || '',
      quantity: '',
    });
    setModalType('remove');
    setShowActionsMenu(false);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      productId: Number(createForm.productId),
      warehouseId: Number(createForm.warehouseId),
      quantityAvailable: Number(createForm.quantityAvailable || 0),
      quantityReserved: Number(createForm.quantityReserved || 0),
      quantityInTransit: Number(createForm.quantityInTransit || 0),
    };

    if (!payload.productId || !payload.warehouseId) {
      showToast(direction === 'rtl' ? 'يرجى اختيار المنتج والمخزن' : 'Please select product and warehouse', 'error');
      return;
    }

    try {
      setSubmitting(true);
      console.log(payload,"send data");
      
console.log('AUTH_API_BASE =>', AUTH_API_BASE);

      const response = await fetch(`${AUTH_API_BASE}/api/StockInventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = direction === 'rtl' ? 'فشل في إنشاء سجل المخزون' : 'Failed to create stock inventory';
        console.log(response,"res");
        
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.title || errorMessage;
        } catch {
          //
        }

        throw new Error(errorMessage);
      }

      showToast(direction === 'rtl' ? 'تم إنشاء سجل المخزون بنجاح' : 'Stock inventory created successfully', 'success');
      closeModal();
      fetchStockInventory();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || (direction === 'rtl' ? 'حدث خطأ أثناء الإنشاء' : 'An error occurred while creating'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockAction = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      productId: Number(stockForm.productId),
      warehouseId: Number(stockForm.warehouseId),
      quantity: Number(stockForm.quantity),
    };

    if (!payload.productId || !payload.warehouseId || !payload.quantity) {
      showToast(
        direction === 'rtl'
          ? 'يرجى اختيار المنتج والمخزن وإدخال الكمية'
          : 'Please select product, warehouse and quantity',
        'error'
      );
      return;
    }

    const endpoint =
      modalType === 'add'
        ? `${AUTH_API_BASE}/api/StockInventory/add-stock`
        : `${AUTH_API_BASE}/api/StockInventory/remove-stock`;

    try {
      setSubmitting(true);

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage =
          modalType === 'add'
            ? direction === 'rtl'
              ? 'فشل في إضافة الكمية'
              : 'Failed to add stock'
            : direction === 'rtl'
            ? 'فشل في سحب الكمية'
            : 'Failed to remove stock';

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorData?.title || errorMessage;
        } catch {
          //
        }

        throw new Error(errorMessage);
      }

      showToast(
        modalType === 'add'
          ? direction === 'rtl'
            ? 'تمت إضافة الكمية بنجاح'
            : 'Stock added successfully'
          : direction === 'rtl'
          ? 'تم سحب الكمية بنجاح'
          : 'Stock removed successfully',
        'success'
      );

      closeModal();
      fetchStockInventory();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || (direction === 'rtl' ? 'حدث خطأ غير متوقع' : 'Unexpected error occurred'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 dark:text-black">
      <div className="text-sm text-gray-500 dark:text-black/60 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 dark:text-black font-medium">
          {direction === 'rtl' ? 'ربط الكميات' : 'Stock Inventory'}
        </span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-black">
            {direction === 'rtl' ? 'ربط الكميات' : 'Stock Inventory'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-black/70 mt-1">
            {direction === 'rtl'
              ? 'عرض وربط كميات المنتجات داخل المخازن'
              : 'Manage and sync product quantities with warehouses'}
          </p>
        </div>

        <div className="relative" ref={actionsMenuRef}>
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Menu size={20} />
          </button>

          <AnimatePresence>
            {showActionsMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden ${
                  direction === 'rtl' ? 'left-0' : 'right-0'
                }`}
              >
                <div className="py-1">
                  <button
                    onClick={openCreateModal}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${
                      direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <Plus size={16} className="text-gray-500" />
                    <span>{direction === 'rtl' ? 'إنشاء سجل مخزون' : 'Create stock record'}</span>
                  </button>

                  <button
                    onClick={() => openAddStockModal()}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${
                      direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <PackagePlus size={16} className="text-gray-500" />
                    <span>{direction === 'rtl' ? 'إضافة كمية' : 'Add stock'}</span>
                  </button>

                  <button
                    onClick={() => openRemoveStockModal()}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${
                      direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <PackageMinus size={16} className="text-gray-500" />
                    <span>{direction === 'rtl' ? 'سحب كمية' : 'Remove stock'}</span>
                  </button>

                  <button
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 ${
                      direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <FileSpreadsheet size={16} className="text-gray-500" />
                    <span>{direction === 'rtl' ? 'تصدير إلى Excel' : 'Export to Excel'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">#</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">
                  {direction === 'rtl' ? 'المنتج' : 'Product'}
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">
                  {direction === 'rtl' ? 'المخزن' : 'Warehouse'}
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">
                  {direction === 'rtl' ? 'المتاح' : 'Available'}
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">
                  {direction === 'rtl' ? 'المحجوز' : 'Reserved'}
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">
                  {direction === 'rtl' ? 'قيد النقل' : 'In Transit'}
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">
                  {t('actions')}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>{direction === 'rtl' ? 'جاري التحميل...' : 'Loading...'}</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    {direction === 'rtl' ? 'لا توجد بيانات مخزون' : 'No stock inventory found'}
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={`${item.productId}-${item.warehouseId}-${index}`}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                  >
                   <td className="p-3 border-x border-gray-200 text-center">
                      {(pageNumber - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 border-x border-gray-200">
                      {item.productName || productMap.get(item.productId) || `#${item.productId}`}
                    </td>
                    <td className="p-3 border-x border-gray-200">
                      {item.warehouseName || warehouseMap.get(item.warehouseId) || `#${item.warehouseId}`}
                    </td>
                    <td className="p-3 border-x border-gray-200 text-center font-semibold">
                      {item.quantityAvailable}
                    </td>
                    <td className="p-3 border-x border-gray-200 text-center">
                      {item.quantityReserved}
                    </td>
                    <td className="p-3 border-x border-gray-200 text-center">
                      {item.quantityInTransit}
                    </td>
                    <td className="p-3 border-x border-gray-200">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailsModal(item)}
                          className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                          title={direction === 'rtl' ? 'عرض التفاصيل' : 'View details'}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => openAddStockModal(item)}
                          className="p-1.5 bg-green-500/10 text-green-600 rounded-md hover:bg-green-500/20 transition-colors"
                          title={direction === 'rtl' ? 'إضافة كمية' : 'Add stock'}
                        >
                          <PackagePlus size={16} />
                        </button>

                        <button
                          onClick={() => openRemoveStockModal(item)}
                          className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors"
                          title={direction === 'rtl' ? 'سحب كمية' : 'Remove stock'}
                        >
                          <PackageMinus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            {direction === 'rtl' ? `إجمالي العناصر: ${totalCount}` : `Total items: ${totalCount}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={pageNumber === 1}
              className="px-3 py-1.5 rounded-md border border-gray-300 disabled:opacity-50"
            >
              {direction === 'rtl' ? 'السابق' : 'Prev'}
            </button>

            <span className="text-sm text-gray-700">
              {direction === 'rtl'
                ? `صفحة ${pageNumber} من ${totalPages}`
                : `Page ${pageNumber} of ${totalPages}`}
            </span>

            <button
              onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
              disabled={pageNumber >= totalPages}
              className="px-3 py-1.5 rounded-md border border-gray-300 disabled:opacity-50"
            >
              {direction === 'rtl' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalType === 'details' && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-xl">
                <h2 className="text-lg font-semibold">
                  {direction === 'rtl' ? 'تفاصيل المخزون' : 'Stock Inventory Details'}
                </h2>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-sm bg-white text-primary px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">
                    <Printer size={14} />
                    {t('print')}
                  </button>

                  <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm text-gray-500 mb-1">{direction === 'rtl' ? 'المنتج' : 'Product'}</p>
                  <p className="font-semibold">{getProductName(selectedItem)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm text-gray-500 mb-1">{direction === 'rtl' ? 'المخزن' : 'Warehouse'}</p>
                  <p className="font-semibold">{getWarehouseName(selectedItem)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm text-gray-500 mb-1">{direction === 'rtl' ? 'الكمية المتاحة' : 'Available Quantity'}</p>
                  <p className="font-semibold">{selectedItem.quantityAvailable}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm text-gray-500 mb-1">{direction === 'rtl' ? 'الكمية المحجوزة' : 'Reserved Quantity'}</p>
                  <p className="font-semibold">{selectedItem.quantityReserved}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">{direction === 'rtl' ? 'الكمية قيد النقل' : 'In Transit Quantity'}</p>
                  <p className="font-semibold">{selectedItem.quantityInTransit}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalType === 'create' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-xl">
                <h2 className="text-lg font-semibold">
                  {direction === 'rtl' ? 'إنشاء سجل مخزون' : 'Create Stock Record'}
                </h2>
                <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateInventory} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'المنتج' : 'Product'}
                  </label>
                  <select
                    value={createForm.productId}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, productId: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    required
                  >
                    <option value="">
                      {lookupsLoading
                        ? direction === 'rtl'
                          ? 'جاري تحميل المنتجات...'
                          : 'Loading products...'
                        : direction === 'rtl'
                        ? 'اختر المنتج'
                        : 'Select product'}
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'المخزن' : 'Warehouse'}
                  </label>
                  <select
                    value={createForm.warehouseId}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, warehouseId: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    required
                  >
                    <option value="">
                      {lookupsLoading
                        ? direction === 'rtl'
                          ? 'جاري تحميل المخازن...'
                          : 'Loading warehouses...'
                        : direction === 'rtl'
                        ? 'اختر المخزن'
                        : 'Select warehouse'}
                    </option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'الكمية المتاحة' : 'Available Quantity'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.quantityAvailable}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, quantityAvailable: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'الكمية المحجوزة' : 'Reserved Quantity'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.quantityReserved}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, quantityReserved: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'الكمية قيد النقل' : 'In Transit Quantity'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.quantityInTransit}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, quantityInTransit: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    {direction === 'rtl' ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || lookupsLoading}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting
                      ? direction === 'rtl'
                        ? 'جاري الحفظ...'
                        : 'Saving...'
                      : direction === 'rtl'
                      ? 'حفظ'
                      : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(modalType === 'add' || modalType === 'remove') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-xl">
                <h2 className="text-lg font-semibold">
                  {modalType === 'add'
                    ? direction === 'rtl'
                      ? 'إضافة كمية'
                      : 'Add Stock'
                    : direction === 'rtl'
                    ? 'سحب كمية'
                    : 'Remove Stock'}
                </h2>
                <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleStockAction} className="p-6 space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'المنتج' : 'Product'}
                  </label>
                  <select
                    value={stockForm.productId}
                    onChange={(e) => setStockForm((prev) => ({ ...prev, productId: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    required
                  >
                    <option value="">
                      {lookupsLoading
                        ? direction === 'rtl'
                          ? 'جاري تحميل المنتجات...'
                          : 'Loading products...'
                        : direction === 'rtl'
                        ? 'اختر المنتج'
                        : 'Select product'}
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'المخزن' : 'Warehouse'}
                  </label>
                  <select
                    value={stockForm.warehouseId}
                    onChange={(e) => setStockForm((prev) => ({ ...prev, warehouseId: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    required
                  >
                    <option value="">
                      {lookupsLoading
                        ? direction === 'rtl'
                          ? 'جاري تحميل المخازن...'
                          : 'Loading warehouses...'
                        : direction === 'rtl'
                        ? 'اختر المخزن'
                        : 'Select warehouse'}
                    </option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    {direction === 'rtl' ? 'الكمية' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    {direction === 'rtl' ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || lookupsLoading}
                    className={`px-4 py-2 rounded-lg text-white disabled:opacity-60 ${
                      modalType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {submitting
                      ? direction === 'rtl'
                        ? 'جاري التنفيذ...'
                        : 'Submitting...'
                      : modalType === 'add'
                      ? direction === 'rtl'
                        ? 'إضافة'
                        : 'Add'
                      : direction === 'rtl'
                      ? 'سحب'
                      : 'Remove'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-4 z-[100] ${direction === 'rtl' ? 'left-4' : 'right-4'}`}
          >
            <div
              className={`px-4 py-3 rounded-lg shadow-lg text-white ${
                toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantityAdjustments;