import { Link } from 'react-router-dom';
import { imageUrl } from '../../config/api';
import styles from './HomePage.module.css';

/** Home-only category row: tall photo tiles with the name set over the image. */
const CategoryStrip = ({ categories, products }) => (
  <ul className={styles.categoryStrip}>
    {categories.map((category) => {
      const count = products.filter((p) => p.categoryId === category.id).length;
      return (
        <li key={category.id}>
          <Link to={`/categories/${category.id}`} className={styles.categoryTile}>
            <img src={imageUrl(category.image)} alt="" loading="lazy" className={styles.categoryImage} />
            <span className={styles.categoryText}>
              <span className={styles.categoryName}>{category.title}</span>
              {count > 0 && <span className={styles.categoryCount}>{count} products</span>}
            </span>
          </Link>
        </li>
      );
    })}
  </ul>
);

export default CategoryStrip;
