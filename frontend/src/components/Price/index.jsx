import { formatPrice, getEffectivePrice, isOnSale } from '../../utils/price';
import styles from './Price.module.css';

/** Current price, plus the struck-through old price when the product is on sale. */
const Price = ({ product, size = 'md', className = '' }) => {
  const sale = isOnSale(product);
  return (
    <p className={`${styles.price} ${styles[size]} ${className}`}>
      <span className={sale ? styles.sale : styles.current}>
        {sale && <span className="visually-hidden">Sale price </span>}
        {formatPrice(getEffectivePrice(product))}
      </span>
      {sale && (
        <s className={styles.old}>
          <span className="visually-hidden">Regular price </span>
          {formatPrice(product.price)}
        </s>
      )}
    </p>
  );
};

export default Price;
