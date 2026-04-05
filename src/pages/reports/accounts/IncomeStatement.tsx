import { useMemo } from 'react';
import { FileText, Download, Printer, TrendingUp, ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SummaryCard = ({ title, value, color, icon: Icon }: { title: string; value: string; color: string; icon: any }) => (
  <div className={`rounded-xl p-5 text-white shadow-md relative overflow-hidden ${color}`}>
    <div className="relative z-10">
      <p className="text-white/80 text-xs font-medium mb-1">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20">
      <Icon size={22} className="text-white" />
    </div>
  </div>
);

export default function IncomeStatement() {
  const { t, direction } = useLanguage();

  const accounts = [
    { code: '4101', name: 'اجمالي المبيعات', debit: 0, credit: 50000, balance: 50000 },
    { code: '4103', name: 'الخصم المسموح', debit: 1200, credit: 0, balance: -1200 },
    { code: '5101', name: 'اجمالي المشتريات', debit: 35000, credit: 0, balance: -35000 },
    { code: '5301', name: 'مصروفات الايجارات', debit: 5000, credit: 0, balance: -5000 },
    { code: '5302', name: 'مصروفات الكهرباء', debit: 300, credit: 0, balance: -300 },
  ];

  const totalRevenue = accounts.filter(a => a.code.startsWith('4')).reduce((s, a) => s + (a.credit - a.debit), 0);
  const totalExpenses = accounts.filter(a => a.code.startsWith('5')).reduce((s, a) => s + (a.debit - a.credit), 0);
  const netProfit = totalRevenue - totalExpenses;

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title={t('net_profit')} value={`${fmt(netProfit)} SAR`} color="bg-[#8b5cf6]" icon={TrendingUp} />
        <SummaryCard title={t('total_revenue')} value={`${fmt(totalRevenue)} SAR`} color="bg-emerald-500" icon={ArrowUpCircle} />
        <SummaryCard title={t('total_expenses')} value={`${fmt(totalExpenses)} SAR`} color="bg-rose-500" icon={ArrowDownCircle} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('income_statement')}</CardTitle>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50"><Printer size={18} className="text-gray-500" /></button>
            <button className="p-2 border rounded-lg hover:bg-gray-50"><Download size={18} className="text-gray-500" /></button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-right bg-white">
              <thead className="bg-[var(--primary)] text-white">
                <tr>
                  <th className="p-4 text-sm font-bold">{t('code')}</th>
                  <th className="p-4 text-sm font-bold">{t('account_name')}</th>
                  <th className="p-4 text-sm font-bold text-center">{t('debit')}</th>
                  <th className="p-4 text-sm font-bold text-center">{t('credit')}</th>
                  <th className="p-4 text-sm font-bold text-center">{t('balance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">{item.code}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-sm text-center font-mono">{fmt(item.debit)}</td>
                    <td className="p-4 text-sm text-center font-mono">{fmt(item.credit)}</td>
                    <td className={`p-4 text-sm text-center font-bold font-mono ${item.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {fmt(item.balance)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                  <td colSpan={2} className="p-4 text-gray-900">{t('total')}</td>
                  <td className="p-4 text-center font-mono">{fmt(accounts.reduce((s, a) => s + a.debit, 0))}</td>
                  <td className="p-4 text-center font-mono">{fmt(accounts.reduce((s, a) => s + a.credit, 0))}</td>
                  <td className="p-4 text-center text-[var(--primary)] font-mono">{fmt(netProfit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
