import { useMemo, useState } from 'react';
import { getEffectivePrice, isOnSale } from '../utils/price';

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low_to_high', label: 'Price: low to high' },
  { value: 'price_high_to_low', label: 'Price: high to low' },
];

export const INITIAL_FILTERS = { priceFrom: '', priceTo: '', discountedOnly: false, sort: 'default' };

/** Number of active filters (a price range counts once); sorting is not a filter. */
export const countActiveFilters = (filters) =>
  (filters.priceFrom !== '' || filters.priceTo !== '' ? 1 : 0) + (filters.discountedOnly ? 1 : 0);

const toNumber = (value) => (value === '' || Number.isNaN(Number(value)) ? null : Number(value));

const comparators = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id,
  price_low_to_high: (a, b) => getEffectivePrice(a) - getEffectivePrice(b),
  price_high_to_low: (a, b) => getEffectivePrice(b) - getEffectivePrice(a),
};

/** Price range, "on sale only", sorting and pagination over a product list. */
export function useProductFilters(products) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const setFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  // Clears the filters but keeps the chosen sort order.
  const resetFilters = () => {
    setFilters((current) => ({ ...INITIAL_FILTERS, sort: current.sort }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    const from = toNumber(filters.priceFrom);
    const to = toNumber(filters.priceTo);
    const result = products.filter((product) => {
      const price = getEffectivePrice(product);
      if (from !== null && price < from) return false;
      if (to !== null && price > to) return false;
      if (filters.discountedOnly && !isOnSale(product)) return false;
      return true;
    });
    const compare = comparators[filters.sort];
    return compare ? [...result].sort(compare) : result;
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilters = countActiveFilters(filters);

  return {
    filters,
    setFilter,
    resetFilters,
    isFiltered: activeFilters > 0,
    activeFilters,
    total: filtered.length,
    pageItems,
    page: currentPage,
    totalPages,
    setPage,
  };
}
