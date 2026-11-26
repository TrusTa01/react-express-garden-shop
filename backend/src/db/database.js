import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const schemaSql = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql'),
  'utf8',
);

export function openDatabase(dbPath) {
  if (dbPath !== ':memory:') {
    mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

export function applySchema(db) {
  db.exec(schemaSql);
}

export function resetSchema(db) {
  db.exec('DROP TABLE IF EXISTS products; DROP TABLE IF EXISTS categories;');
  applySchema(db);
}

export function loadCatalog(seedFile) {
  const catalog = JSON.parse(readFileSync(seedFile, 'utf8'));
  if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.products)) {
    throw new Error(`${seedFile} must contain "categories" and "products" arrays`);
  }
  return catalog;
}

function inTransaction(db, work) {
  db.exec('BEGIN');
  try {
    work();
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

/** Inserts the catalogue into empty tables and returns how many rows went in. */
export function seedCatalog(db, { categories, products }) {
  const insertCategory = db.prepare(
    `INSERT INTO categories (id, title, image, created_at, updated_at)
     VALUES (:id, :title, :image, :createdAt, :updatedAt)`,
  );
  const insertProduct = db.prepare(
    `INSERT INTO products
       (id, category_id, title, price, discount_price, description, image, created_at, updated_at)
     VALUES
       (:id, :categoryId, :title, :price, :discountPrice, :description, :image, :createdAt, :updatedAt)`,
  );

  inTransaction(db, () => {
    for (const category of categories) insertCategory.run(category);
    for (const product of products) insertProduct.run(product);
  });

  return { categories: categories.length, products: products.length };
}

function isEmpty(db) {
  return db.prepare('SELECT COUNT(*) AS count FROM categories').get().count === 0;
}

/**
 * Opens the database and makes sure it is usable: creates the schema and,
 * when the catalogue is empty (first start), fills it from the seed file.
 */
export function prepareDatabase({ dbPath, seedFile }) {
  const isNewFile = dbPath === ':memory:' || !existsSync(dbPath);
  const db = openDatabase(dbPath);
  applySchema(db);
  if (isNewFile || isEmpty(db)) {
    return { db, seeded: seedCatalog(db, loadCatalog(seedFile)) };
  }
  return { db, seeded: null };
}
