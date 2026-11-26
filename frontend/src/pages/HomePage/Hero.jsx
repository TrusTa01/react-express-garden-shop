import { Link } from 'react-router-dom';
import { imageUrl } from '../../config/api';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { ReturnIcon, SupportIcon, TruckIcon } from '../../components/Icons';
import styles from './HomePage.module.css';

const BENEFITS = [
  { icon: TruckIcon, title: 'Free delivery', text: 'On every order over $50' },
  { icon: ReturnIcon, title: '30-day returns', text: 'Plants that don’t thrive? We replace them' },
  { icon: SupportIcon, title: 'Support 24/7', text: 'Gardening advice by phone or chat' },
];

const Hero = ({ categories, products }) => {
  const heroImage = categories[0]?.image;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {heroImage && <img src={imageUrl(heroImage)} alt="" className={styles.heroImage} fetchPriority="high" />}
      <Container className={styles.heroInner}>
        <div className={styles.heroText}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Everything your garden needs, from seed to bloom
          </h1>
          <p className={styles.heroLead}>
            Flowering annuals, nursery plants, care tools and garden art, delivered to your door.
          </p>
          <div className={styles.heroActions}>
            <Button as={Link} to="/products" variant="accent" size="lg">
              Shop now
            </Button>
            <Button as={Link} to="/discounted-items" variant="outlineLight" size="lg">
              View sale
            </Button>
          </div>
          {products.length > 0 && (
            <p className={styles.heroFacts}>
              {products.length} products in {categories.length} categories
            </p>
          )}
        </div>
      </Container>

      <div className={styles.heroBar}>
        <Container as="ul" className={styles.benefits} aria-label="Why shop with us">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className={styles.benefit}>
              <span className={styles.benefitIcon}>
                <Icon size={24} />
              </span>
              <span>
                <strong className={styles.benefitTitle}>{title}</strong>
                <span className={styles.benefitText}>{text}</span>
              </span>
            </li>
          ))}
        </Container>
      </div>
    </section>
  );
};

export default Hero;
