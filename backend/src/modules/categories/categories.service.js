import { NotFoundError } from '../../middleware/errors.js';

export function createCategoriesService({ categoriesRepository, productsRepository }) {
  return {
    listCategories() {
      return categoriesRepository.findAll();
    },

    getCategoryWithProducts(id) {
      const category = categoriesRepository.findById(id);
      if (!category) throw new NotFoundError(`Category ${id} not found`);
      return { category, data: productsRepository.findByCategoryId(id) };
    },
  };
}
