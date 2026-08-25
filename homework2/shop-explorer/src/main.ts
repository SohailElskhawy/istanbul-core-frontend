import './style.css';
import type { Product } from './types';
import { fetchProducts } from './api';

// ============================================================================
// State Management
// ============================================================================
let allProducts: Product[] = [];
let currentCategory: string = 'all';
let currentSearchTerm: string = '';

const STORAGE_SEARCH_KEY = 'shop_explorer_last_search';

// ============================================================================
// DOM Elements Selection
// ============================================================================
const productGrid = document.getElementById('product-grid') as HTMLDivElement;
const statusContainer = document.getElementById('status-container') as HTMLDivElement;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchClearBtn = document.getElementById('search-clear-btn') as HTMLButtonElement;
const resultsCount = document.getElementById('results-count') as HTMLDivElement;

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
  productGrid.innerHTML = '';
  resultsCount.textContent = '';
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
function renderProducts(products: Product[]): void {
  clearStatus();

  // Update results counter
  resultsCount.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;

  // Handle empty state if no products match
  if (products.length === 0) {
    statusContainer.innerHTML = `
      <div class="status-message status-empty">
        <p>🔍 No products found matching your search.</p>
      </div>
    `;
    productGrid.innerHTML = '';
    return;
  }

  // Generate product cards using map() and array destructuring
  const cardsHtml = products
    .map((product) => {
      const { id, title, description, category, price, rating, thumbnail } = product;

      return `
        <article class="product-card" data-id="${id}">
          <div class="card-image-wrap">
            <span class="card-badge">${category}</span>
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
// Filtering & Search Logic
// ============================================================================

/**
 * Filters the master product list based on current category and search query.
 */
function applyFilters(): void {
  const query = currentSearchTerm.trim().toLowerCase();

  const filtered = allProducts.filter((product) => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch =
      query === '' ||
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
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
  searchClearBtn.addEventListener('click', handleSearchClear);

  // Category filter
  categorySelect.addEventListener('change', handleCategoryChange);

  // Event Delegation for "View Details" buttons inside product grid
  productGrid.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const detailsBtn = target.closest<HTMLButtonElement>('.btn-details');

    if (detailsBtn && detailsBtn.dataset.id) {
      const productId = parseInt(detailsBtn.dataset.id, 10);
      if (!isNaN(productId)) {
        openProductModal(productId);
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
