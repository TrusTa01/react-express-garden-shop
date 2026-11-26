import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';
import { createTestApp } from './helpers.js';

const ACCEPTED = { status: 'OK', message: 'request processed' };
// Exactly what the storefront's discount form posts.
const contact = { name: 'Anna', phone: '+7 (999) 123-45-67', email: 'anna@example.com' };

let app;
let db;

before(() => {
  ({ app, db } = createTestApp());
});

after(() => db.close());

function assertValidationError(res, field) {
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  assert.ok(
    res.body.error.details.some((issue) => issue.path === field),
    `expected an issue for "${field}", got ${JSON.stringify(res.body.error.details)}`,
  );
}

for (const endpoint of ['/order/send', '/sale/send']) {
  describe(`POST ${endpoint}`, () => {
    it('accepts the contact form payload', async () => {
      const res = await request(app).post(endpoint).send(contact).expect(200);
      assert.deepEqual(res.body, ACCEPTED);
    });

    it('rejects a missing body', async () => {
      assertValidationError(await request(app).post(endpoint), 'name');
    });

    it('rejects an empty name', async () => {
      assertValidationError(await request(app).post(endpoint).send({ ...contact, name: '  ' }), 'name');
    });

    it('rejects a malformed phone', async () => {
      assertValidationError(
        await request(app).post(endpoint).send({ ...contact, phone: 'call me' }),
        'phone',
      );
    });

    it('rejects a malformed e-mail', async () => {
      assertValidationError(
        await request(app).post(endpoint).send({ ...contact, email: 'anna.example.com' }),
        'email',
      );
    });

    it('rejects invalid JSON', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Content-Type', 'application/json')
        .send('{"name":');
      assert.equal(res.status, 400);
      assert.equal(res.body.error.code, 'INVALID_JSON');
    });

    it('is not available via GET', async () => {
      const res = await request(app).get(endpoint);
      assert.equal(res.status, 404);
      assert.equal(res.body.error.code, 'NOT_FOUND');
    });
  });
}

describe('POST /order/send with items', () => {
  it('accepts a list of products', async () => {
    const res = await request(app)
      .post('/order/send')
      .send({ ...contact, products: [{ id: 1, quantity: 2 }] })
      .expect(200);
    assert.deepEqual(res.body, ACCEPTED);
  });

  it('rejects a non-positive quantity', async () => {
    assertValidationError(
      await request(app)
        .post('/order/send')
        .send({ ...contact, products: [{ id: 1, quantity: 0 }] }),
      'products.0.quantity',
    );
  });

  it('rejects an oversized body', async () => {
    const res = await request(app)
      .post('/order/send')
      .send({ ...contact, note: 'x'.repeat(20_000) });
    assert.equal(res.status, 413);
    assert.equal(res.body.error.code, 'PAYLOAD_TOO_LARGE');
  });
});
