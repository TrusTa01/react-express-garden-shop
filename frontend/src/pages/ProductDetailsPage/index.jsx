import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { addItemToCart, MAX_QUANTITY } from '../../store/slices/cartSlice';
import { notify } from '../../store/slices/notificationsSlice';
import { imageUrl } from '../../config/api';
import { getDiscountPercent, getEffectivePrice, isOnSale, formatPrice } from '../../utils/price';
import AsyncState from '../../components/AsyncState';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import Price from '../../components/Price';
import QuantityStepper from '../../components/QuantityStepper';
import SectionHeader from '../../components/SectionHeader';
import ProductGrid from '../../components/ProductGrid';
import { CartIcon, ReturnIcon, SupportIcon, TruckIcon } from '../../components/Icons';
import NotFoundContent from '../NotFoundPage/NotFoundContent';
import styles from './ProductDetailsPage.module.css';

// The store promises approved by the owner (same wording as the Home benefits row).
const BENEFITS = [
  { icon: TruckIcon, title: 'Free delivery', text: 'On every order over $50' },
  { icon: ReturnIcon, title: '30-day returns', text: 'Plants that don’t thrive? We replace them' },
  { icon: SupportIcon, title: 'Support 24/7', text: 'Gardening advice by phone or chat' },
];

const RELATED_COUNT = 4;

/**
 * True once `ref` has scrolled up out of view. Drives the sticky mobile buy bar,
 * which only appears after the main "Add to cart" button has left the screen.
 */
function useScrolledPast(ref) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    // A scroll listener (not IntersectionObserver): a jump from "below the fold"
    // straight to "above it" crosses no threshold, so the observer would never fire.
    let frame = 0;
    const check = () => {
      frame = 0;
      setPast(node.getBoundingClientRect().bottom < 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);
  return past;
}

const ProductDetails = ({ product, category, related }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const buyRef = useRef(null);
  const showStickyBar = useScrolledPast(buyRef);
  const discount = getDiscountPercent(product);
  const sale = isOnSale(product);

  // Lets the toasts move up above the sticky bar on small screens.
  useEffect(() => {
    if (!showStickyBar) return undefined;
    document.body.dataset.stickyBar = 'true';
    return () => delete document.body.dataset.stickyBar;
  }, [showStickyBar]);

  const handleAdd = () => {
    dispatch(addItemToCart(product, quantity));
    dispatch(notify(`${quantity} × “${product.title}” added to cart`));
    setQuantity(1);
  };

  return (
    <div className={styles.page}>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            category
              ? { label: category.title, to: `/categories/${category.id}` }
              : { label: 'All products', to: '/products' },
            { label: product.title },
          ]}
        />
        <div className={styles.layout}>
          <div className={styles.mediaCard}>
            <div className={styles.media}>
              <img src={imageUrl(product.image)} alt={product.title} className={styles.image} />
            </div>
            {discount > 0 && <span className={styles.badge}>−{discount}%</span>}
          </div>

          <div className={styles.info}>
            {category && (
              <Link to={`/categories/${category.id}`} className={styles.category}>
                {category.title}
              </Link>
            )}
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceBlock}>
              <Price product={product} size="lg" />
              {sale && (
                <p className={styles.saving}>
                  You save {formatPrice(product.price - product.discont_price)} ({discount}%)
                </p>
              )}
            </div>

            <div className={styles.buy} ref={buyRef}>
              <QuantityStepper
                size="lg"
                value={quantity}
                max={MAX_QUANTITY}
                onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
                onIncrease={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
              />
              <Button variant="accent" size="lg" className={styles.addButton} onClick={handleAdd}>
                <CartIcon size={20} />
                Add to cart
                {quantity > 1 && <span className={styles.addTotal}>· {formatPrice(getEffectivePrice(product) * quantity)}</span>}
              </Button>
            </div>

            <ul className={styles.benefits}>
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className={styles.benefit}>
                  <span className={styles.benefitIcon} aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className={styles.benefitTitle}>{title}</span>
                    <span className={styles.benefitText}>{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <section className={styles.description} aria-labelledby="description-title">
              <h2 id="description-title" className={styles.descriptionTitle}>
                About this product
              </h2>
              <p>{product.description}</p>
            </section>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Container as="section" className={styles.related} aria-labelledby="related-title">
          <SectionHeader
            id="related-title"
            title="You may also like"
            linkTo={category ? `/categories/${category.id}` : '/products'}
            linkLabel={category ? `More in ${category.title}` : 'All products'}
          />
          <ProductGrid products={related} />
        </Container>
      )}

      {/* Mobile only (CSS): appears once the main buy row has scrolled away. */}
      <div className={`${styles.stickyBar} ${showStickyBar ? styles.stickyBarVisible : ''}`} inert={!showStickyBar}>
        <div className={styles.stickyInfo}>
          <span className={styles.stickyTitle}>{product.title}</span>
          <Price product={product} size="sm" />
        </div>
        <Button variant="accent" className={styles.stickyButton} onClick={handleAdd} aria-label={`Add ${product.title} to cart`}>
          <CartIcon size={18} />
          Add to cart
        </Button>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, categories, status, error, retry } = useCatalog();
  const product = products.find((item) => item.id === Number(id));
  const category = product && categories.find((item) => item.id === product.categoryId);
  const related = useMemo(
    () =>
      product
        ? products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, RELATED_COUNT)
        : [],
    [products, product],
  );
  usePageTitle(status === 'succeeded' ? (product?.title ?? 'Product not found') : 'Product');

  return (
    <AsyncState status={status} error={error} retry={retry} loadingText="Loading product…">
      {() =>
        product ? (
          <ProductDetails key={product.id} product={product} category={category} related={related} />
        ) : (
          <NotFoundContent
            title="Product not found"
            text="This product may have been sold out or removed from the catalogue."
            actionTo="/products"
            actionLabel="Browse all products"
          />
        )
      }
    </AsyncState>
  );
};

export default ProductDetailsPage;
