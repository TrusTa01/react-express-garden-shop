import Breadcrumbs from '../Breadcrumbs';
import Container from '../ui/Container';
import styles from './PageHeader.module.css';

/**
 * Page title block: breadcrumbs, serif H1, a short subline and an optional meta
 * pill (e.g. "35 products"). `tone="sale"` turns it into a full-width vermilion band.
 * Renders its own Container, so place it outside the page's Container.
 */
const PageHeader = ({ title, breadcrumbs, children, meta, tone = 'default' }) => (
  <header className={`${styles.header} ${styles[tone] || ''}`}>
    <Container>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className={styles.row}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          {children && <p className={styles.text}>{children}</p>}
        </div>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
    </Container>
  </header>
);

export default PageHeader;
