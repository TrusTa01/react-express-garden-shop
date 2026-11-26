import CategoryCard from '../CategoryCard';
import styles from './CategoryGrid.module.css';

const CategoryGrid = ({ categories, products = [] }) => (
  <ul className={styles.grid}>
    {categories.map((category) => (
      <li key={category.id}>
        <CategoryCard
          category={category}
          count={products.length ? products.filter((p) => p.categoryId === category.id).length : undefined}
        />
      </li>
    ))}
  </ul>
);

export default CategoryGrid;
