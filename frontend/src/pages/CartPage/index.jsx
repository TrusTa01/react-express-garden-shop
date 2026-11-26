import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { DEMO, postJson } from '../../config/api';
import { formatPrice } from '../../utils/price';
import { usePageTitle } from '../../hooks/usePageTitle';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/PageHeader';
import StatusMessage from '../../components/StatusMessage';
import ContactForm from '../../components/ContactForm';
import Modal from '../../components/Modal';
import { CartIcon, CheckIcon, ChevronLeftIcon, TruckIcon } from '../../components/Icons';
import CartItem from './CartItem';
import styles from './CartPage.module.css';

const BREADCRUMBS = [{ label: 'Home', to: '/' }, { label: 'Cart' }];
// Same threshold as the store promise "Free delivery on orders over $50".
const FREE_DELIVERY_FROM = 50;

const itemsLabel = (count) => `${count} ${count === 1 ? 'item' : 'items'}`;

const CartPage = () => {
  usePageTitle('Cart');
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const freeDelivery = totalAmount >= FREE_DELIVERY_FROM;
  const progress = Math.min(100, Math.round((totalAmount / FREE_DELIVERY_FROM) * 100));

  const placeOrder = async (contact) => {
    await postJson('/order/send', {
      ...contact,
      products: items.map((item) => ({ id: item.product.id, quantity: item.quantity })),
    });
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  const modal = (
    <Modal
      open={orderPlaced}
      onClose={() => setOrderPlaced(false)}
      title={DEMO ? 'Order form works!' : 'Thank you for your order!'}
      icon={<CheckIcon size={32} />}
    >
      <p className={styles.modalText}>
        {DEMO
          ? 'This is a demo, so the order was not sent. In the real store, a manager would now call you to confirm the details.'
          : 'Your order has been placed. A manager will call you shortly to confirm the details.'}
      </p>
      <Button as={Link} to="/products" variant="accent" size="lg" block onClick={() => setOrderPlaced(false)}>
        Continue shopping
      </Button>
    </Modal>
  );

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Shopping cart" breadcrumbs={BREADCRUMBS} />
        <Container>
          <StatusMessage
            icon={<CartIcon size={30} />}
            title="Your cart is empty"
            text="Looks like you haven’t added anything yet. Our sale is a good place to start."
            action={
              <>
                <Button as={Link} to="/products" variant="accent" size="lg">
                  Start shopping
                </Button>
                <Button as={Link} to="/discounted-items" variant="secondary" size="lg">
                  View sale
                </Button>
              </>
            }
          />
        </Container>
        {modal}
      </>
    );
  }

  return (
    <>
      <PageHeader title="Shopping cart" breadcrumbs={BREADCRUMBS} meta={itemsLabel(totalQuantity)} />
      <Container>
        <div className={styles.layout}>
          <section aria-label="Items in your cart" className={styles.itemsColumn}>
            <ul className={styles.items}>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </ul>
            <Link to="/products" className={styles.continue}>
              <ChevronLeftIcon size={18} />
              Continue shopping
            </Link>
          </section>

          <aside className={styles.summary} aria-labelledby="summary-title">
            <h2 id="summary-title" className={styles.summaryTitle}>
              Order summary
            </h2>
            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <dt>Subtotal ({itemsLabel(totalQuantity)})</dt>
                <dd>{formatPrice(totalAmount)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>Delivery</dt>
                <dd className={freeDelivery ? styles.free : undefined}>{freeDelivery ? 'Free' : 'Calculated by manager'}</dd>
              </div>
            </dl>

            <div className={styles.delivery}>
              <p className={styles.deliveryText}>
                <TruckIcon size={18} />
                {freeDelivery ? (
                  'Delivery is free for this order.'
                ) : (
                  <span>
                    Add <strong>{formatPrice(FREE_DELIVERY_FROM - totalAmount)}</strong> more for free delivery.
                  </span>
                )}
              </p>
              <div
                className={styles.progress}
                role="progressbar"
                aria-label="Progress to free delivery"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <span className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            <div className={styles.checkout}>
              <h3 className={styles.checkoutTitle}>Contact details</h3>
              <p className={styles.checkoutText}>A manager will call you to confirm the details.</p>
              <ContactForm
                submitLabel="Place order"
                submittingLabel="Placing order…"
                submitVariant="accent"
                onSubmit={placeOrder}
              />
            </div>
          </aside>
        </div>
      </Container>
      {modal}
    </>
  );
};

export default CartPage;
