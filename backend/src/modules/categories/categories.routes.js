import { Router } from 'express';
import { idParamSchema, validate } from '../../middleware/validate.js';

export function createCategoriesRouter(controller) {
  const router = Router();
  router.get('/all', controller.list);
  router.get('/:id', validate({ params: idParamSchema }), controller.getWithProducts);
  return router;
}
