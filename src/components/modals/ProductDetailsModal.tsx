import React from 'react';
import { X, Printer, Trash2, Edit, FileText, Barcode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/context/ProductsContext';
import ResponsiveModal from './ResponsiveModal';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onPrintPDF: () => void;
  onPrintBarcode: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0 gap-4">
    <span className="text-sm text-[var(--text-muted)] shrink-0">{label}</span>
    <span className="text-sm font-bold text-[var(--text-main)] text-right break-words">
      {value}
    </span>
  </div>
);

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onDelete,
  onEdit,
  onPrintPDF,
  onPrintBarcode,
}: ProductDetailsModalProps) {
  const { t, direction } = useLanguage();

  if (!product) return null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('product_details') || 'تفاصيل الصنف'}
      maxWidth="max-w-5xl"
    >
      <div dir={direction} className="relative">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="product-details-modal-content"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl flex flex-col h-full"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--primary)]">
                    {t('product_details') || 'تفاصيل الصنف'}
                  </h2>
                  <span className="font-bold text-[var(--primary)] hidden sm:inline">
                    مؤسسة تكامل
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onPrintPDF}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--bg-main)] transition-colors text-[var(--text-main)]"
                  >
                    <Printer size={16} />
                    {t('print') || 'طباعة'}
                  </button>

                  <button
                    onClick={onClose}
                    type="button"
                    className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-main)]"
                    aria-label={t('close') || 'إغلاق'}
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 max-h-[80vh]">
                <div className="flex justify-end sm:hidden">
                  <button
                    type="button"
                    onClick={onPrintPDF}
                    className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--bg-main)] transition-colors text-[var(--text-main)]"
                  >
                    <Printer size={15} />
                    {t('print') || 'طباعة'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Details */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="flex flex-col items-center shrink-0 p-4 bg-white rounded-2xl border border-[var(--border)] shadow-sm w-full sm:w-auto">
                        <img
                          src={`https://api.bwipjs.com?bcid=qrcode&text=${product.code || ''}&scale=2`}
                          alt="QR Code"
                          className="w-24 h-24"
                        />
                        <div className="mt-2 pt-2 border-t border-gray-100 w-full flex justify-center">
                          <img
                            src={`https://api.bwipjs.com?bcid=code128&text=${product.code || ''}&scale=1&height=8`}
                            alt="Barcode"
                            className="w-24 h-8"
                          />
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-1">
                        <DetailRow
                          label={t('response_code') || 'نوع الاستجابة'}
                          value={t('quick_barcode') || 'باركود سريع'}
                        />
                        <DetailRow
                          label={t('type') || 'النوع'}
                          value={(product as any).productType || t('general') || 'عام'}
                        />
                        <DetailRow
                          label={t('product_name') || 'اسم الصنف'}
                          value={product.name || '-'}
                        />
                        <DetailRow
                          label={t('product_code') || 'كود الصنف'}
                          value={product.code || '-'}
                        />
                        <DetailRow
                          label={t('brand') || 'العلامة التجارية'}
                          value={(product as any).brand || '-'}
                        />
                        <DetailRow
                          label={t('main_categories') || 'التصنيف الرئيسي'}
                          value={(product as any).category || '-'}
                        />
                        <DetailRow
                          label={t('unit') || 'الوحدة'}
                          value={product.unit ? `${product.unit}` : '-'}
                        />
                        <DetailRow
                          label={t('cost') || 'التكلفة'}
                          value={product.cost || '-'}
                        />
                        <DetailRow
                          label={t('selling_price') || 'سعر البيع'}
                          value={product.price || '-'}
                        />
                        <DetailRow
                          label={t('quantity') || 'الكمية'}
                          value={product.quantity || '-'}
                        />
                        <DetailRow
                          label={t('stock_alerts') || 'حد تنبيه المخزون'}
                          value={product.alertQuantity || '-'}
                        />
                        <DetailRow
                          label={t('description') || 'الوصف'}
                          value={(product as any).description || '-'}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-[var(--primary)] text-base flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full" />
                        {t('stock_quantity_in_branch') || 'كمية الصنف في الفرع'}
                      </h3>

                      <div className="overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-[var(--primary)] text-white">
                                <th className="p-3 font-bold text-right">
                                  {t('branch_name') || 'اسم الفرع'}
                                </th>
                                <th className="p-3 font-bold text-center">
                                  {t('quantity') || 'الكمية'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-[var(--bg-card)]">
                              <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-main)] transition-colors">
                                <td className="p-3 text-[var(--text-main)] text-right">
                                  شركة دقة الحلول (WHI)
                                </td>
                                <td className="p-3 text-[var(--text-main)] text-center font-bold">
                                  {product.quantity || '0'}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-0 space-y-4">
                      <div className="w-full aspect-square p-2 bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                        <img
                          src={product.image || 'https://picsum.photos/seed/product/400/400'}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] text-center italic font-medium">
                        {t('product_image') || 'صورة الصنف'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 bg-[var(--bg-main)] border-t border-[var(--border)] flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  onClick={() => onDelete(product.id)}
                  className="flex-1 min-w-[120px] bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  {t('delete') || 'حذف'}
                </button>

                <button
                  onClick={() => onEdit(product.id)}
                  className="flex-1 min-w-[120px] bg-yellow-500 text-white px-4 py-2.5 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Edit size={16} />
                  {t('edit') || 'تعديل'}
                </button>

                <button
                  onClick={onPrintPDF}
                  className="flex-1 min-w-[120px] bg-[var(--primary)] text-white px-4 py-2.5 rounded-xl hover:bg-[var(--primary-hover)] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FileText size={16} />
                  PDF
                </button>

                <button
                  onClick={onPrintBarcode}
                  className="flex-1 min-w-[120px] bg-gray-800 text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Barcode size={16} />
                  {t('print_barcode') || 'طباعة الباركود'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveModal>
  );
}