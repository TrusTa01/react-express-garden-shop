// One-off export of the catalogue from a legacy SQLite file into data/catalog.json.
// Usage: node scripts/export-legacy-db.js <path-to-legacy.sqlite> [output.json]
// The generated JSON is committed and is the single source for `npm run seed`.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [source, target = path.join(backendDir, 'data', 'catalog.json')] = process.argv.slice(2);

if (!source) {
  console.error('Usage: node scripts/export-legacy-db.js <legacy.sqlite> [output.json]');
  process.exit(1);
}

// Legacy timestamps are stored as "YYYY-MM-DD HH:MM:SS" in UTC.
const toIso = (value) => new Date(`${value.replace(' ', 'T')}Z`).toISOString();

const db = new DatabaseSync(source, { readOnly: true });

const categories = db
  .prepare('SELECT id, title, image, createdAt, updatedAt FROM categories ORDER BY id')
  .all()
  .map((row) => ({
    id: row.id,
    title: row.title,
    image: row.image,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  }));

const products = db
  .prepare(
    `SELECT id, title, price, discont_price, description, image, categoryId, createdAt, updatedAt
       FROM products ORDER BY id`,
  )
  .all()
  .map((row) => ({
    id: row.id,
    categoryId: row.categoryId,
    title: row.title,
    price: row.price,
    discountPrice: row.discont_price,
    description: row.description,
    image: row.image,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  }));

db.close();

writeFileSync(target, `${JSON.stringify({ categories, products }, null, 2)}\n`);
console.log(`Exported ${categories.length} categories and ${products.length} products to ${target}`);
