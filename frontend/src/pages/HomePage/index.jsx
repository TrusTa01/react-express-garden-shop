import { useMemo } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { getDiscountPercent, isOnSale } from '../../utils/price';
import Container from '../../components/ui/Container';
import SectionHeader from '../../components/SectionHeader';
import ProductGrid from '../../components/ProductGrid';
import StatusMessage from '../../components/StatusMessage';
import Button from '../../components/ui/Button';
import Hero from './Hero';
import CategoryStrip from './CategoryStrip';
import PromoBand from './PromoBand';
import CouponSection from './CouponSection';
import styles from './HomePage.module.css';

const GRID_SIZE = 4;

const HomePage = () => {
  usePageTitle(null);
  const { categories, products, status, error, retry } = useCatalog();

  const { saleCount, saleProducts, newProducts, maxDiscount } = useMemo(() => {
    // Biggest discounts first, so the band's "up to" matches the first card.
    const sale = products.filter(isOnSale).sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    const shown = new Set(sale.slice(0, GRID_SIZE).map((p) => p.id));
    // "New in" = the most recently added products (highest ids), without repeating the sale row.
    const latest = [...products]
      .sort((a, b) => b.id - a.id)
      .filter((p) => !shown.has(p.id))
      .slice(0, GRID_SIZE);
    return {
      saleCount: sale.length,
      saleProducts: sale.slice(0, GRID_SIZE),
      newProducts: latest,
      maxDiscount: sale.length ? getDiscountPercent(sale[0]) : 0,
    };
  }, [products]);

  const failed = status === 'failed' && (
    <StatusMessage
      variant="error"
      title="We couldn’t load the catalogue"
      text={`The server did not respond (${error}).`}
      action={<Button onClick={retry}>Try again</Button>}
    />
  );
  const loading = status === 'loading' && <StatusMessage variant="loading" title="Loading…" />;

  return (
    <>
      <Hero categories={categories} products={products} />

      <Container as="section" className={styles.section} aria-labelledby="home-categories">
        <SectionHeader id="home-categories" title="Shop by category" linkTo="/categories" linkLabel="All categories" />
        {failed || loading || <CategoryStrip categories={categories} products={products} />}
      </Container>

      <PromoBand maxDiscount={maxDiscount} saleCount={saleCount} />

      <Container as="section" className={styles.section} aria-labelledby="home-sale">
        <SectionHeader id="home-sale" title="On sale" linkTo="/discounted-items" linkLabel="All sale items" />
        {failed || loading || <ProductGrid products={saleProducts} />}
      </Container>

      {newProducts.length > 0 && (
        <Container as="section" className={styles.section} aria-labelledby="home-new">
          <SectionHeader id="home-new" title="New in" linkTo="/products" linkLabel="All products" />
          <ProductGrid products={newProducts} />
        </Container>
      )}

      <CouponSection />
    </>
  );
};

export default HomePage;
