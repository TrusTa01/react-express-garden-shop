import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { orderSchema, saleRequestSchema } from './orders.schema.js';

export function createOrdersRouter(controller) {
  const router = Router();
  router.post('/order/send', validate({ body: orderSchema }), controller.submitOrder);
  router.post('/sale/send', validate({ body: saleRequestSchema }), controller.submitSaleRequest);
  return router;
}
