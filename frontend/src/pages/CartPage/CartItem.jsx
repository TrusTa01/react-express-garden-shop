import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  addItemToCart,
  decreaseItemQuantity,
  removeItemFromCart,
  MAX_QUANTITY,
} from '../../store/slices/cartSlice';
import { imageUrl } from '../../config/api';
import { formatPrice, getEffectivePrice } from '../../utils/price';
import Price from '../../components/Price';
import QuantityStepper from '../../components/QuantityStepper';
import { TrashIcon } from '../../components/Icons';
import styles from './CartPage.module.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { product, quantity } = item;
  const url = `/products/${product.id}`;

  return (
    <li className={styles.item}>
      <Link to={url} className={styles.itemMedia} tabIndex={-1} aria-hidden="true">
        <img src={imageUrl(product.image)} alt="" className={styles.itemImage} />
      </Link>
      <div className={styles.itemInfo}>
        <h3 className={styles.itemTitle}>
          <Link to={url}>{product.title}</Link>
        </h3>
        <Price product={product} size="sm" />
      </div>
      <div className={styles.itemControls}>
        <QuantityStepper
          value={quantity}
          min={1}
          max={MAX_QUANTITY}
          label={`Quantity of ${product.title}`}
          onDecrease={() => dispatch(decreaseItemQuantity(product.id))}
          onIncrease={() => dispatch(addItemToCart(product))}
        />
        <p className={styles.lineTotal}>
          <span className="visually-hidden">Line total </span>
          {formatPrice(getEffectivePrice(product) * quantity)}
        </p>
      </div>
      <button
        type="button"
        className={styles.remove}
        aria-label={`Remove ${product.title} from cart`}
        onClick={() => dispatch(removeItemFromCart(product.id))}
      >
        <TrashIcon size={18} />
        <span className={styles.removeLabel} aria-hidden="true">
          Remove
        </span>
      </button>
    </li>
  );
};

export default CartItem;
