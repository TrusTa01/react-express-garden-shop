import { usePageTitle } from '../../hooks/usePageTitle';
import NotFoundContent from './NotFoundContent';

const NotFoundPage = () => {
  usePageTitle('Page not found');
  return <NotFoundContent />;
};

export default NotFoundPage;
