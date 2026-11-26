import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import styles from './Pagination.module.css';

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={`${styles.button} ${styles.step}`}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeftIcon size={18} />
        <span className={styles.stepLabel}>Previous</span>
      </button>
      <ul className={styles.pages}>
        {pages.map((number) => (
          <li key={number}>
            <button
              type="button"
              className={`${styles.button} ${number === page ? styles.active : ''}`}
              aria-current={number === page ? 'page' : undefined}
              aria-label={`Page ${number}`}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${styles.button} ${styles.step}`}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        <span className={styles.stepLabel}>Next</span>
        <ChevronRightIcon size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
