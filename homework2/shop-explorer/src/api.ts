import { Product, ProductsResponse } from './types';

const API_BASE_URL = 'https://dummyjson.com/products';

/**
 * Fetches products from the DummyJSON API.
 * Uses async/await and typed response parsing.
 * @param limit Number of items to fetch (default: 100 to get a full catalog)
 * @returns Promise<Product[]> Array of typed product objects
 */
export async function fetchProducts(limit: number = 100): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: HTTP ${response.status} ${response.statusText}`);
    }

    const data: ProductsResponse = await response.json();
    return data.products;
  } catch (error) {
    console.error('API Error in fetchProducts:', error);
    throw error;
  }
}
