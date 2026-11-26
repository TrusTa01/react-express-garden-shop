import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errors.js';
import { createCategoriesController } from './modules/categories/categories.controller.js';
import { createCategoriesRepository } from './modules/categories/categories.repository.js';
import { createCategoriesRouter } from './modules/categories/categories.routes.js';
import { createCategoriesService } from './modules/categories/categories.service.js';
import { createOrdersController } from './modules/orders/orders.controller.js';
import { createOrdersRouter } from './modules/orders/orders.routes.js';
import { createOrdersService } from './modules/orders/orders.service.js';
import { createProductsController } from './modules/products/products.controller.js';
import { createProductsRepository } from './modules/products/products.repository.js';
import { createProductsRouter } from './modules/products/products.routes.js';
import { createProductsService } from './modules/products/products.service.js';

/**
 * Builds the Express application. It does not open a port, so tests can drive it directly.
 * @param {{ db: import('node:sqlite').DatabaseSync, publicDir: string, corsOrigin?: string | string[] }} options
 */
export function createApp({ db, publicDir, corsOrigin = '*' }) {
  const categoriesRepository = createCategoriesRepository(db);
  const productsRepository = createProductsRepository(db);

  const categoriesController = createCategoriesController(
    createCategoriesService({ categoriesRepository, productsRepository }),
  );
  const productsController = createProductsController(
    createProductsService({ productsRepository }),
  );
  const ordersController = createOrdersController(createOrdersService());

  const app = express();
  app.disable('x-powered-by');

  app.use(cors({ origin: corsOrigin }));
  // Category and product images: /category_img/*.jpeg, /product_img/*.jpeg
  app.use(express.static(publicDir, { index: false }));
  app.use(express.json({ limit: '10kb' }));

  app.use('/categories', createCategoriesRouter(categoriesController));
  app.use('/products', createProductsRouter(productsController));
  app.use(createOrdersRouter(ordersController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
