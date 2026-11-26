import { useEffect, useId, useRef } from 'react';
import { SORT_OPTIONS, countActiveFilters } from '../../hooks/useProductFilters';
import Button from '../ui/Button';
import { CheckIcon, CloseIcon } from '../Icons';
import styles from './ProductFilters.module.css';

const PRICE_PRESETS = [
  { label: 'Under $10', from: '', to: '10' },
  { label: '$10–25', from: '10', to: '25' },
  { label: '$25–50', from: '25', to: '50' },
  { label: '$50+', from: '50', to: '' },
];

/** Price range (inputs + quick presets) and "On sale only". Shared by the sidebar and the drawer. */
const FilterFields = ({ filters, setFilter, showDiscounted }) => {
  const id = useId();
  const setRange = (from, to) => {
    setFilter('priceFrom', from);
    setFilter('priceTo', to);
  };

  return (
    <>
      <fieldset className={styles.group}>
        <legend className={styles.label}>Price</legend>
        <div className={styles.priceRow}>
          <label className={styles.priceField} htmlFor={`${id}-from`}>
            <span className="visually-hidden">Minimum price, dollars</span>
            <span className={styles.currency} aria-hidden="true">
              $
            </span>
            <input
              id={`${id}-from`}
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="From"
              className={styles.input}
              value={filters.priceFrom}
              onChange={(event) => setFilter('priceFrom', event.target.value)}
            />
          </label>
          <span className={styles.dash} aria-hidden="true">
            –
          </span>
          <label className={styles.priceField} htmlFor={`${id}-to`}>
            <span className="visually-hidden">Maximum price, dollars</span>
            <span className={styles.currency} aria-hidden="true">
              $
            </span>
            <input
              id={`${id}-to`}
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="To"
              className={styles.input}
              value={filters.priceTo}
              onChange={(event) => setFilter('priceTo', event.target.value)}
            />
          </label>
        </div>
        <ul className={styles.presets} aria-label="Quick price ranges">
          {PRICE_PRESETS.map((preset) => {
            const active = filters.priceFrom === preset.from && filters.priceTo === preset.to;
            return (
              <li key={preset.label}>
                <button
                  type="button"
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                  aria-pressed={active}
                  onClick={() => (active ? setRange('', '') : setRange(preset.from, preset.to))}
                >
                  {preset.label}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {showDiscounted && (
        <fieldset className={styles.group}>
          <legend className={styles.label}>Offers</legend>
          <label className={styles.checkboxRow} htmlFor={`${id}-sale`}>
            <input
              id={`${id}-sale`}
              type="checkbox"
              className={styles.checkbox}
              checked={filters.discountedOnly}
              onChange={(event) => setFilter('discountedOnly', event.target.checked)}
            />
            <span className={styles.checkmark} aria-hidden="true">
              <CheckIcon size={14} />
            </span>
            On sale only
          </label>
        </fieldset>
      )}
    </>
  );
};

/** Desktop sidebar: a white card with the filters and a clear "Reset". */
export const FilterSidebar = ({ filters, setFilter, resetFilters, showDiscounted }) => {
  const active = countActiveFilters(filters);
  return (
    <aside className={styles.sidebar} aria-labelledby="filters-title">
      <div className={styles.sidebarHead}>
        <h2 id="filters-title" className={styles.sidebarTitle}>
          Filters
        </h2>
        <button type="button" className={styles.reset} onClick={resetFilters} disabled={active === 0}>
          Reset
        </button>
      </div>
      <FilterFields filters={filters} setFilter={setFilter} showDiscounted={showDiscounted} />
    </aside>
  );
};

/** Mobile bottom sheet built on <dialog>: focus trap, Escape and backdrop close come with showModal(). */
export const FilterDrawer = ({ open, onClose, filters, setFilter, resetFilters, showDiscounted, total }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // The drawer only exists below the desktop breakpoint: close it if the window grows.
  useEffect(() => {
    if (!open) return undefined;
    const query = window.matchMedia('(min-width: 900px)');
    const onChange = (event) => event.matches && onClose();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [open, onClose]);

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby="drawer-title"
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
    >
      <div className={styles.drawerHead}>
        <h2 id="drawer-title" className={styles.sidebarTitle}>
          Filters
        </h2>
        <button type="button" className={styles.close} aria-label="Close filters" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.drawerBody}>
        <FilterFields filters={filters} setFilter={setFilter} showDiscounted={showDiscounted} />
      </div>
      <div className={styles.drawerFoot}>
        <Button variant="secondary" size="lg" onClick={resetFilters} disabled={countActiveFilters(filters) === 0}>
          Reset
        </Button>
        <Button variant="accent" size="lg" className={styles.showButton} onClick={onClose}>
          Show {total} {total === 1 ? 'product' : 'products'}
        </Button>
      </div>
    </dialog>
  );
};

/** Sort select used in the listing toolbar. */
export const SortSelect = ({ value, onChange }) => {
  const id = useId();
  return (
    <div className={styles.sort}>
      <label htmlFor={id} className={styles.sortLabel}>
        Sort by
      </label>
      <select id={id} className={styles.select} value={value} onChange={(event) => onChange(event.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
