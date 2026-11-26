import { Link } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import styles from './NotFoundPage.module.css';

/** 404 and "not found" states: big serif heading and two ways out. */
const NotFoundContent = ({
  title = 'Page not found',
  text = 'The page you’re looking for doesn’t exist or has moved.',
  actionTo = '/products',
  actionLabel = 'Browse products',
}) => (
  <Container className={styles.wrapper}>
    <div className={styles.card}>
      <p className={styles.code} aria-hidden="true">
        4<span className={styles.zero}>0</span>4
      </p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{text}</p>
      <div className={styles.actions}>
        <Button as={Link} to="/" variant="accent" size="lg">
          Go to home page
        </Button>
        <Button as={Link} to={actionTo} variant="secondary" size="lg">
          {actionLabel}
        </Button>
      </div>
    </div>
  </Container>
);

export default NotFoundContent;
