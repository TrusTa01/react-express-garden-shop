import styles from './Container.module.css';

const Container = ({ as: Component = 'div', className = '', ...rest }) => (
  <Component className={`${styles.container} ${className}`} {...rest} />
);

export default Container;
