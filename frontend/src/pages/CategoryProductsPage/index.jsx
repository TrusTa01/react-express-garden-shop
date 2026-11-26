import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import AsyncState from '../../components/AsyncState';
import CatalogView from '../../components/CatalogView';
import NotFoundContent from '../NotFoundPage/NotFoundContent';
import { CATEGORY_LINES } from './categoryLines';

const CategoryProductsPage = () => {
  const { id } = useParams();
  const categoryId = Number(id);
  const { products, categories, status, error, retry } = useCatalog();
  const category = categories.find((item) => item.id === categoryId);
  const categoryProducts = useMemo(
    () => products.filter((product) => product.categoryId === categoryId),
    [products, categoryId],
  );
  usePageTitle(status === 'succeeded' ? (category?.title ?? 'Category not found') : 'Category');

  return (
    <AsyncState status={status} error={error} retry={retry} loadingText="Loading category…">
      {() =>
        category ? (
          <CatalogView
            key={categoryId}
            title={category.title}
            description={CATEGORY_LINES[category.title]}
            breadcrumbs={[
              { label: 'Home', to: '/' },
              { label: 'Categories', to: '/categories' },
              { label: category.title },
            ]}
            products={categoryProducts}
            emptyText="This category has no products yet."
          />
        ) : (
          <NotFoundContent
            title="Category not found"
            text="It may have been renamed or removed. Pick one of our categories instead."
            actionTo="/categories"
            actionLabel="View all categories"
          />
        )
      }
    </AsyncState>
  );
};

export default CategoryProductsPage;
