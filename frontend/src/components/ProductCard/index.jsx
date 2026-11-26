import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/slices/cartSlice';
import { notify } from '../../store/slices/notificationsSlice';
import { imageUrl } from '../../config/api';
import { getDiscountPercent } from '../../utils/price';
import Price from '../Price';
import Button from '../ui/Button';
import { CartIcon } from '../Icons';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const discount = getDiscountPercent(product);
  const url = `/products/${product.id}`;

  const handleAdd = () => {
    dispatch(addItemToCart(product));
    dispatch(notify(`“${product.title}” added to cart`));
  };

  return (
    <article className={styles.card}>
      <Link to={url} className={styles.media} tabIndex={-1} aria-hidden="true">
        <img src={imageUrl(product.image)} alt="" loading="lazy" className={styles.image} />
      </Link>
      {discount > 0 && <span className={styles.badge}>−{discount}%</span>}
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={url} className={styles.titleLink}>
            {product.title}
          </Link>
        </h3>
        <Price product={product} className={styles.price} />
        <Button variant="accent" size="sm" block className={styles.button} onClick={handleAdd} aria-label={`Add ${product.title} to cart`}>
          <CartIcon size={18} />
          Add to cart
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
