# 🧱 Project Structure

## 🧩 Architecture Style
This project follows a **Hybrid Architecture**:

- 🧱 **Layer-based** architecture for shared and global concerns
- 🧩 **Feature-based** architecture for pages and business domains

### ✨ Why this approach?
- 📈 **Scalability** — easy to grow features without breaking others
- 🧠 **Clear separation of concerns** — each layer has a single responsibility
- 🚀 **Fast onboarding** — new developers understand the structure quickly
- 🏢 **Enterprise-ready** — suitable for large, long-term projects

---

## ✅ Benefits of the Hybrid Approach
- 🧩 **Modularity**: Page-specific and global components are clearly separated, making the app easier to scale and reason about.
- 🔍 **Clarity**: Developers can quickly identify where each piece of logic belongs.
- 🛠️ **Maintainability**: Isolated components reduce unintended side effects during changes.

---

## 📂 Source Folder Structure
```text
src/
├── @types/
├── api/
├── assets/
├── components/
├── configs/
├── constants/
├── docs/
├── locales/
├── mock/
├── pages/
├── services/
├── store/
├── utils/
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

---

## 📄 pages/ — Routing & Screens
The project uses a **route-based page structure**.

- 🧭 Each folder under `pages/` represents a **logical route group**.
- 📦 Each route encapsulates a single screen and its related logic.
- 🧠 Page-level concerns remain isolated and easy to maintain.

### 📁 Typical Page Folder Contains:
- 🖥️ Main screen component
- 🧩 Page-specific components (used only within this route)
- 📤 `index.ts` / `index.tsx` acting as a **barrel export**

### 🎯 Benefits
- Clean imports using folder paths
- Clear routing ownership
- Improved scalability and readability

---

## 🔌 api/ — Data Access Layer
Handles all communication with backend services.

- ⚡ Built with **Axios** for HTTP requests
- 🔄 Uses **@tanstack/react-query** for server-state caching

### 📂 Structure Overview
- 🧾 `constants/` — API base settings, endpoints, shared keys
- 🚀 `api.ts` — Axios client instance and defaults
- 🪝 `hooks/` — React Query hooks (queries & mutations)
- 🧠 `services/` — Domain-level API functions
- 🔐 `protected/` — Helpers for secured API flows
- 🧬 `types/` — TypeScript interfaces for requests & responses

---

## 🎨 components/ — UI & Template Core
The UI is built on top of the **Elstar React Admin Template**.

### 📂 Core Folders
- 🧱 `layouts/` — Page layout wrappers
- 🛡️ `route/` — Routing logic and authorization guards
- 🔁 `shared/` — Reusable components (tables, charts, loaders)
- 🧭 `template/` — Main dashboard skeleton (header, sidebar)
- 🧩 `ui/` — Low-level design system components

> ⚠️ These folders form the template core and should be **extended**, not heavily modified.

---

## 🖼️ assets/ — Static & Design Assets
Contains visual and styling resources used across the app.

- 🗺️ `maps/` — Map-related assets and configs
- 🎨 `styles/` — Global CSS styles
- 🧩 `components/` — Visual-only helpers
- 📚 `docs/` — UI/design documentation
- 🌈 `tailwind/` — Tailwind extensions and tokens
- 🧱 `template/` — Base UI layout references
- 📦 `vendors/` — Third-party assets
- 🖌️ `svg/` — SVG icons and illustrations
- 🎨 `app.css` — Global style overrides

---

## 🧬 @types/ — Global Types
- 📌 Shared TypeScript interfaces
- 📎 Global enums and type definitions

---

## ⚙️ configs/ — Application Configuration
Centralized configuration controlling behavior and UI setup.

- 🧭 `navigation.config.ts` — Sidebar & menu structure
- 🗺️ `routes.config.ts` — Application route mappings
- ⚙️ `app.config.ts` — Global app settings & feature flags
- 📊 `chart.config.ts` — Shared chart configurations
- 🖼️ `navigation-icon.config.tsx` — Navigation icon mapping
- 🎨 `theme.config.ts` — Theme & design system setup
