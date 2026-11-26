import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';

const STATUS_RANK = { failed: 3, loading: 2, idle: 2, succeeded: 1 };

/**
 * Loads products and/or categories once and exposes a combined status.
 * @param {{ products?: boolean, categories?: boolean }} needs
 */
export function useCatalog({ products: needProducts = true, categories: needCategories = true } = {}) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    if (needProducts && products.status === 'idle') dispatch(fetchProducts());
    if (needCategories && categories.status === 'idle') dispatch(fetchCategories());
  }, [dispatch, needProducts, needCategories, products.status, categories.status]);

  const retry = useCallback(() => {
    if (needProducts && products.status === 'failed') dispatch(fetchProducts());
    if (needCategories && categories.status === 'failed') dispatch(fetchCategories());
  }, [dispatch, needProducts, needCategories, products.status, categories.status]);

  const statuses = [needProducts && products.status, needCategories && categories.status].filter(Boolean);
  const status = statuses.sort((a, b) => STATUS_RANK[b] - STATUS_RANK[a])[0] || 'succeeded';

  return {
    products: products.list,
    categories: categories.list,
    status: status === 'idle' ? 'loading' : status,
    error: (needProducts && products.error) || (needCategories && categories.error) || null,
    retry,
  };
}
