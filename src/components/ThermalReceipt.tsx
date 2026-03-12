import React from 'react';
import { QrCode, Building2 } from 'lucide-react';

interface ReceiptProps {
    invoiceData: any;
}

export default function ThermalReceipt({ invoiceData }: ReceiptProps) {
    if (!invoiceData) return null;

    return (
        <div
            className="hidden print:block"
            // التنسيقات المباشرة هنا بتجبر المتصفح يطبعها بنفس الشكل بالضبط
            style={{
                width: '80mm', // مقاس ورق الكاشير
                margin: '0 auto',
                padding: '0',
                backgroundColor: '#fff',
                color: '#000',
                fontFamily: "'Courier New', Courier, monospace", // نفس خط الفاتورة في صورتك
                direction: 'rtl'
            }}
        >
            {/* 1. الهيدر واللوجو */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ width: '45px', height: '55px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', margin: '0 auto 8px flex', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    <Building2 size={28} color="#6b7280" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px 0' }}>
                    {invoiceData.companyName || 'شركة اختيار'}
                </h2>
                <p style={{ fontSize: '11px', margin: '0 0 6px 0', fontWeight: 'bold' }}>
                    الرياض - الملقا - سعود بن فيصل
                </p>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>
                    فاتورة مبيعات
                </h3>
            </div>

            <div style={{ borderTop: '2px dashed #000', margin: '10px 0' }}></div>

            {/* 2. بيانات الفاتورة الأساسية */}
            <div style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <span style={{ width: '95px' }}>رقم الفاتورة :</span>
                    <span>{invoiceData.invoiceNo || '508'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <span style={{ width: '95px' }}>التاريخ:</span>
                    <span style={{ direction: 'ltr' }}>{invoiceData.date || '23/02/2026 13:13:04'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <span style={{ width: '95px' }}>العميل:</span>
                    <span>{invoiceData.customer || 'عميل افتراضي'}</span>
                </div>
            </div>

            <div style={{ borderTop: '2px dashed #000', margin: '10px 0' }}></div>

            {/* 3. جدول الأصناف (تم تظبيط المسافات ليكون مطابق للصورة) */}
            <table style={{ width: '100%', fontSize: '11px', fontWeight: 'bold', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px dashed #000' }}>
                        <th style={{ textAlign: 'right', paddingBottom: '6px', width: '45%' }}>بيان الصنف</th>
                        <th style={{ textAlign: 'center', paddingBottom: '6px' }}>كمية</th>
                        <th style={{ textAlign: 'center', paddingBottom: '6px' }}>السعر</th>
                        <th style={{ textAlign: 'left', paddingBottom: '6px' }}>المجموع</th>
                    </tr>
                </thead>
                <tbody>
                    {(invoiceData.items || [
                        { name: 'عباية كريب مع اكمام مموجه', qty: 1, price: 250, total: 250 },
                        { name: 'صنف جديد', qty: 1, price: 150, total: 150 }
                    ]).map((item: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '2px dashed #000' }}>
                            <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'right', paddingRight: '2px' }}>{item.name}</td>
                            <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>{Number(item.qty).toFixed(2)}</td>
                            <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>{Number(item.price).toFixed(2)}</td>
                            <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'left' }}>{Number(item.total).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 4. الإجماليات */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px', marginTop: '10px' }}>
                <span>المجموع الكلي</span>
                <span>{Number(invoiceData.grandTotal || 400).toFixed(2)}</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', margin: '8px 0' }}>
                أربعمائة ريال سعودي فقط لا غير
            </div>

            <div style={{ borderTop: '2px dashed #000', margin: '10px 0' }}></div>

            {/* 5. الدفع (3 أعمدة) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', marginBottom: '20px' }}>
                <div>
                    <p style={{ margin: '0 0 4px 0' }}>نوع الدفع:</p>
                    <p style={{ margin: '0' }}>{invoiceData.paymentType === 'mada' ? 'شبكة' : 'شبكة'}</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0' }}>مدفوع:</p>
                    <p style={{ margin: '0' }}>{Number(invoiceData.paid || 400).toFixed(2)}</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0' }}>remaining:</p>
                    <p style={{ margin: '0' }}>{Number(invoiceData.remaining || 0).toFixed(2)}</p>
                </div>
            </div>

            {/* 6. الفوتر */}
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', lineHeight: '1.6' }}>
                <p style={{ margin: '0' }}>عفواً لزيارتكم</p>
                <p style={{ margin: '0' }}>نتشرف بكم مرة أخرى</p>
                <p style={{ margin: '0' }}>للاسترجاع والاستبدال خلال 48 ساعة</p>
                <p style={{ margin: '0' }}>يجب إحضار الفاتورة</p>
            </div>

            {/* 7. QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <QrCode size={110} strokeWidth={1.5} color="#000" />
            </div>

            <p style={{ fontSize: '9px', textAlign: 'center', marginTop: '10px', color: '#888' }}>Powered By: www.daqatech.com</p>

        </div>
    );
}