import { z } from 'zod';

// Deliberately lenient: the storefront form checks the input only with the browser's
// built-in `required` / `type="email"`, so the API must accept what those accept.
const contactSchema = z.object({
  name: z.string().trim().min(1, 'is required').max(100),
  phone: z
    .string()
    .trim()
    .min(5, 'is too short')
    .max(30)
    .regex(/^[+\d\s().-]+$/, 'may contain only digits, spaces and + ( ) - .'),
  email: z
    .string()
    .trim()
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+$/, 'must be an e-mail address'),
});

/** POST /sale/send: request for a discount coupon. */
export const saleRequestSchema = contactSchema;

/** POST /order/send: contact details plus an optional list of ordered items. */
export const orderSchema = contactSchema.extend({
  products: z
    .array(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().positive().max(999),
      }),
    )
    .min(1)
    .max(100)
    .optional(),
});
