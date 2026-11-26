import { useMemo } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { isOnSale } from '../../utils/price';
import AsyncState from '../../components/AsyncState';
import CatalogView from '../../components/CatalogView';

const SalePage = () => {
  usePageTitle('Sale');
  const { products, status, error, retry } = useCatalog({ categories: false });
  const saleProducts = useMemo(() => products.filter(isOnSale), [products]);

  return (
    <AsyncState status={status} error={error} retry={retry} loadingText="Loading sale…">
      {() => (
        <CatalogView
          title="Sale"
          description="Discounted plants and garden supplies. Prices are already reduced."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Sale' }]}
          products={saleProducts}
          showDiscounted={false}
          tone="sale"
          emptyText="No discounts right now. Check back soon."
        />
      )}
    </AsyncState>
  );
};

export default SalePage;
