import ProductCard from '../ProductCard';
import styles from './ProductGrid.module.css';

/** Responsive product grid: 4 / 3 / 2 columns. */
const ProductGrid = ({ products }) => (
  <ul className={styles.grid}>
    {products.map((product) => (
      <li key={product.id}>
        <ProductCard product={product} />
      </li>
    ))}
  </ul>
);

export default ProductGrid;
