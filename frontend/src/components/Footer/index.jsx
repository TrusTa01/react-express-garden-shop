import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import { ClockIcon, LeafLogo, PhoneIcon, PinIcon, WhatsAppIcon } from '../Icons';
import { NAV_LINKS } from '../Header/navLinks';
import styles from './Footer.module.css';

const PHONE_DISPLAY = '+7 (499) 350-66-04';
const PHONE_LINK = '+74993506604';
const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2247.382092576326!2d37.625807415840515!3d55.70014288053723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54b032d1e0d37%3A0xc0c8e3e4f3a3d5f!2sDubininskaya%20Ulitsa%2C%2096%2C%20Moscow%2C%20Russia%2C%20115093!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus';

const Footer = () => (
  <footer className={styles.footer}>
    <Container className={styles.grid}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo}>
          <LeafLogo size={40} />
          <span className={styles.logoText}>Garden Shop</span>
        </Link>
        <p className={styles.tagline}>Plants, seeds, tools and garden decor, delivered to your door.</p>
        <ul className={styles.socials} aria-label="Social networks">
          <li>
            <a
              className={styles.social}
              href={`https://wa.me/${PHONE_LINK.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp chat (opens in a new tab)"
            >
              <WhatsAppIcon />
              <span>Chat on WhatsApp</span>
            </a>
          </li>
        </ul>
      </div>

      <nav aria-label="Footer">
        <h2 className={styles.heading}>Shop</h2>
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </nav>

      <div>
        <h2 className={styles.heading}>Contact</h2>
        <ul className={styles.contacts}>
          <li>
            <PhoneIcon size={20} />
            <a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a>
          </li>
          <li>
            <PinIcon size={20} />
            <span>Dubininskaya Ulitsa, 96, Moscow, 115093</span>
          </li>
          <li>
            <ClockIcon size={20} />
            <span>Open 24 hours a day</span>
          </li>
        </ul>
      </div>

      <div className={styles.map}>
        <iframe
          src={MAP_SRC}
          title="Garden Shop location on Google Maps"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </Container>

    <div className={styles.bottom}>
      <Container className={styles.bottomInner}>
        <span>© {new Date().getFullYear()} Garden Shop. All rights reserved.</span>
        <span>Prices in USD</span>
      </Container>
    </div>
  </footer>
);

export default Footer;
