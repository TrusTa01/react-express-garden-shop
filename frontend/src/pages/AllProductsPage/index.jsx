import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import AsyncState from '../../components/AsyncState';
import CatalogView from '../../components/CatalogView';

const AllProductsPage = () => {
  usePageTitle('All products');
  const { products, status, error, retry } = useCatalog({ categories: false });

  return (
    <AsyncState status={status} error={error} retry={retry} loadingText="Loading products…">
      {() => (
        <CatalogView
          title="All products"
          description="Plants, seeds, tools and decor for every part of your garden."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'All products' }]}
          products={products}
        />
      )}
    </AsyncState>
  );
};

export default AllProductsPage;
