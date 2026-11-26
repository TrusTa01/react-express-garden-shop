// Static demo build for GitHub Pages: `npm run build:demo` (root or frontend/).
//
// 1. Builds the frontend with VITE_DEMO=true and VITE_BASE (default "/react-express-garden-shop/").
// 2. Starts the real backend app in memory (seeded from backend/data/catalog.json) and
//    saves its GET responses as JSON files in dist/demo-api/, so the demo reads exactly
//    what the API would return.
// 3. Copies the catalogue images from backend/public/ into dist/ (never into git).
// 4. Copies index.html to 404.html so GitHub Pages serves the SPA on deep links.
//
// Needs the backend dependencies installed (`npm install --prefix backend`).
import { cp, copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const frontendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendDir = path.resolve(frontendDir, '..', 'backend');
const distDir = path.join(frontendDir, 'dist');

const EXPECTED = { categories: 5, products: 35 };

process.env.VITE_DEMO = 'true';
process.env.VITE_BASE = process.env.VITE_BASE || '/react-express-garden-shop/';

async function buildFrontend() {
  // vite.config.js reads .env files from the working directory.
  process.chdir(frontendDir);
  const { build } = await import('vite');
  await build({ root: frontendDir, mode: 'production', logLevel: 'warn' });
}

const backendModule = (relative) => import(pathToFileURL(path.join(backendDir, relative)).href);

async function writeDemoApi() {
  const [{ createApp }, { loadConfig }, { prepareDatabase }] = await Promise.all([
    backendModule('src/app.js'),
    backendModule('src/config/index.js'),
    backendModule('src/db/database.js'),
  ]);
  const { publicDir, seedFile } = loadConfig({});
  const { db } = prepareDatabase({ dbPath: ':memory:', seedFile });
  const server = createApp({ db, publicDir }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const apiDir = path.join(distDir, 'demo-api');

  const save = async (route) => {
    const response = await fetch(origin + route);
    if (!response.ok) throw new Error(`GET ${route} -> ${response.status}`);
    const body = await response.json();
    const file = path.join(apiDir, `${route}.json`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(body));
    return body;
  };

  try {
    await rm(apiDir, { recursive: true, force: true });
    const categories = await save('/categories/all');
    const products = await save('/products/all');
    if (categories.length !== EXPECTED.categories || products.length !== EXPECTED.products) {
      throw new Error(
        `Unexpected catalogue size: ${categories.length} categories, ${products.length} products ` +
          `(expected ${EXPECTED.categories} and ${EXPECTED.products})`,
      );
    }
    for (const category of categories) await save(`/categories/${category.id}`);
    for (const product of products) await save(`/products/${product.id}`);
    return { categories: categories.length, products: products.length, publicDir };
  } finally {
    server.close();
    db.close();
  }
}

async function main() {
  await buildFrontend();
  const { categories, products, publicDir } = await writeDemoApi();
  for (const folder of ['category_img', 'product_img']) {
    await cp(path.join(publicDir, folder), path.join(distDir, folder), { recursive: true });
  }
  await copyFile(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
  console.log(
    `Demo build ready in ${path.relative(process.cwd(), distDir) || 'dist'} ` +
      `(base ${process.env.VITE_BASE}): ${categories} categories, ${products} products, images and 404.html`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
