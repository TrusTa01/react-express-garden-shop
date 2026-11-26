export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, 'NOT_FOUND', message);
  }
}

export class ValidationError extends HttpError {
  constructor(message, details) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

function sendError(res, status, code, message, details) {
  const error = { code, message };
  if (details) error.details = details;
  res.status(status).json({ error });
}

/** Catch-all for requests that matched no route and no static file. */
export function notFoundHandler(req, res) {
  sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
}

/** Express treats a middleware with four arguments as the error handler, so `next` must stay. */
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    sendError(res, err.status, err.code, err.message, err.details);
    return;
  }
  // Errors raised by express.json().
  if (err.type === 'entity.parse.failed') {
    sendError(res, 400, 'INVALID_JSON', 'Request body is not valid JSON');
    return;
  }
  if (err.type === 'entity.too.large') {
    sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
    return;
  }
  if (Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    sendError(res, err.status, 'BAD_REQUEST', err.expose ? err.message : 'Bad request');
    return;
  }

  console.error(err);
  sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error');
}
