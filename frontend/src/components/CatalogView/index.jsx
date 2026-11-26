import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAGE_SIZE, useProductFilters } from '../../hooks/useProductFilters';
import Container from '../ui/Container';
import Button from '../ui/Button';
import PageHeader from '../PageHeader';
import { FilterDrawer, FilterSidebar, SortSelect } from '../ProductFilters';
import ProductGrid from '../ProductGrid';
import Pagination from '../Pagination';
import StatusMessage from '../StatusMessage';
import { FilterIcon } from '../Icons';
import styles from './CatalogView.module.css';

const plural = (count) => `${count} ${count === 1 ? 'product' : 'products'}`;

/** Shared layout of the catalogue, category and sale pages. */
const CatalogView = ({ title, description, breadcrumbs, products, showDiscounted = true, emptyText, tone }) => {
  const catalog = useProductFilters(products);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const changePage = (page) => {
    catalog.setPage(page);
    window.scrollTo({ top: 0 });
  };

  const first = (catalog.page - 1) * PAGE_SIZE + 1;
  const last = first + catalog.pageItems.length - 1;
  const filterProps = {
    filters: catalog.filters,
    setFilter: catalog.setFilter,
    resetFilters: catalog.resetFilters,
    showDiscounted,
  };

  return (
    <>
      <PageHeader title={title} breadcrumbs={breadcrumbs} meta={plural(products.length)} tone={tone}>
        {description}
      </PageHeader>
      <Container>
        <div className={styles.layout}>
          <FilterSidebar {...filterProps} />
          <section aria-label="Products" className={styles.results}>
            <div className={styles.toolbar}>
              <button
                type="button"
                className={styles.filterButton}
                aria-haspopup="dialog"
                onClick={() => setDrawerOpen(true)}
              >
                <FilterIcon size={18} />
                Filters
                {catalog.activeFilters > 0 && (
                  <span className={styles.filterCount}>
                    {catalog.activeFilters}
                    <span className="visually-hidden"> active</span>
                  </span>
                )}
              </button>
              <p className={styles.count} aria-live="polite">
                {catalog.total === 0
                  ? 'No products'
                  : catalog.totalPages > 1
                    ? `Showing ${first}–${last} of ${catalog.total}`
                    : plural(catalog.total)}
              </p>
              <SortSelect value={catalog.filters.sort} onChange={(value) => catalog.setFilter('sort', value)} />
            </div>

            {catalog.total === 0 ? (
              <StatusMessage
                icon={<FilterIcon size={28} />}
                title={catalog.isFiltered ? 'No products match these filters' : 'Nothing here yet'}
                text={
                  catalog.isFiltered
                    ? 'Try a wider price range or turn off “On sale only”.'
                    : emptyText || 'There is nothing here yet.'
                }
                action={
                  catalog.isFiltered ? (
                    <Button variant="accent" onClick={catalog.resetFilters}>
                      Reset filters
                    </Button>
                  ) : (
                    <Button as={Link} to="/products" variant="accent">
                      Browse all products
                    </Button>
                  )
                }
              />
            ) : (
              <>
                <ProductGrid products={catalog.pageItems} />
                <Pagination page={catalog.page} totalPages={catalog.totalPages} onChange={changePage} />
              </>
            )}
          </section>
        </div>
      </Container>
      <FilterDrawer {...filterProps} open={drawerOpen} onClose={closeDrawer} total={catalog.total} />
    </>
  );
};

export default CatalogView;
