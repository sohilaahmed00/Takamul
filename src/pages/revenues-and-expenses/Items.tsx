import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, List } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Items() {
    const { t } = useLanguage();

    const dummyData = [
        { id: 1, code: 'BND001', name: 'سند إيرادات 1', type: 'إيراد', amount: 1000 },
        { id: 2, code: 'BND002', name: 'سند مصروفات 1', type: 'مصروف', amount: 500 },
        { id: 3, code: 'BND003', name: 'بند خاص', type: 'بنود', amount: 2000 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('items')}</h1>
                    <p className="text-muted-foreground">{t('items_table_desc') || 'البنود - قائمة البنود'}</p>
                </div>
                <Button><Plus className="mr-2 h-4 w-4" /> {t('add_item') || 'إضافة بند'}</Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('items_list') || 'قائمة البنود'}</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Search className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm"><Filter className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable value={dummyData} className="p-datatable-sm custom-green-table custom-compact-table">
                        <Column field="code" header={t('code') || 'الكود'} body={(row) => row.code} />
                        <Column field="name" header={t('name') || 'الاسم'} body={(row) => row.name} />
                        {/* <Column field="type" header={t('type') || 'النوع'} body={(row) => <Badge>{row.type}</Badge>} /> */}
                        <Column field="amount" header={t('amount') || 'المبلغ'} body={(row) => `ر.س ${row.amount}`} />
                    </DataTable>
                </CardContent>
            </Card>
        </div>
    );
}

