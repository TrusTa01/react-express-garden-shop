import { MinusIcon, PlusIcon } from '../Icons';
import styles from './QuantityStepper.module.css';

const QuantityStepper = ({ value, onDecrease, onIncrease, min = 1, max = 999, label = 'Quantity', size = 'md' }) => (
  <div className={`${styles.stepper} ${styles[size]}`} role="group" aria-label={label}>
    <button
      type="button"
      className={styles.button}
      onClick={onDecrease}
      disabled={value <= min}
      aria-label="Decrease quantity"
    >
      <MinusIcon size={18} />
    </button>
    <output className={styles.value} aria-live="polite">
      {value}
    </output>
    <button
      type="button"
      className={styles.button}
      onClick={onIncrease}
      disabled={value >= max}
      aria-label="Increase quantity"
    >
      <PlusIcon size={18} />
    </button>
  </div>
);

export default QuantityStepper;
