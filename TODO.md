# Treasuries Translation Improvement TODO

## Plan Breakdown (Approved)
1. ✅ **Plan confirmed** by user.
2. ✅ **Update locales**: Added 20+ keys to `src/locales/ar.json` and `src/locales/en.json` (fixed "Treasurys" → "Treasuries").
3. ✅ **Refactor TreasurysList.tsx**: Replaced hardcoded strings (titles, headers, button, placeholder, breadcrumb) with t() calls.
4. ✅ **Refactor TreasuryModal.tsx**: Replaced hardcoded strings, labels, titles, placeholders, errors, toasts, buttons with t() calls.
5. ✅ **Refactor AddTreasuryModal.tsx & EditTreasuryModal.tsx**: Replaced titles, info text, labels, buttons with t() calls.
6. ✅ **Refactor TreasurysContext.tsx**: Added LanguageContext and used t("treasury_default_name") for default data.
7. **Minor refactors**: Layout.tsx (menus), ExternalTransfersList.tsx, InternalTransfersList.tsx, AddInternalTreasuryTransferModal.tsx (select prompts).
8. **Test**: Switch AR/EN, verify UI on treasuries pages/modals.
9. **Complete**: Run `npm run dev`, check bilingual support.

**Progress: Step 6 complete. Next: Minor refactors (Layout, transfers pages/modals).**






