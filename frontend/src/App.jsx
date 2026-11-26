import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import AllProductsPage from './pages/AllProductsPage';
import SalePage from './pages/SalePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './App.module.css';

const App = () => {
  const { pathname } = useLocation();

  // Every new route starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.app}>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <Header />
      <main id="main" className={styles.main} tabIndex={-1}>
        <div key={pathname} className={styles.page}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryProductsPage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/discounted-items" element={<SalePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <Notifications />
    </div>
  );
};

export default App;
