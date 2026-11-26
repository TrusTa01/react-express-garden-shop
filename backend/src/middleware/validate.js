import { z } from 'zod';
import { ValidationError } from './errors.js';

function formatIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

function parseOrThrow(schema, value, label) {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const details = formatIssues(result.error.issues);
  const [first] = details;
  throw new ValidationError(`Invalid ${label}: ${first.path} ${first.message}`, details);
}

/**
 * Validates `req.params` and/or `req.body` with zod schemas.
 * Parsed values are exposed as `req.valid.params` and `req.valid.body`.
 */
export function validate({ params, body }) {
  return (req, res, next) => {
    req.valid = {};
    if (params) req.valid.params = parseOrThrow(params, req.params, 'path parameter');
    // A missing or non-JSON body arrives as undefined: validate it as an empty object.
    if (body) req.valid.body = parseOrThrow(body, req.body ?? {}, 'request body');
    next();
  };
}

/** `:id` route parameter: a positive integer without sign, leading zeros or fraction. */
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d{0,9}$/, 'must be a positive integer')
    .transform(Number),
});
