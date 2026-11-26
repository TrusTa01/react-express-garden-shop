import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../Icons';
import styles from './SectionHeader.module.css';

/** Section title with an optional "view all" link on the right. */
const SectionHeader = ({ id, title, linkTo, linkLabel, accent }) => (
  <div className={styles.header}>
    <h2 id={id} className={`${styles.title} ${accent ? styles.accent : ''}`}>
      {title}
    </h2>
    {linkTo && (
      <Link to={linkTo} className={styles.link}>
        {linkLabel}
        <ArrowRightIcon size={18} />
      </Link>
    )}
  </div>
);

export default SectionHeader;
