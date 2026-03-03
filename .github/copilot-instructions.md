# 🧭 Takamul ERP UI – Copilot Instructions

This is a single‑page ERP front‑end built with React, TypeScript and Vite. The app is heavily
localised (Arabic/English) and maintains most of its state in React contexts that either
persist to `localStorage` or proxy to a remote API.  When writing or fixing code, keep the
following conventions in mind.

---
## 🏗 Architecture Overview

- **Entry point**: `src/main.tsx` – wraps `<App />` in a long chain of providers
  (`Theme`, `Language`, `Groups`, `Products`, …).  Providers must be added in this file.
- **Routing**: defined in `src/App.tsx`.  New pages live under `src/pages` and are wired
  there with `react-router-dom`; protected routes are rendered inside the `Layout` component.
- **Reusable UI**: `src/components/*` contains buttons, modals, layout pieces and the
  `cn()` helper (see `src/lib/utils.ts` for `clsx` / `tailwind-merge`).
- **Type aliases**: global types are in `src/types.ts` and `global.d.ts` (vite alias `@/*`).
- Path alias defined in `tsconfig.json` (`@/* -> ./src/*`); use it consistently in imports.

---
## 🧠 State & Data Flow

- Each domain object has a context: `ProductsContext`, `GroupsContext`, `CustomersContext`,
  etc.  Pattern:
  ```tsx
  const XContext = createContext<XYZ | undefined>(undefined);
  export const XProvider = ({children}) => { /* state + effects */ };
  export const useX = () => { /* throw if undefined */ };
  ```
- Providers handle persistence:
  - simple stores save/restore from `localStorage` with key `takamul_<resource>`.
  - more complex stores (products, groups) also call the remote API.  See the `loadFromApi`,
    `add…`, `update…` helpers for examples.  API base is `AUTH_API_BASE`; in dev `''` (proxy)
    or taken from `VITE_API_BASE`.
- `mapApiProduct` and similar mapping functions transform arbitrary backend payloads to
  UI-friendly shapes.  Follow them when adding new endpoints.
- Authentication pages (`Login`, `ForgotPassword`, `VerifyOTP`, `ResetPassword`) write
  `takamul_token`/`takamul_refresh_token` to `localStorage` and append an Authorization header
  in context calls if present.

---
## 🌍 Localization & Direction

- `LanguageContext` (`useLanguage()`) exposes `t(key)`, `language`, `direction` and a setter.
- Translations live in the big `translations` object inside `LanguageContext.tsx`.  Always
  add both `ar` and `en` entries when introducing a new UI string.
- Use `direction` to set `dir` attributes or choose layout classes (e.g. `rtl` vs `ltr`).
  Many components already read it directly from the hook.
- Error messages and validation text toggle based on `direction` for Arabic/English.

---
## 🎨 Styling & UI Conventions

- Tailwind CSS is the only styling mechanism.  Classes can be merged with the `cn(...)`
  helper (`clsx` + `tailwind-merge`).  Avoid hard‑coding inline styles.
- Components and pages use PascalCase file names; modal sub‑components live in
  `src/components/modals`.
- Light/dark theming is handled by `ThemeContext` with persisted mode; controls are in
  the login screen for quick testing.

---
## ⚙️ Developer Workflows

- **Install**: `npm install` (Node.js v18+ assumed).
- **Dev server**: `npm run dev` (port 3000, host 0.0.0.0).  Use `.env.local` to set
  `VITE_API_BASE` or `GEMINI_API_KEY` (the latter is only for AI Studio demo features).
- **Build**: `npm run build`; **preview**: `npm run preview`; **clean**: `npm run clean`.
- **Lint/compile‑check**: `npm run lint` runs `tsc --noEmit`.  There are no unit tests
  yet – development is manual.

---
## 🧩 Project‑Specific Patterns

- **LocalStorage keys** always begin with `takamul_`.
- **API base** constant lives in `src/lib/utils.ts`; proxies are configured in `vite.config.ts`
  when `AUTH_API_BASE` is empty (dev mode).
- Most forms follow the same pattern: local `useState` object, `handleInputChange`,
  validate fields, set `errors` state, call context method, `navigate(...)` on success.
  Look at `AddProduct.tsx` and `AddGroupModal.tsx` as canonical examples.
- CSV import pages parse files with `<input type="file">` and produce a list of objects;
  check `ImportProducts.tsx` / `ImportSales.tsx` for guidance.
- Route parameters are read via `useParams()` from `react-router-dom` (see edit pages).

---
## 🔗 External Integrations

- The only external dependency is the remote ERP API under `http://takamulerp.runasp.net`
  (configurable via environment).  All network calls are made from contexts or auth pages.  
- The UI does not yet require a server; mock data is stored in localStorage and is enough
  to exercise most flows.
- Third‑party libraries include `lucide-react` icons, `framer-motion` for animations,
  `recharts` for charts, and `html2canvas`/`jspdf` for invoice printing.

---
## ✅ Adding New Features

1. Add a new page/component under `src/pages` or `src/components`.
2. If you need shared state, create a new context following existing ones and wrap it
   in `main.tsx`.
3. Expose a `useX()` hook and throw when used outside provider.
4. Wire the page into `App.tsx` with a route; decide whether it needs `<Layout>`.
5. Add translation keys and update `LanguageContext.tsx`.
6. Persist to localStorage or hit an API endpoint; mimic patterns from similar contexts.
7. Run `npm run lint` and spin up the dev server to manually verify.

---
> **Note to Copilot developers:** the English/Arabic duality and persistent-context
> pattern are the two most repetitive concerns in this repo.  Use existing keys,
> utilities and hooks instead of inventing new abstractions.  When editing large
> generated files (e.g. translations), keep the format stable – alphabetical order is
> *not* enforced, just append new keys near related ones.

Thanks for helping keep Takamul maintainable!  Let me know if there are areas that
need clarification or if you'd like examples added to this document.