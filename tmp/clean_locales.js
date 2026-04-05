const fs = require('fs');

function cleanJson(filePath, newKeys) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const result = {};
    
    // Parse manually to handle potential syntax issues if any, 
    // but standard JSON.parse is better if the file is valid JSON (except duplicates)
    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        // If it fails due to duplicates (though standard JSON.parse usually takes the last one),
        // we might need a more robust parser. But usually JSON.parse works.
        data = eval('(' + content + ')'); 
    }

    // Merge new keys
    const merged = { ...data, ...newKeys };

    // Sort keys for better organization
    const sorted = {};
    Object.keys(merged).sort().forEach(key => {
        sorted[key] = merged[key];
    });

    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2), 'utf8');
    console.log(`Cleaned and updated ${filePath}`);
}

const arNewKeys = {
    "net_profit": "صافي الربح",
    "total_revenue": "إجمالي الإيرادات",
    "total_expenses": "إجمالي المصروفات",
    "active_customers": "العملاء النشطين",
    "overdue_balance": "مبالغ متأخرة",
    "less_30_days": "أقل من 30 يوم",
    "range_30_60_days": "من 30 الي 60 يوم",
    "range_60_90_days": "من 60 الي 90 يوم",
    "range_90_120_days": "من 90 الي 120 يوم",
    "range_120_150_days": "من 120 الي 150 يوم",
    "more_150_days": "أكبر من 150 يوم",
    "customize_report_below": "يرجى تخصيص التقرير أدناه",
    "income_statement": "قائمة الدخل",
    "confirmed": "مؤكدة",
    "not_confirmed": "غير مؤكدة",
    "customer_aging_report": "تقرير أعمار ديون العملاء",
    "check_customer_debts_below": "تحقق من مديونيات العملاء أدناه",
    "purchases_report": "تقرير المشتريات",
    "total_purchases_report": "مجموع المشتريات"
};

const enNewKeys = {
    "net_profit": "Net Profit",
    "total_revenue": "Total Revenue",
    "total_expenses": "Total Expenses",
    "active_customers": "Active Customers",
    "overdue_balance": "Overdue Balance",
    "less_30_days": "Less than 30 Days",
    "range_30_60_days": "30-60 Days",
    "range_60_90_days": "60-90 Days",
    "range_90_120_days": "90-120 Days",
    "range_120_150_days": "120-150 Days",
    "more_150_days": "More than 150 Days",
    "customize_report_below": "Please customize the report below",
    "income_statement": "Income Statement",
    "confirmed": "Confirmed",
    "not_confirmed": "Not Confirmed",
    "customer_aging_report": "Customer Aging Report",
    "check_customer_debts_below": "Check customer debts below",
    "purchases_report": "Purchases Report",
    "total_purchases_report": "Total Purchases"
};

cleanJson('e:\\Takamul\\src\\locales\\ar.json', arNewKeys);
cleanJson('e:\\Takamul\\src\\locales\\en.json', enNewKeys);
