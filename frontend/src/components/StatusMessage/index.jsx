import styles from './StatusMessage.module.css';

/** Loading / error / empty states with an optional action (button or link). */
const StatusMessage = ({ title, text, action, variant = 'empty', icon }) => (
  <div
    className={`${styles.box} ${styles[variant]}`}
    role={variant === 'error' ? 'alert' : undefined}
    aria-busy={variant === 'loading' ? true : undefined}
  >
    {variant === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
    {icon && <span className={styles.icon}>{icon}</span>}
    {title && <h2 className={styles.title}>{title}</h2>}
    {text && <p className={styles.text}>{text}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

export default StatusMessage;
