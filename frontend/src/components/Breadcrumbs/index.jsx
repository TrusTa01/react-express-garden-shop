import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../Icons';
import styles from './Breadcrumbs.module.css';

/** items: [{ label, to? }]; the last item is the current page. */
const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className={styles.nav}>
    <ol className={styles.list}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <li key={item.label} className={styles.item}>
            {last || !item.to ? (
              <span aria-current={last ? 'page' : undefined} className={styles.current}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className={styles.link}>
                {item.label}
              </Link>
            )}
            {!last && <ChevronRightIcon size={16} className={styles.sep} />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
