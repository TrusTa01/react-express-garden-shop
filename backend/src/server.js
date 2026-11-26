import { createApp } from './app.js';
import { loadConfig, loadEnvFile } from './config/index.js';
import { prepareDatabase } from './db/database.js';

loadEnvFile();
const config = loadConfig();
const { db, seeded } = prepareDatabase(config);

if (seeded) {
  console.log(
    `Database created at ${config.dbPath} (${seeded.categories} categories, ${seeded.products} products)`,
  );
}

const app = createApp({ db, publicDir: config.publicDir, corsOrigin: config.corsOrigin });

const server = app.listen(config.port, () => {
  console.log(`Garden Shop API listening on http://localhost:${server.address().port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
