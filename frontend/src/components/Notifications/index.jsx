import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissNotification } from '../../store/slices/notificationsSlice';
import { AlertIcon, CheckIcon, CloseIcon } from '../Icons';
import styles from './Notifications.module.css';

const DURATION = 3500;

const Toast = ({ id, message, type }) => {
  const dispatch = useDispatch();

  // Each toast owns its timer, so new toasts or re-renders never reset it.
  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissNotification(id)), DURATION);
    return () => clearTimeout(timer);
  }, [dispatch, id]);

  return (
    <div className={`${styles.toast} ${styles[type] || ''}`}>
      <span className={styles.icon}>{type === 'error' ? <AlertIcon size={20} /> : <CheckIcon size={20} />}</span>
      <p className={styles.message}>{message}</p>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss notification"
        onClick={() => dispatch(dismissNotification(id))}
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
};

/** Always mounted, so screen readers announce toasts inserted into the live region. */
const Notifications = () => {
  const items = useSelector((state) => state.notifications.items);
  return (
    <div className={styles.region} role="status" aria-live="polite" aria-atomic="false">
      {items.map((item) => (
        <Toast key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Notifications;
