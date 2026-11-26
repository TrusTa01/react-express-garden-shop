import { Router } from 'express';
import { idParamSchema, validate } from '../../middleware/validate.js';

export function createProductsRouter(controller) {
  const router = Router();
  router.get('/all', controller.list);
  router.get('/:id', validate({ params: idParamSchema }), controller.getById);
  return router;
}
