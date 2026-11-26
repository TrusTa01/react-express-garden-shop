import { Link } from 'react-router-dom';
import { imageUrl } from '../../config/api';
import { ArrowRightIcon } from '../Icons';
import styles from './CategoryCard.module.css';

/** Tall photo tile with the category name set over the image (same look as the Home strip). */
const CategoryCard = ({ category, count }) => (
  <Link to={`/categories/${category.id}`} className={styles.tile}>
    <img src={imageUrl(category.image)} alt="" loading="lazy" className={styles.image} />
    <span className={styles.text}>
      <span className={styles.name}>{category.title}</span>
      {count !== undefined && (
        <span className={styles.count}>
          {count} {count === 1 ? 'product' : 'products'}
        </span>
      )}
    </span>
    <span className={styles.arrow} aria-hidden="true">
      <ArrowRightIcon size={20} />
    </span>
  </Link>
);

export default CategoryCard;
