import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';
import { createTestApp, legacyFixture } from './helpers.js';

let app;
let db;

before(() => {
  ({ app, db } = createTestApp());
});

after(() => db.close());

function assertError(res, status, code) {
  assert.equal(res.status, status);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.equal(res.body.error.code, code);
  assert.equal(typeof res.body.error.message, 'string');
}

describe('GET /categories/all', () => {
  it('lists every category in the legacy format', async () => {
    const res = await request(app).get('/categories/all').expect(200);
    assert.equal(res.body.length, 5);
    assert.deepEqual(Object.keys(res.body[0]), ['id', 'title', 'image', 'createdAt', 'updatedAt']);
    assert.equal(res.text, legacyFixture('categories-all'));
  });

  it('allows cross-origin requests', async () => {
    const res = await request(app).get('/categories/all').set('Origin', 'http://localhost:3000');
    assert.equal(res.headers['access-control-allow-origin'], '*');
  });
});

describe('GET /categories/:id', () => {
  it('returns the category with its products', async () => {
    const res = await request(app).get('/categories/1').expect(200);
    assert.deepEqual(Object.keys(res.body), ['category', 'data']);
    assert.equal(res.body.category.id, 1);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.every((product) => product.categoryId === 1));
    assert.equal(res.text, legacyFixture('categories-1'));
  });

  it('responds 404 for an unknown category', async () => {
    assertError(await request(app).get('/categories/999'), 404, 'NOT_FOUND');
  });

  for (const id of ['abc', '0', '-1', '1.5', '01']) {
    it(`responds 400 for id "${id}"`, async () => {
      assertError(await request(app).get(`/categories/${id}`), 400, 'VALIDATION_ERROR');
    });
  }
});

describe('GET /products/all', () => {
  it('lists every product in the legacy format', async () => {
    const res = await request(app).get('/products/all').expect(200);
    assert.equal(res.body.length, 35);
    assert.deepEqual(Object.keys(res.body[0]), [
      'id',
      'title',
      'price',
      'discont_price',
      'description',
      'image',
      'createdAt',
      'updatedAt',
      'categoryId',
    ]);
    assert.equal(res.text, legacyFixture('products-all'));
  });
});

describe('GET /products/:id', () => {
  it('returns the product wrapped in an array', async () => {
    const res = await request(app).get('/products/1').expect(200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, 1);
    assert.equal(res.text, legacyFixture('products-1'));
  });

  it('keeps fractional prices and null discounts', async () => {
    const [product] = (await request(app).get('/products/2').expect(200)).body;
    assert.equal(product.price, 10.75);
    assert.equal(product.discont_price, null);
  });

  it('responds 404 for an unknown product', async () => {
    assertError(await request(app).get('/products/999'), 404, 'NOT_FOUND');
  });

  it('responds 400 for a non-numeric id', async () => {
    assertError(await request(app).get('/products/abc'), 400, 'VALIDATION_ERROR');
  });

  it('no longer exposes the write-through-GET route', async () => {
    assertError(await request(app).get('/products/add/a/1/1/b'), 404, 'NOT_FOUND');
  });
});

describe('static images', () => {
  it('serves product and category images', async () => {
    const product = await request(app).get('/product_img/1.jpeg').expect(200);
    assert.match(product.headers['content-type'], /image\/jpeg/);
    await request(app).get('/category_img/1.jpeg').expect(200);
  });

  it('responds 404 with JSON for a missing image', async () => {
    assertError(await request(app).get('/product_img/999.jpeg'), 404, 'NOT_FOUND');
  });
});

describe('unknown routes', () => {
  it('responds 404 with the error envelope', async () => {
    assertError(await request(app).get('/nope'), 404, 'NOT_FOUND');
  });
});
