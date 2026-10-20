import { useState, useEffect } from 'react';
import type { ProductItem } from '../types';
import { BESTSELLERS } from '../data/products';

/**
 * Hook to fetch and manage product data
 * Currently uses static data, ready for API integration
 */
export const useProducts = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/products/bestsellers');
        // const data = await response.json();
        
        // For now, use static data
        await new Promise(resolve => setTimeout(resolve, 100));
        setProducts(BESTSELLERS);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: () => {
      // Trigger reload
      setProducts([]);
      setLoading(true);
    },
  };
};
