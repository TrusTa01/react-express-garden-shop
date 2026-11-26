import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DEMO } from '../../config/api';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { CartIcon, CloseIcon, LeafLogo, MenuIcon } from '../Icons';
import { NAV_LINKS } from './navLinks';
import styles from './Header.module.css';

const navClass = ({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink);

const Header = () => {
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const burger = burgerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      burger?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className={styles.announcement}>
        <Container className={styles.announcementInner}>
          Free delivery on orders over $50. New customers get 5% off the first order.
          {DEMO && <span className={styles.demoNote}>Demo version: orders are not sent anywhere.</span>}
        </Container>
      </div>
      <header className={styles.header}>
        <Container className={styles.inner}>
          <button
            ref={burgerRef}
            type="button"
            className={`${styles.iconButton} ${styles.burger}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>

          <Link to="/" className={styles.logo} aria-label="Garden Shop, home page">
            <LeafLogo size={36} />
            <span className={styles.logoText}>Garden Shop</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end} className={navClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/cart"
            className={`${styles.iconButton} ${styles.cart}`}
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart, empty'}
          >
            <CartIcon size={26} />
            {cartCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </Container>
      </header>

      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} onClick={closeMenu} aria-hidden="true" />
      <div
        id="mobile-menu"
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.logo}>
            <LeafLogo size={32} />
            <span className={styles.logoText}>Garden Shop</span>
          </span>
          <button ref={closeButtonRef} type="button" className={styles.iconButton} aria-label="Close menu" onClick={closeMenu}>
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className={styles.drawerList}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={navClass} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/cart" className={navClass} onClick={closeMenu}>
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </NavLink>
            </li>
          </ul>
        </nav>
        <Button as={Link} to="/discounted-items" variant="accent" size="lg" block className={styles.drawerCta} onClick={closeMenu}>
          Shop the sale
        </Button>
      </div>
    </>
  );
};

export default Header;
