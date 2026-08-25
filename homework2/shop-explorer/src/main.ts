import './style.css';
import type { Product } from './types';
import { fetchProducts } from './api';

// ============================================================================
// State Management
// ============================================================================
let allProducts: Product[] = [];
let currentCategory: string = 'all';
let currentSort: string = 'default';
let currentSearchTerm: string = '';
let showFavoritesOnly: boolean = false;
let favoriteIds: Set<number> = new Set();
let currentPage: number = 1;
const ITEMS_PER_PAGE: number = 12;

const STORAGE_SEARCH_KEY = 'shop_explorer_last_search';
const STORAGE_FAVORITES_KEY = 'shop_explorer_favorites';

// ============================================================================
// DOM Elements Selection
// ============================================================================
const productGrid = document.getElementById('product-grid') as HTMLDivElement;
const statusContainer = document.getElementById('status-container') as HTMLDivElement;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const favoritesToggleBtn = document.getElementById('favorites-toggle-btn') as HTMLButtonElement;
const favoritesCountSpan = document.getElementById('favorites-count') as HTMLSpanElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchClearBtn = document.getElementById('search-clear-btn') as HTMLButtonElement;
const resultsCount = document.getElementById('results-count') as HTMLDivElement;
const paginationContainer = document.getElementById('pagination-container') as HTMLElement;

const productModal = document.getElementById('product-modal') as HTMLDialogElement;
const modalContent = document.getElementById('modal-content') as HTMLDivElement;
const modalCloseBtn = document.getElementById('modal-close-btn') as HTMLButtonElement;

// ============================================================================
// UI Status Renderers
// ============================================================================

/**
 * Displays a loading indicator while products are being fetched.
 */
function showLoading(): void {
  statusContainer.innerHTML = `
    <div class="status-message status-loading" role="alert">
      <div class="spinner"></div>
      <span>Loading products...</span>
    </div>
  `;

  // Render 8 skeleton cards for visual loading state (Bonus Feature)
  const skeletonCardsHtml = Array.from({ length: 8 })
    .map(
      () => `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-box skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-box skeleton-title"></div>
          <div class="skeleton-box skeleton-text"></div>
          <div class="skeleton-box skeleton-text-short"></div>
          <div class="skeleton-footer">
            <div class="skeleton-box skeleton-price"></div>
            <div class="skeleton-box skeleton-button"></div>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  productGrid.innerHTML = skeletonCardsHtml;
  paginationContainer.innerHTML = '';
  resultsCount.textContent = 'Loading products...';
}

/**
 * Displays an error message when product fetching fails.
 */
function showError(message: string = 'Unable to load products. Please try again.'): void {
  statusContainer.innerHTML = `
    <div class="status-message status-error" role="alert">
      <p>⚠️ ${message}</p>
    </div>
  `;
  productGrid.innerHTML = '';
  paginationContainer.innerHTML = '';
  resultsCount.textContent = '';
}

/**
 * Clears the status messages container.
 */
function clearStatus(): void {
  statusContainer.innerHTML = '';
}

// ============================================================================
// Dynamic Product Rendering (DOM Manipulation)
// ============================================================================

/**
 * Renders an array of products as cards inside the product grid.
 * Uses map() and template literals.
 */
function renderProducts(products: Product[], totalMatchingCount: number): void {
  clearStatus();

  // Update results counter
  if (totalMatchingCount === 0) {
    resultsCount.textContent = '0 products found';
  } else if (totalMatchingCount <= ITEMS_PER_PAGE) {
    resultsCount.textContent = `Showing all ${totalMatchingCount} product${totalMatchingCount === 1 ? '' : 's'}`;
  } else {
    const startNum = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endNum = Math.min(currentPage * ITEMS_PER_PAGE, totalMatchingCount);
    resultsCount.textContent = `Showing ${startNum}–${endNum} of ${totalMatchingCount} products`;
  }

  // Handle empty state if no products match
  if (products.length === 0) {
    statusContainer.innerHTML = `
      <div class="status-message status-empty">
        <p>🔍 No products found matching your search.</p>
      </div>
    `;
    productGrid.innerHTML = '';
    paginationContainer.innerHTML = '';
    return;
  }

  // Generate product cards using map() and array destructuring
  const cardsHtml = products
    .map((product) => {
      const { id, title, description, category, price, rating, thumbnail } = product;
      const isFav = favoriteIds.has(id);

      return `
        <article class="product-card" data-id="${id}">
          <div class="card-image-wrap">
            <span class="card-badge">${category}</span>
            <button 
              type="button" 
              class="btn-favorite" 
              data-fav-id="${id}" 
              aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
              title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
            >
              ${isFav ? '❤️' : '🤍'}
            </button>
            <img 
              src="${thumbnail}" 
              alt="${title}" 
              class="card-image" 
              loading="lazy" 
              onerror="this.src='https://via.placeholder.com/200?text=No+Image'"
            />
          </div>
          <div class="card-body">
            <div class="card-header-row">
              <span class="card-rating">★ ${rating.toFixed(1)}</span>
            </div>
            <h2 class="card-title" title="${title}">${title}</h2>
            <p class="card-description">${description}</p>
            <div class="card-footer">
              <span class="card-price">$${price.toFixed(2)}</span>
              <button 
                type="button" 
                class="btn-details" 
                data-id="${id}"
                aria-label="View details for ${title}"
              >
                View Details
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  productGrid.innerHTML = cardsHtml;
}

/**
 * Dynamically populates the category select dropdown from the loaded products.
 */
function populateCategories(products: Product[]): void {
  // Extract unique categories using Set and spread operator
  const categories = [...new Set(products.map((p) => p.category))].sort();

  // Clear existing options except 'All Categories'
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  // Append each category option
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    // Format category title (e.g., 'beauty' -> 'Beauty')
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });
}

// ============================================================================
// Filtering, Sorting & Pagination Logic
// ============================================================================

/**
 * Renders pagination navigation buttons.
 */
function renderPagination(totalItems: number, totalPages: number): void {
  if (totalPages <= 1 || totalItems === 0) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationHtml = `
    <button 
      type="button" 
      class="btn-page" 
      data-page="${currentPage - 1}" 
      ${currentPage === 1 ? 'disabled' : ''}
      aria-label="Previous page"
    >
      « Prev
    </button>
  `;

  // Build page numbers with smart clamping
  const maxButtons = 5;
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxButtons) {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 4;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 3;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  if (startPage > 1) {
    paginationHtml += `<button type="button" class="btn-page" data-page="1">1</button>`;
    if (startPage > 2) {
      paginationHtml += `<span class="pagination-ellipsis">…</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    paginationHtml += `
      <button 
        type="button" 
        class="btn-page ${isActive ? 'active' : ''}" 
        data-page="${i}"
        ${isActive ? 'aria-current="page"' : ''}
      >
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHtml += `<span class="pagination-ellipsis">…</span>`;
    }
    paginationHtml += `<button type="button" class="btn-page" data-page="${totalPages}">${totalPages}</button>`;
  }

  paginationHtml += `
    <button 
      type="button" 
      class="btn-page" 
      data-page="${currentPage + 1}" 
      ${currentPage === totalPages ? 'disabled' : ''}
      aria-label="Next page"
    >
      Next »
    </button>
  `;

  paginationContainer.innerHTML = paginationHtml;
}

/**
 * Filters, sorts, and paginates the master product list.
 */
function applyFilters(resetPage: boolean = true): void {
  if (resetPage) {
    currentPage = 1;
  }

  const query = currentSearchTerm.trim().toLowerCase();

  let filtered = allProducts.filter((product) => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch =
      query === '' ||
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    const matchesFavorites = !showFavoritesOnly || favoriteIds.has(product.id);

    return matchesCategory && matchesSearch && matchesFavorites;
  });

  // Apply Sorting (Bonus Feature)
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'title-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Calculate Pagination (Bonus Feature)
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  renderProducts(paginatedProducts, totalItems);
  renderPagination(totalItems, totalPages);
}

/**
 * Handles sort dropdown change.
 */
function handleSortChange(e: Event): void {
  const select = e.target as HTMLSelectElement;
  currentSort = select.value;
  applyFilters();
}

/**
 * Handles search input changes with LocalStorage persistence.
 */
function handleSearchInput(e: Event): void {
  const input = e.target as HTMLInputElement;
  currentSearchTerm = input.value;

  // Toggle clear button visibility
  searchClearBtn.hidden = currentSearchTerm.length === 0;

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_SEARCH_KEY, currentSearchTerm);
  } catch (err) {
    console.warn('Unable to save search term to localStorage:', err);
  }

  applyFilters();
}

/**
 * Clears the current search input and resets local storage.
 */
function handleSearchClear(): void {
  searchInput.value = '';
  currentSearchTerm = '';
  searchClearBtn.hidden = true;
  searchInput.focus();

  try {
    localStorage.removeItem(STORAGE_SEARCH_KEY);
  } catch (err) {
    console.warn('Unable to clear search term in localStorage:', err);
  }

  applyFilters();
}

/**
 * Handles category selection change.
 */
function handleCategoryChange(e: Event): void {
  const select = e.target as HTMLSelectElement;
  currentCategory = select.value;
  applyFilters();
}

// ============================================================================
// Favorites (Bonus Feature)
// ============================================================================

/**
 * Updates the favorites count badge.
 */
function updateFavoritesCount(): void {
  favoritesCountSpan.textContent = favoriteIds.size.toString();
}

/**
 * Saves current favorite product IDs to localStorage.
 */
function saveFavorites(): void {
  try {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify([...favoriteIds]));
  } catch (err) {
    console.warn('Unable to save favorites to localStorage:', err);
  }
}

/**
 * Restores saved favorites from localStorage.
 */
function restoreFavorites(): void {
  try {
    const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (saved) {
      const parsed: number[] = JSON.parse(saved);
      favoriteIds = new Set(parsed);
    }
  } catch (err) {
    console.warn('Unable to load favorites from localStorage:', err);
  }
  updateFavoritesCount();
}

/**
 * Toggles a product in/out of the user's favorites list.
 */
function toggleFavorite(productId: number): void {
  if (favoriteIds.has(productId)) {
    favoriteIds.delete(productId);
  } else {
    favoriteIds.add(productId);
  }

  saveFavorites();
  updateFavoritesCount();
  applyFilters();
}

// ============================================================================
// Product Details Modal Interaction (Event Delegation)
// ============================================================================

/**
 * Opens the product modal dialog with complete product details.
 */
function openProductModal(productId: number): void {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const {
    title,
    description,
    category,
    price,
    rating,
    stock,
    brand,
    availabilityStatus,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    thumbnail,
    reviews = []
  } = product;

  // Generate reviews HTML
  const reviewsHtml =
    reviews.length > 0
      ? reviews
          .map(
            (r) => `
            <li class="review-item">
              <div class="review-header">
                <span>${r.reviewerName}</span>
                <span class="card-rating">★ ${r.rating}</span>
              </div>
              <p class="review-comment">"${r.comment}"</p>
            </li>
          `
          )
          .join('')
      : '<p>No reviews available for this product.</p>';

  modalContent.innerHTML = `
    <div class="modal-grid">
      <div>
        <img src="${thumbnail}" alt="${title}" class="modal-image" />
      </div>
      <div class="modal-info">
        <span class="card-badge">${category}</span>
        <h2 id="modal-title" class="modal-title">${title}</h2>
        <div class="modal-meta-row">
          <span class="modal-price">$${price.toFixed(2)}</span>
          <span class="card-rating">★ ${rating.toFixed(1)} / 5</span>
        </div>
        <p>${description}</p>
        
        <ul class="modal-specs">
          ${brand ? `<li><strong>Brand:</strong> ${brand}</li>` : ''}
          <li><strong>Availability:</strong> ${availabilityStatus || (stock > 0 ? 'In Stock' : 'Out of Stock')} (${stock} available)</li>
          ${warrantyInformation ? `<li><strong>Warranty:</strong> ${warrantyInformation}</li>` : ''}
          ${shippingInformation ? `<li><strong>Shipping:</strong> ${shippingInformation}</li>` : ''}
          ${returnPolicy ? `<li><strong>Returns:</strong> ${returnPolicy}</li>` : ''}
        </ul>
      </div>
    </div>

    <div>
      <h3 class="modal-reviews-title">Customer Reviews (${reviews.length})</h3>
      <ul class="modal-reviews-list">
        ${reviewsHtml}
      </ul>
    </div>
  `;

  productModal.showModal();
}

/**
 * Closes the product modal dialog.
 */
function closeProductModal(): void {
  productModal.close();
}

// ============================================================================
// Event Listeners & Initialization
// ============================================================================

/**
 * Sets up all application event listeners including Event Delegation for cards.
 */
function setupEventListeners(): void {
  // Search input and clear button
  searchInput.addEventListener('input', handleSearchInput);
  searchInput.addEventListener('search', handleSearchInput);
  searchClearBtn.addEventListener('click', handleSearchClear);

  // Category and Sort filters
  categorySelect.addEventListener('change', handleCategoryChange);
  sortSelect.addEventListener('change', handleSortChange);

  // Favorites toggle filter
  favoritesToggleBtn.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    favoritesToggleBtn.classList.toggle('active', showFavoritesOnly);
    favoritesToggleBtn.setAttribute('aria-pressed', showFavoritesOnly ? 'true' : 'false');
    applyFilters();
  });

  // Event Delegation for "View Details" and "Favorite" buttons inside product grid
  productGrid.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Handle Favorite button click
    const favBtn = target.closest<HTMLButtonElement>('.btn-favorite');
    if (favBtn && favBtn.dataset.favId) {
      const favId = parseInt(favBtn.dataset.favId, 10);
      if (!isNaN(favId)) {
        toggleFavorite(favId);
      }
      return;
    }

    // Handle View Details button click
    const detailsBtn = target.closest<HTMLButtonElement>('.btn-details');
    if (detailsBtn && detailsBtn.dataset.id) {
      const productId = parseInt(detailsBtn.dataset.id, 10);
      if (!isNaN(productId)) {
        openProductModal(productId);
      }
    }
  });

  // Event Delegation for Pagination buttons
  paginationContainer.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const pageBtn = target.closest<HTMLButtonElement>('.btn-page');

    if (pageBtn && pageBtn.dataset.page && !pageBtn.disabled) {
      const targetPage = parseInt(pageBtn.dataset.page, 10);
      if (!isNaN(targetPage) && targetPage !== currentPage) {
        currentPage = targetPage;
        applyFilters(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Modal close button
  modalCloseBtn.addEventListener('click', closeProductModal);

  // Close modal when clicking backdrop outside dialog wrapper
  productModal.addEventListener('click', (event: MouseEvent) => {
    const rect = productModal.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      closeProductModal();
    }
  });
}

/**
 * Restores saved search term from LocalStorage on page initialization.
 */
function restoreSavedSearch(): void {
  try {
    const savedTerm = localStorage.getItem(STORAGE_SEARCH_KEY);
    if (savedTerm) {
      currentSearchTerm = savedTerm;
      searchInput.value = savedTerm;
      searchClearBtn.hidden = false;
    }
  } catch (err) {
    console.warn('Unable to read localStorage:', err);
  }
}

/**
 * Main application initializer.
 */
async function initializeApp(): Promise<void> {
  setupEventListeners();
  restoreSavedSearch();
  restoreFavorites();
  showLoading();

  try {
    allProducts = await fetchProducts(100);
    populateCategories(allProducts);
    applyFilters();
  } catch (error) {
    showError('Unable to load products. Please try again.');
  }
}

// Start the app when DOM is ready
initializeApp();
