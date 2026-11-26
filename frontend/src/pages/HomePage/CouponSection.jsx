import { useDispatch } from 'react-redux';
import { postJson } from '../../config/api';
import { notify } from '../../store/slices/notificationsSlice';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import ContactForm from '../../components/ContactForm';
import { CheckIcon } from '../../components/Icons';
import styles from './HomePage.module.css';

const CouponSection = () => {
  const dispatch = useDispatch();

  // The coupon request goes to /order/send, as in the original storefront.
  const sendRequest = async (contact) => {
    await postJson('/order/send', contact);
    dispatch(notify('Coupon request sent. Check your email.'));
  };

  return (
    <Container as="section" className={styles.section} aria-labelledby="coupon-title">
      <div className={styles.coupon}>
        <div className={styles.couponText}>
          <h2 id="coupon-title" className={styles.couponTitle}>
            5% off your first order
          </h2>
          <p className={styles.couponLead}>
            New here? Leave your contacts and we’ll email you a personal discount code. One coupon per customer.
          </p>
        </div>
        <div className={styles.couponCard}>
          <ContactForm
            submitLabel="Get my discount"
            submitVariant="accent"
            onSubmit={sendRequest}
            renderSuccess={(again) => (
              <div className={styles.couponSuccess} role="status">
                <span className={styles.couponSuccessIcon}>
                  <CheckIcon size={28} />
                </span>
                <h3>Request received!</h3>
                <p>We’ll email your 5% coupon shortly.</p>
                <Button variant="secondary" onClick={again}>
                  Send another request
                </Button>
              </div>
            )}
          />
        </div>
      </div>
    </Container>
  );
};

export default CouponSection;
