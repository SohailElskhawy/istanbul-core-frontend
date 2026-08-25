# Frontend Practical Assignment: Dynamic Product Explorer (ShopExplorer)

## 📌 Project Overview
- **Project Name:** ShopExplorer
- **Stack:** Semantic HTML5, Modern Responsive CSS, Vanilla TypeScript, Vite
- **API Endpoint:** `https://dummyjson.com/products`
- **Author:** Sohail Elskhawy

---

## 🚀 Features Implemented

### 1. Core Requirements (100% Complete)
- **Responsive Header:** Brand name (`ShopExplorer`), navigation links (`Products`, `Categories`, `About`), and an accessible search bar.
- **Product Section:** Responsive CSS Grid of dynamically rendered product cards featuring thumbnail, category badge, star rating, title, 2-line clamped description, formatted price, and a *"View Details"* button.
- **API Integration:** Asynchronous data fetching via native `Fetch API` and `async/await` with typed `ProductsResponse` parsing, loading indicators, and error handling (`"Unable to load products. Please try again."`).
- **Search:** Dynamic in-memory product filtering by title and description with `filter()`, updating the grid live.
- **Category Filter:** Dynamically extracted categories from the dataset to populate the `<select id="category-select">` dropdown.
- **Product Interaction & Modal Dialog:** Native HTML5 `<dialog>` displaying detailed specifications (Brand, Stock, Warranty, Shipping, Return Policy) and full customer reviews using **Event Delegation**.
- **Browser Storage (`localStorage`):** Persists the user's last search term across page reloads and automatically restores filtered results on app initialization.

### 2. Bonus Challenges Implemented (All 6 Included)
1. 🔼 **Sorting by Price:** Low to High & High to Low.
2. 🔤 **Sorting Alphabetically & by Rating:** A to Z and Highest Rated First.
3. ❤️ **Favorites / Wishlist:** Interactive heart button on cards, persistent storage in `localStorage`, and a dedicated *"❤️ Favorites (X)"* filter button.
4. 📄 **Pagination:** 12 products per page with smart pagination controls (`« Prev`, page numbers, `Next »`) and auto-scroll to top.
5. 🔍 **Empty Search State:** User-friendly feedback (`"🔍 No products found matching your search."`) when queries yield no results.
6. 💀 **Loading Skeleton Animation:** Animated shimmer placeholder cards during initial API fetch.

---

## 🤖 AI Usage Requirements & Stage Reports

### Task 1 — API & Data Understanding
#### Prompt:
> *"Analyze this API response and explain what data structure we should create in TypeScript. Do not write the code yet."*

#### AI Analysis & Findings:
1. **Root Response Structure:** The API returns an object containing an array of products along with metadata: `{ products: Product[], total: number, skip: number, limit: number }`. We should model this as `ProductsResponse`.
2. **Nested Objects & Arrays:**
   - `dimensions`: Nested object with numeric properties `{ width, height, depth }`.
   - `reviews`: Array of review objects `{ rating, comment, date, reviewerName, reviewerEmail }`.
3. **Optional vs Required Fields:** Several fields like `brand`, `discountPercentage`, `warrantyInformation`, and `shippingInformation` may vary or be omitted across product categories, so they should be marked optional (`?`) in TypeScript.
4. **Primary Identifiers:** `id` is a unique `number`, `price` is a `number`, `rating` is a `number`, and `thumbnail` is a `string` (image URL).

---

### Task 2 — Debugging & Root Cause Analysis
#### Issues Investigated:

#### 1. TypeScript `verbatimModuleSyntax` Compilation Error
- **Error:** `error TS1484: 'Product' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`
- **Root Cause:** Modern TypeScript with `verbatimModuleSyntax` requires explicit `import type` declarations so the compiler knows no runtime JavaScript code needs to be emitted for type definitions.
- **Solution:** Updated imports to `import type { Product, ProductsResponse } from './types';`.

#### 2. Duplicate Clear Buttons on Search Input
- **Expected Behavior:** A single styled `✕` button to clear search input.
- **Actual Behavior:** WebKit browsers displayed their native clear icon overlapping our custom button.
- **Root Cause:** Chrome and Edge automatically render a native pseudo-element `::-webkit-search-cancel-button` on `<input type="search">`.
- **Solution:** Added CSS rules to hide native WebKit and MS search cancel buttons:
  ```css
  .search-input::-webkit-search-cancel-button {
    -webkit-appearance: none;
    display: none;
  }
  ```

#### 3. Favorite Button Stacking Context & DOM Re-rendering
- **Problem:** Clicking the heart icon on a card was intercepted by the parent image wrapper and triggered a slow full-page re-render.
- **Root Cause:** Missing `z-index` on `.btn-favorite` and calling full-page `applyFilters()` instead of in-place DOM updates.
- **Solution:** Added `z-index: 10;`, `event.stopPropagation()`, and updated the button text in-place (`'❤️'` vs `'🤍'`).

---

### Task 3 — Senior Code Review Report
#### Prompt:
> *"As a senior frontend engineer, analyze the project and the code we did in the homework, see what needs to get fixed and refactored, and return a report checking for SOLID, Clean Code, TypeScript, HTML, CSS, DRY, YAGNI, and KISS."*

#### Review Summary:
- **SOLID Principles:**
  - **SRP:** Clean separation of concerns (`types.ts` for contracts, `api.ts` for HTTP transport, `style.css` for design system).
  - **OCP:** Extensible filtering/sorting pipeline inside `applyFilters()`.
- **Clean Code & DRY:** Magic values extracted into constants (`STORAGE_SEARCH_KEY`, `ITEMS_PER_PAGE`, `API_BASE_URL`).
- **Accessibility (a11y):** Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<dialog>`), proper heading outline (`h1` $\rightarrow$ `h2` $\rightarrow$ `h3`), live regions (`aria-live="polite"`), and `.sr-only` search label.
- **Responsive CSS:** CSS Grid with `repeat(auto-fit, minmax(270px, 1fr))` and mobile layout stacking to prevent filter overflow on mobile devices.

---

## 💭 Engineering Reflection

### 1. What did AI help me with?
- **Boilerplate and Interface Design:** Rapidly mapping the DummyJSON payload into strict TypeScript interfaces.
- **Diagnosing Tooling Errors:** Pinpointing TypeScript `verbatimModuleSyntax` requirements and WebKit browser pseudo-element quirks.
- **CSS Architecture:** Setting up responsive CSS Grid auto-fit formulas, shimmer skeleton animations, and mobile flex layouts.

### 2. What did I have to understand and verify myself?
- **Event Delegation & DOM Lifecycle:** Understanding how event delegation works on dynamic grid elements (`target.closest('.btn-details')` and `.btn-favorite`), and ensuring event propagation didn't trigger unwanted parent clicks.
- **State Synchronization:** Verifying that filtering, searching, sorting, pagination, and favorites all operate harmoniously off a single master array `allProducts`.
- **Browser Storage Restorations:** Testing `localStorage` lifecycle to confirm search queries and favorited IDs survive browser refreshes.

### 3. Which AI suggestion did I reject or modify, and why?
- **Full DOM Re-render on Favorite Click:** Initially, the suggestion was to re-run `applyFilters()` every time a heart was clicked. I modified this to update the clicked button in-place (`btnElement.textContent = isNowFav ? '❤️' : '🤍'`). This eliminated click lag and prevented the page from unnecessarily resetting scroll and pagination when favoriting items.
- **Complex Search Dropdown vs Simple Search:** Instead of adding an over-engineered recent search dropdown that would clutter the mobile header, I adhered to the KISS principle by keeping the search bar focused and lightweight with seamless `localStorage` persistence.

---

## 📦 Deliverables Checklist
- [x] Complete project source code (`homework2/shop-explorer`)
- [x] `package.json` & `tsconfig.json`
- [x] TypeScript source files (`src/main.ts`, `src/types.ts`, `src/api.ts`)
- [x] CSS stylesheet (`src/style.css`)
- [x] Three AI prompts & responses documented
- [x] Engineering reflection completed
- [x] Desktop screenshot attached
- [x] Mobile screenshot attached
