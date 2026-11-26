import { Link } from 'react-router-dom';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import AsyncState from '../../components/AsyncState';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/PageHeader';
import { isOnSale } from '../../utils/price';
import Button from '../../components/ui/Button';
import CategoryGrid from '../../components/CategoryGrid';
import styles from './CategoriesPage.module.css';

const CategoriesPage = () => {
  usePageTitle('Categories');
  const { categories, products, status, error, retry } = useCatalog();

  return (
    <AsyncState status={status} error={error} retry={retry} loadingText="Loading categories…">
      {() => (
        <>
          <PageHeader
            title="Categories"
            breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]}
            meta={`${categories.length} categories · ${products.length} products`}
          >
            Browse the shop by what you are growing or decorating.
          </PageHeader>
          <Container>
            <CategoryGrid categories={categories} products={products} />
            <aside className={styles.cta} aria-label="More ways to shop">
              <div>
                <h2 className={styles.ctaTitle}>Not sure what you need?</h2>
                <p className={styles.ctaText}>
                  Browse the full catalog in one list, or see the {products.filter(isOnSale).length} items on sale
                  right now.
                </p>
              </div>
              <div className={styles.ctaActions}>
                <Button as={Link} to="/discounted-items" variant="accent" size="lg">
                  Shop the sale
                </Button>
                <Button as={Link} to="/products" variant="secondary" size="lg">
                  All products
                </Button>
              </div>
            </aside>
          </Container>
        </>
      )}
    </AsyncState>
  );
};

export default CategoriesPage;
