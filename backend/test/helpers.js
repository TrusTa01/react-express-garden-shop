import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config/index.js';
import { prepareDatabase } from '../src/db/database.js';

const testDir = path.dirname(fileURLToPath(import.meta.url));

/** App backed by a fresh in-memory database seeded from data/catalog.json. */
export function createTestApp() {
  const { publicDir, seedFile } = loadConfig({});
  const { db } = prepareDatabase({ dbPath: ':memory:', seedFile });
  return { app: createApp({ db, publicDir }), db };
}

/** Raw JSON bodies recorded from the previous implementation of the API. */
export function legacyFixture(name) {
  return readFileSync(path.join(testDir, 'fixtures', 'legacy', `${name}.json`), 'utf8');
}
