import { Link } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import styles from './HomePage.module.css';

/** Full-width vermilion band; the percentage is the largest discount in the catalogue. */
const PromoBand = ({ maxDiscount, saleCount }) => {
  if (maxDiscount <= 0) return null;
  return (
    <section className={styles.promo} aria-labelledby="promo-title">
      <Container className={styles.promoInner}>
        <div>
          <h2 id="promo-title" className={styles.promoTitle}>
            Up to −{maxDiscount}% off across the shop
          </h2>
          <p className={styles.promoText}>{saleCount} items are on sale right now</p>
        </div>
        <Button as={Link} to="/discounted-items" size="lg" className={styles.promoButton}>
          Shop the sale
        </Button>
      </Container>
    </section>
  );
};

export default PromoBand;
