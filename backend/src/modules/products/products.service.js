import { NotFoundError } from '../../middleware/errors.js';

export function createProductsService({ productsRepository }) {
  return {
    listProducts() {
      return productsRepository.findAll();
    },

    getProduct(id) {
      const product = productsRepository.findById(id);
      if (!product) throw new NotFoundError(`Product ${id} not found`);
      return product;
    },
  };
}
