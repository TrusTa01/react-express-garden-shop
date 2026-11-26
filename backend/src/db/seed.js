// Rebuilds the database from data/catalog.json: drops the tables, recreates them, inserts the catalogue.
import { loadConfig, loadEnvFile } from '../config/index.js';
import { loadCatalog, openDatabase, resetSchema, seedCatalog } from './database.js';

loadEnvFile();
const config = loadConfig();
const db = openDatabase(config.dbPath);

try {
  resetSchema(db);
  const counts = seedCatalog(db, loadCatalog(config.seedFile));
  console.log(
    `Seeded ${counts.categories} categories and ${counts.products} products into ${config.dbPath}`,
  );
} finally {
  db.close();
}
