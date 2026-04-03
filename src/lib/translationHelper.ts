/**
 * Translation Helper Utility
 * This file contains common translation keys and their patterns
 * Used to standardize translation across all pages
 */

export const TRANSLATION_KEYS = {
    // Generic
    search_placeholder: 'search_placeholder',
    loading: 'loading_data',
    no_data: 'no_data_in_table',
    delete: 'delete',
    edit: 'edit',
    add: 'add',
    cancel: 'cancel',
    save: 'save',
    close: 'close',
    actions: 'actions',

    // Groups
    user_groups: 'user_groups',
    add_group: 'add_group',
    delete_group_success: 'delete_group_success',
    delete_group_error: 'delete_group_error',
    duplicate_group_success: 'duplicate_group_success',
    duplicate_group_error: 'duplicate_group_error',

    // Products & Categories
    primary_category: 'primary_category',
    secondary_category: 'secondary_category',
    code: 'code',
    name: 'name',
    description: 'description',
    price: 'price',
    cost: 'cost',
    stock: 'stock',

    // Forms
    required_fields: 'required_fields',
    enter_here: 'enter_here',
    select: 'select',

    // Messages
    operation_success: 'operation_added_successfully',
    operation_error: 'error_occurred',
    deleted_successfully: 'deleted_successfully',
    updated_successfully: 'updated_successfully',

    // Common placeholders
    search: 'search',
    search_products: 'search_in_direct_categories',
    choose: 'choose',
    select_warehouse: 'select_warehouse_option',
    select_supplier: 'select_supplier',
    select_customer: 'select_customer',
    select_branch: 'select_branch',
} as const;

// Regex patterns for common hardcoded Arabic strings
export const HARDCODED_PATTERNS = [
    { pattern: /placeholder=["']البحث\.\.\.["']/, replacement: 'placeholder={t("search_placeholder")}' },
    { pattern: /placeholder=["']بحث\.\.\.["']/, replacement: 'placeholder={t("search_placeholder")}' },
    { pattern: />البحث</, replacement: '>{t("search")}<' },
    { pattern: />الكود</, replacement: '>{t("code")}<' },
    { pattern: />الإجراءات</, replacement: '>{t("actions")}<' },
    { pattern: />اسم المجموعة</, replacement: '>{t("group_name")}<' },
    { pattern: />حذف</, replacement: '>{t("delete")}<' },
    { pattern: />تحرير</, replacement: '>{t("edit")}<' },
    { pattern: />إضافة</, replacement: '>{t("add")}<' },
];

export default TRANSLATION_KEYS;
